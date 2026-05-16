import { memo } from "react";
import { motion, useDragControls } from "framer-motion";
import { useCMS } from "../hooks/useCMS";

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
    authReady,
    adminReady,
    cloudStatus,
    cloudSaveStatus,
    publishStatus,
    loginWithGoogle,
    logout,
    publishSite,
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
            {["design", "live", "content", "config"].map((tab) => (
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
            </div>
          )}
        </motion.div>
      )}
    </>
  );
};

export default memo(VisualEditor);
