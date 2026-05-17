import { memo } from "react";
import { motion } from "framer-motion";
import { useCMS } from "../hooks/useCMS";
import Editable from "./Editable";
import { getOptimizedImageUrl } from "../lib/cloudinary";
import { isSafeHttpUrl } from "../security/sanitize";

const Sponsors = () => {
  const { t, lang, cmsData, isConfiguredImageActive } = useCMS();
  const sponsorLogos = cmsData.config.sponsorLogos?.filter(isConfiguredImageActive) || [];
  const configuredSponsors = [...(cmsData.config.sponsors || [])]
    .filter((sponsor) => sponsor.active !== false)
    .sort((left, right) => left.order - right.order);
  const gridSponsors = configuredSponsors.filter((sponsor) => sponsor.showInGrid !== false);
  const marqueeSponsors = configuredSponsors.filter((sponsor) => sponsor.showInMarquee !== false);
  const hasConfiguredSponsors = configuredSponsors.length > 0;

  const renderSponsorContent = (sponsor, imageClassName = "h-16 w-full object-contain") => {
    const hasActiveLogo = sponsor.logo && isConfiguredImageActive(sponsor.logo);
    const content = hasActiveLogo
      ? <img src={getOptimizedImageUrl(sponsor.logo, 320)} alt={sponsor.name} className={imageClassName} />
      : sponsor.name;

    return sponsor.website && isSafeHttpUrl(sponsor.website) ? (
      <a href={sponsor.website} target="_blank" rel="noreferrer" className="flex h-full w-full items-center justify-center">
        {content}
      </a>
    ) : content;
  };
  return (
<>
        {/* SPONSORS SECTION */}
        <section id="sponsors" className="px-6 md:px-12 py-28 bg-[#060b18]">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <Editable path="sponsorsLabel" langContext={lang} as="p" className="text-orange-400 uppercase tracking-[0.35em] text-sm mb-4 font-black inline-block" />
              <h2 className="text-5xl md:text-7xl font-black uppercase leading-none">
                <Editable path="sponsorsTitle1" langContext={lang} as="span" className="block" />
                <Editable path="sponsorsTitle2" langContext={lang} as="span" className="block text-cyan-300" />
              </h2>
              <Editable path="sponsorsText" langContext={lang} multiline as="p" className="text-white/65 leading-relaxed mt-8 inline-block" />
              <br />
              <a href="#contact" className="inline-flex mt-8 px-8 py-4 rounded-2xl bg-orange-500 font-black hover:bg-orange-400 transition shadow-[0_0_40px_rgba(255,122,24,.4)]">
                <Editable path="sponsorshipOffer" langContext={lang} as="span" />
              </a>
            </div>

            <div className="grid grid-cols-2 gap-5">
              {hasConfiguredSponsors
                ? gridSponsors.map((sponsor) => (
                  <div key={sponsor.id} className="border border-white/10 flex items-center justify-center text-center font-black tracking-widest hover:border-cyan-300/50 hover:-translate-y-2 transition duration-300 global-box">
                    {renderSponsorContent(sponsor)}
                  </div>
                ))
                : t.sponsorCards.map((item, index) => (
                  <Editable key={index} path={`sponsorCards.${index}`} langContext={lang} as="div" className="border border-white/10 flex items-center justify-center text-center font-black tracking-widest hover:border-cyan-300/50 hover:-translate-y-2 transition duration-300 global-box" />
                ))}
            </div>
          </div>
        </section>

        {/* SPONSORS MARQUEE */}
        <section className="px-6 md:px-12 py-20 bg-[#030713] overflow-hidden">
          <div className="max-w-7xl mx-auto mb-10">
            <Editable path="sponsorMarqueeLabel" langContext={lang} as="p" className="text-cyan-300 uppercase tracking-[0.35em] text-sm mb-4 font-black inline-block" />
            <Editable path="sponsorMarqueeTitle" langContext={lang} as="h2" className="text-4xl md:text-6xl font-black uppercase" />
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-[#030713] to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-[#030713] to-transparent" />
            <div className="marquee-track flex gap-5 w-max animate-marquee">
              {hasConfiguredSponsors
                ? [...marqueeSponsors, ...marqueeSponsors].map((sponsor, index) => (
                  <div key={`${sponsor.id}-${index}`} className="min-w-[240px] border border-white/10 flex items-center justify-center px-6 text-center font-black tracking-[0.18em] global-box">
                    {renderSponsorContent(sponsor)}
                  </div>
                ))
                : [...(sponsorLogos.length ? sponsorLogos : t.sponsorMarqueeItems), ...(sponsorLogos.length ? sponsorLogos : t.sponsorMarqueeItems)].map((item, index) => (
                  <div key={`${item}-${index}`} className="min-w-[240px] border border-white/10 flex items-center justify-center px-6 text-center font-black tracking-[0.18em] global-box">
                    {sponsorLogos.length ? <img src={getOptimizedImageUrl(item, 320)} alt="Sponsor" className="h-16 w-full object-contain" /> : item}
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* SOCIAL COMMUNITY */}
        <section id="social" className="px-6 md:px-12 py-28 bg-[#050814]">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <Editable path="socialLabel" langContext={lang} as="p" className="text-cyan-300 uppercase tracking-[0.35em] text-sm mb-4 font-black inline-block" />
              <Editable path="socialTitle" langContext={lang} as="h2" className="text-5xl md:text-7xl font-black uppercase leading-none" />
              <Editable path="socialText" langContext={lang} multiline as="p" className="text-white/65 leading-relaxed mt-8 inline-block" />
              <br/>
              <a href="#contact" className="inline-flex mt-8 px-8 py-4 rounded-2xl bg-cyan-300 text-black font-black hover:scale-105 transition shadow-[0_0_40px_rgba(0,217,255,.35)]">
                <Editable path="socialButton" langContext={lang} as="span" />
              </a>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {t.socialCards.map((item, index) => (
                <motion.a key={index} href="#contact" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="group border border-white/10 hover:border-cyan-300/50 hover:-translate-y-2 transition duration-300 global-box">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-300/10 border border-cyan-300/25 flex items-center justify-center text-2xl font-black text-cyan-300 group-hover:bg-cyan-300 group-hover:text-black transition">{item.icon}</div>
                    <div>
                      <Editable path={`socialCards.${index}.name`} langContext={lang} as="h3" className="text-2xl font-black" />
                      <Editable path={`socialCards.${index}.text`} langContext={lang} as="p" className="text-white/55 mt-1" />
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>
</>
  );
};

export default memo(Sponsors);
