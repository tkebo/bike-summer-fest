import { lazy, Suspense, useState } from "react";
import { useCMS } from "../../hooks/useCMS";
import AdminDashboard from "./AdminDashboard";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import AdminModuleLoader from "./AdminModuleLoader";

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
        onPublish={cms.publishSite}
        onLogout={cms.logout}
      />
      <div className="grid lg:grid-cols-[260px_1fr]">
        <AdminSidebar activeModule={activeModule} onSelect={setActiveModule} canManageUsers={cms.canManageUsers} canReadAuditLogs={cms.canReadAuditLogs} />
        <main className="p-4 md:p-6">
          <div className="mx-auto max-w-7xl">
            <Suspense fallback={<AdminModuleLoader label="Loading admin module..." />}>
              {renderModule()}
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
