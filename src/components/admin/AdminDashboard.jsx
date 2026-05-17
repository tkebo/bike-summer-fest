const dashboardCards = [
  ["Visitor stats", "Analytics placeholder"],
  ["Draft status", "Autosave and draft sync are active"],
  ["Published status", "Live site release state"],
  ["Quick actions", "Publish, preview, export"],
  ["Last updates", "Recent CMS activity placeholder"],
  ["System health", "Firebase and Cloudinary status"],
  ["Bundle info", "Chunk metrics placeholder"],
  ["Lazy modules", "Loaded on demand per admin module"],
  ["Cache status", "Browser cache telemetry placeholder"],
];

const AdminDashboard = ({ cloudStatus, cloudSaveStatus, publishStatus }) => (
  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
    {dashboardCards.map(([title, description]) => (
      <section key={title} className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 shadow-[0_18px_60px_rgba(0,0,0,.22)]">
        <h2 className="text-sm font-black uppercase text-white/80">{title}</h2>
        <p className="mt-3 text-sm text-white/55">{description}</p>
        {title === "Draft status" && <div className="mt-4 font-black text-cyan-300">{cloudSaveStatus}</div>}
        {title === "Published status" && <div className="mt-4 font-black text-cyan-300">{publishStatus}</div>}
        {title === "System health" && <div className="mt-4 font-black text-cyan-300">{cloudStatus}</div>}
      </section>
    ))}
  </div>
);

export default AdminDashboard;
