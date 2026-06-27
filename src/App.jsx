import { useState, useRef } from 'react'
import { useCodeReview } from './hooks/useCodeReview'
import ReviewPanel from './components/ReviewPanel'
import LanguageSelect from './components/LanguageSelect'
import { SAMPLES } from './samples'

export default function App() {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('JavaScript')
  const { reviewCode, loading, result, error, reset } = useCodeReview()
  const textareaRef = useRef(null)

  const handleReview = () => {
    if (!code.trim() || loading) return
    reviewCode(code, language)
  }

  const handleLoadSample = () => {
    const key = language.toLowerCase().replace(' / jsx', '').replace('node.js', 'node').replace('/', '').trim()
    const sample = SAMPLES[key] || SAMPLES['javascript']
    setCode(sample)
    reset()
    textareaRef.current?.focus()
  }

  const handleClear = () => {
    setCode('')
    reset()
    textareaRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    // Ctrl+Enter or Cmd+Enter to review
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      handleReview()
    }
    // Tab key inserts 2 spaces
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = e.target.selectionStart
      const end = e.target.selectionEnd
      const newCode = code.substring(0, start) + '  ' + code.substring(end)
      setCode(newCode)
      requestAnimationFrame(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2
      })
    }
  }

  const lineCount = code ? code.split('\n').length : 0
  const charCount = code.length

  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col">
      {/* Header */}
      <header className="border-b border-[#21262d] px-6 py-3.5 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-700 rounded-lg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
            </svg>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-100">CodeReview AI</div>
            <div className="text-[11px] text-gray-500">Powered by SK</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSelect value={language} onChange={(lang) => { setLanguage(lang); reset() }} />
          <button
            onClick={handleLoadSample}
            className="text-xs text-gray-400 hover:text-emerald-400 border border-[#30363d] hover:border-emerald-800 rounded-lg px-3 py-2 transition-colors"
          >
            Load sample
          </button>
        </div>
      </header>

      {/* Main split layout */}
      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 57px - 56px)' }}>
        {/* Left: Code Editor */}
        <div className="flex flex-col w-1/2 border-r border-[#21262d]">
          <div className="flex items-center justify-between px-4 py-2 border-b border-[#21262d]">
            <span className="text-[11px] text-gray-600 uppercase tracking-wider font-medium">Editor</span>
            <span className="text-[11px] text-gray-700 font-mono">
              {lineCount > 0 ? `${lineCount} lines · ${charCount} chars` : ''}
            </span>
          </div>
          <textarea
            ref={textareaRef}
            value={code}
            onChange={e => { setCode(e.target.value); if (result || error) reset() }}
            onKeyDown={handleKeyDown}
            placeholder={"Paste your code here...\n\nTip: Press ⌘+Enter to review"}
            spellCheck={false}
            className="code-input flex-1 w-full bg-[#0d1117] text-gray-300 text-sm leading-relaxed resize-none outline-none p-5 placeholder-gray-700"
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', lineHeight: '1.7' }}
          />
        </div>

        {/* Right: Review Panel */}
        <div className="flex flex-col w-1/2 overflow-y-auto">
          <div className="flex items-center justify-between px-4 py-2 border-b border-[#21262d] flex-shrink-0">
            <span className="text-[11px] text-gray-600 uppercase tracking-wider font-medium">AI Review</span>
            {result && (
              <span className="text-[11px] text-emerald-600 font-medium">
                {result.issues?.length} findings
              </span>
            )}
          </div>
          <div className="flex-1">
            <ReviewPanel result={result} loading={loading} error={error} />
          </div>
        </div>
      </div>

      {/* Footer / Action bar */}
      <footer className="border-t border-[#21262d] px-5 py-3 flex items-center gap-3 flex-shrink-0">
        <button
          onClick={handleClear}
          disabled={loading}
          className="px-4 py-2 text-sm text-gray-500 hover:text-gray-300 border border-[#30363d] hover:border-[#484f58] rounded-lg transition-colors disabled:opacity-40"
        >
          Clear
        </button>

        <button
          onClick={handleReview}
          disabled={!code.trim() || loading}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-2 bg-emerald-700 hover:bg-emerald-600 disabled:bg-[#161b22] disabled:text-gray-600 disabled:border disabled:border-[#30363d] text-white text-sm font-medium rounded-lg transition-colors"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin-fast" />
              Analyzing...
            </>
          ) : (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
              Review Code
              <span className="text-xs text-emerald-300/60 font-normal ml-1">⌘↵</span>
            </>
          )}
        </button>

        <div className="text-[11px] text-gray-700 hidden sm:block">
          Tab = indent · ⌘↵ = review
        </div>
      </footer>
    </div>
  )
}
