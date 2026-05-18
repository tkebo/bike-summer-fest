import { lazy, Suspense } from "react";
import { CMSProvider } from "./context/CMSContext";
import AdminOverlay from "./components/AdminOverlay";
import SEOHead from "./components/SEOHead";
import { useCMS } from "./hooks/useCMS";
import SiteCanvas from "./components/SiteCanvas";

const ProtectedAdminRoute = lazy(() => import("./components/ProtectedAdminRoute"));
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const AdminPreviewPage = lazy(() => import("./components/admin/AdminPreviewPage"));
const IntroPortal = lazy(() => import("./components/IntroPortal"));

function Platform() {
  const { editor, cmsData, isAdmin, lang } = useCMS();
  const isAdminPreviewRoute = window.location.pathname.startsWith("/admin/preview");
  const isAdminRoute = window.location.pathname.startsWith("/admin");

  if (isAdminPreviewRoute) {
    return (
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#050814] text-sm font-black text-white/70">Loading live preview...</div>}>
        <ProtectedAdminRoute>
          <AdminPreviewPage />
        </ProtectedAdminRoute>
      </Suspense>
    );
  }

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
      <SiteCanvas cmsData={cmsData} editor={editor} />
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
