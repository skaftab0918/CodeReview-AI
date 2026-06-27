const TYPE_CONFIG = {
  bug:         { label: 'Bug',         bg: 'bg-red-900/50',    text: 'text-red-300',    border: 'border-red-800' },
  performance: { label: 'Performance', bg: 'bg-amber-900/50',  text: 'text-amber-300',  border: 'border-amber-800' },
  security:    { label: 'Security',    bg: 'bg-orange-900/50', text: 'text-orange-300', border: 'border-orange-800' },
  style:       { label: 'Style',       bg: 'bg-blue-900/50',   text: 'text-blue-300',   border: 'border-blue-800' },
  good:        { label: 'Good',        bg: 'bg-emerald-900/50',text: 'text-emerald-300',border: 'border-emerald-800' },
}

const SEVERITY_DOT = {
  critical: 'bg-red-500',
  high:     'bg-orange-500',
  medium:   'bg-amber-400',
  low:      'bg-blue-400',
  info:     'bg-gray-500',
}

export default function IssueCard({ issue, index }) {
  const config = TYPE_CONFIG[issue.type] || TYPE_CONFIG.style

  return (
    <div
      className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 fade-in"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start gap-3">
        {/* Severity dot */}
        <div className="mt-1 flex-shrink-0">
          <span className={`inline-block w-2 h-2 rounded-full ${SEVERITY_DOT[issue.severity] || 'bg-gray-500'}`} />
        </div>

        <div className="flex-1 min-w-0">
          {/* Badge + title row */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${config.bg} ${config.text} ${config.border}`}>
              {config.label}
            </span>
            <span className="text-sm font-medium text-gray-200">{issue.title}</span>
            {issue.line_hint && (
              <span className="text-xs text-gray-500 font-mono">{issue.line_hint}</span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-gray-400 leading-relaxed mb-2">{issue.description}</p>

          {/* Fix snippet */}
          {issue.fix && (
            <div className="bg-[#0d1117] border-l-2 border-emerald-600 rounded-r-lg p-3 mt-2">
              <div className="text-[10px] text-emerald-500 font-semibold uppercase tracking-wider mb-1.5">Fix</div>
              <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap break-words leading-relaxed">
                {issue.fix}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
