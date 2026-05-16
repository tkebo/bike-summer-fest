import { memo } from "react";
import { motion } from "framer-motion";
import { useCMS } from "../hooks/useCMS";
import Editable from "./Editable";

const About = () => {
  const { t, lang } = useCMS();
  return (
<>
        {/* HIGHLIGHTS SECTION */}
        <section className="px-6 md:px-12 py-20 bg-[#060b18]">
          <div className="max-w-7xl mx-auto text-center">
            <Editable path="highlightsLabel" langContext={lang} as="p" className="text-cyan-300 uppercase tracking-[0.35em] text-sm mb-4 font-black inline-block" />
            <Editable path="highlightsTitle" langContext={lang} as="h2" className="text-4xl md:text-6xl font-black uppercase mb-10" />

            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {t.highlights.map((item, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="border border-white/10 text-center hover:-translate-y-2 hover:border-cyan-300/50 transition duration-300 global-box">
                  <Editable path={`highlights.${index}.value`} langContext={lang} as="div" className="text-6xl md:text-7xl font-black text-cyan-300 drop-shadow-[0_0_30px_rgba(0,217,255,.65)]" />
                  <Editable path={`highlights.${index}.label`} langContext={lang} as="div" className="mt-4 text-white/70 font-black uppercase tracking-widest text-sm" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="px-6 md:px-12 py-28 bg-gradient-to-b from-[#050814] to-[#091225]">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <Editable path="aboutLabel" langContext={lang} as="p" className="text-cyan-300 uppercase tracking-[0.35em] text-sm mb-4 font-black inline-block" />
              <h2 className="text-5xl md:text-7xl font-black uppercase leading-none">
                <Editable path="slogan1" langContext={lang} as="span" className="block" />
                <Editable path="slogan2" langContext={lang} as="span" className="block text-orange-500" />
                <Editable path="slogan3" langContext={lang} as="span" className="block text-cyan-300" />
              </h2>
            </div>

            <div className="border border-white/10 global-box">
              <Editable path="aboutText" langContext={lang} multiline as="p" className="text-white/70 leading-relaxed inline-block" />
            </div>
          </div>
        </section>
</>
  );
};

export default memo(About);
