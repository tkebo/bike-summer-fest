const TicketFeatureEditor = ({ features, onChange }) => (
  <div>
    <div className="mb-2 text-xs font-black uppercase text-white/45">Features</div>
    <div className="grid gap-2">
      {features.map((feature, index) => (
        <div key={index} className="grid grid-cols-[1fr_auto] gap-2">
          <input value={feature} onChange={(event) => onChange(features.map((item, itemIndex) => (itemIndex === index ? event.target.value : item)))} className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm" />
          <button onClick={() => onChange(features.filter((_, itemIndex) => itemIndex !== index))} className="rounded-xl border border-orange-400/30 px-3 py-2 text-xs font-black text-orange-300">Remove</button>
        </div>
      ))}
      <button onClick={() => onChange([...features, ""])} className="rounded-xl border border-white/15 px-3 py-2 text-xs font-black">Add feature</button>
    </div>
  </div>
);

export default TicketFeatureEditor;
