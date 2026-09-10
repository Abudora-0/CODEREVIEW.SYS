import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Groq rotates its hosted models on a published schedule. Rather than pin one id,
// try a list in order and fall through to the next when a model is missing or
// decommissioned — so a retired model degrades gracefully instead of 500ing.
// Override the whole list with GROQ_MODEL (comma-separated, highest priority first).
// Current free-tier ("developer plan") models: https://console.groq.com/docs/models
const GROQ_MODELS = (
  process.env.GROQ_MODEL ?? "openai/gpt-oss-120b,openai/gpt-oss-20b,llama-3.1-8b-instant"
)
  .split(",")
  .map((m) => m.trim())
  .filter(Boolean);

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

/** True when the error means "this model won't work" — safe to try the next one. */
function isModelUnavailable(status: number, body: string): boolean {
  if (status === 404) return true;
  try {
    const code = JSON.parse(body)?.error?.code ?? "";
    return typeof code === "string" && code.startsWith("model_");
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { code, language } = await req.json();

    if (!code?.trim()) {
      return NextResponse.json({ error: "No code provided" }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not set on the server. Add it in your deployment's environment variables." },
        { status: 500 },
      );
    }

    const prompt = `You are an expert code reviewer. Review the following ${language} code and respond with ONLY valid JSON (no markdown, no backticks, no explanation outside the JSON).

The JSON must follow this exact structure:
{
  "score": <number 0-100>,
  "summary": "<2-3 sentence overall assessment>",
  "issues": [
    {
      "id": "<unique string like issue-1>",
      "type": "<bug|security|performance|style>",
      "severity": "<critical|warning|info>",
      "line": <line number or null>,
      "title": "<short title>",
      "message": "<detailed explanation>",
      "suggestion": "<how to fix it>"
    }
  ],
  "positives": ["<thing done well>"],
  "refactoredCode": "<full improved version of the code>"
}

Scoring: 90-100 excellent, 70-89 good, 50-69 needs work, 30-49 significant issues, 0-29 major problems.
Find real issues. Be specific. Include 2-6 issues. Always provide refactoredCode.

Code to review (${language}):
\`\`\`${language}
${code}
\`\`\``;

    let groqRes: Response | null = null;
    let lastStatus = 0;
    let lastBody = "";

    for (const model of GROQ_MODELS) {
      const res = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
          max_tokens: 4096,
          response_format: { type: "json_object" },
        }),
      });

      if (res.ok) {
        groqRes = res;
        break;
      }

      lastStatus = res.status;
      lastBody = await res.text();
      console.error(`Groq model "${model}" failed (${res.status}):`, lastBody);

      // Auth / rate-limit / server errors won't be fixed by another model.
      if (!isModelUnavailable(res.status, lastBody)) break;
    }

    if (!groqRes) {
      let friendly = `The AI provider returned an error (HTTP ${lastStatus}).`;
      if (lastStatus === 401) {
        friendly = "Groq rejected the API key. Check the GROQ_API_KEY value in your deployment.";
      } else if (lastStatus === 429) {
        friendly = "Groq rate limit reached. Wait a moment and run the audit again.";
      } else if (isModelUnavailable(lastStatus, lastBody)) {
        friendly = `None of the configured Groq models are available to this API key (tried: ${GROQ_MODELS.join(", ")}). Set GROQ_MODEL to a current developer-plan model from https://console.groq.com/docs/models, or check that the key's account has model access.`;
      }
      return NextResponse.json({ error: friendly }, { status: 502 });
    }

    const groqData = await groqRes.json();
    const text = groqData.choices?.[0]?.message?.content ?? "";

    // Strip any accidental markdown fences before parsing
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    let review: unknown;
    try {
      review = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse model output:", text);
      return NextResponse.json(
        { error: "The model returned malformed output. Try running the audit again." },
        { status: 502 },
      );
    }

    return NextResponse.json(review);
  } catch (err: unknown) {
    console.error("Review error:", err);
    const message = err instanceof Error ? err.message : "Review failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
