import { useState } from "react";

const recommendations = [
  ["Hero", "1920x1080"],
  ["Gallery", "1400x900"],
  ["Sponsor", "1200x400"],
  ["Intro", "1080x1080"],
  ["Background", "1600x900"],
];

const MediaUpload = ({ onUpload, progress, error }) => {
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState("");

  const handleFile = async (file) => {
    if (!file) return;
    try {
      await onUpload(file);
      setStatus("Upload complete");
    } catch (uploadError) {
      setStatus(uploadError.message);
    }
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
      <div className="mb-4">
        <h2 className="text-lg font-black">Upload Center</h2>
        <p className="mt-1 text-sm text-white/55">Images are validated before Cloudinary upload.</p>
      </div>
      <label
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          handleFile(event.dataTransfer.files?.[0]);
        }}
        className={`block cursor-pointer rounded-2xl border border-dashed p-8 text-center transition ${dragging ? "border-cyan-300 bg-cyan-300/10" : "border-white/20 bg-black/20 hover:border-cyan-300/50"}`}
      >
        <input type="file" accept="image/*" onChange={(event) => handleFile(event.target.files?.[0])} className="hidden" />
        <div className="font-black">Drop image here or click to upload</div>
        <div className="mt-2 text-xs text-white/45">Image MIME only, max size follows shared upload policy.</div>
        {progress > 0 && (
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full bg-cyan-300" style={{ width: `${progress}%` }} />
          </div>
        )}
      </label>
      {(status || error) && <div className={`mt-3 text-sm font-black ${error ? "text-orange-300" : "text-cyan-200"}`}>{error || status}</div>}
      <div className="mt-5 grid gap-2 md:grid-cols-5">
        {recommendations.map(([label, size]) => (
          <div key={label} className="rounded-xl bg-black/25 p-3">
            <div className="text-xs text-white/45">{label}</div>
            <div className="mt-2 font-black text-cyan-200">{size}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MediaUpload;
