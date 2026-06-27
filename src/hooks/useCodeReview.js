import { useState, useCallback } from 'react'

// Get your FREE Gemini API key at: https://aistudio.google.com/apikey
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY

// gemini-2.5-flash free tier: 15 req/min, 1500 req/day
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`

const SYSTEM_INSTRUCTION = `You are a senior software engineer and expert code reviewer with 10+ years of experience.
You MUST respond with ONLY a valid JSON object — no markdown, no backticks, no explanation, no text before or after.
The response must be parseable by JSON.parse() directly.`

const buildPrompt = (code, language) => `Analyze this ${language} code and return a JSON object with EXACTLY this structure:

{
  "overall_score": 72,
  "quality_grade": "B",
  "summary": "2-3 sentence summary here.",
  "issues": [
    {
      "type": "bug",
      "severity": "high",
      "title": "Issue title",
      "description": "Clear explanation.",
      "line_hint": "line 12",
      "fix": "corrected code snippet or null"
    }
  ],
  "metrics": {
    "readability": 70,
    "performance": 65,
    "security": 80,
    "maintainability": 75
  },
  "top_priority": "The single most important fix."
}

Rules:
- type must be one of: bug | performance | style | security | good
- severity must be one of: critical | high | medium | low | info
- Include 3-7 issues. Use type "good" for positive findings.
- overall_score and all metrics must be integers 0-100
- fix can be a short code snippet or null
- Return ONLY the JSON object, nothing else

Code to review (${language}):
\`\`\`
${code}
\`\`\``

// Robustly extract JSON from Gemini response text
function extractJSON(text) {
  if (!text) throw new SyntaxError('Empty response from Gemini')

  // 1. Try direct parse first
  try { return JSON.parse(text.trim()) } catch (_) {}

  // 2. Strip markdown fences: ```json ... ``` or ``` ... ```
  const fenceStripped = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim()
  try { return JSON.parse(fenceStripped) } catch (_) {}

  // 3. Extract first { ... } block found anywhere in the text
  const match = text.match(/\{[\s\S]*\}/)
  if (match) {
    try { return JSON.parse(match[0]) } catch (_) {}
  }

  throw new SyntaxError(`Could not parse Gemini response. Raw: ${text.slice(0, 300)}`)
}

export function useCodeReview() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const reviewCode = useCallback(async (code, language) => {
    if (!code.trim()) return

    if (!GEMINI_API_KEY) {
      setError('Gemini API key missing. Add VITE_GEMINI_API_KEY=your-key to your .env.local file.')
      return
    }

    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const response = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
          contents: [{ parts: [{ text: buildPrompt(code, language) }] }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 8192,
            responseMimeType: 'application/json',
          }
        })
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData?.error?.message || `Gemini API error ${response.status}`)
      }

      const data = await response.json()

      // Check for safety block
      const finishReason = data.candidates?.[0]?.finishReason
      if (finishReason === 'SAFETY') {
        throw new Error('Gemini blocked this request for safety reasons. Try different code.')
      }

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
      const parsed = extractJSON(text)

      setResult(parsed)
    } catch (err) {
      console.error('[CodeReview] Error:', err)
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setResult(null)
    setError(null)
  }, [])

  return { reviewCode, loading, result, error, reset }
}
