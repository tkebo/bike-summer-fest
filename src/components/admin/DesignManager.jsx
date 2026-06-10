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
  ["gallery", "Gallery"],
  ["sponsors", "Sponsors"],
  ["backgrounds", "Backgrounds"],
  ["atmosphere", "Atmosphere"],
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
  createMediaAsset,
  mediaUploadProgress,
  mediaError,
}) => {
  const [activeCategory, setActiveCategory] = useState("theme");
  const [search, setSearch] = useState("");
  const [centerMarkUploadStatus, setCenterMarkUploadStatus] = useState("");
  const visibleControls = useMemo(
    () => (designTabs[activeCategory] || []).filter(([, label]) => label.toLowerCase().includes(search.toLowerCase())),
    [activeCategory, designTabs, search]
  );

  const resetCategory = () => {
    const nextPatch = Object.fromEntries((designTabs[activeCategory] || []).map(([key]) => [key, defaultEditor[key]]));
    patchEditor(nextPatch);
  };

  const uploadCenterMarkImage = async (file) => {
    if (!file || !createMediaAsset) return;
    try {
      setCenterMarkUploadStatus("Uploading...");
      const asset = await createMediaAsset(file, "center-mark");
      updateContent("config.heroCenterMark.image", asset.url);
      updateContent("config.heroCenterMark.imageFit", "contain");
      setCenterMarkUploadStatus("Uploaded and assigned");
    } catch (error) {
      setCenterMarkUploadStatus(error.message || "Upload failed");
    }
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
          {activeCategory === "atmosphere" && (
            <label className="mt-5 block max-w-sm">
              <span className="mb-2 block text-xs font-black uppercase text-white/45">Cinematic mode</span>
              <select
                value={editor.atmosphereMode || defaultEditor.atmosphereMode}
                onChange={(event) => patchEditor({ atmosphereMode: event.target.value })}
                className="w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300"
              >
                <option value="subtle">subtle</option>
                <option value="balanced">balanced</option>
                <option value="ultra">ultra</option>
              </select>
            </label>
          )}
          {activeCategory === "sponsors" && (
            <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h4 className="font-black">Sponsor Logo Presentation</h4>
                  <p className="mt-1 text-xs text-white/45">Clean mode removes sponsor card frames, backgrounds, shadows and blur while preserving logo transparency.</p>
                </div>
                <label className="flex items-center gap-3 text-sm font-black text-white/70">
                  <input
                    type="checkbox"
                    checked={cmsData.config.imageStyles?.sponsorLogoCleanMode !== false}
                    onChange={(event) => updateContent("config.imageStyles.sponsorLogoCleanMode", event.target.checked)}
                    className="h-5 w-5 rounded accent-cyan-300"
                  />
                  Logo Clean Mode
                </label>
              </div>
            </div>
          )}
          {activeCategory === "gallery" && (
            <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
              <div>
                <h4 className="font-black">External Gallery</h4>
                <p className="mt-1 text-xs text-white/45">Paste a shared Google Photos album URL. The public gallery opens it in a new tab.</p>
              </div>
              <label className="mt-4 grid gap-2">
                <span className="text-sm text-white/70">Google Photos / external gallery URL</span>
                <input
                  value={cmsData.config.externalGalleryUrl || ""}
                  onChange={(event) => updateContent("config.externalGalleryUrl", event.target.value)}
                  placeholder="https://photos.app.goo.gl/..."
                  className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300"
                />
              </label>
            </div>
          )}
          {activeCategory === "hero" && (
            <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h4 className="font-black">Center Mark Content</h4>
                  <p className="mt-1 text-xs text-white/45">Controls the circular BIKE SUMMER FEST 2026 mark in the hero.</p>
                </div>
                <label className="flex items-center gap-2 text-sm font-black text-white/70">
                  <input
                    type="checkbox"
                    checked={(cmsData.config.heroCenterMark || defaultContent.config.heroCenterMark).enabled !== false}
                    onChange={(event) => updateContent("config.heroCenterMark.enabled", event.target.checked)}
                    className="h-5 w-5 rounded accent-cyan-300"
                  />
                  Show mark
                </label>
                <label className="flex items-center gap-2 text-sm font-black text-white/70">
                  <input
                    type="checkbox"
                    checked={(cmsData.config.heroCenterMark || defaultContent.config.heroCenterMark).backgroundEnabled !== false}
                    onChange={(event) => updateContent("config.heroCenterMark.backgroundEnabled", event.target.checked)}
                    className="h-5 w-5 rounded accent-cyan-300"
                  />
                  Show background ring
                </label>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {[
                  ["line1", "Top text"],
                  ["line2", "Main text"],
                  ["line3", "Bottom text"],
                  ["line4", "Year / small text"],
                  ["image", "Image URL"],
                  ["imageAlt", "Image alt text"],
                ].map(([key, label]) => (
                  <label key={key} className="grid gap-2">
                    <span className="text-sm text-white/70">{label}</span>
                    <input
                      value={(cmsData.config.heroCenterMark || defaultContent.config.heroCenterMark)[key] ?? ""}
                      onChange={(event) => updateContent(`config.heroCenterMark.${key}`, event.target.value)}
                      className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300"
                    />
                  </label>
                ))}
                <label className="grid gap-2 md:col-span-2">
                  <span className="text-sm text-white/70">Upload image directly</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(event) => uploadCenterMarkImage(event.target.files?.[0])}
                    className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm text-white file:mr-4 file:rounded-lg file:border-0 file:bg-cyan-300 file:px-3 file:py-2 file:text-sm file:font-black file:text-black"
                  />
                  {(centerMarkUploadStatus || mediaError) && (
                    <span className={`text-xs font-black ${mediaError ? "text-orange-300" : "text-cyan-200"}`}>
                      {mediaError || centerMarkUploadStatus}
                    </span>
                  )}
                  {mediaUploadProgress > 0 && (
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full bg-cyan-300" style={{ width: `${mediaUploadProgress}%` }} />
                    </div>
                  )}
                </label>
                <label className="grid gap-2">
                  <span className="text-sm text-white/70">Image fit</span>
                  <select
                    value={(cmsData.config.heroCenterMark || defaultContent.config.heroCenterMark).imageFit || "contain"}
                    onChange={(event) => updateContent("config.heroCenterMark.imageFit", event.target.value)}
                    className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300"
                  >
                    <option value="cover">Cover</option>
                    <option value="contain">Contain</option>
                  </select>
                </label>
                <label className="grid gap-2">
                  <span className="text-sm text-white/70">Image opacity</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={(cmsData.config.heroCenterMark || defaultContent.config.heroCenterMark).imageOpacity ?? 45}
                    onChange={(event) => updateContent("config.heroCenterMark.imageOpacity", Number(event.target.value))}
                  />
                  <span className="text-xs text-cyan-200">{(cmsData.config.heroCenterMark || defaultContent.config.heroCenterMark).imageOpacity ?? 45}%</span>
                </label>
              </div>
            </div>
          )}
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
            ["galleryGridLimit", "Gallery visible items", 1, 24],
            ["galleryGridGap", "Gallery grid gap", 0, 64],
            ["zonesMobileHeight", "Zones image mobile height", 120, 900],
            ["zonesDesktopHeight", "Zones image desktop height", 180, 1200],
            ["faqHeight", "FAQ image height", 120, 900],
            ["sponsorLogoHeight", "Sponsor logo height", 24, 240],
            ["sponsorLogoMaxWidth", "Sponsor logo max width", 80, 480],
            ["sponsorLogoPadding", "Sponsor logo padding", 0, 64],
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
        <div className="mt-6 grid gap-5 xl:grid-cols-3">
          {[
            ["gallery", "Gallery images"],
            ["zones", "Zones panorama"],
            ["faq", "FAQ / location image"],
          ].map(([prefix, label]) => (
            <div key={prefix} className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <h4 className="font-black">{label}</h4>
              <label className="mt-4 grid gap-2">
                <span className="text-sm text-white/70">Fit inside section</span>
                <select
                  value={cmsData.config.imageStyles?.[`${prefix}Fit`] ?? defaultContent.config.imageStyles[`${prefix}Fit`]}
                  onChange={(event) => updateContent(`config.imageStyles.${prefix}Fit`, event.target.value)}
                  className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm"
                >
                  <option value="cover">Cover</option>
                  <option value="contain">Contain</option>
                </select>
              </label>
              {[
                [`${prefix}PositionX`, "Horizontal position"],
                [`${prefix}PositionY`, "Vertical position"],
              ].map(([key, positionLabel]) => (
                <label key={key} className="mt-4 grid gap-2">
                  <span className="text-sm text-white/70">{positionLabel}</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={cmsData.config.imageStyles?.[key] ?? defaultContent.config.imageStyles[key]}
                    onChange={(event) => updateContent(`config.imageStyles.${key}`, Number(event.target.value))}
                  />
                  <span className="text-xs text-cyan-200">{cmsData.config.imageStyles?.[key] ?? defaultContent.config.imageStyles[key]}%</span>
                </label>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DesignManager;
