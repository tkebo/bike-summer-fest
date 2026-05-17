const formatTimestamp = (timestamp) => timestamp?.toDate?.().toLocaleString?.() || "Pending";

const VersionHistory = ({ versions, canPublish, onPreview, onRestore, onRestoreAndPublish }) => (
  <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
    <div className="flex items-center justify-between gap-3">
      <div>
        <h3 className="text-lg font-black">Version History</h3>
        <p className="mt-1 text-sm text-white/55">Published snapshots stored in Firestore.</p>
      </div>
      <span className="rounded-full bg-white/5 px-3 py-2 text-xs font-black">{versions.length} versions</span>
    </div>
    <div className="mt-4 grid gap-3">
      {versions.map((version) => (
        <article key={version.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="font-black">{version.note || "No changelog note"}</div>
              <div className="mt-2 text-xs text-white/45">{formatTimestamp(version.createdAt)} / {version.createdBy || "Unknown"}</div>
              <div className="mt-1 break-all text-xs text-white/35">{version.id}</div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => onPreview(version)} className="rounded-xl border border-white/15 px-3 py-2 text-xs font-black">Preview</button>
              <button onClick={() => onRestore(version)} className="rounded-xl border border-cyan-300/30 px-3 py-2 text-xs font-black text-cyan-200">Restore to draft</button>
              {canPublish && <button onClick={() => onRestoreAndPublish(version)} className="rounded-xl border border-orange-400/30 px-3 py-2 text-xs font-black text-orange-300">Restore + publish</button>}
            </div>
          </div>
        </article>
      ))}
      {!versions.length && <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/45">No published versions yet.</div>}
    </div>
  </section>
);

export default VersionHistory;
