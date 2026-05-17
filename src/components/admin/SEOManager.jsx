import { useMemo, useState } from "react";
import { defaultContent } from "../../data/defaultContent";
import SEOPreviewCard from "./SEOPreviewCard";

const SEOManager = ({
  cmsData,
  updateContent,
  activeMediaAssets,
  isConfiguredImageActive,
}) => {
  const [language, setLanguage] = useState("ka");
  const seo = cmsData.config.seo || defaultContent.config.seo;
  const eventSettings = cmsData.config.eventSettings || defaultContent.config.eventSettings;
  const mediaImages = useMemo(
    () => activeMediaAssets.filter((asset) => ["hero", "gallery", "background", "general"].includes(asset.type)),
    [activeMediaAssets]
  );
  const patch = (path, value) => updateContent(`config.seo.${path}`, value);

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-black">SEO Manager</h2>
            <p className="mt-1 text-sm text-white/55">Runtime document metadata with language-aware previews.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setLanguage("ka")} className={`rounded-xl px-4 py-2 font-black ${language === "ka" ? "bg-cyan-300 text-black" : "bg-white/5 text-white/70"}`}>ქართული</button>
            <button onClick={() => setLanguage("en")} className={`rounded-xl px-4 py-2 font-black ${language === "en" ? "bg-cyan-300 text-black" : "bg-white/5 text-white/70"}`}>English</button>
            <button onClick={() => updateContent("config.seo", defaultContent.config.seo)} className="rounded-xl border border-white/15 px-4 py-2 font-black">Reset defaults</button>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
        <h3 className="text-lg font-black">Basic SEO</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input value={seo.title[language]} onChange={(event) => patch(`title.${language}`, event.target.value)} placeholder="Site title" className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm" />
          <input value={seo.keywords.join(", ")} onChange={(event) => patch("keywords", event.target.value.split(",").map((item) => item.trim()).filter(Boolean))} placeholder="keywords, comma separated" className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm" />
          <textarea value={seo.description[language]} onChange={(event) => patch(`description.${language}`, event.target.value)} placeholder="Meta description" className="min-h-24 rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm md:col-span-2" />
          <input value={seo.canonicalUrl} onChange={(event) => patch("canonicalUrl", event.target.value)} placeholder="Canonical URL" className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm" />
          <div className="flex flex-wrap gap-4 rounded-xl border border-white/10 bg-black/20 px-3 py-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={seo.robots.index} onChange={(event) => patch("robots.index", event.target.checked)} />
              Index
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={seo.robots.follow} onChange={(event) => patch("robots.follow", event.target.checked)} />
              Follow
            </label>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
        <h3 className="text-lg font-black">Social Preview / Open Graph</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input value={seo.openGraph.title[language]} onChange={(event) => patch(`openGraph.title.${language}`, event.target.value)} placeholder="OG title" className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm" />
          <input value={seo.twitter.title[language]} onChange={(event) => patch(`twitter.title.${language}`, event.target.value)} placeholder="Twitter title" className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm" />
          <textarea value={seo.openGraph.description[language]} onChange={(event) => patch(`openGraph.description.${language}`, event.target.value)} placeholder="OG description" className="min-h-24 rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm" />
          <textarea value={seo.twitter.description[language]} onChange={(event) => patch(`twitter.description.${language}`, event.target.value)} placeholder="Twitter description" className="min-h-24 rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm" />
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {[
            ["openGraph.image", "OG image", seo.openGraph.image],
            ["twitter.image", "Twitter image", seo.twitter.image],
          ].map(([path, label, value]) => (
            <div key={path} className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs font-black uppercase text-cyan-200">{label}</div>
              <div className="mt-3 flex h-28 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
                {value && isConfiguredImageActive(value) ? <img src={value} alt="" className="h-full w-full object-cover" /> : <span className="text-xs text-white/35">No image</span>}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {mediaImages.map((asset) => (
                  <button key={`${path}-${asset.id}`} onClick={() => patch(path, asset.url)} className={`overflow-hidden rounded-xl border p-2 ${value === asset.url ? "border-cyan-300" : "border-white/10"}`}>
                    <img src={asset.optimizedUrl || asset.url} alt={asset.alt || asset.title || ""} className="h-14 w-full object-cover" />
                  </button>
                ))}
              </div>
              {value && <button onClick={() => patch(path, "")} className="mt-3 rounded-xl border border-orange-400/30 px-3 py-2 text-xs text-orange-300">Remove image</button>}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
        <h3 className="text-lg font-black">Favicon / App Icons</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <input value={seo.icons.favicon} onChange={(event) => patch("icons.favicon", event.target.value)} placeholder="Favicon URL" className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm" />
          <input value={seo.icons.appleTouchIcon} onChange={(event) => patch("icons.appleTouchIcon", event.target.value)} placeholder="Apple touch icon URL" className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm" />
          <input value={seo.icons.themeColor} onChange={(event) => patch("icons.themeColor", event.target.value)} placeholder="#050814" className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm" />
        </div>
      </section>

      <SEOPreviewCard seo={seo} language={language} eventSettings={eventSettings} />
    </div>
  );
};

export default SEOManager;
