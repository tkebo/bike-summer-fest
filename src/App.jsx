import { lazy, Suspense } from "react";
import { CMSProvider } from "./context/CMSContext";
import AdminOverlay from "./components/AdminOverlay";
import SEOHead from "./components/SEOHead";
import { useCMS } from "./hooks/useCMS";
import { allowedSectionIds, sectionRegistry } from "./data/sectionRegistry";

const ProtectedAdminRoute = lazy(() => import("./components/ProtectedAdminRoute"));
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const IntroPortal = lazy(() => import("./components/IntroPortal"));

const previewWidths = {
  desktop: "100%",
  tablet: "820px",
  mobile: "390px",
};

function Platform() {
  const { editor, cmsData, isAdmin, lang } = useCMS();
  const isAdminRoute = window.location.pathname.startsWith("/admin");
  const fallbackSections = (editor.sectionOrder || []).map((id, index) => ({ id, visible: editor.sectionVisibility?.[id] !== false, order: index + 1 }));
  const sections = Array.isArray(cmsData.config.sections) && cmsData.config.sections.length
    ? cmsData.config.sections.filter((section) => allowedSectionIds.includes(section.id)).sort((left, right) => left.order - right.order)
    : fallbackSections;
  const previewMode = editor.previewMode || "desktop";

  if (isAdminRoute) {
    return (
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#050814] text-sm font-black text-white/70">Loading admin shell...</div>}>
        <ProtectedAdminRoute>
          <AdminLayout />
        </ProtectedAdminRoute>
      </Suspense>
    );
  }

  return (
    <main className="min-h-screen bg-[#050814] text-white overflow-hidden">
      <SEOHead />
      {isAdmin && <div className="fixed left-1/2 top-4 z-[999] -translate-x-1/2 rounded-full border border-orange-400/30 bg-black/80 px-4 py-2 text-xs font-black text-orange-300 backdrop-blur-xl">Draft Preview — Not Published</div>}
      <AdminOverlay />
      <Suspense fallback={null}>
        <IntroPortal settings={cmsData.config.introSettings} audioSettings={cmsData.config.introAudio} lang={lang} />
      </Suspense>
      <div
        className="mx-auto min-h-screen transition-all duration-300"
        style={{ maxWidth: previewWidths[previewMode], width: "100%" }}
      >
        {sections.map((section, index) => {
          const Section = sectionRegistry[section.id]?.component;
          if (!Section || section.visible === false) return null;
          return <Section key={`${section.id}-${index}`} />;
        })}
      </div>
    </main>
  );
}

export default function App() {
  return (
    <CMSProvider>
      <Platform />
    </CMSProvider>
  );
}
