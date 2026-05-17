import { useState } from "react";
import { isSafeHttpUrl } from "../../security/sanitize";
import SponsorLogoPicker from "./SponsorLogoPicker";

const categoryOptions = ["main", "stage", "media", "beer", "energy", "moto", "tourism", "food", "tech", "general"];

const SponsorEditor = ({
  sponsor,
  language,
  index,
  total,
  mediaAssets,
  mediaUploadProgress,
  createMediaAsset,
  onPatch,
  onPatchLocale,
  onDuplicate,
  onToggleActive,
  onDelete,
  onMove,
  onReset,
}) => {
  const localeContent = sponsor[language];
  const [websiteDraft, setWebsiteDraft] = useState(sponsor.website || "");
  const [websiteError, setWebsiteError] = useState("");

  const commitWebsite = () => {
    if (!websiteDraft) {
      setWebsiteError("");
      onPatch({ website: "" });
      return;
    }
    if (!isSafeHttpUrl(websiteDraft)) {
      setWebsiteError("Use a valid http or https URL.");
      return;
    }
    setWebsiteError("");
    onPatch({ website: websiteDraft });
  };

  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-black">{sponsor.name || "Untitled sponsor"}</h3>
          <div className="mt-1 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-white/5 px-2 py-1">{sponsor.category}</span>
            {sponsor.featured && <span className="rounded-full bg-cyan-300/15 px-2 py-1 text-cyan-200">featured</span>}
            {!sponsor.active && <span className="rounded-full bg-orange-400/15 px-2 py-1 text-orange-300">inactive</span>}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button disabled={index === 0} onClick={() => onMove(index, index - 1)} className="rounded-xl border border-white/15 px-3 py-2 text-xs disabled:opacity-30">Up</button>
          <button disabled={index === total - 1} onClick={() => onMove(index, index + 1)} className="rounded-xl border border-white/15 px-3 py-2 text-xs disabled:opacity-30">Down</button>
          <button onClick={onDuplicate} className="rounded-xl border border-white/15 px-3 py-2 text-xs">Duplicate</button>
          <button onClick={onToggleActive} className="rounded-xl border border-white/15 px-3 py-2 text-xs">{sponsor.active ? "Disable" : "Enable"}</button>
          <button onClick={onDelete} className="rounded-xl border border-orange-400/30 px-3 py-2 text-xs text-orange-300">Delete</button>
          <button onClick={onReset} className="rounded-xl border border-white/15 px-3 py-2 text-xs">Reset</button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <input value={sponsor.name} onChange={(event) => onPatch({ name: event.target.value })} placeholder="Sponsor name" className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm" />
        <select value={sponsor.category} onChange={(event) => onPatch({ category: event.target.value })} className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm">
          {categoryOptions.map((category) => <option key={category} value={category}>{category}</option>)}
        </select>
        <div>
          <input
            value={websiteDraft}
            onChange={(event) => setWebsiteDraft(event.target.value)}
            onBlur={commitWebsite}
            placeholder="https://example.com"
            className="w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm"
          />
          {websiteError && <p className="mt-1 text-xs text-orange-300">{websiteError}</p>}
        </div>
        <input value={sponsor.order} onChange={(event) => onPatch({ order: Number(event.target.value) || sponsor.order })} type="number" min="1" placeholder="Order" className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm" />
        <textarea
          value={localeContent.description}
          onChange={(event) => onPatchLocale({ description: event.target.value })}
          placeholder="Description"
          className="min-h-28 rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm md:col-span-2"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={sponsor.featured} onChange={(event) => onPatch({ featured: event.target.checked })} />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={sponsor.showInGrid} onChange={(event) => onPatch({ showInGrid: event.target.checked })} />
          Show in grid
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={sponsor.showInMarquee} onChange={(event) => onPatch({ showInMarquee: event.target.checked })} />
          Show in marquee
        </label>
      </div>

      <div className="mt-4">
        <SponsorLogoPicker
          value={sponsor.logo}
          mediaAssets={mediaAssets}
          mediaUploadProgress={mediaUploadProgress}
          createMediaAsset={createMediaAsset}
          onChange={(logo) => onPatch({ logo })}
        />
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
        <div className="text-xs font-black uppercase text-cyan-200">Live preview</div>
        <div className="mt-3 flex items-center gap-4">
          <div className="flex h-16 w-24 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
            {sponsor.logo ? <img src={sponsor.logo} alt="" className="h-full w-full object-contain" /> : <span className="text-xs text-white/45">Text</span>}
          </div>
          <div>
            <div className="font-black">{sponsor.name}</div>
            <div className="text-sm text-white/55">{localeContent.description}</div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default SponsorEditor;
