import { defaultContent } from "../../data/defaultContent";
import { allowedSectionIds, createDefaultSections, sectionRegistry } from "../../data/sectionRegistry";
import SectionCard from "./SectionCard";

const normalizeSections = (sections) => {
  const source = Array.isArray(sections) && sections.length ? sections : createDefaultSections();
  return source.filter((section) => allowedSectionIds.includes(section.id)).sort((left, right) => left.order - right.order);
};

const SectionsManager = ({ cmsData, updateContent }) => {
  const sections = normalizeSections(cmsData.config.sections);

  const commit = (nextSections) => updateContent("config.sections", nextSections.map((section, index) => ({ ...section, order: index + 1 })));
  const patchSection = (index, patch) => commit(sections.map((section, sectionIndex) => (sectionIndex === index ? { ...section, ...patch } : section)));
  const moveSection = (fromIndex, toIndex) => {
    const next = [...sections];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    commit(next);
  };
  const duplicateSection = (index) => {
    const source = sections[index];
    const duplicate = { ...source, label: `${source.label} Copy`, anchor: `${source.anchor}-copy` };
    commit([...sections.slice(0, index + 1), duplicate, ...sections.slice(index + 1)]);
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
          onReset={() => resetSection(index)}
        />
      ))}
    </div>
  );
};

export default SectionsManager;
