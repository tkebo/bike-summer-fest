import TicketFeatureEditor from "./TicketFeatureEditor";

const statusOptions = ["coming_soon", "available", "sold_out", "hidden"];

const TicketPackageEditor = ({ ticket, language, index, total, onPatch, onPatchLocale, onDuplicate, onDisable, onDelete, onMove, onReset }) => {
  const localeContent = ticket[language];
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-black">{localeContent.name || "Untitled package"}</h3>
          <div className="mt-1 flex gap-2 text-xs">
            <span className="rounded-full bg-white/5 px-2 py-1">{ticket.status}</span>
            {ticket.highlighted && <span className="rounded-full bg-cyan-300/15 px-2 py-1 text-cyan-200">popular</span>}
            {!ticket.active && <span className="rounded-full bg-orange-400/15 px-2 py-1 text-orange-300">inactive</span>}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button disabled={index === 0} onClick={() => onMove(index, index - 1)} className="rounded-xl border border-white/15 px-3 py-2 text-xs disabled:opacity-30">Up</button>
          <button disabled={index === total - 1} onClick={() => onMove(index, index + 1)} className="rounded-xl border border-white/15 px-3 py-2 text-xs disabled:opacity-30">Down</button>
          <button onClick={onDuplicate} className="rounded-xl border border-white/15 px-3 py-2 text-xs">Duplicate</button>
          <button onClick={onDisable} className="rounded-xl border border-white/15 px-3 py-2 text-xs">{ticket.active ? "Disable" : "Enable"}</button>
          <button onClick={onDelete} className="rounded-xl border border-orange-400/30 px-3 py-2 text-xs text-orange-300">Delete</button>
          <button onClick={onReset} className="rounded-xl border border-white/15 px-3 py-2 text-xs">Reset</button>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <input value={localeContent.name} onChange={(event) => onPatchLocale({ name: event.target.value })} placeholder="Name" className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm" />
        <input value={ticket.price} onChange={(event) => onPatch({ price: event.target.value })} placeholder="Price" className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm" />
        <input value={ticket.currency} onChange={(event) => onPatch({ currency: event.target.value })} placeholder="Currency" className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm" />
        <select value={ticket.status} onChange={(event) => onPatch({ status: event.target.value })} className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm">
          {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
        </select>
        <input value={localeContent.ctaText} onChange={(event) => onPatchLocale({ ctaText: event.target.value })} placeholder="CTA text" className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm" />
        <input value={ticket.ctaLink} onChange={(event) => onPatch({ ctaLink: event.target.value })} placeholder="CTA link" className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm" />
        <textarea value={localeContent.desc} onChange={(event) => onPatchLocale({ desc: event.target.value })} placeholder="Description" className="min-h-28 rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm md:col-span-2" />
      </div>
      <div className="mt-4 flex gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={ticket.highlighted} onChange={(event) => onPatch({ highlighted: event.target.checked })} />
          Highlighted
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={ticket.active} onChange={(event) => onPatch({ active: event.target.checked })} />
          Active
        </label>
      </div>
      <div className="mt-4">
        <TicketFeatureEditor features={localeContent.features} onChange={(features) => onPatchLocale({ features })} />
      </div>
      <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
        <div className="text-xs font-black uppercase text-cyan-200">Live preview</div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="font-black">{localeContent.name}</span>
          <span className="rounded-xl bg-orange-500/15 px-3 py-2 text-sm font-black text-orange-300">{ticket.price} {ticket.currency}</span>
        </div>
      </div>
    </article>
  );
};

export default TicketPackageEditor;
