import { AdminCard } from "./AdminUI";

const PublishModule = ({ cloudSaveStatus, publishStatus, publishSite, exportData, importData, resetCms }) => (
  <div className="grid gap-4 md:grid-cols-2">
    <AdminCard title="Publish system">
      <div className="space-y-3">
        <div className="flex justify-between text-sm"><span>Draft</span><span className="text-cyan-300">{cloudSaveStatus}</span></div>
        <div className="flex justify-between text-sm"><span>Live</span><span className="text-cyan-300">{publishStatus}</span></div>
        <button onClick={publishSite} className="w-full rounded-xl bg-orange-500 px-4 py-3 font-black text-black">Publish live</button>
      </div>
    </AdminCard>
    <AdminCard title="Backup and restore">
      <div className="grid gap-3">
        <button onClick={exportData} className="rounded-xl border border-white/15 px-4 py-3 font-black">Export JSON</button>
        <label className="cursor-pointer rounded-xl border border-white/15 px-4 py-3 text-center font-black">
          Import JSON
          <input type="file" accept=".json" onChange={importData} className="hidden" />
        </label>
        <button onClick={resetCms} className="rounded-xl border border-orange-400/30 px-4 py-3 font-black text-orange-300">Reset defaults</button>
      </div>
    </AdminCard>
  </div>
);

export default PublishModule;
