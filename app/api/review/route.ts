import { NextRequest, NextResponse } from "next/server";
import { generateText, APICallError } from "ai";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Requests route through the Vercel AI Gateway (https://vercel.com/docs/ai-gateway).
// The gateway tries PRIMARY first, then each model in FALLBACKS in order, so a
// retired model or a provider outage degrades gracefully with no redeploy.
// Slugs: https://ai-gateway.vercel.sh/v1/models
const PRIMARY_MODEL = process.env.AI_MODEL ?? "openai/gpt-oss-120b";
const FALLBACK_MODELS = (
  process.env.AI_MODEL_FALLBACKS ?? "openai/gpt-oss-20b,google/gemini-2.5-flash-lite"
)
  .split(",")
  .map((m) => m.trim())
  .filter(Boolean);

export async function POST(req: NextRequest) {
  try {
    const { code, language } = await req.json();

    if (!code?.trim()) {
      return NextResponse.json({ error: "No code provided" }, { status: 400 });
    }

    if (!process.env.AI_GATEWAY_API_KEY && !process.env.VERCEL_OIDC_TOKEN) {
      return NextResponse.json(
        {
          error:
            "AI_GATEWAY_API_KEY is not set on the server. Create a key at https://vercel.com/dashboard → AI Gateway and add it to your environment variables.",
        },
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

    let text: string;
    try {
      const result = await generateText({
        model: PRIMARY_MODEL,
        prompt,
        temperature: 0.3,
        maxOutputTokens: 4096,
        providerOptions: {
          gateway: {
            models: FALLBACK_MODELS,
            tags: ["feature:code-review"],
          },
        },
      });
      text = result.text;
    } catch (err) {
      if (APICallError.isInstance(err)) {
        console.error(`AI Gateway error ${err.statusCode}:`, err.message);
        let friendly = `The AI provider returned an error (HTTP ${err.statusCode ?? "unknown"}).`;
        if (err.statusCode === 401 || err.statusCode === 403) {
          friendly = "The AI Gateway rejected the API key. Check AI_GATEWAY_API_KEY in your deployment.";
        } else if (err.statusCode === 402) {
          friendly = "The AI Gateway credit balance is exhausted. Add credits or wait for the monthly free tier to refresh.";
        } else if (err.statusCode === 429) {
          friendly = "Rate limit reached. Wait a moment and run the audit again.";
        } else if (err.statusCode === 404) {
          friendly = `None of the configured models are available (tried ${[PRIMARY_MODEL, ...FALLBACK_MODELS].join(", ")}). Pick current slugs from https://ai-gateway.vercel.sh/v1/models and set AI_MODEL / AI_MODEL_FALLBACKS.`;
        }
        return NextResponse.json({ error: friendly }, { status: 502 });
      }
      throw err;
    }

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
