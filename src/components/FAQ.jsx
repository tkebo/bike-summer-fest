import { memo } from "react";
import { motion } from "framer-motion";
import { useCMS } from "../hooks/useCMS";
import Editable from "./Editable";

const FAQ = () => {
  const { cmsData, t, lang, openFaq, setOpenFaq } = useCMS();
  return (
<>
        {/* FAQ SECTION */}
        <section id="faq" className="px-6 md:px-12 py-28 bg-[#07101f]">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <Editable path="faqLabel" langContext={lang} as="p" className="text-cyan-300 uppercase tracking-[0.35em] text-sm mb-4 font-black inline-block" />
              <Editable path="faqTitle" langContext={lang} as="h2" className="text-5xl md:text-7xl font-black uppercase leading-none" />

              <div className="mt-10 border border-white/10 global-box" style={{ padding: '16px' }}>
                <img src={cmsData.config.images.gallery2} alt="Anaklia Ganmukhuri" className="w-full h-[320px] object-cover rounded-[28px]" />
                <div className="p-4">
                  <Editable path="locationTitle" langContext={lang} as="h3" className="text-3xl font-black mt-4" />
                  <Editable path="locationText" langContext={lang} multiline as="p" className="text-white/60 mt-4 leading-relaxed inline-block" />
                  <br />
                  <a href="https://www.google.com/maps/search/Anaklia+Ganmukhuri+Georgia" target="_blank" rel="noreferrer" className="inline-flex mt-6 px-7 py-4 rounded-2xl bg-cyan-300 text-black font-black hover:scale-105 transition shadow-[0_0_35px_rgba(0,217,255,.35)]">
                    <Editable path="openMap" langContext={lang} as="span" />
                  </a>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {t.faqItems.map((item, index) => (
                <div key={index} className="border border-white/10 overflow-hidden global-box" style={{ padding: 0 }}>
                  <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full flex items-center justify-between gap-4 text-left p-6">
                    <Editable path={`faqItems.${index}.q`} langContext={lang} as="span" className="text-xl font-black" />
                    <span className="text-cyan-300 text-2xl font-black">{openFaq === index ? "−" : "+"}</span>
                  </button>
                  {openFaq === index && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="px-6 pb-6 text-white/62 leading-relaxed">
                      <Editable path={`faqItems.${index}.a`} langContext={lang} multiline as="div" />
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
</>
  );
};

export default memo(FAQ);
