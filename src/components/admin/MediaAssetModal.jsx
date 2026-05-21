import { useState } from "react";
import { getOptimizedImageUrl } from "../../lib/cloudinary";
import MediaAssignmentPanel from "./MediaAssignmentPanel";

const MediaAssetModal = ({ asset, assignedLabels, onClose, onUpdate, onDeactivate, onRestore, onRemoveFromSections, onAssign }) => {
  const [draft, setDraft] = useState(asset);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-black p-5" onClick={(event) => event.stopPropagation()}>
        <div className="grid gap-5 md:grid-cols-[240px_1fr]">
          <div>
            <img src={getOptimizedImageUrl(asset.url, 720)} alt={draft.alt || ""} className="h-56 w-full rounded-2xl object-cover" />
            <div className="mt-3 grid gap-2 text-xs text-white/55">
              <div>URL: {asset.url}</div>
              <div>Optimized URL: {getOptimizedImageUrl(asset.url, 720)}</div>
              <div>Public ID: {asset.publicId}</div>
              <div>Created by: {asset.createdBy}</div>
            </div>
          </div>
          <div className="grid gap-3">
            <input value={draft.title || ""} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="Title" className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm" />
            <input value={draft.alt || ""} onChange={(event) => setDraft({ ...draft, alt: event.target.value })} placeholder="Alt text" className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm" />
            <input value={(draft.tags || []).join(", ")} onChange={(event) => setDraft({ ...draft, tags: event.target.value.split(",").map((tag) => tag.trim()).filter(Boolean) })} placeholder="tags, comma separated" className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm" />
            <select value={draft.type} onChange={(event) => setDraft({ ...draft, type: event.target.value })} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm">
              {["hero", "gallery", "sponsor", "intro", "center-mark", "background", "general"].map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
            <div className="flex flex-wrap gap-2">
              {assignedLabels.map((label) => <span key={label} className="rounded-full bg-cyan-300/15 px-3 py-1 text-xs font-black text-cyan-200">{label}</span>)}
            </div>
            <button onClick={() => onUpdate(asset.id, { title: draft.title, alt: draft.alt, tags: draft.tags, type: draft.type })} className="rounded-xl bg-cyan-300 px-4 py-3 font-black text-black">Save metadata</button>
            <MediaAssignmentPanel onAssign={(target) => onAssign(target, asset)} />
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => navigator.clipboard.writeText(asset.url)} className="rounded-xl border border-white/15 px-3 py-2 text-xs font-black">Copy URL</button>
              <button onClick={() => onRemoveFromSections(asset.url)} className="rounded-xl border border-white/15 px-3 py-2 text-xs font-black">Remove from section</button>
              {asset.active !== false ? (
                <button onClick={() => onDeactivate(asset.id)} className="rounded-xl border border-orange-400/30 px-3 py-2 text-xs font-black text-orange-300">Deactivate</button>
              ) : (
                <button onClick={() => onRestore(asset.id)} className="rounded-xl border border-cyan-300/30 px-3 py-2 text-xs font-black text-cyan-200">Restore</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaAssetModal;
