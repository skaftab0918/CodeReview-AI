# CodeReview AI 🔍

An AI-powered code review tool built with **React 18 + Vite + Tailwind CSS + GEMINI API**.

Paste any code → get instant analysis: bugs, security vulnerabilities, performance issues, style feedback, and concrete fix suggestions.

## Features

- **Multi-language support** — JavaScript, TypeScript, React/JSX, Python, Node.js, CSS, SQL
- **AI-powered analysis** — Uses GEMINI API
- **Detailed scoring** — Overall score + Readability, Performance, Security, Maintainability metrics
- **Actionable fixes** — Every issue includes a concrete code fix suggestion
- **Sample code** — Built-in intentionally buggy samples for each language
- **Keyboard shortcuts** — Tab to indent, ⌘+Enter to review
- **Dark theme** — GitHub-inspired dark UI

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS |
| Font | JetBrains Mono (editor), Inter (UI) |
| AI | GEMINI API |
| Deployment | Vercel |

## Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env
# Add your Anthropic API key to .env

# 3. Start dev server
npm run dev
```


## Environment Variables

Create a `.env` file:

```
VITE_GEMINI_API_KEY=sk-ant-your-key-here
```



## Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set env variable in Vercel dashboard:
# VITE_GEMINI_API_KEY = sk-ant-...
```

## Project Structure

```
src/
├── components/
│   ├── IssueCard.jsx       # Individual finding card
│   ├── ScoreCard.jsx       # Metric score display
│   ├── ReviewPanel.jsx     # Right panel: results/loading/empty states
│   └── LanguageSelect.jsx  # Language dropdown
├── hooks/
│   └── useCodeReview.js    # GEMINI API integration hook
├── samples.js              # Built-in buggy code samples
├── App.jsx                 # Main layout
├── main.jsx                # Entry point
└── index.css               # Global styles + Tailwind
```

## How It Works

1. User pastes code + selects language
2. `useCodeReview` hook sends code to GEMINI API with a structured prompt
3. GEMINI returns a JSON object with scores, issues, and fix suggestions
4. `ReviewPanel` renders the results with `ScoreCard` and `IssueCard` components

rompt engineering to enforce strict JSON response schema from the LLM"

---

Built by [Aftab Shaikh] · [Live Demo](https://vercel.com/skaftab0918s-projects/code-review-ai)
