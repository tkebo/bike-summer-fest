const DesignControl = ({ control, value, onChange }) => {
  const [key, label, min, max, step = 1, type = "range"] = control;

  if (type === "color") {
    return (
      <label className="block">
        <span className="mb-2 flex justify-between text-xs font-black uppercase text-white/45">
          <span>{label}</span>
          <span className="text-cyan-200">{value}</span>
        </span>
        <input type="color" value={value} onChange={(event) => onChange(key, event.target.value, "color")} className="h-11 w-full cursor-pointer rounded-xl border border-white/10 bg-black/35 p-1" />
      </label>
    );
  }

  return (
    <label className="block">
      <span className="mb-2 flex justify-between text-xs font-black uppercase text-white/45">
        <span>{label}</span>
        <span className="text-cyan-200">{value}</span>
      </span>
      <div className="grid grid-cols-[1fr_88px] gap-3">
        <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(key, event.target.value)} className="accent-cyan-300" />
        <input type="number" min={min} max={max} step={step} value={value} onChange={(event) => onChange(key, event.target.value)} className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300" />
      </div>
    </label>
  );
};

export default DesignControl;
