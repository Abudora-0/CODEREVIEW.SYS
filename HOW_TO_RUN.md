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
- A free Groq API key (see step 2)

---

## 1. Install Dependencies

```powershell
cd path\to\CODEREVIEW.SYS
npm install
```

---

## 2. Get a Free Groq API Key

1. Go to **https://console.groq.com**
2. Sign up / log in
3. Click **"API Keys"** in the sidebar
4. Click **"Create API Key"** and copy it (starts with `gsk_...`)

---

## 3. Set Up Environment Variables

Create `.env` at the project root:

```env
GROQ_API_KEY="gsk_your-key-here"

# Optional — comma-separated model list, tried in order (retired models are
# skipped automatically). Default: openai/gpt-oss-120b,openai/gpt-oss-20b,llama-3.1-8b-instant
# GROQ_MODEL="openai/gpt-oss-120b,openai/gpt-oss-20b"
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
2. **Load a sample** via the Samples button, or paste your own code
3. Click **RUN AUDIT** or press **Ctrl+Enter**
4. Review the results:
   - Animated score ring (0–100) with a PASS / REVIEW / CAUTION / REJECT verdict
   - Diagnostics list: click any issue to expand details & fix suggestion
   - "Passed checks" section
   - Click **"Load refactored source"** to see the improved version in the editor
   - Click **"Export report · Markdown"** to copy the review

---

## Features

| Feature | Description |
|---------|-------------|
| 🎨 Monaco Editor | VS Code-style editor with syntax highlighting |
| 🤖 AI Review | Groq — `openai/gpt-oss-120b`, auto-falls back through a model list |
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
| Styling | Tailwind CSS 4 |
| Code Editor | Monaco Editor (`@monaco-editor/react`) |
| AI Model | Groq API — `openai/gpt-oss-120b` with automatic fallback (`GROQ_MODEL` to override) |
| Icons | Lucide React |

---

## Folder Structure

```
CODEREVIEW.SYS/
├── app/
│   ├── api/
│   │   └── review/route.ts     # Groq call, model fallback chain, JSON parsing
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
