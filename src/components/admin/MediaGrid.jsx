import { getOptimizedImageUrl } from "../../lib/cloudinary";

const MediaGrid = ({ assets, onSelect }) => (
  <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
    {assets.map((asset) => (
      <button key={asset.id} onClick={() => onSelect(asset)} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] text-left">
        <img src={getOptimizedImageUrl(asset.url, 480)} alt={asset.alt || ""} className="h-40 w-full object-cover" />
        <div className="p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate font-black">{asset.title || "Untitled"}</span>
            <span className={`rounded-full px-2 py-1 text-[10px] font-black ${asset.active !== false ? "bg-cyan-300/15 text-cyan-200" : "bg-orange-400/15 text-orange-300"}`}>
              {asset.active !== false ? "active" : "inactive"}
            </span>
          </div>
          <div className="mt-2 text-xs uppercase text-white/45">{asset.type}</div>
        </div>
      </button>
    ))}
  </section>
);

export default MediaGrid;
