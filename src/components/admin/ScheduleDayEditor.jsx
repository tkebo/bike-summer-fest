import { lazy, Suspense } from "react";

const ScheduleEventEditor = lazy(() => import("./ScheduleEventEditor"));

const createEvent = (index) => ({
  id: `event-${Date.now()}`,
  order: index + 1,
  active: true,
  highlighted: false,
  time: "",
  location: "",
  zone: "",
  type: "general",
  ka: { title: "", description: "" },
  en: { title: "", description: "" },
});

const ScheduleDayEditor = ({
  day,
  language,
  index,
  total,
  onPatch,
  onPatchLocale,
  onDuplicate,
  onToggleActive,
  onDelete,
  onMove,
  onReset,
}) => {
  const locale = day[language];
  const events = [...(day.events || [])].sort((left, right) => left.order - right.order);
  const commitEvents = (nextEvents) => onPatch({ events: nextEvents.map((event, eventIndex) => ({ ...event, order: eventIndex + 1 })) });
  const patchEvent = (eventId, nextPatch) => commitEvents(events.map((event) => (event.id === eventId ? { ...event, ...nextPatch } : event)));
  const patchEventLocale = (eventId, nextPatch) => patchEvent(eventId, { [language]: { ...events.find((event) => event.id === eventId)[language], ...nextPatch } });
  const moveEvent = (fromIndex, toIndex) => {
    const next = [...events];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    commitEvents(next);
  };

  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-black">{day.label || `Day ${index + 1}`}</h3>
          <div className="mt-1 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-white/5 px-2 py-1">{day.date || "No date"}</span>
            {!day.active && <span className="rounded-full bg-orange-400/15 px-2 py-1 text-orange-300">inactive</span>}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button disabled={index === 0} onClick={() => onMove(index, index - 1)} className="rounded-xl border border-white/15 px-3 py-2 text-xs disabled:opacity-30">Up</button>
          <button disabled={index === total - 1} onClick={() => onMove(index, index + 1)} className="rounded-xl border border-white/15 px-3 py-2 text-xs disabled:opacity-30">Down</button>
          <button onClick={onDuplicate} className="rounded-xl border border-white/15 px-3 py-2 text-xs">Duplicate</button>
          <button onClick={onToggleActive} className="rounded-xl border border-white/15 px-3 py-2 text-xs">{day.active ? "Disable" : "Enable"}</button>
          <button onClick={onDelete} className="rounded-xl border border-orange-400/30 px-3 py-2 text-xs text-orange-300">Delete</button>
          <button onClick={onReset} className="rounded-xl border border-white/15 px-3 py-2 text-xs">Reset</button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <input value={day.label} onChange={(event) => onPatch({ label: event.target.value })} placeholder="Day label" className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm" />
        <input value={day.date} onChange={(event) => onPatch({ date: event.target.value })} type="date" className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm" />
        <input value={locale.title} onChange={(event) => onPatchLocale({ title: event.target.value })} placeholder="Title" className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm md:col-span-2" />
        <textarea value={locale.description} onChange={(event) => onPatchLocale({ description: event.target.value })} placeholder="Description" className="min-h-24 rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm md:col-span-2" />
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-black uppercase text-cyan-200">Events</div>
            <p className="mt-1 text-xs text-white/45">Nested event program for this day.</p>
          </div>
          <button onClick={() => commitEvents([...events, createEvent(events.length)])} className="rounded-xl bg-cyan-300 px-4 py-2 text-sm font-black text-black">Add event</button>
        </div>
        <div className="space-y-3">
          {events.map((event, eventIndex) => (
            <Suspense key={event.id} fallback={<div className="h-28 animate-pulse rounded-2xl border border-white/10 bg-white/[0.045]" />}>
              <ScheduleEventEditor
                event={event}
                language={language}
                index={eventIndex}
                total={events.length}
                onPatch={(nextPatch) => patchEvent(event.id, nextPatch)}
                onPatchLocale={(nextPatch) => patchEventLocale(event.id, nextPatch)}
                onDuplicate={() => commitEvents([...events.slice(0, eventIndex + 1), { ...event, id: `${event.id}-copy-${Date.now()}` }, ...events.slice(eventIndex + 1)])}
                onDelete={() => commitEvents(events.filter((item) => item.id !== event.id))}
                onMove={moveEvent}
              />
            </Suspense>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
        <div className="text-xs font-black uppercase text-cyan-200">Mini preview</div>
        <div className="mt-3 font-black">{locale.title}</div>
        <div className="mt-3 grid gap-2">
          {events.filter((event) => event.active !== false).map((event) => (
            <div key={event.id} className="flex flex-wrap items-center gap-2 text-sm text-white/65">
              <span className="font-black text-cyan-200">{event.time || "--:--"}</span>
              <span>{event[language].title || "Untitled event"}</span>
              <span className="rounded-full bg-white/5 px-2 py-1 text-xs">{event.type}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
};

export default ScheduleDayEditor;
