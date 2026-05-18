const severityMap = {
  publish: "high",
  restore_version: "high",
  user_remove: "high",
  user_role_change: "high",
  user_deactivate: "medium",
  import_config: "medium",
  media_deactivate: "medium",
  sponsor_delete: "medium",
  ticket_delete: "medium",
  draft_save: "low",
  export_config: "low",
  login: "low",
  logout: "low",
  sponsor_add: "low",
  sponsor_edit: "low",
  ticket_add: "low",
  ticket_edit: "low",
  schedule_edit: "low",
};

const severityStyles = {
  high: "bg-orange-400/15 text-orange-300",
  medium: "bg-yellow-300/15 text-yellow-200",
  low: "bg-cyan-300/15 text-cyan-200",
};

const formatTimestamp = (timestamp) => timestamp?.toDate?.().toLocaleString?.() || "Pending";

const AuditLogTable = ({ logs }) => (
  <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045]">
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="bg-white/[0.04] text-xs uppercase text-white/45">
          <tr>
            <th className="px-4 py-3">Time</th>
            <th className="px-4 py-3">Action</th>
            <th className="px-4 py-3">Actor</th>
            <th className="px-4 py-3">Target</th>
            <th className="px-4 py-3">Summary</th>
            <th className="px-4 py-3">Severity</th>
          </tr>
        </thead>
        <tbody>
          {!logs.length && (
            <tr className="border-t border-white/10">
              <td colSpan="6" className="px-4 py-8 text-center text-white/45">No audit logs match the current filters.</td>
            </tr>
          )}
          {logs.map((log) => {
            const severity = severityMap[log.action] || "low";
            return (
              <tr key={log.id} className="border-t border-white/10">
                <td className="px-4 py-3 text-white/55">{formatTimestamp(log.createdAt)}</td>
                <td className="px-4 py-3 font-black">{log.action}</td>
                <td className="px-4 py-3">{log.actorEmail || log.actorUid}</td>
                <td className="px-4 py-3 text-white/55">{log.targetType} / {log.targetId}</td>
                <td className="px-4 py-3 text-white/65">{log.summary}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-1 text-xs font-black ${severityStyles[severity]}`}>{severity}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </section>
);

export default AuditLogTable;
