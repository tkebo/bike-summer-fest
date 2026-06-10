import { Suspense } from "react";
import { allowedSectionIds, sectionRegistry } from "../data/sectionRegistry";

const previewWidths = {
  desktop: "100%",
  tablet: "820px",
  mobile: "390px",
};

const SiteCanvas = ({ cmsData, editor, className = "" }) => {
  const fallbackSections = (editor.sectionOrder || []).map((id, index) => ({
    id,
    visible: editor.sectionVisibility?.[id] !== false,
    order: index + 1,
  }));
  const sections = Array.isArray(cmsData.config.sections) && cmsData.config.sections.length
    ? cmsData.config.sections.filter((section) => allowedSectionIds.includes(section.id)).sort((left, right) => left.order - right.order)
    : fallbackSections;
  const previewMode = editor.previewMode || "desktop";
  const transitionSpeed = editor.atmosphereTransitionSpeed || 1;
  const parallaxAmount = editor.atmosphereParallaxAmount || 40;

  return (
    <div
      className={`mx-auto min-h-screen transition-all duration-300 ${className}`}
      style={{ maxWidth: previewWidths[previewMode], width: "100%" }}
    >
      {sections.map((section, index) => {
        const Section = sectionRegistry[section.id]?.component;
        if (!Section || section.visible === false) return null;
        return (
          <div
            key={`${section.id}-${section.instanceId || index}`}
            className="atmosphere-section"
            data-section-id={section.id}
            style={{
              "--section-index": index,
              "--section-transition-speed": transitionSpeed,
              "--section-parallax": `${parallaxAmount}px`,
              contentVisibility: index > 1 ? "auto" : "visible",
              containIntrinsicSize: index > 1 ? "1px 900px" : undefined,
            }}
          >
            <Suspense fallback={<div className="min-h-40" aria-hidden="true" />}>
              <Section section={section} />
            </Suspense>
          </div>
        );
      })}
    </div>
  );
};

export default SiteCanvas;
