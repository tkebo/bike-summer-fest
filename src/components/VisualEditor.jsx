import { memo, useState } from "react";
import { motion, useDragControls } from "framer-motion";
import { useCMS } from "../hooks/useCMS";
import { getOptimizedImageUrl, uploadImage } from "../lib/cloudinary";
import { validateFutureImageUpload } from "../security/uploadPolicy";

const sectionLabels = {
  hero: "Hero",
  about: "About",
  zones: "Zones",
  schedule: "Schedule",
  tickets: "Tickets",
  sponsors: "Sponsors",
  faq: "FAQ",
  gallery: "Gallery",
  newsletter: "Newsletter",
  footer: "Footer",
};

const MediaUploadField = ({ label, value, onChange, onRemove, multiple = false }) => {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const files = Array.isArray(value) ? value : value ? [value] : [];

  const handleFiles = async (fileList, replaceIndex = null) => {
    const selectedFiles = Array.from(fileList || []);
    if (!selectedFiles.length) return;
    setUploading(true);
    setStatus("");
    try {
      const uploads = [];
      for (const file of selectedFiles) {
        const validation = validateFutureImageUpload(file);
        if (!validation.ok) throw new Error(validation.reason);
        const result = await uploadImage(file, setProgress);
        uploads.push(result.secure_url);
      }
      if (multiple) {
        if (replaceIndex !== null) {
          onChange(files.map((file, index) => (index === replaceIndex ? uploads[0] : file)));
        } else {
          onChange([...files, ...uploads]);
        }
      } else {
        onChange(uploads[0]);
      }
      setStatus("Uploaded");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-black text-white/70">{label}</span>
        {status && <span className={`text-xs font-black ${status === "Uploaded" ? "text-cyan-300" : "text-orange-400"}`}>{status}</span>}
      </div>
      <label
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          handleFiles(event.dataTransfer.files);
        }}
        className={`block cursor-pointer rounded-xl border border-dashed p-4 text-center transition ${dragging ? "border-cyan-300 bg-cyan-300/10" : "border-white/20 bg-black/20 hover:border-cyan-300/50"}`}
      >
        <input type="file" accept="image/*" multiple={multiple} onChange={(event) => handleFiles(event.target.files)} className="hidden" />
        <span className="block text-sm font-black text-white/75">{uploading ? "Uploading..." : "Drop image here or click to upload"}</span>
        {uploading && (
          <span className="mt-3 block h-2 overflow-hidden rounded-full bg-white/10">
            <span className="block h-full bg-cyan-300 transition-all" style={{ width: `${progress}%` }} />
          </span>
        )}
      </label>
      {files.length > 0 && (
        <div className="mt-3 grid gap-3">
          {files.map((file, index) => (
            <div key={`${file}-${index}`} className="overflow-hidden rounded-xl border border-white/10 bg-black/30">
              <img src={getOptimizedImageUrl(file, 480)} alt="" className="h-32 w-full object-cover" />
              <div className="grid grid-cols-2 gap-2 p-2">
                <label className="cursor-pointer rounded-lg border border-white/15 px-3 py-2 text-center text-xs font-black text-white/75 hover:bg-white/10">
                  Replace
                  <input type="file" accept="image/*" onChange={(event) => handleFiles(event.target.files, index)} className="hidden" />
                </label>
                <button type="button" onClick={() => onRemove(index)} className="rounded-lg border border-orange-400/30 px-3 py-2 text-xs font-black text-orange-400 hover:bg-orange-400/10">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const MediaLibraryPanel = ({
  assets,
  loading,
  error,
  progress,
  onUpload,
  onUpdate,
  onDelete,
  onRestore,
  onUse,
  onRemoveFromSection,
}) => {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [preview, setPreview] = useState(null);
  const filteredAssets = assets.filter((asset) => {
    const matchesType = filter === "all" || asset.type === filter;
    const query = search.toLowerCase();
    const matchesSearch = !query
      || asset.title?.toLowerCase().includes(query)
      || asset.tags?.some((tag) => tag.toLowerCase().includes(query));
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-4">
      <label className="block cursor-pointer rounded-2xl border border-dashed border-white/20 bg-white/5 p-4 text-center hover:border-cyan-300/50">
        <input type="file" accept="image/*" onChange={(event) => onUpload(event.target.files?.[0])} className="hidden" />
        <span className="block text-sm font-black text-white/75">Upload new asset</span>
        {progress > 0 && (
          <span className="mt-3 block h-2 overflow-hidden rounded-full bg-white/10">
            <span className="block h-full bg-cyan-300" style={{ width: `${progress}%` }} />
          </span>
        )}
      </label>
      {error && <div className="rounded-xl border border-orange-400/30 bg-orange-400/10 p-3 text-xs font-black text-orange-300">{error}</div>}
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search title or tag" className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300" />
        <select value={filter} onChange={(event) => setFilter(event.target.value)} className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none">
          {["all", "hero", "gallery", "sponsor", "intro", "general"].map((type) => <option key={type} value={type}>{type}</option>)}
        </select>
      </div>
      {loading ? (
        <div className="text-sm font-black text-white/60">Loading media...</div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filteredAssets.map((asset) => (
            <button key={asset.id} onClick={() => setPreview(asset)} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-left">
              <img src={getOptimizedImageUrl(asset.url, 320)} alt={asset.alt || ""} className="h-28 w-full object-cover" />
              <div className="p-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-xs font-black text-white/80">{asset.title || "Untitled"}</span>
                  <span className={`rounded-full px-2 py-1 text-[10px] font-black ${asset.active !== false ? "bg-cyan-300/15 text-cyan-200" : "bg-orange-400/15 text-orange-300"}`}>
                    {asset.active !== false ? "active" : "inactive"}
                  </span>
                </div>
                <div className="mt-2 text-[10px] uppercase text-white/40">{asset.type}</div>
              </div>
            </button>
          ))}
        </div>
      )}
      {preview && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 p-4" onClick={() => setPreview(null)}>
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-black p-5" onClick={(event) => event.stopPropagation()}>
            <img src={getOptimizedImageUrl(preview.url, 720)} alt={preview.alt || ""} className="h-56 w-full rounded-2xl object-cover" />
            <div className="mt-4 grid gap-3">
              <input value={preview.title || ""} onChange={(event) => setPreview({ ...preview, title: event.target.value })} placeholder="Title" className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
              <input value={preview.alt || ""} onChange={(event) => setPreview({ ...preview, alt: event.target.value })} placeholder="Alt text" className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
              <input value={(preview.tags || []).join(", ")} onChange={(event) => setPreview({ ...preview, tags: event.target.value.split(",").map((tag) => tag.trim()).filter(Boolean) })} placeholder="tags, comma, separated" className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white" />
              <select value={preview.type} onChange={(event) => setPreview({ ...preview, type: event.target.value })} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white">
                {["hero", "gallery", "sponsor", "intro", "general"].map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
              <button onClick={() => onUpdate(preview.id, { title: preview.title, alt: preview.alt, tags: preview.tags, type: preview.type })} className="rounded-xl bg-cyan-300 px-4 py-3 font-black text-black">Save metadata</button>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => onUse("hero", preview)} className="rounded-xl border border-white/15 px-3 py-2 text-xs font-black">Use as hero</button>
                <button onClick={() => onUse("intro", preview)} className="rounded-xl border border-white/15 px-3 py-2 text-xs font-black">Use as intro</button>
                <button onClick={() => onUse("gallery", preview)} className="rounded-xl border border-white/15 px-3 py-2 text-xs font-black">Add gallery</button>
                <button onClick={() => onUse("sponsor", preview)} className="rounded-xl border border-white/15 px-3 py-2 text-xs font-black">Add sponsor</button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {preview.active !== false ? (
                  <button onClick={() => onDelete(preview.id)} className="rounded-xl border border-orange-400/30 px-3 py-2 text-xs font-black text-orange-300">Soft delete</button>
                ) : (
                  <button onClick={() => onRestore(preview.id)} className="rounded-xl border border-cyan-300/30 px-3 py-2 text-xs font-black text-cyan-200">Restore</button>
                )}
                <button onClick={() => onRemoveFromSection(preview.url)} className="rounded-xl border border-white/15 px-3 py-2 text-xs font-black">Remove from section</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const VisualEditor = () => {
  const dragControls = useDragControls();
  const {
    editorOpen,
    setEditorOpen,
    editorTab,
    setEditorTab,
    designTabs,
    activeDesignCategory,
    setActiveDesignCategory,
    renderDesignSliders,
    editorSaveStatus,
    saveEditor,
    exportEditorData,
    importEditorData,
    resetEditor,
    adminMode,
    setAdminMode,
    exportData,
    importData,
    resetCms,
    cmsData,
    updateContent,
    editor,
    toggleSectionVisibility,
    setPreviewMode,
    reorderSections,
    user,
    isAdmin,
    firestoreAdmin,
    authReady,
    adminProfile,
    adminReady,
    cloudStatus,
    cloudSaveStatus,
    publishStatus,
    loginWithGoogle,
    logout,
    publishSite,
    mediaAssets,
    mediaLoading,
    mediaError,
    mediaUploadProgress,
    createMediaAsset,
    updateMediaAsset,
    softDeleteMediaAsset,
    restoreMediaAsset,
  } = useCMS();
  const isAdminRoute = window.location.pathname.startsWith("/admin");

  if (!isAdminRoute) return null;

  if (!authReady || !adminReady) {
    return (
      <div className="fixed right-5 bottom-5 z-[999] rounded-2xl border border-white/10 bg-black/90 px-5 py-4 text-sm font-black text-white/70">
        Loading admin...
      </div>
    );
  }

  if (!user) {
    return (
      <button
        onClick={loginWithGoogle}
        className="fixed right-5 bottom-5 z-[999] rounded-2xl bg-cyan-300 px-5 py-4 font-black text-black shadow-[0_0_40px_rgba(0,217,255,.45)]"
      >
        Admin Login
      </button>
    );
  }

  if (!isAdmin) {
    if (import.meta.env.DEV) {
      return (
        <div className="fixed right-5 bottom-5 z-[999] w-[360px] rounded-2xl border border-orange-400/30 bg-black/95 p-4 shadow-[0_0_40px_rgba(249,115,22,.2)]">
          <p className="font-black text-orange-400">Access denied debug</p>
          <div className="mt-4 grid gap-3 text-xs text-white/70">
            <div>
              <span className="block text-white/40">user.email</span>
              <span className="break-all font-mono">{user.email ?? "null"}</span>
            </div>
            <div>
              <span className="block text-white/40">user.uid</span>
              <span className="break-all font-mono">{user.uid ?? "null"}</span>
            </div>
            <div>
              <span className="block text-white/40">adminProfile</span>
              <pre className="mt-1 max-h-28 overflow-auto rounded-xl bg-white/5 p-3 font-mono text-[11px] text-white/70">
                {JSON.stringify(adminProfile, null, 2)}
              </pre>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="block text-white/40">isAdmin</span>
                <span className="font-mono">{String(isAdmin)}</span>
              </div>
              <div>
                <span className="block text-white/40">isFirestoreAdmin</span>
                <span className="font-mono">{String(firestoreAdmin)}</span>
              </div>
            </div>
            <div>
              <span className="block text-white/40">loading state</span>
              <span className="font-mono">{String(!authReady || !adminReady)}</span>
            </div>
          </div>
          <button onClick={logout} className="mt-4 w-full rounded-xl border border-white/15 px-4 py-3 font-black text-white/80 hover:bg-white/10">
            Logout
          </button>
        </div>
      );
    }

    return (
      <div className="fixed right-5 bottom-5 z-[999] w-[260px] rounded-2xl border border-orange-400/30 bg-black/95 p-4 shadow-[0_0_40px_rgba(249,115,22,.2)]">
        <p className="font-black text-orange-400">Access denied</p>
        <p className="mt-2 truncate text-sm text-white/60">{user.email}</p>
        <button onClick={logout} className="mt-4 w-full rounded-xl border border-white/15 px-4 py-3 font-black text-white/80 hover:bg-white/10">
          Logout
        </button>
      </div>
    );
  }

  return (
    <>
      <button onClick={() => setEditorOpen(!editorOpen)} className="fixed right-5 bottom-5 z-[999] rounded-2xl bg-cyan-300 px-5 py-4 font-black text-black shadow-[0_0_40px_rgba(0,217,255,.45)]">
        Editor
      </button>

      {editorOpen && (
        <motion.div
          drag
          dragControls={dragControls}
          dragListener={false}
          dragMomentum={false}
          className="fixed right-5 bottom-24 z-[999] max-h-[85vh] w-[360px] overflow-y-auto rounded-[28px] border border-white/10 bg-black/95 p-6 shadow-[0_0_70px_rgba(0,217,255,.22)] backdrop-blur-3xl hide-scrollbar"
          style={{ touchAction: "none" }}
        >
          <div
            className="-mt-2 mb-5 flex cursor-grab items-center justify-between border-b border-white/10 pb-4 pt-2 active:cursor-grabbing"
            onPointerDown={(event) => dragControls.start(event)}
          >
            <h3 className="pointer-events-none text-xl font-black text-cyan-300">CMS & Editor</h3>
            <button onClick={() => setEditorOpen(false)} className="px-2 text-xl font-black text-white/70 hover:text-white">x</button>
          </div>
          <div className="mb-5 rounded-2xl border border-white/10 bg-white/5 p-3 text-xs">
            <div className="flex items-center justify-between gap-3">
              <span className="truncate font-black text-white/75">{user.email}</span>
              <button onClick={logout} className="rounded-lg border border-white/15 px-3 py-1.5 font-black text-white/75 hover:bg-white/10">
                Logout
              </button>
            </div>
            <div className="mt-3 grid gap-2 text-white/60">
              <div className="flex items-center justify-between">
                <span>Cloud</span>
                <span className={cloudStatus === "Connected" ? "font-black text-cyan-300" : "font-black text-orange-400"}>{cloudStatus}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Draft</span>
                <span className="font-black text-cyan-300">{cloudSaveStatus}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Publish</span>
                <span className="font-black text-cyan-300">{publishStatus}</span>
              </div>
            </div>
            <button onClick={publishSite} className="mt-3 w-full rounded-xl bg-orange-500 px-4 py-3 font-black text-black transition hover:bg-orange-400">
              Publish
            </button>
          </div>

          <div className="mb-6 flex gap-2 border-b border-white/10 pb-3">
            {["design", "live", "content", "config", "media"].map((tab) => (
              <button key={tab} onClick={() => setEditorTab(tab)} className={`flex-1 rounded-lg py-2 text-sm font-black capitalize transition ${editorTab === tab ? "bg-cyan-400 text-black" : "text-white/60 hover:bg-white/5"}`}>
                {tab === "config" ? "Data" : tab}
              </button>
            ))}
          </div>

          {editorTab === "design" && (
            <div className="animate-in fade-in zoom-in-95 duration-200">
              <div className="mb-4 flex gap-2 overflow-x-auto border-b border-white/10 pb-2 hide-scrollbar">
                {Object.keys(designTabs).map((category) => (
                  <button key={category} onClick={() => setActiveDesignCategory(category)} className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-black transition ${activeDesignCategory === category ? "bg-cyan-400 text-black" : "text-white/60 hover:bg-white/5"}`}>
                    {category.toUpperCase()}
                  </button>
                ))}
              </div>
              <div className="max-h-[45vh] overflow-y-auto pr-2 hide-scrollbar">{renderDesignSliders(activeDesignCategory)}</div>
              <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="mb-3 flex items-center justify-between text-xs">
                  <span className="text-white/50">Design storage</span>
                  <span className="font-black text-cyan-300">{editorSaveStatus}</span>
                </div>
                <button onClick={saveEditor} className="w-full rounded-xl bg-cyan-400 px-5 py-3 font-black text-black transition hover:bg-cyan-300">Save Design</button>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <button onClick={exportEditorData} className="rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-black text-white transition hover:bg-white/10">Export</button>
                  <label className="cursor-pointer rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-center text-sm font-black text-white transition hover:bg-white/10">
                    Import
                    <input type="file" accept=".json" onChange={importEditorData} className="hidden" />
                  </label>
                </div>
                <button onClick={resetEditor} className="mt-3 w-full rounded-xl bg-orange-500/20 px-5 py-3 font-black text-orange-500 transition hover:bg-orange-500 hover:text-black">Reset Design</button>
              </div>
            </div>
          )}

          {editorTab === "live" && (
            <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-black text-white/70">Autosave</span>
                  <span className="text-sm font-black text-cyan-300">{editorSaveStatus === "Saving..." ? "Saving..." : "Saved"}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {["desktop", "tablet", "mobile"].map((mode) => (
                    <button key={mode} onClick={() => setPreviewMode(mode)} className={`rounded-xl px-3 py-2 text-xs font-black uppercase transition ${editor.previewMode === mode ? "bg-cyan-400 text-black" : "bg-white/5 text-white/65 hover:bg-white/10"}`}>
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="mb-3 text-sm font-black text-white/70">Section visibility</div>
                <div className="grid gap-2">
                  {Object.keys(sectionLabels).map((key) => (
                    <button key={key} onClick={() => toggleSectionVisibility(key)} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-left text-sm font-black hover:border-cyan-300/40">
                      <span>{sectionLabels[key]}</span>
                      <span className={editor.sectionVisibility?.[key] === false ? "text-orange-400" : "text-cyan-300"}>
                        {editor.sectionVisibility?.[key] === false ? "Hidden" : "Visible"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="mb-3 text-sm font-black text-white/70">Section reorder</div>
                <div className="grid gap-2">
                  {(editor.sectionOrder || Object.keys(sectionLabels)).map((key, index, order) => (
                    <div key={key} draggable onDragStart={(event) => event.dataTransfer.setData("text/plain", String(index))} onDragOver={(event) => event.preventDefault()} onDrop={(event) => reorderSections(Number(event.dataTransfer.getData("text/plain")), index)} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm font-black">
                      <span className="cursor-grab">{sectionLabels[key]}</span>
                      <div className="flex gap-2">
                        <button disabled={index === 0} onClick={() => reorderSections(index, Math.max(0, index - 1))} className="text-white/60 disabled:opacity-20">Up</button>
                        <button disabled={index === order.length - 1} onClick={() => reorderSections(index, Math.min(order.length - 1, index + 1))} className="text-white/60 disabled:opacity-20">Down</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {editorTab === "content" && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-4 transition hover:bg-cyan-400/20">
                <span className="font-black text-cyan-300">Live Edit Mode</span>
                <input type="checkbox" checked={adminMode} onChange={(event) => setAdminMode(event.target.checked)} className="h-5 w-5 rounded accent-cyan-400" />
              </label>
              <p className="px-1 text-xs leading-relaxed text-white/50">When Live Edit Mode is enabled, you can click on any text element on the website to edit it inline.</p>
              <div className="space-y-3 border-t border-white/10 pt-4">
                <button onClick={exportData} className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 font-black text-white transition hover:bg-white/10">Export JSON Config</button>
                <label className="block w-full cursor-pointer rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-center font-black text-white transition hover:bg-white/10">
                  Import JSON Config
                  <input type="file" accept=".json" onChange={importData} className="hidden" />
                </label>
                <button onClick={resetCms} className="mt-6 w-full rounded-xl bg-orange-500/20 px-4 py-3 font-black text-orange-500 transition hover:bg-orange-500 hover:text-black">Reset All Content</button>
              </div>
            </div>
          )}

          {editorTab === "config" && (
            <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <label className="block">
                <span className="mb-2 block text-sm font-black text-white/70">Festival Date & Time</span>
                <input type="datetime-local" value={cmsData.config.festivalDate.slice(0, 16)} onChange={(event) => updateContent("config.festivalDate", `${event.target.value}:00`)} className="w-full rounded-xl border border-white/10 bg-black/50 p-3 text-white outline-none focus:border-cyan-400" />
              </label>
              {[
                ["hero", "Hero Background Image"],
                ["gallery1", "Gallery Image 1"],
                ["gallery2", "Gallery Image 2 (FAQ)"],
                ["gallery3", "Gallery Image 3 (Panorama)"],
              ].map(([key, label]) => (
                <label key={key} className="block">
                  <span className="mb-2 block text-sm font-black text-white/70">{label}</span>
                  <input type="text" value={cmsData.config.images[key]} onChange={(event) => updateContent(`config.images.${key}`, event.target.value)} placeholder={`/${key}.png or URL`} className="w-full rounded-xl border border-white/10 bg-black/50 p-3 text-sm text-white outline-none focus:border-cyan-400" />
                </label>
              ))}
              <MediaUploadField
                label="Hero image upload"
                value={cmsData.config.heroImage}
                onChange={(url) => updateContent("config.heroImage", url)}
                onRemove={() => updateContent("config.heroImage", "")}
              />
              <MediaUploadField
                label="Gallery images"
                value={cmsData.config.galleryImages}
                multiple
                onChange={(urls) => updateContent("config.galleryImages", urls)}
                onRemove={(index) => updateContent("config.galleryImages", cmsData.config.galleryImages.filter((_, itemIndex) => itemIndex !== index))}
              />
              <MediaUploadField
                label="Sponsor logos"
                value={cmsData.config.sponsorLogos}
                multiple
                onChange={(urls) => updateContent("config.sponsorLogos", urls)}
                onRemove={(index) => updateContent("config.sponsorLogos", cmsData.config.sponsorLogos.filter((_, itemIndex) => itemIndex !== index))}
              />
              <MediaUploadField
                label="Intro portal image"
                value={cmsData.config.introImage}
                onChange={(url) => updateContent("config.introImage", url)}
                onRemove={() => updateContent("config.introImage", "")}
              />
            </div>
          )}

          {editorTab === "media" && (
            <MediaLibraryPanel
              assets={mediaAssets}
              loading={mediaLoading}
              error={mediaError}
              progress={mediaUploadProgress}
              onUpload={(file) => file && createMediaAsset(file)}
              onUpdate={updateMediaAsset}
              onDelete={softDeleteMediaAsset}
              onRestore={restoreMediaAsset}
              onUse={(target, asset) => {
                if (target === "hero") updateContent("config.heroImage", asset.url);
                if (target === "intro") updateContent("config.introImage", asset.url);
                if (target === "gallery") updateContent("config.galleryImages", [...(cmsData.config.galleryImages || []), asset.url]);
                if (target === "sponsor") updateContent("config.sponsorLogos", [...(cmsData.config.sponsorLogos || []), asset.url]);
              }}
              onRemoveFromSection={(url) => {
                if (cmsData.config.heroImage === url) updateContent("config.heroImage", "");
                if (cmsData.config.introImage === url) updateContent("config.introImage", "");
                updateContent("config.galleryImages", (cmsData.config.galleryImages || []).filter((item) => item !== url));
                updateContent("config.sponsorLogos", (cmsData.config.sponsorLogos || []).filter((item) => item !== url));
              }}
            />
          )}
        </motion.div>
      )}
    </>
  );
};

export default memo(VisualEditor);
