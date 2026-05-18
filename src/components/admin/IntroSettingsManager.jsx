import { defaultContent } from "../../data/defaultContent";

const IntroSettingsManager = ({ cmsData, updateContent }) => {
  const settings = cmsData.config.introSettings || defaultContent.config.introSettings;
  const audio = cmsData.config.introAudio || defaultContent.config.introAudio;
  const patch = (nextPatch) => updateContent("config.introSettings", { ...settings, ...nextPatch });
  const patchAudio = (nextPatch) => updateContent("config.introAudio", { ...audio, ...nextPatch });

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-black">Intro Settings</h2>
            <p className="mt-1 text-sm text-white/55">Cinematic intro behavior and visitor controls.</p>
          </div>
          <button onClick={() => {
            updateContent("config.introSettings", defaultContent.config.introSettings);
            updateContent("config.introAudio", defaultContent.config.introAudio);
          }} className="rounded-xl border border-white/15 px-4 py-2 font-black">Reset defaults</button>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
          <h3 className="font-black">Behavior</h3>
          <div className="mt-4 grid gap-4">
            {[
              ["enabled", "Enable intro"],
              ["skipEnabled", "Allow skip"],
              ["replayEnabled", "Allow replay"],
              ["mobileLiteMode", "Mobile lite mode"],
            ].map(([key, label]) => (
              <label key={key} className="flex items-center justify-between gap-4">
                <span className="text-sm text-white/70">{label}</span>
                <input type="checkbox" checked={settings[key]} onChange={(event) => patch({ [key]: event.target.checked })} />
              </label>
            ))}
            <label className="grid gap-2">
              <span className="text-sm text-white/70">Intro mode</span>
              <select value={settings.introMode} onChange={(event) => patch({ introMode: event.target.value })} className="rounded-xl border border-white/10 bg-black/35 px-3 py-2">
                <option value="cinematic">cinematic</option>
                <option value="lite">lite</option>
              </select>
            </label>
            <label className="grid gap-2">
              <span className="text-sm text-white/70">Duration preset</span>
              <select value={settings.durationPreset} onChange={(event) => patch({ durationPreset: event.target.value })} className="rounded-xl border border-white/10 bg-black/35 px-3 py-2">
                <option value="short">short</option>
                <option value="cinematic">cinematic</option>
                <option value="ultra">ultra</option>
              </select>
            </label>
          </div>
        </article>

        <article className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
          <h3 className="font-black">Timing & Audio</h3>
          <div className="mt-4 grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm text-white/70">Auto skip after (ms)</span>
              <input type="number" min="2000" max="30000" value={settings.autoSkipAfterMs} onChange={(event) => patch({ autoSkipAfterMs: Number(event.target.value) })} className="rounded-xl border border-white/10 bg-black/35 px-3 py-2" />
            </label>
            {[
              ["masterVolume", "Master volume"],
              ["engineVolume", "Engine volume"],
              ["ambienceVolume", "Ambience volume"],
              ["uiVolume", "UI / stinger volume"],
            ].map(([key, label]) => (
              <label key={key} className="grid gap-2">
                <span className="text-sm text-white/70">{label}</span>
                <input type="range" min="0" max="1" step="0.05" value={audio[key]} onChange={(event) => patchAudio({ [key]: Number(event.target.value) })} />
                <span className="text-xs text-cyan-200">{Math.round(audio[key] * 100)}%</span>
              </label>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
        <h3 className="font-black">Cinematic FX</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {[
            ["cinematicIntensity", "Cinematic intensity"],
            ["particleDensity", "Particle density"],
            ["fogDensity", "Fog density"],
            ["glowStrength", "Glow strength"],
            ["cameraMotionAmount", "Camera motion"],
            ["transitionSpeed", "Transition speed"],
          ].map(([key, label]) => (
            <label key={key} className="grid gap-2">
              <span className="text-sm text-white/70">{label}</span>
              <input
                type="range"
                min={key === "transitionSpeed" ? "0.5" : "0"}
                max={key === "transitionSpeed" ? "2" : "1"}
                step="0.05"
                value={settings[key]}
                onChange={(event) => patch({ [key]: Number(event.target.value) })}
              />
              <span className="text-xs text-cyan-200">{settings[key]}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
        <h3 className="font-black">Visor copy</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm text-white/70">KA</span>
            <input value={settings.visorTextKa} onChange={(event) => patch({ visorTextKa: event.target.value })} className="rounded-xl border border-white/10 bg-black/35 px-3 py-2" />
          </label>
          <label className="grid gap-2">
            <span className="text-sm text-white/70">EN</span>
            <input value={settings.visorTextEn} onChange={(event) => patch({ visorTextEn: event.target.value })} className="rounded-xl border border-white/10 bg-black/35 px-3 py-2" />
          </label>
        </div>
      </section>
    </div>
  );
};

export default IntroSettingsManager;
