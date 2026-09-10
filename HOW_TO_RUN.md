# CodeReview AI: How to Run

## What it does
Paste any code into the VS Code-style editor and get an instant AI-powered review:
- **Quality score** (0–100) with animated ring
- **Bug, security, performance & style issues** with line numbers
- **AI-refactored version** of your code
- **Copy review as Markdown** for sharing

---

## Prerequisites
- Node.js v18+
- A Vercel AI Gateway API key (see step 2)

---

## 1. Install Dependencies

```powershell
cd D:\Projects\ai-code-reviewer
npm install
```

---

## 2. Get a Vercel AI Gateway API Key

1. Go to **https://vercel.com/dashboard** and open the **AI Gateway** tab
2. Open **API Keys** → **Create Key** and copy it
3. Every Vercel team gets **$5 of free AI Gateway credits per month** — a review
   costs about $0.001, so the free tier is plenty

---

## 3. Set Up Environment Variables

Create `.env` at the project root:

```env
AI_GATEWAY_API_KEY="your-key-here"

# Optional — override the model chain (primary, then fallbacks tried in order):
# AI_MODEL="openai/gpt-oss-120b"
# AI_MODEL_FALLBACKS="openai/gpt-oss-20b,google/gemini-2.5-flash-lite"
```

---

## 4. Run the App

```powershell
npm run dev
```

Open **http://localhost:3000**

---

## How to Use

1. **Select a language** from the dropdown (13 supported)
2. **Load an example** via the Examples button, or paste your own code
3. Click **Review Code** or press **Ctrl+Enter**
4. Review the results:
   - Animated score ring (0–100)
   - Issues list: click any issue to expand details & fix suggestion
   - "What's good" section
   - Click **"View AI-refactored code"** to see the improved version
   - Click **"Copy review as Markdown"** to export the review

---

## Features

| Feature | Description |
|---------|-------------|
| 🎨 Monaco Editor | VS Code-style editor with syntax highlighting |
| 🤖 AI Review | Vercel AI Gateway — `openai/gpt-oss-120b` with cross-provider fallback |
| 📊 Quality Score | Animated 0–100 score ring |
| 🐛 Bug Detection | Identifies bugs with line numbers |
| 🔒 Security Audit | Flags SQL injection, XSS, etc. |
| ⚡ Performance Tips | Highlights inefficient code |
| ✨ Refactored Code | Full AI-rewritten version |
| 📋 Markdown Export | Copy full review as Markdown |
| ⌨️ Keyboard Shortcut | Ctrl+Enter to trigger review |
| ⏱️ Review Time | Shows how fast the model responded |

---

## Supported Languages

JavaScript, TypeScript, Python, Java, C++, Go, Rust, PHP, Ruby, Swift, Kotlin, CSS, SQL

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Code Editor | Monaco Editor (`@monaco-editor/react`) |
| AI | Vercel AI Gateway + AI SDK v6 — `openai/gpt-oss-120b`, fallbacks via `AI_MODEL_FALLBACKS` |
| Icons | Lucide React |

---

## Folder Structure

```
ai-code-reviewer/
├── app/
│   ├── api/
│   │   └── review/route.ts     # AI Gateway call + model fallback chain
│   ├── globals.css             # Dark theme + animations
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Main page (editor + results)
├── components/
│   ├── CodeEditor.tsx          # Monaco editor wrapper
│   ├── IssueCard.tsx           # Expandable issue card
│   ├── Logo.tsx                # Custom SVG logo
│   ├── ReviewPanel.tsx         # Results panel
│   └── ScoreRing.tsx           # Animated SVG score ring
└── .env                        # API key (not committed)
```
