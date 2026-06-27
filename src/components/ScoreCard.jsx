export default function ScoreCard({ label, value, icon }) {
  const color =
    value >= 80 ? 'text-emerald-400' :
    value >= 60 ? 'text-amber-400' :
    'text-red-400'

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 flex flex-col gap-1">
      <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      <div className={`text-2xl font-semibold ${color}`}>
        {value}
        <span className="text-sm text-gray-500 font-normal">/100</span>
      </div>
    </div>
  )
}
