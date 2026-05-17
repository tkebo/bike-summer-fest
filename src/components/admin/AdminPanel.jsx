import { useState } from "react";
import { useCMS } from "../../hooks/useCMS";
import DashboardModule from "./DashboardModule";
import ContentManagerModule from "./ContentManagerModule";
import DesignManagerModule from "./DesignManagerModule";
import SectionsManagerModule from "./SectionsManagerModule";
import TicketsManagerModule from "./TicketsManagerModule";
import SponsorsManagerModule from "./SponsorsManagerModule";
import ScheduleManagerModule from "./ScheduleManagerModule";
import EventSettingsModule from "./EventSettingsModule";
import SeoManagerModule from "./SeoManagerModule";
import PublishModule from "./PublishModule";
import UsersRolesModule from "./UsersRolesModule";
import { MediaLibraryPanel } from "../VisualEditor";

const modules = [
  ["dashboard", "Dashboard"],
  ["content", "Content"],
  ["design", "Design"],
  ["media", "Media"],
  ["sections", "Sections"],
  ["tickets", "Tickets"],
  ["sponsors", "Sponsors"],
  ["schedule", "Schedule"],
  ["event", "Event"],
  ["seo", "SEO"],
  ["publish", "Publish"],
  ["users", "Users"],
];

const AdminPanel = () => {
  const cms = useCMS();
  const [activeModule, setActiveModule] = useState("dashboard");
  const renderModule = () => {
    if (activeModule === "dashboard") return <DashboardModule {...cms} />;
    if (activeModule === "content") return <ContentManagerModule {...cms} />;
    if (activeModule === "design") return <DesignManagerModule {...cms} />;
    if (activeModule === "sections") return <SectionsManagerModule {...cms} />;
    if (activeModule === "tickets") return <TicketsManagerModule {...cms} />;
    if (activeModule === "sponsors") return <SponsorsManagerModule {...cms} />;
    if (activeModule === "schedule") return <ScheduleManagerModule {...cms} />;
    if (activeModule === "event") return <EventSettingsModule {...cms} />;
    if (activeModule === "seo") return <SeoManagerModule {...cms} />;
    if (activeModule === "publish") return <PublishModule {...cms} />;
    if (activeModule === "users") return <UsersRolesModule {...cms} />;
    if (activeModule === "media") {
      return (
        <MediaLibraryPanel
          assets={cms.mediaAssets}
          loading={cms.mediaLoading}
          error={cms.mediaError}
          progress={cms.mediaUploadProgress}
          onUpload={(file) => file && cms.createMediaAsset(file)}
          onUpdate={cms.updateMediaAsset}
          onDelete={cms.softDeleteMediaAsset}
          onRestore={cms.restoreMediaAsset}
          onUse={(target, asset) => {
            if (target === "hero") cms.updateContent("config.heroImage", asset.url);
            if (target === "intro") cms.updateContent("config.introImage", asset.url);
            if (target === "gallery") cms.updateContent("config.galleryImages", [...(cms.cmsData.config.galleryImages || []), asset.url]);
            if (target === "sponsor") cms.updateContent("config.sponsorLogos", [...(cms.cmsData.config.sponsorLogos || []), asset.url]);
          }}
          onRemoveFromSection={(url) => {
            if (cms.cmsData.config.heroImage === url) cms.updateContent("config.heroImage", "");
            if (cms.cmsData.config.introImage === url) cms.updateContent("config.introImage", "");
            cms.updateContent("config.galleryImages", (cms.cmsData.config.galleryImages || []).filter((item) => item !== url));
            cms.updateContent("config.sponsorLogos", (cms.cmsData.config.sponsorLogos || []).filter((item) => item !== url));
          }}
        />
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#050814] text-white">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-black/70 px-5 py-4 backdrop-blur-2xl">
        <div>
          <div className="text-xs font-black uppercase text-cyan-300">Bike Summer Fest 2026</div>
          <h1 className="text-xl font-black">Premium Admin Panel</h1>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="rounded-full bg-white/5 px-3 py-2">Cloud: {cms.cloudStatus}</span>
          <span className="rounded-full bg-white/5 px-3 py-2">Draft: {cms.cloudSaveStatus}</span>
          <button onClick={cms.publishSite} className="rounded-xl bg-orange-500 px-4 py-2 font-black text-black">Publish</button>
        </div>
      </header>
      <div className="grid min-h-[calc(100vh-73px)] lg:grid-cols-[250px_1fr]">
        <aside className="border-r border-white/10 p-4">
          <nav className="grid gap-2">
            {modules.map(([key, label]) => (
              <button key={key} onClick={() => setActiveModule(key)} className={`rounded-xl px-4 py-3 text-left text-sm font-black ${activeModule === key ? "bg-cyan-300 text-black" : "bg-white/[0.04] text-white/70 hover:bg-white/[0.08]"}`}>{label}</button>
            ))}
          </nav>
        </aside>
        <main className="p-4 md:p-6">
          <div className="mx-auto max-w-7xl">{renderModule()}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
