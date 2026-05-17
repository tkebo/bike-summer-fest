export const AdminCard = ({ title, children, actions }) => (
  <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 shadow-[0_18px_60px_rgba(0,0,0,.22)]">
    <div className="mb-4 flex items-center justify-between gap-3">
      <h3 className="text-sm font-black uppercase text-white/80">{title}</h3>
      {actions}
    </div>
    {children}
  </section>
);

export const AdminField = ({ label, value, onChange, multiline = false, type = "text", placeholder = "" }) => (
  <label className="block">
    <span className="mb-2 block text-xs font-black uppercase text-white/45">{label}</span>
    {multiline ? (
      <textarea value={value ?? ""} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="min-h-24 w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300" />
    ) : (
      <input type={type} value={value ?? ""} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300" />
    )}
  </label>
);

export const AdminSelect = ({ label, value, onChange, options }) => (
  <label className="block">
    <span className="mb-2 block text-xs font-black uppercase text-white/45">{label}</span>
    <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300">
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  </label>
);
