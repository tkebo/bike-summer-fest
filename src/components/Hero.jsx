import { memo } from "react";
import { motion } from "framer-motion";
import Header from "./Header";
import { useCMS } from "../hooks/useCMS";
import Editable from "./Editable";
import AdminFrame from "./AdminFrame";

const Hero = () => {
  const { cmsData, lang, ev } = useCMS();
  return (
<>
        {/* HERO SECTION */}
        <section className="relative min-h-screen overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(5,8,20,.95), rgba(5,8,20,.52), rgba(5,8,20,.78)), url('${cmsData.config.images.hero}')`,
            }}
          />
          <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${ev("heroOverlayOpacity") / 100})` }} />

          <Header />

          {/* HERO TEXT */}
          <div className="relative z-10 min-h-screen max-w-[1680px] mx-auto px-8 pb-24 flex items-center" style={{ paddingTop: `${ev("heroTop")}px` }}>
            <AdminFrame frameKey="heroContent" label="Hero Content" className="max-w-[720px]">
            <motion.div initial={{ opacity: 0, y: 45 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
              
              <Editable path="heroDate" langContext={lang} as="div" className="font-black tracking-[0.28em] text-xl md:text-2xl mb-6 inline-block" style={{ color: ev("accentOrangeColor") }} />

              <h1 
                className="uppercase font-black inline-block" 
                style={{ 
                  fontSize: `clamp(48px, 7vw, ${ev("heroTitleSize")}px)`,
                  lineHeight: ev("heroTitleLineHeight"),
                  letterSpacing: `${ev("heroTitleLetterSpacing")}em`,
                  transform: `translate(${ev("heroTitlePosX")}px, ${ev("heroTitlePosY")}px)`
                }}
              >
                <Editable path="heroTitleLines.0" langContext={lang} as="span" className="block" />
                <Editable path="heroTitleLines.1" langContext={lang} as="span" className="block" />
                <Editable path="heroTitleLines.2" langContext={lang} as="span" className="block" />
                <Editable path="heroTitleLines.3" langContext={lang} as="span" className="block italic" style={{ color: ev("accentOrangeColor"), textShadow: `0 0 ${ev("logoSummerGlow")}px ${ev("accentOrangeColor")}` }} />
              </h1>
              <br />
              <Editable 
                path="heroSubtitle" 
                langContext={lang} 
                multiline 
                as="p" 
                className="mt-8 uppercase tracking-widest font-black inline-block text-white/85" 
                style={{ fontSize: `${ev("heroSubtitleSize")}px` }}
              />

              <AdminFrame frameKey="heroCta" label="CTA Buttons" className="inline-flex">
              <div className="flex flex-wrap mt-10" style={{ gap: `${ev("heroCtaBtnGap")}px` }}>
                <Editable path="heroGetTicketsBtn" langContext={lang} as="a" href="#tickets" className="px-9 py-4 rounded-xl text-white font-black transition shadow-[0_0_40px_rgba(255,77,0,.45)] inline-block" style={{ backgroundColor: ev("accentOrangeColor"), boxShadow: `0 0 40px ${ev("accentOrangeColor")}55` }} />
                <Editable path="heroExploreBtn" langContext={lang} as="a" href="#zones" className="px-9 py-4 rounded-xl border bg-black/30 backdrop-blur-xl font-black hover:text-black transition inline-block" style={{ borderColor: `${ev("accentCyanColor")}b3`, color: ev("accentCyanColor"), backgroundColor: "rgba(0,0,0,0.18)" }} />
              </div>
              </AdminFrame>
            </motion.div>
            </AdminFrame>
          </div>
        </section>
</>
  );
};

export default memo(Hero);
