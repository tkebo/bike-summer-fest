import { lazy, Suspense, useState } from "react";
import { useCMS } from "../../hooks/useCMS";
import AdminDashboard from "./AdminDashboard";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import AdminModuleLoader from "./AdminModuleLoader";
import SiteCanvas from "../SiteCanvas";

const VisualEditor = lazy(() => import("../VisualEditor"));
const ContentManager = lazy(() => import("./ContentManager"));
const DesignManager = lazy(() => import("./DesignManager"));
const MediaManager = lazy(() => import("./MediaManager"));
const SectionsManager = lazy(() => import("./SectionsManager"));
const TicketsManager = lazy(() => import("./TicketsManager"));
const SponsorsManager = lazy(() => import("./SponsorsManager"));
const ScheduleManager = lazy(() => import("./ScheduleManager"));
const EventSettingsManager = lazy(() => import("./EventSettingsManager"));
const IntroSettingsManager = lazy(() => import("./IntroSettingsManager"));
const SEOManager = lazy(() => import("./SEOManager"));
const PublishManager = lazy(() => import("./PublishManager"));
const UsersManager = lazy(() => import("./UsersManager"));
const SecurityManager = lazy(() => import("./SecurityManager"));

const PlaceholderModule = ({ title }) => (
  <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-6">
    <h2 className="text-xl font-black">{title}</h2>
    <p className="mt-3 text-sm text-white/55">Module placeholder. Detailed migration comes in the next steps.</p>
  </section>
);

const AdminLayout = () => {
  const cms = useCMS();
  const [activeModule, setActiveModule] = useState("dashboard");
  const [previewOpen, setPreviewOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  const renderModule = () => {
    if (activeModule === "dashboard") return <AdminDashboard {...cms} />;
    if (activeModule === "content") return <ContentManager {...cms} />;
    if (activeModule === "design") return <DesignManager {...cms} />;
    if (activeModule === "media") return <MediaManager {...cms} />;
    if (activeModule === "sections") return <SectionsManager {...cms} />;
    if (activeModule === "tickets") return <TicketsManager {...cms} />;
    if (activeModule === "sponsors") return <SponsorsManager {...cms} />;
    if (activeModule === "schedule") return <ScheduleManager {...cms} />;
    if (activeModule === "event-settings") return <EventSettingsManager {...cms} />;
    if (activeModule === "intro-settings") return <IntroSettingsManager {...cms} />;
    if (activeModule === "seo") return <SEOManager {...cms} />;
    if (activeModule === "users" && cms.canManageUsers) return <UsersManager {...cms} />;
    if (activeModule === "security" && cms.canReadAuditLogs) return <SecurityManager {...cms} />;
    if (activeModule === "publish") return <PublishManager {...cms} />;
    if (activeModule === "visual-builder") {
      return (
        <div className="space-y-4">
          <PlaceholderModule title="Visual Builder" />
          <VisualEditor />
        </div>
      );
    }
    return <PlaceholderModule title={activeModule.replace("-", " ")} />;
  };

  return (
    <div className="min-h-screen bg-[#050814] text-white">
      <AdminTopbar
        user={cms.user}
        role={cms.adminProfile?.role || cms.session.role}
        cloudStatus={cms.cloudStatus}
        cloudSaveStatus={cms.cloudSaveStatus}
        publishStatus={cms.publishStatus}
        canPublish={cms.canPublish}
        onPublish={cms.quickPublishSite}
        onLogout={cms.logout}
        previewOpen={previewOpen}
        onTogglePreview={() => setPreviewOpen((current) => !current)}
      />
      <div className="lg:hidden border-b border-white/10 bg-black/30 px-4 py-3">
        <button
          type="button"
          onClick={() => setSidebarCollapsed((current) => !current)}
          className="admin-sidebar-toggle w-full rounded-xl border border-cyan-300/25 px-4 py-3 text-left text-sm font-black text-cyan-100"
        >
          {sidebarCollapsed ? "Show admin menu" : "Hide admin menu"}
        </button>
      </div>
      <div className="grid lg:grid-cols-[260px_1fr]">
        <AdminSidebar
          activeModule={activeModule}
          onSelect={(module) => {
            setActiveModule(module);
            setSidebarCollapsed(true);
          }}
          canManageUsers={cms.canManageUsers}
          canReadAuditLogs={cms.canReadAuditLogs}
          collapsed={sidebarCollapsed}
        />
        <main className="p-4 md:p-6">
          <div className={`mx-auto grid max-w-[1800px] gap-4 ${previewOpen ? "2xl:grid-cols-[minmax(520px,760px)_minmax(520px,1fr)]" : ""}`}>
            <Suspense fallback={<AdminModuleLoader label="Loading admin module..." />}>
              {renderModule()}
            </Suspense>
            {previewOpen && (
              <section className="overflow-hidden rounded-2xl border border-cyan-300/20 bg-black/40">
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                  <div>
                    <div className="text-xs font-black uppercase text-cyan-200">Live Preview</div>
                    <div className="text-xs text-white/45">Draft state updates immediately</div>
                  </div>
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-black">{cms.editor.previewMode}</span>
                </div>
                <div className="max-h-[calc(100vh-150px)] overflow-auto bg-[#050814]">
                  <SiteCanvas cmsData={cms.cmsData} editor={cms.editor} />
                </div>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
