import { memo } from "react";
import { useCMS } from "../hooks/useCMS";
import Editable from "./Editable";

const Schedule = () => {
  const { t, lang } = useCMS();
  return (
<>
        {/* SCHEDULE SECTION */}
        <section id="schedule" className="px-6 md:px-12 py-28 bg-[#081020]">
          <div className="max-w-7xl mx-auto">
            <Editable path="scheduleLabel" langContext={lang} as="p" className="text-orange-400 uppercase tracking-[0.35em] text-sm mb-4 font-black inline-block" />
            <Editable path="scheduleTitle" langContext={lang} as="h2" className="text-5xl md:text-7xl font-black uppercase mb-12" />

            <div className="grid lg:grid-cols-3 gap-6">
              {t.days.map((item, index) => (
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
