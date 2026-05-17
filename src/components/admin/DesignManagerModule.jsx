import { useState } from "react";
import { AdminCard, AdminField } from "./AdminUI";

const recommendations = [
  ["Hero desktop", "1920x1080"],
  ["Section background", "1600x900"],
  ["Mobile background", "1080x1920"],
  ["Sponsor banner", "1200x400"],
  ["Gallery image", "1400x900"],
];

const BackgroundUploadField = ({ label, recommendation, value, onUpload }) => {
  const [dimensions, setDimensions] = useState(null);
  const [warning, setWarning] = useState("");

  const inspectFile = (file) => {
    if (!file) return;
    const image = new Image();
    image.onload = () => {
      const nextDimensions = `${image.naturalWidth}x${image.naturalHeight}`;
      setDimensions(nextDimensions);
      const [recommendedWidth, recommendedHeight] = recommendation.split("x").map(Number);
      setWarning(image.naturalWidth > recommendedWidth * 1.5 || image.naturalHeight > recommendedHeight * 1.5 ? "Oversized image" : "");
      URL.revokeObjectURL(image.src);
    };
    image.src = URL.createObjectURL(file);
    onUpload(file);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
      <div className="mb-2 text-xs font-black uppercase text-white/45">{label}</div>
      <div className="mb-3 text-xs text-cyan-200">Recommended {recommendation}</div>
      <label className="block cursor-pointer rounded-xl border border-dashed border-white/20 px-3 py-4 text-center text-sm font-black hover:border-cyan-300/50">
        Upload background
        <input type="file" accept="image/*" onChange={(event) => inspectFile(event.target.files?.[0])} className="hidden" />
      </label>
      <div className="mt-3 text-xs text-white/55">Current: {value || "not set"}</div>
      {dimensions && <div className="mt-1 text-xs text-white/55">Actual: {dimensions}</div>}
      {warning && <div className="mt-1 text-xs font-black text-orange-300">{warning}</div>}
    </div>
  );
};

const DesignManagerModule = ({ designTabs, activeDesignCategory, setActiveDesignCategory, renderDesignSliders, cmsData, updateContent, createMediaAsset }) => {
  const heroBackground = cmsData.config.backgrounds.hero;
  return (
    <div className="grid gap-4">
      <AdminCard title="Design controls">
        <div className="mb-4 flex flex-wrap gap-2">
          {Object.keys(designTabs).map((tab) => (
            <button key={tab} onClick={() => setActiveDesignCategory(tab)} className={`rounded-xl px-3 py-2 text-xs font-black uppercase ${activeDesignCategory === tab ? "bg-cyan-300 text-black" : "bg-white/5 text-white/65"}`}>{tab}</button>
          ))}
        </div>
        {renderDesignSliders(activeDesignCategory)}
      </AdminCard>
      <AdminCard title="Responsive backgrounds">
        <div className="grid gap-3 md:grid-cols-3">
          {["desktop", "tablet", "mobile"].map((device) => (
            <AdminField key={device} label={`${device} image`} value={heroBackground[device]} onChange={(value) => updateContent(`config.backgrounds.hero.${device}`, value)} />
          ))}
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-5">
          <AdminField label="Overlay %" type="number" value={heroBackground.overlay} onChange={(value) => updateContent("config.backgrounds.hero.overlay", Number(value))} />
          <AdminField label="Blur" type="number" value={heroBackground.blur} onChange={(value) => updateContent("config.backgrounds.hero.blur", Number(value))} />
          <AdminField label="Brightness %" type="number" value={heroBackground.brightness} onChange={(value) => updateContent("config.backgrounds.hero.brightness", Number(value))} />
          <AdminField label="Position" value={heroBackground.position} onChange={(value) => updateContent("config.backgrounds.hero.position", value)} />
          <AdminField label="Scale %" type="number" value={heroBackground.scale} onChange={(value) => updateContent("config.backgrounds.hero.scale", Number(value))} />
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <BackgroundUploadField label="Desktop hero background" recommendation="1920x1080" value={heroBackground.desktop} onUpload={async (file) => {
            const asset = await createMediaAsset(file, "hero");
            updateContent("config.backgrounds.hero.desktop", asset.url);
          }} />
          <BackgroundUploadField label="Tablet hero background" recommendation="1600x900" value={heroBackground.tablet} onUpload={async (file) => {
            const asset = await createMediaAsset(file, "hero");
            updateContent("config.backgrounds.hero.tablet", asset.url);
          }} />
          <BackgroundUploadField label="Mobile hero background" recommendation="1080x1920" value={heroBackground.mobile} onUpload={async (file) => {
            const asset = await createMediaAsset(file, "hero");
            updateContent("config.backgrounds.hero.mobile", asset.url);
          }} />
        </div>
      </AdminCard>
      <AdminCard title="Recommended image sizes">
        <div className="grid gap-2 md:grid-cols-5">
          {recommendations.map(([label, size]) => <div key={label} className="rounded-xl bg-black/25 p-3"><div className="text-xs text-white/45">{label}</div><div className="mt-2 font-black text-cyan-200">{size}</div></div>)}
        </div>
      </AdminCard>
    </div>
  );
};

export default DesignManagerModule;
