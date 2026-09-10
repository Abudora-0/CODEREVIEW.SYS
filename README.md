# AI Code Reviewer

**Live Demo:** [https://codereview-sys.vercel.app/](https://codereview-sys.vercel.app/)

An AI-powered code review tool that analyzes your code and delivers instant, structured feedback: bugs, security vulnerabilities, performance issues, and a fully refactored version, all in seconds.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css&logoColor=white)
![Vercel AI Gateway](https://img.shields.io/badge/Vercel_AI_Gateway-gpt--oss--120b-black?logo=vercel)

## Design

A "phosphor audit terminal": warm graphite with an amber CRT accent, all-mono typography (JetBrains Mono), faint scanlines, a segmented instrument gauge for the score, compiler-style diagnostics (`E01 · SEC · L42`), and a vim-style status line. No gradients, no glassmorphism.

## Features

- **Quality Score**: animated 0–100 instrument gauge with a stamped PASS / REVIEW / CAUTION / REJECT verdict
- **Bug Detection**: pinpoints issues with exact line numbers
- **Security Analysis**: flags SQL injection, XSS, and other OWASP vulnerabilities
- **Performance Suggestions**: highlights inefficient patterns and proposes fixes
- **AI Refactor**: delivers a fully rewritten, improved version of your code
- **13 Languages**: JavaScript, TypeScript, Python, Java, C++, Go, Rust, PHP, Ruby, Swift, Kotlin, CSS, SQL
- **Monaco Editor**: VS Code-style editor with syntax highlighting
- **Copy as Markdown**: export the full review report in one click
- **Keyboard Shortcut**: `Ctrl+Enter` to trigger a review instantly

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Editor | Monaco Editor (`@monaco-editor/react`) |
| AI / LLM | [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) (AI SDK v6) — `openai/gpt-oss-120b` with a cross-provider fallback chain |
| Icons | Lucide React |

## Getting Started

### Prerequisites

- Node.js 18+
- A **Vercel AI Gateway** API key — create one in the [Vercel dashboard](https://vercel.com/dashboard)
  under **AI Gateway → API Keys**. Every team gets $5 of free credits per month, which
  is far more than this app needs (a review costs ~$0.001).

### Installation

```bash
git clone https://github.com/yourusername/ai-code-reviewer.git
cd ai-code-reviewer
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
AI_GATEWAY_API_KEY=your_ai_gateway_key_here

# Optional — override the model chain. Primary first, then comma-separated fallbacks.
# The gateway tries each in order, so a retired model or a provider outage is handled
# automatically with no redeploy. Slugs: https://ai-gateway.vercel.sh/v1/models
# AI_MODEL=openai/gpt-oss-120b
# AI_MODEL_FALLBACKS=openai/gpt-oss-20b,google/gemini-2.5-flash-lite
```

> Deploying to Vercel? Add `AI_GATEWAY_API_KEY` in **Project → Settings → Environment
> Variables** and redeploy. (On Vercel you can also skip the key entirely and use
> [OIDC](https://vercel.com/docs/ai-gateway/authentication-and-byok/oidc) — the route
> falls back to `VERCEL_OIDC_TOKEN` when no key is set.)

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How It Works

1. Paste any code snippet into the Monaco editor
2. Select the language from the dropdown (or use a built-in example)
3. Click **Review Code** or press `Ctrl+Enter`
4. The review panel renders your quality score, detected issues, and a refactored version side-by-side
5. Copy the full report as Markdown with one click

## Project Structure

```
├── app/
│   ├── api/review/route.ts   # AI Gateway call + model fallback chain
│   └── page.tsx              # Main layout
├── components/
│   ├── CodeEditor.tsx        # Monaco editor wrapper
│   ├── ReviewPanel.tsx       # Results display
│   ├── ScoreRing.tsx         # Animated quality score ring
│   └── IssueCard.tsx         # Bug / security / performance cards
```

## License

MIT
