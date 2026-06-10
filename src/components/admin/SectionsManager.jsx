import { defaultContent } from "../../data/defaultContent";
import { allowedSectionIds, createDefaultSections, sectionRegistry } from "../../data/sectionRegistry";
import SectionCard from "./SectionCard";

const normalizeSections = (sections) => {
  const source = Array.isArray(sections) && sections.length ? sections : createDefaultSections();
  return source.filter((section) => allowedSectionIds.includes(section.id)).sort((left, right) => left.order - right.order);
};

const createCustomSection = (count) => ({
  id: "custom",
  instanceId: `custom-${Date.now()}-${count + 1}`,
  label: `Custom Section ${count + 1}`,
  visible: true,
  order: 999,
  anchor: `custom-section-${count + 1}`,
  layout: "split",
  backgroundImage: "",
  overlayOpacity: 0,
  paddingX: 48,
  paddingY: 112,
  maxWidth: 1280,
  gap: 32,
  radius: 32,
  content: {
    eyebrowKa: "ახალი სექცია",
    eyebrowEn: "New Section",
    titleKa: "სათაური",
    titleEn: "Section Title",
    textKa: "დაამატე ტექსტი ამ სექციისთვის.",
    textEn: "Add section text here.",
    image: "",
    mediaType: "image",
    buttonTextKa: "",
    buttonTextEn: "",
    buttonUrl: "",
  },
});

const SectionsManager = ({ cmsData, updateContent }) => {
  const sections = normalizeSections(cmsData.config.sections);
  const sectionCounts = sections.reduce((counts, section) => section.id === "custom" ? counts : ({ ...counts, [section.id]: (counts[section.id] || 0) + 1 }), {});
  const duplicateIds = Object.entries(sectionCounts).filter(([, count]) => count > 1).map(([id]) => id);
  const rendererCounts = sections.reduce((counts, section) => {
    const renderer = sectionRegistry[section.id]?.renderKey || section.id;
    if (renderer === "custom") return counts;
    return { ...counts, [renderer]: (counts[renderer] || 0) + 1 };
  }, {});
  const duplicateRendererIds = sections
    .filter((section) => rendererCounts[sectionRegistry[section.id]?.renderKey || section.id] > 1)
    .map((section) => section.id);

  const commit = (nextSections) => updateContent("config.sections", nextSections.map((section, index) => ({ ...section, order: index + 1 })));
  const patchSection = (index, patch) => commit(sections.map((section, sectionIndex) => (sectionIndex === index ? { ...section, ...patch } : section)));
  const addSection = (id) => {
    if (id === "custom") {
      commit([...sections, createCustomSection(sections.filter((section) => section.id === "custom").length)]);
      return;
    }
    const defaults = defaultContent.config.sections.find((section) => section.id === id) || createDefaultSections().find((section) => section.id === id);
    if (!defaults) return;
    commit([...sections, { ...defaults, visible: true, order: sections.length + 1 }]);
  };
  const moveSection = (fromIndex, toIndex) => {
    const next = [...sections];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    commit(next);
  };
  const duplicateSection = (index) => {
    const source = sections[index];
    const copyCount = sections.filter((section) => section.id === source.id).length;
    const duplicate = { ...source, instanceId: `${source.id}-copy-${copyCount}`, label: `${source.label} Copy`, anchor: `${source.anchor}-copy-${copyCount}` };
    commit([...sections.slice(0, index + 1), duplicate, ...sections.slice(index + 1)]);
  };
  const removeSection = (index) => commit(sections.filter((_, sectionIndex) => sectionIndex !== index));
  const removeDuplicateSections = () => {
    const seen = new Set();
    commit(sections.filter((section) => {
      if (seen.has(section.id)) return false;
      seen.add(section.id);
      return true;
    }));
  };
  const removeDuplicateRenderers = () => {
    const seenRenderers = new Set();
    commit(sections.filter((section) => {
      const renderer = sectionRegistry[section.id]?.renderKey || section.id;
      if (seenRenderers.has(renderer)) return false;
      seenRenderers.add(renderer);
      return true;
    }));
  };
  const resetSection = (index) => {
    const defaults = defaultContent.config.sections.find((section) => section.id === sections[index].id) || defaultContent.config.sections[index];
    patchSection(index, { ...defaults, order: sections[index].order });
  };

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
        <h2 className="text-xl font-black">Sections Manager</h2>
        <p className="mt-2 text-sm text-white/55">Only registry-approved section IDs render publicly. Unknown IDs are ignored safely.</p>
        <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="mb-3 text-xs font-black uppercase text-cyan-200">Add section</div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => addSection("custom")} className="rounded-xl bg-cyan-300 px-3 py-2 text-xs font-black text-black">Add custom section</button>
            {allowedSectionIds
              .filter((id) => id !== "custom" && id !== "intro-portal" && !sections.some((section) => section.id === id))
              .map((id) => (
                <button key={id} onClick={() => addSection(id)} className="rounded-xl border border-white/15 px-3 py-2 text-xs font-black text-white/70">
                  Add {sectionRegistry[id]?.label || id}
                </button>
              ))}
          </div>
        </div>
        {duplicateIds.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-400/35 bg-red-400/10 p-4 text-red-200">
            <span className="text-sm font-black">Duplicated sections: {duplicateIds.join(", ")}</span>
            <button onClick={removeDuplicateSections} className="rounded-xl border border-red-300/35 px-3 py-2 text-xs font-black">Remove all duplicates</button>
          </div>
        )}
        {duplicateRendererIds.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-400/35 bg-red-400/10 p-4 text-red-200">
            <span className="text-sm font-black">Same renderer used more than once: {duplicateRendererIds.join(", ")}</span>
            <button onClick={removeDuplicateRenderers} className="rounded-xl border border-red-300/35 px-3 py-2 text-xs font-black">Remove repeated renderers</button>
          </div>
        )}
      </section>
      {sections.map((section, index) => (
        <SectionCard
          key={`${section.id}-${index}`}
          section={{ ...section, label: section.label || sectionRegistry[section.id]?.label }}
          index={index}
          total={sections.length}
          onPatch={(patch) => patchSection(index, patch)}
          onMove={moveSection}
          onDuplicate={() => duplicateSection(index)}
          onRemove={() => removeSection(index)}
          onReset={() => resetSection(index)}
          duplicate={section.id !== "custom" && (sectionCounts[section.id] > 1 || rendererCounts[sectionRegistry[section.id]?.renderKey || section.id] > 1)}
        />
      ))}
    </div>
  );
};

export default SectionsManager;
