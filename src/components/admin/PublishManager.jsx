import { useState } from "react";
import PublishConfirmModal from "./PublishConfirmModal";
import VersionHistory from "./VersionHistory";
import BackupImportExport from "./BackupImportExport";

const formatTimestamp = (timestamp) => timestamp?.toDate?.().toLocaleString?.() || "Not available";

const PublishManager = ({
  user,
  draftMeta,
  publishedMeta,
  cloudSaveStatus,
  publishStatus,
  versions,
  canPublish,
  publishSite,
  restoreVersionToDraft,
  restoreVersionAndPublish,
  exportFullBackup,
  exportContentData,
  exportEditorData,
  importFullBackup,
  importData,
  importEditorData,
}) => {
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [previewVersion, setPreviewVersion] = useState(null);
  const pendingChanges = draftMeta?.updatedAt?.seconds !== publishedMeta?.publishedAt?.seconds;

  const restoreDraft = (version) => {
    if (window.confirm("Restore this version to draft? Current draft changes will be replaced locally and autosaved.")) {
      restoreVersionToDraft(version);
    }
  };

  const restoreAndPublish = async (version) => {
    if (window.confirm("Restore this version and publish it live?")) {
      await restoreVersionAndPublish(version);
    }
  };

  return (
    <div className="space-y-4">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Draft status", cloudSaveStatus],
          ["Last saved", formatTimestamp(draftMeta?.updatedAt)],
          ["Last published", formatTimestamp(publishedMeta?.publishedAt)],
          ["Published version", publishedMeta?.versionId || "None"],
        ].map(([title, value]) => (
          <article key={title} className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
            <div className="text-xs font-black uppercase text-white/45">{title}</div>
            <div className="mt-3 break-all font-black text-cyan-200">{value}</div>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-black">Publish Manager</h2>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-white/5 px-3 py-2">{user?.email || "Unknown admin"}</span>
              <span className={`rounded-full px-3 py-2 ${pendingChanges ? "bg-orange-400/15 text-orange-300" : "bg-cyan-300/15 text-cyan-200"}`}>
                {pendingChanges ? "Pending changes" : "Draft matches published metadata"}
              </span>
              <span className="rounded-full bg-white/5 px-3 py-2">{publishStatus}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => window.open("/?preview=draft", "_blank", "noopener,noreferrer")} className="rounded-xl border border-cyan-300/30 px-4 py-2 font-black text-cyan-200">Preview Draft</button>
            {canPublish && <button onClick={() => setShowPublishModal(true)} className="rounded-xl bg-orange-500 px-4 py-2 font-black text-black">Publish</button>}
          </div>
        </div>
      </section>

      <VersionHistory
        versions={versions}
        canPublish={canPublish}
        onPreview={setPreviewVersion}
        onRestore={restoreDraft}
        onRestoreAndPublish={restoreAndPublish}
      />

      <BackupImportExport
        exportFullBackup={exportFullBackup}
        exportContentData={exportContentData}
        exportEditorData={exportEditorData}
        importFullBackup={importFullBackup}
        importData={importData}
        importEditorData={importEditorData}
      />

      <section className="rounded-2xl border border-orange-400/20 bg-orange-400/[0.04] p-5">
        <h3 className="font-black text-orange-300">Danger zone</h3>
        <p className="mt-2 text-sm text-white/55">Restore and publish actions replace the live snapshot. Confirmation is required before mutation.</p>
      </section>

      {showPublishModal && (
        <PublishConfirmModal
          onClose={() => setShowPublishModal(false)}
          onConfirm={async (note) => {
            await publishSite(note);
            setShowPublishModal(false);
          }}
        />
      )}

      {previewVersion && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 p-4" onClick={() => setPreviewVersion(null)}>
          <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-black p-5" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xl font-black">Version preview</h3>
              <button onClick={() => setPreviewVersion(null)} className="rounded-xl border border-white/15 px-3 py-2 text-xs">Close</button>
            </div>
            <pre className="mt-4 max-h-[60vh] overflow-auto rounded-2xl bg-white/5 p-4 text-xs text-white/65">{JSON.stringify({
              seo: previewVersion.seoSnapshot,
              eventSettings: previewVersion.eventSettingsSnapshot,
              sections: previewVersion.sectionsSnapshot,
            }, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublishManager;
