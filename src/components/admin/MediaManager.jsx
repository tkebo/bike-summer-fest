import { lazy, Suspense, useMemo, useState } from "react";
import MediaUpload from "./MediaUpload";
import MediaGrid from "./MediaGrid";

const MediaAssetModal = lazy(() => import("./MediaAssetModal"));

const MediaManager = ({
  cmsData,
  updateContent,
  mediaAssets,
  mediaLoading,
  mediaError,
  mediaUploadProgress,
  uploadHistory,
  createMediaAsset,
  updateMediaAsset,
  softDeleteMediaAsset,
  restoreMediaAsset,
  hardDeleteMediaAsset,
}) => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedAsset, setSelectedAsset] = useState(null);

  const filteredAssets = useMemo(() => mediaAssets.filter((asset) => {
    const query = search.toLowerCase();
    const matchesSearch = !query || asset.title?.toLowerCase().includes(query) || asset.tags?.some((tag) => tag.toLowerCase().includes(query));
    const matchesType = typeFilter === "all" || asset.type === typeFilter;
    const matchesActive = activeFilter === "all" || String(asset.active !== false) === activeFilter;
    return matchesSearch && matchesType && matchesActive;
  }), [activeFilter, mediaAssets, search, typeFilter]);

  const assignAsset = (target, asset) => {
    if (target === "hero-desktop") updateContent("config.backgrounds.hero.desktop", asset.url);
    if (target === "hero-tablet") updateContent("config.backgrounds.hero.tablet", asset.url);
    if (target === "hero-mobile") updateContent("config.backgrounds.hero.mobile", asset.url);
    if (target === "section") updateContent("config.backgrounds.section", asset.url);
    if (target === "gallery") updateContent("config.galleryImages", [...(cmsData.config.galleryImages || []), asset.url]);
    if (target === "sponsor") updateContent("config.sponsorLogos", [...(cmsData.config.sponsorLogos || []), asset.url]);
    if (target === "center-mark") updateContent("config.heroCenterMark.image", asset.url);
    if (target === "intro") updateContent("config.introImage", asset.url);
    if (target === "faq") updateContent("config.faqImage", asset.url);
    if (target === "zones") updateContent("config.zonesImage", asset.url);
  };

  const removeFromSections = (url) => {
    if (cmsData.config.backgrounds.hero.desktop === url) updateContent("config.backgrounds.hero.desktop", "");
    if (cmsData.config.backgrounds.hero.tablet === url) updateContent("config.backgrounds.hero.tablet", "");
    if (cmsData.config.backgrounds.hero.mobile === url) updateContent("config.backgrounds.hero.mobile", "");
    if (cmsData.config.backgrounds.section === url) updateContent("config.backgrounds.section", "");
    if (cmsData.config.introImage === url) updateContent("config.introImage", "");
    if (cmsData.config.heroCenterMark?.image === url) updateContent("config.heroCenterMark.image", "");
    if (cmsData.config.faqImage === url) updateContent("config.faqImage", "");
    if (cmsData.config.zonesImage === url) updateContent("config.zonesImage", "");
    updateContent("config.galleryImages", (cmsData.config.galleryImages || []).filter((item) => item !== url));
    updateContent("config.sponsorLogos", (cmsData.config.sponsorLogos || []).filter((item) => item !== url));
  };

  const assignedLabels = (url) => [
    cmsData.config.backgrounds.hero.desktop === url && "Hero desktop",
    cmsData.config.backgrounds.hero.tablet === url && "Hero tablet",
    cmsData.config.backgrounds.hero.mobile === url && "Hero mobile",
    cmsData.config.backgrounds.section === url && "Section background",
    cmsData.config.introImage === url && "Intro",
    cmsData.config.heroCenterMark?.image === url && "Hero center mark",
    cmsData.config.faqImage === url && "FAQ",
    cmsData.config.zonesImage === url && "Zones",
    cmsData.config.galleryImages?.includes(url) && "Gallery",
    cmsData.config.sponsorLogos?.includes(url) && "Sponsor",
  ].filter(Boolean);

  const deletePermanently = async (asset) => {
    const confirmed = window.confirm(
      `Delete "${asset.title || "this image"}" permanently from the media library? This also removes it from all assigned sections.`
    );
    if (!confirmed) return;
    removeFromSections(asset.url);
    await hardDeleteMediaAsset(asset);
    setSelectedAsset(null);
  };

  return (
    <div className="space-y-4">
      <MediaUpload onUpload={(file) => createMediaAsset(file, "general")} progress={mediaUploadProgress} error={mediaError} />
      <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
        <div className="mb-4 grid gap-3 md:grid-cols-[1fr_180px_180px]">
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by title or tag" className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm outline-none focus:border-cyan-300" />
          <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm">
            {["all", "hero", "gallery", "sponsor", "intro", "center-mark", "background", "general"].map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
          <select value={activeFilter} onChange={(event) => setActiveFilter(event.target.value)} className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm">
            <option value="all">all</option>
            <option value="true">active</option>
            <option value="false">inactive</option>
          </select>
        </div>
        {mediaLoading ? <div className="text-sm font-black text-white/60">Loading media...</div> : <MediaGrid assets={filteredAssets} onSelect={setSelectedAsset} />}
      </section>
      <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
        <h2 className="text-lg font-black">Upload history</h2>
        <div className="mt-4 grid gap-2 md:grid-cols-2">
          {uploadHistory.map((asset) => <div key={asset.id} className="rounded-xl bg-black/25 p-3 text-sm">{asset.title || "Untitled"} <span className="text-white/45">/ {asset.type}</span></div>)}
        </div>
      </section>
      {selectedAsset && (
        <Suspense fallback={null}>
          <MediaAssetModal
            asset={selectedAsset}
            assignedLabels={assignedLabels(selectedAsset.url)}
            onClose={() => setSelectedAsset(null)}
            onUpdate={updateMediaAsset}
            onDeactivate={softDeleteMediaAsset}
            onRestore={restoreMediaAsset}
            onDeletePermanently={deletePermanently}
            onRemoveFromSections={removeFromSections}
            onAssign={assignAsset}
          />
        </Suspense>
      )}
    </div>
  );
};

export default MediaManager;
