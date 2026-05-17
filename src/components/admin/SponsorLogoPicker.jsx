import { useMemo, useState } from "react";

const SponsorLogoPicker = ({
  value,
  mediaAssets,
  mediaUploadProgress,
  createMediaAsset,
  onChange,
}) => {
  const [uploadError, setUploadError] = useState("");
  const availableLogos = useMemo(
    () => mediaAssets.filter((asset) => asset.active !== false && ["sponsor", "general"].includes(asset.type)),
    [mediaAssets]
  );

  const uploadLogo = async (file) => {
    if (!file) return;
    try {
      setUploadError("");
      const asset = await createMediaAsset(file, "sponsor");
      onChange(asset.url);
    } catch (error) {
      setUploadError(error.message);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-black uppercase text-cyan-200">Logo</div>
          <p className="mt-1 text-xs text-white/45">Use Media Library or upload Cloudinary asset.</p>
        </div>
        {value && (
          <button onClick={() => onChange("")} className="rounded-xl border border-orange-400/30 px-3 py-2 text-xs text-orange-300">
            Remove logo
          </button>
        )}
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-[120px_1fr]">
        <div className="flex h-28 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
          {value ? <img src={value} alt="" className="h-full w-full object-contain" /> : <span className="text-xs text-white/35">No logo</span>}
        </div>
        <div className="space-y-3">
          <label className="inline-flex cursor-pointer rounded-xl bg-cyan-300 px-4 py-2 text-sm font-black text-black">
            Upload logo
            <input type="file" accept="image/*" className="hidden" onChange={(event) => uploadLogo(event.target.files?.[0])} />
          </label>
          {mediaUploadProgress > 0 && (
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full bg-cyan-300" style={{ width: `${mediaUploadProgress}%` }} />
            </div>
          )}
          {uploadError && <p className="text-xs text-orange-300">{uploadError}</p>}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
        {availableLogos.map((asset) => (
          <button
            key={asset.id}
            onClick={() => onChange(asset.url)}
            className={`overflow-hidden rounded-xl border p-2 ${value === asset.url ? "border-cyan-300" : "border-white/10"}`}
          >
            <img src={asset.optimizedUrl || asset.url} alt={asset.alt || asset.title || ""} className="h-16 w-full object-contain" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default SponsorLogoPicker;
