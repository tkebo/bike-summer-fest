const recommendations = [
  ["Hero desktop", "1920x1080"],
  ["Hero mobile", "1080x1920"],
  ["Section background", "1600x900"],
  ["Sponsor banner", "1200x400"],
  ["Gallery image", "1400x900"],
];

const BackgroundControl = ({ backgrounds, updateContent }) => (
  <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
    <div className="mb-4">
      <h3 className="text-sm font-black uppercase text-white/80">Background images</h3>
      <p className="mt-2 text-sm text-white/55">Image URLs remain in CMS config so import validation and public rendering stay on the existing safe path.</p>
    </div>
    <div className="grid gap-3 md:grid-cols-2">
      <label className="block">
        <span className="mb-2 block text-xs font-black uppercase text-white/45">Hero desktop background</span>
        <input value={backgrounds.hero.desktop} onChange={(event) => updateContent("config.backgrounds.hero.desktop", event.target.value)} className="w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300" />
      </label>
      <label className="block">
        <span className="mb-2 block text-xs font-black uppercase text-white/45">Hero tablet background</span>
        <input value={backgrounds.hero.tablet} onChange={(event) => updateContent("config.backgrounds.hero.tablet", event.target.value)} className="w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300" />
      </label>
      <label className="block">
        <span className="mb-2 block text-xs font-black uppercase text-white/45">Hero mobile background</span>
        <input value={backgrounds.hero.mobile} onChange={(event) => updateContent("config.backgrounds.hero.mobile", event.target.value)} className="w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300" />
      </label>
      <label className="block">
        <span className="mb-2 block text-xs font-black uppercase text-white/45">Section background image</span>
        <input value={backgrounds.section || ""} onChange={(event) => updateContent("config.backgrounds.section", event.target.value)} className="w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300" />
      </label>
    </div>
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

export default BackgroundControl;
