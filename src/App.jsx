import { lazy, Suspense } from "react";
import { CMSProvider } from "./context/CMSContext";
import AdminOverlay from "./components/AdminOverlay";
import SEOHead from "./components/SEOHead";
import { useCMS } from "./hooks/useCMS";
import SiteCanvas from "./components/SiteCanvas";
import AtmosphereLayer from "./components/AtmosphereLayer";

const ProtectedAdminRoute = lazy(() => import("./components/ProtectedAdminRoute"));
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const AdminPreviewPage = lazy(() => import("./components/admin/AdminPreviewPage"));
const IntroPortal = lazy(() => import("./components/IntroPortal"));

function Platform() {
  const { editor, cmsData, lang } = useCMS();
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
      <AtmosphereLayer editor={editor} />
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
