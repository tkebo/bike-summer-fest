import { memo } from "react";
import { motion } from "framer-motion";
import { useCMS } from "../hooks/useCMS";
import Editable from "./Editable";
import { getOptimizedImageUrl, getResponsiveImageSrcSet } from "../lib/cloudinary";
import { isSafeHttpUrl } from "../security/sanitize";

const Sponsors = () => {
  const { t, lang, cmsData, isConfiguredImageActive, eventSettings } = useCMS();
  const sponsorLogos = cmsData.config.sponsorLogos?.filter(isConfiguredImageActive) || [];
  const configuredSponsors = [...(cmsData.config.sponsors || [])]
    .filter((sponsor) => sponsor.active !== false)
    .sort((left, right) => left.order - right.order);
  const gridSponsors = configuredSponsors.filter((sponsor) => sponsor.showInGrid !== false);
  const marqueeSponsors = configuredSponsors.filter((sponsor) => sponsor.showInMarquee !== false);
  const hasConfiguredSponsors = configuredSponsors.length > 0;
  const imageStyles = cmsData.config.imageStyles || {};
  const sponsorLogoCleanMode = imageStyles.sponsorLogoCleanMode !== false;
  const socialLinkKeys = ["facebook", "instagram", "tiktok", "youtube", "telegram", "whatsapp"];
  const socialLinks = eventSettings.socials || {};
  const firstActiveSocialLink = socialLinkKeys
    .map((key) => socialLinks[key])
    .find((url) => isSafeHttpUrl(url));

  const getSponsorLogoStyle = (sponsor = {}) => {
    const maxHeight = sponsor.logoMaxHeight || imageStyles.sponsorLogoHeight || 64;
    const maxWidth = sponsor.logoMaxWidth || imageStyles.sponsorLogoMaxWidth || 220;

    return sponsorLogoCleanMode
      ? {
        width: "auto",
        height: "auto",
        maxHeight: `${maxHeight}px`,
        maxWidth: `min(${maxWidth}px, 100%)`,
        objectFit: "contain",
        imageRendering: "auto",
      }
      : {
        width: "100%",
        height: `${maxHeight}px`,
        maxWidth: `min(${maxWidth}px, 100%)`,
        objectFit: "contain",
      };
  };
  const getSponsorCardStyle = (sponsor = {}, variant = "grid") => {
    const padding = sponsorLogoCleanMode
      ? `clamp(8px, 2.2vw, ${Math.max(imageStyles.sponsorLogoPadding || 20, 8)}px)`
      : `${imageStyles.sponsorLogoPadding || 20}px`;
    const cardStyle = { padding };
    const logoMaxWidth = Number(sponsor.logoMaxWidth) || 0;

    if (variant === "marquee" && logoMaxWidth > 0) {
      cardStyle.minWidth = `min(${Math.min(Math.max(logoMaxWidth + 48, 240), 680)}px, 72vw)`;
    }

    return cardStyle;
  };
  const sponsorCardStyle = {
    padding: sponsorLogoCleanMode
      ? `clamp(8px, 2.2vw, ${Math.max(imageStyles.sponsorLogoPadding || 20, 8)}px)`
      : `${imageStyles.sponsorLogoPadding || 20}px`,
  };
  const sponsorCardClassName = sponsorLogoCleanMode
    ? "sponsor-clean-card flex min-h-[132px] items-center justify-center text-center font-black tracking-widest transition duration-300"
    : "border border-white/10 flex min-h-[132px] items-center justify-center text-center font-black tracking-widest hover:border-cyan-300/50 hover:-translate-y-2 transition duration-300 global-box";
  const sponsorMarqueeCardClassName = sponsorLogoCleanMode
    ? "sponsor-clean-card sponsor-clean-marquee-card min-w-[240px] flex min-h-[116px] items-center justify-center text-center font-black tracking-[0.18em]"
    : "min-w-[240px] border border-white/10 flex min-h-[116px] items-center justify-center text-center font-black tracking-[0.18em] global-box";

  const renderSponsorContent = (sponsor, imageClassName = "sponsor-logo-image max-w-full object-contain") => {
    const hasActiveLogo = sponsor.logo && isConfiguredImageActive(sponsor.logo);
    const content = hasActiveLogo
      ? (
        <img
          src={getOptimizedImageUrl(sponsor.logo, 480)}
          srcSet={getResponsiveImageSrcSet(sponsor.logo, [240, 320, 480])}
          sizes="(min-width: 1024px) 220px, 45vw"
          alt={sponsor.name}
          loading="lazy"
          decoding="async"
          className={imageClassName}
          style={getSponsorLogoStyle(sponsor)}
        />
      )
      : sponsor.name;

    return sponsor.website && isSafeHttpUrl(sponsor.website) ? (
      <a href={sponsor.website} target="_blank" rel="noreferrer" className="sponsor-logo-link flex h-full w-full items-center justify-center">
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
                  <div
                    key={sponsor.id}
                    className={sponsorCardClassName}
                    style={getSponsorCardStyle(sponsor)}
                  >
                    {renderSponsorContent(sponsor)}
                  </div>
                ))
                : t.sponsorCards.map((item, index) => (
                  <Editable
                    key={index}
                    path={`sponsorCards.${index}`}
                    langContext={lang}
                    as="div"
                    className={sponsorCardClassName}
                    style={sponsorCardStyle}
                  />
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
                  <div
                    key={`${sponsor.id}-${index}`}
                    className={sponsorMarqueeCardClassName}
                    style={getSponsorCardStyle(sponsor, "marquee")}
                  >
                    {renderSponsorContent(sponsor)}
                  </div>
                ))
                : [...(sponsorLogos.length ? sponsorLogos : t.sponsorMarqueeItems), ...(sponsorLogos.length ? sponsorLogos : t.sponsorMarqueeItems)].map((item, index) => (
                  <div
                    key={`${item}-${index}`}
                    className={sponsorMarqueeCardClassName}
                    style={sponsorCardStyle}
                  >
                    {sponsorLogos.length ? (
                      <img
                        src={getOptimizedImageUrl(item, 480)}
                        srcSet={getResponsiveImageSrcSet(item, [240, 320, 480])}
                        sizes="240px"
                        alt="Sponsor"
                        loading="lazy"
                        decoding="async"
                        className="sponsor-logo-image max-w-full object-contain"
                        style={getSponsorLogoStyle()}
                      />
                    ) : item}
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
              <a
                href={firstActiveSocialLink || "#contact"}
                target={firstActiveSocialLink ? "_blank" : undefined}
                rel={firstActiveSocialLink ? "noreferrer" : undefined}
                className="inline-flex mt-8 px-8 py-4 rounded-2xl bg-cyan-300 text-black font-black hover:scale-105 transition shadow-[0_0_40px_rgba(0,217,255,.35)]"
              >
                <Editable path="socialButton" langContext={lang} as="span" />
              </a>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {t.socialCards.map((item, index) => {
                const socialUrl = socialLinks[socialLinkKeys[index]];
                const hasSocialUrl = isSafeHttpUrl(socialUrl);
                return (
                <motion.a
                  key={index}
                  href={hasSocialUrl ? socialUrl : "#contact"}
                  target={hasSocialUrl ? "_blank" : undefined}
                  rel={hasSocialUrl ? "noreferrer" : undefined}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group border border-white/10 hover:border-cyan-300/50 hover:-translate-y-2 transition duration-300 global-box"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-300/10 border border-cyan-300/25 flex items-center justify-center text-2xl font-black text-cyan-300 group-hover:bg-cyan-300 group-hover:text-black transition">{item.icon}</div>
                    <div>
                      <Editable path={`socialCards.${index}.name`} langContext={lang} as="h3" className="text-2xl font-black" />
                      <Editable path={`socialCards.${index}.text`} langContext={lang} as="p" className="text-white/55 mt-1" />
                    </div>
                  </div>
                </motion.a>
              )})}
            </div>
          </div>
        </section>
</>
  );
};

export default memo(Sponsors);
