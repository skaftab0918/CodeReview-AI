const LANGUAGES = [
  { value: 'JavaScript', label: 'JavaScript' },
  { value: 'TypeScript', label: 'TypeScript' },
  { value: 'React',      label: 'React / JSX' },
  { value: 'Python',     label: 'Python' },
  { value: 'Node',       label: 'Node.js' },
  { value: 'CSS',        label: 'CSS' },
  { value: 'SQL',        label: 'SQL' },
]

export default function LanguageSelect({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="bg-[#161b22] border border-[#30363d] text-gray-300 text-sm rounded-lg px-3 py-2 cursor-pointer focus:outline-none focus:border-emerald-600 transition-colors"
    >
      {LANGUAGES.map(lang => (
        <option key={lang.value} value={lang.value}>
          {lang.label}
        </option>
      ))}
    </select>
  )
}
