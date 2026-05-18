import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../lib/firebase";
import AuditLogTable from "./AuditLogTable";

const exportFile = (filename, content, type) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const SecurityManager = ({ canManageSecurity }) => {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [actorFilter, setActorFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    getDocs(query(collection(db, "audit_logs"), orderBy("createdAt", "desc"))).then((snapshot) => {
      setLogs(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    });
  }, []);

  const actions = [...new Set(logs.map((log) => log.action))];
  const filteredLogs = useMemo(() => logs.filter((log) => {
    const queryValue = search.toLowerCase();
    const matchesSearch = !queryValue || `${log.summary} ${log.targetType} ${log.targetId}`.toLowerCase().includes(queryValue);
    const matchesActor = !actorFilter || log.actorEmail?.toLowerCase().includes(actorFilter.toLowerCase());
    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    const matchesDate = !dateFilter || log.createdAt?.toDate?.().toISOString().startsWith(dateFilter);
    return matchesSearch && matchesActor && matchesAction && matchesDate;
  }), [actionFilter, actorFilter, dateFilter, logs, search]);

  const exportJson = () => exportFile("audit_logs.json", JSON.stringify(filteredLogs, null, 2), "application/json");
  const exportCsv = () => {
    const rows = [
      ["createdAt", "action", "actorEmail", "actorRole", "targetType", "targetId", "summary"],
      ...filteredLogs.map((log) => [
        log.createdAt?.toDate?.().toISOString() || "",
        log.action,
        log.actorEmail,
        log.actorRole,
        log.targetType,
        log.targetId,
        log.summary,
      ]),
    ];
    exportFile("audit_logs.csv", rows.map((row) => row.map((value) => `"${String(value || "").replace(/"/g, '""')}"`).join(",")).join("\n"), "text/csv");
  };

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-xl font-black">Security Manager</h2>
            <p className="mt-1 text-sm text-white/55">Audit trail and production security checklist.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={exportCsv} className="rounded-xl border border-white/15 px-4 py-2 font-black">Export CSV</button>
            <button onClick={exportJson} className="rounded-xl border border-white/15 px-4 py-2 font-black">Export JSON</button>
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search summary / target" className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm" />
          <input value={actorFilter} onChange={(event) => setActorFilter(event.target.value)} placeholder="Filter actor" className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm" />
          <select value={actionFilter} onChange={(event) => setActionFilter(event.target.value)} className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm">
            <option value="all">all actions</option>
            {actions.map((action) => <option key={action} value={action}>{action}</option>)}
          </select>
          <input value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} type="date" className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm" />
        </div>
      </section>

      <AuditLogTable logs={filteredLogs} />

      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["Firestore rules", "Status placeholder"],
          ["Cloudinary config", "Status placeholder"],
          ["Authorized domains", "Checklist placeholder"],
        ].map(([title, value]) => (
          <article key={title} className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
            <div className="text-xs font-black uppercase text-white/45">{title}</div>
            <div className="mt-3 font-black text-cyan-200">{value}</div>
          </article>
        ))}
      </section>

      {canManageSecurity && (
        <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
          <h3 className="text-lg font-black">System security checklist</h3>
          <div className="mt-4 grid gap-2 text-sm text-white/65">
            <span>HTTPS only deployment</span>
            <span>Firestore rules deployed</span>
            <span>Service role keys excluded from frontend</span>
            <span>Cloudinary unsigned preset reviewed</span>
            <span>Authorized domains reviewed</span>
          </div>
        </section>
      )}
    </div>
  );
};

export default SecurityManager;
