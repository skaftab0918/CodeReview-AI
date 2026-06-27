import ScoreCard from './ScoreCard'
import IssueCard from './IssueCard'

export default function ReviewPanel({ result, loading, error }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-500">
        <div className="w-8 h-8 border-2 border-gray-700 border-t-emerald-500 rounded-full animate-spin-fast" />
        <div className="text-sm text-center">
          <p className="text-gray-400 font-medium">Analyzing your code...</p>
          <p className="text-xs text-gray-600 mt-1">Checking for bugs, security issues & more</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-900/30 border border-red-800 rounded-xl p-4 text-sm text-red-300">
          <div className="font-semibold mb-1">Something went wrong</div>
          <div className="text-red-400 text-xs leading-relaxed">{error}</div>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-600 px-8 text-center">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
        </svg>
        <div>
          <p className="text-sm text-gray-500 font-medium">No review yet</p>
          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
            Paste your code on the left, pick a language, and click <span className="text-emerald-600 font-medium">Review Code</span>
          </p>
        </div>
      </div>
    )
  }

  const gradeColor =
    result.overall_score >= 80 ? 'text-emerald-400' :
    result.overall_score >= 60 ? 'text-amber-400' :
    'text-red-400'

  const bugCount = result.issues?.filter(i => i.type === 'bug').length || 0
  const securityCount = result.issues?.filter(i => i.type === 'security').length || 0
  const goodCount = result.issues?.filter(i => i.type === 'good').length || 0

  return (
    <div className="p-5 space-y-5 fade-in">
      {/* Grade + Summary */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Overall Quality</div>
            <div className={`text-4xl font-bold ${gradeColor}`}>
              {result.quality_grade}
              <span className="text-lg font-normal text-gray-500 ml-2">{result.overall_score}/100</span>
            </div>
          </div>
          <div className="flex gap-3 text-center">
            {bugCount > 0 && (
              <div>
                <div className="text-lg font-semibold text-red-400">{bugCount}</div>
                <div className="text-[10px] text-gray-600">bug{bugCount !== 1 ? 's' : ''}</div>
              </div>
            )}
            {securityCount > 0 && (
              <div>
                <div className="text-lg font-semibold text-orange-400">{securityCount}</div>
                <div className="text-[10px] text-gray-600">security</div>
              </div>
            )}
            {goodCount > 0 && (
              <div>
                <div className="text-lg font-semibold text-emerald-400">{goodCount}</div>
                <div className="text-[10px] text-gray-600">good</div>
              </div>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-400 leading-relaxed">{result.summary}</p>
      </div>

      {/* Metrics grid */}
      {result.metrics && (
        <div className="grid grid-cols-2 gap-3">
          <ScoreCard label="Readability"     value={result.metrics.readability}     icon="📖" />
          <ScoreCard label="Performance"     value={result.metrics.performance}     icon="⚡" />
          <ScoreCard label="Security"        value={result.metrics.security}        icon="🔒" />
          <ScoreCard label="Maintainability" value={result.metrics.maintainability} icon="🔧" />
        </div>
      )}

      {/* Top priority callout */}
      {result.top_priority && (
        <div className="bg-amber-900/20 border border-amber-800/50 rounded-xl p-4">
          <div className="text-xs text-amber-500 font-semibold uppercase tracking-wider mb-1.5">
            ⚡ Fix This First
          </div>
          <p className="text-sm text-amber-200/80 leading-relaxed">{result.top_priority}</p>
        </div>
      )}

      {/* Issues list */}
      {result.issues?.length > 0 && (
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">
            Findings ({result.issues.length})
          </div>
          <div className="space-y-3">
            {result.issues.map((issue, i) => (
              <IssueCard key={i} issue={issue} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
