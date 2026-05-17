import { useRef, useState } from "react";

const BackupImportExport = ({
  exportFullBackup,
  exportContentData,
  exportEditorData,
  importFullBackup,
  importData,
  importEditorData,
}) => {
  const fullInputRef = useRef(null);
  const contentInputRef = useRef(null);
  const designInputRef = useRef(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const importFull = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setError("");
      await importFullBackup(file);
      setStatus("Validated full backup imported to draft.");
    } catch (importError) {
      setError(importError.message);
    } finally {
      event.target.value = "";
    }
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
      <h3 className="text-lg font-black">Backup / Export / Import</h3>
      <p className="mt-1 text-sm text-white/55">Imports update draft only. Published content changes only through publish flow.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={exportFullBackup} className="rounded-xl border border-white/15 px-4 py-2 font-black">Export full CMS</button>
        <button onClick={exportContentData} className="rounded-xl border border-white/15 px-4 py-2 font-black">Export content only</button>
        <button onClick={exportEditorData} className="rounded-xl border border-white/15 px-4 py-2 font-black">Export design only</button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button onClick={() => fullInputRef.current?.click()} className="rounded-xl border border-cyan-300/30 px-4 py-2 font-black text-cyan-200">Import full CMS</button>
        <button onClick={() => contentInputRef.current?.click()} className="rounded-xl border border-cyan-300/30 px-4 py-2 font-black text-cyan-200">Import content</button>
        <button onClick={() => designInputRef.current?.click()} className="rounded-xl border border-cyan-300/30 px-4 py-2 font-black text-cyan-200">Import design</button>
      </div>
      <input ref={fullInputRef} type="file" accept="application/json" className="hidden" onChange={importFull} />
      <input ref={contentInputRef} type="file" accept="application/json" className="hidden" onChange={importData} />
      <input ref={designInputRef} type="file" accept="application/json" className="hidden" onChange={importEditorData} />
      {status && <div className="mt-4 text-sm font-black text-cyan-200">{status}</div>}
      {error && <div className="mt-4 text-sm font-black text-orange-300">{error}</div>}
    </section>
  );
};

export default BackupImportExport;
