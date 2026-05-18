import { lazy, Suspense, useState } from "react";
import { defaultContent } from "../../data/defaultContent";
import { AUDIT_ACTIONS, logAudit } from "../../security/securityAudit";

const ScheduleDayEditor = lazy(() => import("./ScheduleDayEditor"));

const createDay = (index) => ({
  id: `day-${Date.now()}`,
  order: index + 1,
  active: true,
  date: "",
  label: `DAY ${String(index + 1).padStart(2, "0")}`,
  ka: { title: "", description: "" },
  en: { title: "", description: "" },
  events: [],
});

const ScheduleManager = ({ cmsData, updateContent, user, adminProfile }) => {
  const [language, setLanguage] = useState("ka");
  const days = [...(cmsData.config.scheduleDays || [])].sort((left, right) => left.order - right.order);
  const commit = (nextDays) => updateContent("config.scheduleDays", nextDays.map((day, index) => ({ ...day, order: index + 1 })));
  const audit = (day, summary) => logAudit(AUDIT_ACTIONS.SCHEDULE_EDIT, {
    actorUid: user?.uid || "",
    actorEmail: user?.email || "",
    actorRole: adminProfile?.role || "",
    targetType: "schedule_day",
    targetId: day?.id || "",
    summary,
  });
  const patchById = (id, nextPatch) => commit(days.map((day) => (day.id === id ? { ...day, ...nextPatch } : day)));
  const patchLocaleById = (id, nextPatch) => patchById(id, { [language]: { ...days.find((day) => day.id === id)[language], ...nextPatch } });
  const move = (fromIndex, toIndex) => {
    const next = [...days];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    commit(next);
  };
  const reset = (index, id) => patchById(id, defaultContent.config.scheduleDays[index] || createDay(index));

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-black">Schedule Manager</h2>
            <p className="mt-1 text-sm text-white/55">Festival days with nested program events.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setLanguage("ka")} className={`rounded-xl px-4 py-2 font-black ${language === "ka" ? "bg-cyan-300 text-black" : "bg-white/5 text-white/70"}`}>ქართული</button>
            <button onClick={() => setLanguage("en")} className={`rounded-xl px-4 py-2 font-black ${language === "en" ? "bg-cyan-300 text-black" : "bg-white/5 text-white/70"}`}>English</button>
            <button onClick={() => {
              const day = createDay(days.length);
              commit([...days, day]);
              audit(day, "Schedule day added");
            }} className="rounded-xl bg-cyan-300 px-4 py-2 font-black text-black">Add day</button>
            <button onClick={() => commit(defaultContent.config.scheduleDays)} className="rounded-xl border border-white/15 px-4 py-2 font-black">Reset defaults</button>
          </div>
        </div>
      </section>

      {days.map((day, index) => (
        <Suspense key={day.id} fallback={<div className="h-40 animate-pulse rounded-2xl border border-white/10 bg-white/[0.045]" />}>
          <ScheduleDayEditor
            day={day}
            language={language}
            index={index}
            total={days.length}
            onPatch={(nextPatch) => patchById(day.id, nextPatch)}
            onPatchLocale={(nextPatch) => patchLocaleById(day.id, nextPatch)}
            onDuplicate={() => {
              const duplicate = { ...day, id: `${day.id}-copy-${Date.now()}` };
              commit([...days.slice(0, index + 1), duplicate, ...days.slice(index + 1)]);
              audit(duplicate, "Schedule day duplicated");
            }}
            onToggleActive={() => {
              patchById(day.id, { active: !day.active });
              audit(day, `Schedule day ${day.active ? "disabled" : "enabled"}`);
            }}
            onDelete={() => {
              commit(days.filter((item) => item.id !== day.id));
              audit(day, "Schedule day deleted");
            }}
            onMove={move}
            onReset={() => reset(index, day.id)}
          />
        </Suspense>
      ))}
    </div>
  );
};

export default ScheduleManager;
