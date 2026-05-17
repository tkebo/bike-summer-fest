import { memo } from "react";
import { useCMS } from "../hooks/useCMS";
import Editable from "./Editable";

const Schedule = () => {
  const { t, lang, cmsData } = useCMS();
  const configuredDays = [...(cmsData.config.scheduleDays || [])]
    .filter((day) => day.active !== false)
    .sort((left, right) => left.order - right.order);
  const hasConfiguredSchedule = configuredDays.length > 0;
  return (
<>
        {/* SCHEDULE SECTION */}
        <section id="schedule" className="px-6 md:px-12 py-28 bg-[#081020]">
          <div className="max-w-7xl mx-auto">
            <Editable path="scheduleLabel" langContext={lang} as="p" className="text-orange-400 uppercase tracking-[0.35em] text-sm mb-4 font-black inline-block" />
            <Editable path="scheduleTitle" langContext={lang} as="h2" className="text-5xl md:text-7xl font-black uppercase mb-12" />

            <div className="grid lg:grid-cols-3 gap-6">
              {hasConfiguredSchedule
                ? configuredDays.map((day) => {
                  const events = [...(day.events || [])]
                    .filter((event) => event.active !== false)
                    .sort((left, right) => left.order - right.order);
                  return (
                    <div key={day.id} className="border border-white/10 hover:-translate-y-2 transition duration-300 global-box">
                      <p className="text-cyan-300 font-black tracking-[0.3em]">{day.label}</p>
                      <h3 className="text-3xl font-black mt-5">{day[lang].title}</h3>
                      <p className="text-white/60 mt-4 leading-relaxed">{day[lang].description}</p>
                      <div className="mt-6 grid gap-3">
                        {events.map((event) => (
                          <div key={event.id} className={`rounded-2xl border p-4 ${event.highlighted ? "border-cyan-300/45 bg-cyan-300/[0.08]" : "border-white/10 bg-black/20"}`}>
                            <div className="flex flex-wrap items-center gap-2 text-xs font-black">
                              <span className="text-cyan-200">{event.time}</span>
                              <span className="rounded-full bg-white/5 px-2 py-1 uppercase">{event.type}</span>
                            </div>
                            <h4 className="mt-3 font-black">{event[lang].title}</h4>
                            <p className="mt-2 text-sm text-white/55">{event[lang].description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
                : t.days.map((item, index) => (
                  <div key={index} className="border border-white/10 hover:-translate-y-2 transition duration-300 global-box">
                    <Editable path={`days.${index}.day`} langContext={lang} as="p" className="text-cyan-300 font-black tracking-[0.3em] inline-block" />
                    <Editable path={`days.${index}.title`} langContext={lang} as="h3" className="text-3xl font-black mt-5" />
                    <Editable path={`days.${index}.text`} langContext={lang} multiline as="p" className="text-white/60 mt-4 leading-relaxed inline-block" />
                  </div>
                ))}
            </div>
          </div>
        </section>
</>
  );
};

export default memo(Schedule);
