import { sectionRegistry } from "../../data/sectionRegistry";

const layoutOptions = ["grid", "split", "centered", "full-width", "cards"];

const SectionCard = ({ section, index, total, onPatch, onMove, onDuplicate, onReset }) => (
  <article
    draggable
    onDragStart={(event) => event.dataTransfer.setData("text/plain", String(index))}
    onDragOver={(event) => event.preventDefault()}
    onDrop={(event) => onMove(Number(event.dataTransfer.getData("text/plain")), index)}
    className={`rounded-2xl border bg-white/[0.045] p-5 ${section.visible ? "border-white/10" : "border-orange-400/30"}`}
  >
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="cursor-grab text-white/40">::</span>
        <div>
          <h3 className="font-black">{section.label}</h3>
          <p className="text-xs text-white/45">{section.id}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <button onClick={() => onPatch({ visible: !section.visible })} className="rounded-xl border border-white/15 px-3 py-2 text-xs font-black">
          {section.visible ? "Hide" : "Show"}
        </button>
        <button disabled={index === 0} onClick={() => onMove(index, index - 1)} className="rounded-xl border border-white/15 px-3 py-2 text-xs font-black disabled:opacity-30">Up</button>
        <button disabled={index === total - 1} onClick={() => onMove(index, index + 1)} className="rounded-xl border border-white/15 px-3 py-2 text-xs font-black disabled:opacity-30">Down</button>
        <button onClick={onDuplicate} className="rounded-xl border border-white/15 px-3 py-2 text-xs font-black">Duplicate</button>
        <button onClick={onReset} className="rounded-xl border border-orange-400/30 px-3 py-2 text-xs font-black text-orange-300">Reset</button>
      </div>
    </div>
    {!section.visible && <div className="mb-4 rounded-xl bg-orange-400/10 p-3 text-xs font-black text-orange-300">Hidden section will not render publicly.</div>}
    <div className="grid gap-3 md:grid-cols-3">
      <label className="block">
        <span className="mb-2 block text-xs font-black uppercase text-white/45">Label</span>
        <input value={section.label} onChange={(event) => onPatch({ label: event.target.value })} className="w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm" />
      </label>
      <label className="block">
        <span className="mb-2 block text-xs font-black uppercase text-white/45">Anchor / ID</span>
        <input value={section.anchor} onChange={(event) => onPatch({ anchor: event.target.value })} className="w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm" />
      </label>
      <label className="block">
        <span className="mb-2 block text-xs font-black uppercase text-white/45">Layout mode</span>
        <select value={section.layout} onChange={(event) => onPatch({ layout: event.target.value })} className="w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm">
          {layoutOptions.map((layout) => <option key={layout} value={layout}>{layout}</option>)}
        </select>
      </label>
      {[
        ["backgroundImage", "Background image"],
        ["overlayOpacity", "Overlay opacity"],
        ["paddingX", "Padding X"],
        ["paddingY", "Padding Y"],
        ["maxWidth", "Max width"],
        ["radius", "Card radius"],
        ["gap", "Gap"],
      ].map(([key, label]) => (
        <label key={key} className="block">
          <span className="mb-2 block text-xs font-black uppercase text-white/45">{label}</span>
          <input
            type={key === "backgroundImage" ? "text" : "number"}
            value={section[key]}
            onChange={(event) => onPatch({ [key]: key === "backgroundImage" ? event.target.value : Number(event.target.value) })}
            className="w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm"
          />
        </label>
      ))}
    </div>
    <div className="mt-4 text-xs text-white/40">Registry: {sectionRegistry[section.id]?.label || "Unknown ignored"}</div>
  </article>
);

export default SectionCard;
