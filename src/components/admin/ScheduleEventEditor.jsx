const eventTypes = ["ride", "concert", "sport", "competition", "sponsor", "food", "beach", "ceremony", "general"];

const ScheduleEventEditor = ({
  event,
  language,
  index,
  total,
  onPatch,
  onPatchLocale,
  onDuplicate,
  onDelete,
  onMove,
}) => {
  const locale = event[language];

  return (
    <article className={`rounded-2xl border p-4 ${event.highlighted ? "border-cyan-300/35 bg-cyan-300/[0.06]" : "border-white/10 bg-black/20"}`}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-white/5 px-2 py-1">{event.time || "--:--"}</span>
          <span className="rounded-full bg-white/5 px-2 py-1">{event.type}</span>
          {event.highlighted && <span className="rounded-full bg-cyan-300/15 px-2 py-1 text-cyan-200">highlighted</span>}
          {!event.active && <span className="rounded-full bg-orange-400/15 px-2 py-1 text-orange-300">inactive</span>}
        </div>
        <div className="flex flex-wrap gap-2">
          <button disabled={index === 0} onClick={() => onMove(index, index - 1)} className="rounded-xl border border-white/15 px-3 py-2 text-xs disabled:opacity-30">Up</button>
          <button disabled={index === total - 1} onClick={() => onMove(index, index + 1)} className="rounded-xl border border-white/15 px-3 py-2 text-xs disabled:opacity-30">Down</button>
          <button onClick={onDuplicate} className="rounded-xl border border-white/15 px-3 py-2 text-xs">Duplicate</button>
          <button onClick={onDelete} className="rounded-xl border border-orange-400/30 px-3 py-2 text-xs text-orange-300">Delete</button>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <input value={event.time} onChange={(eventValue) => onPatch({ time: eventValue.target.value })} type="time" className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm" />
        <select value={event.type} onChange={(eventValue) => onPatch({ type: eventValue.target.value })} className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm">
          {eventTypes.map((type) => <option key={type} value={type}>{type}</option>)}
        </select>
        <input value={locale.title} onChange={(eventValue) => onPatchLocale({ title: eventValue.target.value })} placeholder="Event title" className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm" />
        <input value={event.location} onChange={(eventValue) => onPatch({ location: eventValue.target.value })} placeholder="Location" className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm" />
        <input value={event.zone} onChange={(eventValue) => onPatch({ zone: eventValue.target.value })} placeholder="Zone" className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm" />
        <textarea value={locale.description} onChange={(eventValue) => onPatchLocale({ description: eventValue.target.value })} placeholder="Description" className="min-h-24 rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm md:col-span-2" />
      </div>
      <div className="mt-4 flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={event.active} onChange={(eventValue) => onPatch({ active: eventValue.target.checked })} />
          Active
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={event.highlighted} onChange={(eventValue) => onPatch({ highlighted: eventValue.target.checked })} />
          Highlighted
        </label>
      </div>
    </article>
  );
};

export default ScheduleEventEditor;
