import { AdminCard, AdminField } from "./AdminUI";

const SectionsManagerModule = ({ editor, toggleSectionVisibility, reorderSections, duplicateSection, cmsData, updateContent }) => (
  <AdminCard title="Sections manager">
    <div className="grid gap-3">
      {(editor.sectionOrder || []).map((section, index, order) => {
        const settings = cmsData.config.sectionSettings[section] || {};
        return (
          <div key={`${section}-${index}`} className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="font-black capitalize">{section}</span>
              <div className="flex gap-2">
                <button onClick={() => toggleSectionVisibility(section)} className="rounded-lg border border-white/15 px-3 py-1 text-xs">{editor.sectionVisibility?.[section] === false ? "Show" : "Hide"}</button>
                <button onClick={() => duplicateSection(section)} className="rounded-lg border border-white/15 px-3 py-1 text-xs">Duplicate</button>
                <button disabled={index === 0} onClick={() => reorderSections(index, index - 1)} className="rounded-lg border border-white/15 px-3 py-1 text-xs disabled:opacity-30">Up</button>
                <button disabled={index === order.length - 1} onClick={() => reorderSections(index, index + 1)} className="rounded-lg border border-white/15 px-3 py-1 text-xs disabled:opacity-30">Down</button>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <AdminField label="Layout" value={settings.layout || "default"} onChange={(value) => updateContent(`config.sectionSettings.${section}.layout`, value)} />
              <AdminField label="Background image" value={settings.backgroundImage || ""} onChange={(value) => updateContent(`config.sectionSettings.${section}.backgroundImage`, value)} />
              <AdminField label="Overlay %" type="number" value={settings.overlay ?? 0} onChange={(value) => updateContent(`config.sectionSettings.${section}.overlay`, Number(value))} />
            </div>
          </div>
        );
      })}
    </div>
  </AdminCard>
);

export default SectionsManagerModule;
