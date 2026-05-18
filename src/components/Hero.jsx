import { memo } from "react";
import { motion } from "framer-motion";
import Header from "./Header";
import { useCMS } from "../hooks/useCMS";
import Editable from "./Editable";
import AdminFrame from "./AdminFrame";
import { getOptimizedImageUrl } from "../lib/cloudinary";

const Hero = () => {
  const { cmsData, lang, ev, isConfiguredImageActive, introArrivalActive } = useCMS();
  const configuredHeroImage = isConfiguredImageActive(cmsData.config.heroImage) ? cmsData.config.heroImage : cmsData.config.images.hero;
  const heroImage = getOptimizedImageUrl(configuredHeroImage, 1920);
  const heroBackgrounds = cmsData.config.backgrounds?.hero || {};
  const generatedHeroDate = lang === "ka"
    ? cmsData.config.eventSettings?.dates?.displayKa
    : cmsData.config.eventSettings?.dates?.displayEn;
  const heroDate = cmsData[lang]?.heroDate?.trim() || generatedHeroDate;
  return (
<>
        {/* HERO SECTION */}
        <section className="relative min-h-screen overflow-hidden">
          <div
            className="hero-responsive-background absolute inset-0 bg-cover bg-center transition-all duration-1000"
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(5,8,20,.95), rgba(5,8,20,.52), rgba(5,8,20,.78)), url('${heroImage}')`,
              filter: `blur(${ev("heroBgBlur")}px) brightness(${ev("heroBgBrightness")}%) contrast(${ev("heroBgContrast")}%)`,
              backgroundPosition: `${ev("heroBgPositionX")}% ${ev("heroBgPositionY")}%`,
              backgroundSize: `${ev("heroBgScale")}%`,
            }}
          />
          <style>{`
            @media (min-width: 1024px) {
              .hero-responsive-background {
                ${heroBackgrounds.desktop ? `background-image: linear-gradient(90deg, rgba(5,8,20,.95), rgba(5,8,20,.52), rgba(5,8,20,.78)), url('${heroBackgrounds.desktop}') !important;` : ""}
              }
            }
            @media (min-width: 640px) and (max-width: 1023px) {
              .hero-responsive-background {
                ${heroBackgrounds.tablet ? `background-image: linear-gradient(90deg, rgba(5,8,20,.95), rgba(5,8,20,.52), rgba(5,8,20,.78)), url('${heroBackgrounds.tablet}') !important;` : ""}
              }
            }
            @media (max-width: 639px) {
              .hero-responsive-background {
                ${heroBackgrounds.mobile ? `background-image: linear-gradient(90deg, rgba(5,8,20,.95), rgba(5,8,20,.52), rgba(5,8,20,.78)), url('${heroBackgrounds.mobile}') !important;` : ""}
              }
            }
          `}</style>
          <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${ev("heroOverlayOpacity") / 100})` }} />

          <Header />

          {/* HERO TEXT */}
          <div className="relative z-10 min-h-screen max-w-[1680px] mx-auto px-8 pb-24 flex items-center" style={{ paddingTop: `${ev("heroTop")}px` }}>
            <AdminFrame frameKey="heroContent" label="Hero Content" className="max-w-[720px]">
            <motion.div initial={{ opacity: 0, y: 45 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
              
              {cmsData[lang]?.heroDate?.trim() ? (
                <Editable path="heroDate" langContext={lang} as="div" className="font-black tracking-[0.28em] text-xl md:text-2xl mb-6 inline-block" style={{ color: ev("accentOrangeColor") }} />
              ) : (
                <div className="font-black tracking-[0.28em] text-xl md:text-2xl mb-6 inline-block" style={{ color: ev("accentOrangeColor") }}>{heroDate}</div>
              )}

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
              <div className={`flex flex-wrap mt-10 ${introArrivalActive ? "intro-arrival-cta" : ""}`} style={{ gap: `${ev("heroCtaBtnGap")}px` }}>
                <Editable path="heroGetTicketsBtn" langContext={lang} as="a" href="#tickets" className="px-9 py-4 rounded-xl text-white font-black transition shadow-[0_0_40px_rgba(255,77,0,.45)] inline-block" style={{ backgroundColor: ev("accentOrangeColor"), boxShadow: `0 0 40px ${ev("accentOrangeColor")}55` }} />
                <Editable path="heroExploreBtn" langContext={lang} as="a" href="#zones" className="px-9 py-4 rounded-xl border bg-black/30 backdrop-blur-xl font-black hover:text-black transition inline-block" style={{ borderColor: `${ev("accentCyanColor")}b3`, color: ev("accentCyanColor"), backgroundColor: "rgba(0,0,0,0.18)" }} />
              </div>
              </AdminFrame>
            </motion.div>
            </AdminFrame>
          </div>
        </section>
        <style>{`
          .intro-arrival-logo { animation: introArrivalLogo 2.2s ease both; }
          .intro-arrival-countdown { animation: introArrivalCountdown 1.4s .25s cubic-bezier(.2,.8,.2,1) both; }
          .intro-arrival-cta > *:first-child { animation: introArrivalButton .9s .45s cubic-bezier(.2,.8,.2,1) both; }
          .intro-arrival-cta > *:last-child { animation: introArrivalButton .9s .62s cubic-bezier(.2,.8,.2,1) both; }
          @keyframes introArrivalLogo { 0% { filter: brightness(.7); text-shadow: 0 0 0 rgba(0,217,255,0); } 35% { filter: brightness(1.5); text-shadow: 0 0 48px rgba(0,217,255,.8); } 100% { filter: brightness(1); } }
          @keyframes introArrivalCountdown { from { opacity: 0; transform: translate(${ev("countdownTranslateX")}%, 22px) scale(.92); } to { opacity: 1; transform: translate(${ev("countdownTranslateX")}%, 0) scale(${ev("countdownScale")}); } }
          @keyframes introArrivalButton { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
</>
  );
};

export default memo(Hero);
