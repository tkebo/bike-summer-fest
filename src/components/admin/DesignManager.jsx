import { useMemo, useState } from "react";
import { defaultEditor } from "../../data/defaultEditor";
import { defaultContent } from "../../data/defaultContent";
import DesignControl from "./DesignControl";
import BackgroundControl from "./BackgroundControl";

const categories = [
  ["theme", "Global Theme"],
  ["header", "Header"],
  ["logo", "Logo"],
  ["nav", "Navigation"],
  ["language", "Language Switcher"],
  ["ticket", "Ticket Button"],
  ["countdown", "Countdown"],
  ["hero", "Hero"],
  ["buttons", "Buttons"],
  ["globalBox", "Cards / Boxes"],
  ["sections", "Sections"],
  ["backgrounds", "Backgrounds"],
  ["responsive", "Responsive"],
];

const DesignManager = ({
  editor,
  designTabs,
  updateEditor,
  patchEditor,
  resetEditor,
  exportEditorData,
  importEditorData,
  editorSaveStatus,
  cmsData,
  updateContent,
}) => {
  const [activeCategory, setActiveCategory] = useState("theme");
  const [search, setSearch] = useState("");
  const visibleControls = useMemo(
    () => (designTabs[activeCategory] || []).filter(([, label]) => label.toLowerCase().includes(search.toLowerCase())),
    [activeCategory, designTabs, search]
  );

  const resetCategory = () => {
    const nextPatch = Object.fromEntries((designTabs[activeCategory] || []).map(([key]) => [key, defaultEditor[key]]));
    patchEditor(nextPatch);
  };

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-black">Design Manager</h2>
            <p className="mt-1 text-sm text-white/55">Live preview uses the same editor config as Visual Builder.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/5 px-3 py-2 text-xs font-black text-cyan-200">{editorSaveStatus === "Saving..." ? "Unsaved" : "Saved"}</span>
            <button onClick={resetCategory} className="rounded-xl border border-orange-400/30 px-3 py-2 text-xs font-black text-orange-300">Reset category</button>
            <button onClick={resetEditor} className="rounded-xl border border-orange-400/30 px-3 py-2 text-xs font-black text-orange-300">Reset all design</button>
            <button onClick={exportEditorData} className="rounded-xl border border-white/15 px-3 py-2 text-xs font-black">Export JSON</button>
            <label className="cursor-pointer rounded-xl border border-white/15 px-3 py-2 text-xs font-black">
              Import JSON
              <input type="file" accept=".json" onChange={importEditorData} className="hidden" />
            </label>
          </div>
        </div>
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search controls" className="mt-4 w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300" />
      </section>

      <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
        <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-3">
          <div className="grid gap-2">
            {categories.map(([key, label]) => (
              <button key={key} onClick={() => setActiveCategory(key)} className={`rounded-xl px-3 py-3 text-left text-sm font-black ${activeCategory === key ? "bg-cyan-300 text-black" : "bg-black/20 text-white/70 hover:bg-white/5"}`}>{label}</button>
            ))}
          </div>
        </section>
        <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-black">{categories.find(([key]) => key === activeCategory)?.[1]}</h3>
            <span className="text-xs font-black uppercase text-cyan-200">Live preview</span>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {visibleControls.map((control) => (
              <DesignControl key={control[0]} control={control} value={editor[control[0]] ?? defaultEditor[control[0]]} onChange={updateEditor} />
            ))}
          </div>
        </section>
      </div>

      <BackgroundControl backgrounds={cmsData.config.backgrounds} updateContent={updateContent} />
      <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-black">Image Size Controls</h3>
          <span className="text-xs font-black uppercase text-cyan-200">Live preview</span>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {[
            ["galleryHeight", "Gallery image height", 120, 900],
            ["zonesMobileHeight", "Zones image mobile height", 120, 900],
            ["zonesDesktopHeight", "Zones image desktop height", 180, 1200],
            ["faqHeight", "FAQ image height", 120, 900],
            ["sponsorLogoHeight", "Sponsor logo height", 24, 240],
            ["heroBackgroundScale", "Hero background scale", 50, 200],
          ].map(([key, label, min, max]) => (
            <label key={key} className="grid gap-2">
              <span className="text-sm text-white/70">{label}</span>
              <input
                type="range"
                min={min}
                max={max}
                value={cmsData.config.imageStyles?.[key] ?? defaultContent.config.imageStyles[key]}
                onChange={(event) => updateContent(`config.imageStyles.${key}`, Number(event.target.value))}
              />
              <span className="text-xs text-cyan-200">{cmsData.config.imageStyles?.[key] ?? defaultContent.config.imageStyles[key]} px</span>
            </label>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DesignManager;
