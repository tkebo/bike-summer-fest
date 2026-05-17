import { AdminCard } from "./AdminUI";

const DashboardModule = ({ cloudStatus, cloudSaveStatus, publishStatus, publishSite, exportData }) => (
  <div className="grid gap-4 lg:grid-cols-2">
    <AdminCard title="Visitor stats">
      <div className="grid grid-cols-3 gap-3 text-center">
        {["Today", "Week", "Conversion"].map((item) => <div key={item} className="rounded-xl bg-black/25 p-4"><div className="text-xs text-white/45">{item}</div><div className="mt-2 text-2xl font-black">--</div></div>)}
      </div>
    </AdminCard>
    <AdminCard title="System health">
      <div className="grid gap-2 text-sm">
        <div className="flex justify-between"><span>Cloud</span><span className="text-cyan-300">{cloudStatus}</span></div>
        <div className="flex justify-between"><span>Draft</span><span className="text-cyan-300">{cloudSaveStatus}</span></div>
        <div className="flex justify-between"><span>Publish</span><span className="text-cyan-300">{publishStatus}</span></div>
      </div>
    </AdminCard>
    <AdminCard title="Quick actions">
      <div className="grid grid-cols-2 gap-3">
        <button onClick={publishSite} className="rounded-xl bg-orange-500 px-4 py-3 font-black text-black">Publish live</button>
        <button onClick={exportData} className="rounded-xl border border-white/15 px-4 py-3 font-black">Export backup</button>
      </div>
    </AdminCard>
    <AdminCard title="Last updates">
      <div className="text-sm text-white/55">Realtime audit feed placeholder. Firestore version history can be attached here next.</div>
    </AdminCard>
  </div>
);

export default DashboardModule;
