const countdownModes = ["start_date", "end_date", "custom_deadline"];
const timezoneOptions = ["Asia/Tbilisi", "UTC", "Europe/London", "Europe/Berlin", "America/New_York"];

const CountdownSettingsPanel = ({ countdown, language, timeLeft, countdownFinished, onChange }) => (
  <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h3 className="text-lg font-black">Countdown Settings</h3>
        <p className="mt-1 text-sm text-white/55">Target selection stays compatible with legacy festival date fallback.</p>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={countdown.enabled} onChange={(event) => onChange("enabled", event.target.checked)} />
        Enabled
      </label>
    </div>
    <div className="mt-4 grid gap-3 md:grid-cols-2">
      <select value={countdown.mode} onChange={(event) => onChange("mode", event.target.value)} className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm">
        {countdownModes.map((mode) => <option key={mode} value={mode}>{mode}</option>)}
      </select>
      <select value={countdown.timezone} onChange={(event) => onChange("timezone", event.target.value)} className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm">
        {timezoneOptions.map((timezone) => <option key={timezone} value={timezone}>{timezone}</option>)}
      </select>
      <input value={countdown.targetDate} onChange={(event) => onChange("targetDate", event.target.value)} type="date" className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm" />
      <input value={countdown.targetTime} onChange={(event) => onChange("targetTime", event.target.value)} type="time" className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm" />
      <input
        value={language === "ka" ? countdown.finishedMessageKa : countdown.finishedMessageEn}
        onChange={(event) => onChange(language === "ka" ? "finishedMessageKa" : "finishedMessageEn", event.target.value)}
        placeholder="Finished message"
        className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm md:col-span-2"
      />
      {["days", "hours", "minutes", "seconds"].map((key) => (
        <input
          key={key}
          value={countdown.labels?.[language]?.[key] || ""}
          onChange={(event) => onChange(`labels.${language}.${key}`, event.target.value)}
          placeholder={`${key} label`}
          className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm"
        />
      ))}
    </div>
    <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="text-xs font-black uppercase text-cyan-200">Live countdown preview</div>
      <div className="mt-3 flex flex-wrap gap-3">
        {countdownFinished ? (
          <span className="font-black text-cyan-200">{language === "ka" ? countdown.finishedMessageKa : countdown.finishedMessageEn}</span>
        ) : Object.entries(timeLeft).map(([key, value]) => (
          <span key={key} className="rounded-xl bg-white/5 px-3 py-2 font-black">{value} {key}</span>
        ))}
      </div>
    </div>
  </section>
);

export default CountdownSettingsPanel;
