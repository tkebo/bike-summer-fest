const AdminTopbar = ({ user, role, cloudStatus, cloudSaveStatus, publishStatus, canPublish, onPublish, onLogout, previewOpen, onTogglePreview }) => (
  <header className="sticky top-0 z-40 flex flex-col gap-4 border-b border-white/10 bg-black/70 px-4 py-4 backdrop-blur-2xl md:flex-row md:items-center md:justify-between md:px-6">
    <div>
      <div className="text-xs font-black uppercase text-cyan-300">Bike Summer Fest 2026</div>
      <h1 className="text-xl font-black">Admin Panel</h1>
    </div>
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <span className="rounded-full bg-white/5 px-3 py-2">Cloud: {cloudStatus}</span>
      <span className="rounded-full bg-white/5 px-3 py-2">Draft: {cloudSaveStatus}</span>
      <span className="rounded-full bg-white/5 px-3 py-2">Published: {publishStatus}</span>
      <span className="rounded-full bg-white/5 px-3 py-2">{user?.email} / {role}</span>
      <button onClick={onTogglePreview} className="rounded-xl border border-cyan-300/25 px-4 py-2 font-black text-cyan-100">{previewOpen ? "Hide preview" : "Show preview"}</button>
      {canPublish && <button onClick={onPublish} className="rounded-xl bg-orange-500 px-4 py-2 font-black text-black">Publish</button>}
      <button onClick={onLogout} className="rounded-xl border border-white/15 px-4 py-2 font-black text-white/80">Logout</button>
    </div>
  </header>
);

export default AdminTopbar;
