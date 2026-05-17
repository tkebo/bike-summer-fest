const ContentField = ({ label, value, onChange, multiline = false }) => (
  <label className="block">
    <span className="mb-2 block text-xs font-black uppercase text-white/45">{label}</span>
    {multiline ? (
      <textarea value={value ?? ""} onChange={(event) => onChange(event.target.value)} className="min-h-28 w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-300" />
    ) : (
      <input value={value ?? ""} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-300" />
    )}
  </label>
);

export default ContentField;
