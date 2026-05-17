import { useMemo, useState } from "react";
import { defaultContent } from "../../data/defaultContent";
import CountdownSettingsPanel from "./CountdownSettingsPanel";
import SocialLinksEditor from "./SocialLinksEditor";

const EventSettingsManager = ({ cmsData, updateContent, timeLeft, countdownFinished }) => {
  const [language, setLanguage] = useState("ka");
  const settings = cmsData.config.eventSettings || defaultContent.config.eventSettings;
  const patch = (path, value) => updateContent(`config.eventSettings.${path}`, value);
  const generatedHeroDate = useMemo(
    () => (language === "ka" ? settings.dates.displayKa : settings.dates.displayEn),
    [language, settings.dates.displayEn, settings.dates.displayKa]
  );

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-black">Event Settings</h2>
            <p className="mt-1 text-sm text-white/55">Core festival data shared by hero, countdown, FAQ and footer.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setLanguage("ka")} className={`rounded-xl px-4 py-2 font-black ${language === "ka" ? "bg-cyan-300 text-black" : "bg-white/5 text-white/70"}`}>ქართული</button>
            <button onClick={() => setLanguage("en")} className={`rounded-xl px-4 py-2 font-black ${language === "en" ? "bg-cyan-300 text-black" : "bg-white/5 text-white/70"}`}>English</button>
            <button onClick={() => updateContent("config.eventSettings", defaultContent.config.eventSettings)} className="rounded-xl border border-white/15 px-4 py-2 font-black">Reset defaults</button>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
        <h3 className="text-lg font-black">General Event Info</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input value={settings.name} onChange={(event) => patch("name", event.target.value)} placeholder="Event name" className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm" />
          <input value={settings.year} onChange={(event) => patch("year", event.target.value)} placeholder="Year" className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm" />
          <input value={settings.dates.start} onChange={(event) => patch("dates.start", event.target.value)} type="date" className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm" />
          <input value={settings.dates.end} onChange={(event) => patch("dates.end", event.target.value)} type="date" className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm" />
          <input value={language === "ka" ? settings.dates.displayKa : settings.dates.displayEn} onChange={(event) => patch(language === "ka" ? "dates.displayKa" : "dates.displayEn", event.target.value)} placeholder="Display date" className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm md:col-span-2" />
        </div>
        <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/60">
          Hero auto-date preview: <span className="font-black text-cyan-200">{generatedHeroDate}</span>. If `heroDate` text is empty, this value is used publicly.
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
        <h3 className="text-lg font-black">Location & Contact</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input value={settings.location[language]} onChange={(event) => patch(`location.${language}`, event.target.value)} placeholder="Localized location" className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm md:col-span-2" />
          <input value={settings.location.country} onChange={(event) => patch("location.country", event.target.value)} placeholder="Country" className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm" />
          <input value={settings.location.region} onChange={(event) => patch("location.region", event.target.value)} placeholder="City / region" className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm" />
          <input value={settings.location.venue} onChange={(event) => patch("location.venue", event.target.value)} placeholder="Venue" className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm" />
          <input value={settings.location.mapUrl} onChange={(event) => patch("location.mapUrl", event.target.value)} placeholder="Google Maps link" className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm" />
          <input value={settings.contact.email} onChange={(event) => patch("contact.email", event.target.value)} placeholder="Contact email" className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm" />
          <input value={settings.contact.phone} onChange={(event) => patch("contact.phone", event.target.value)} placeholder="Contact phone" className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm" />
        </div>
      </section>

      <CountdownSettingsPanel
        countdown={settings.countdown}
        language={language}
        timeLeft={timeLeft}
        countdownFinished={countdownFinished}
        onChange={(key, value) => patch(`countdown.${key}`, value)}
      />

      <SocialLinksEditor socials={settings.socials} onChange={(key, value) => patch(`socials.${key}`, value)} />
    </div>
  );
};

export default EventSettingsManager;
