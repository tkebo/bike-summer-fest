import { memo } from "react";
import { useCMS } from "../hooks/useCMS";
import Editable from "./Editable";
import { getOptimizedImageUrl } from "../lib/cloudinary";

const Zones = () => {
  const { cmsData, t, lang, isConfiguredImageActive } = useCMS();
  const zonesImage = isConfiguredImageActive(cmsData.config.zonesImage)
    ? cmsData.config.zonesImage
    : isConfiguredImageActive(cmsData.config.galleryImages?.[2])
      ? cmsData.config.galleryImages[2]
      : cmsData.config.images.gallery3;
  const imageStyles = cmsData.config.imageStyles || {};
  return (
<>
        {/* ZONES SECTION */}
        <section id="zones" className="px-6 md:px-12 py-28">
          <div className="max-w-7xl mx-auto text-center">
            <Editable path="zonesLabel" langContext={lang} as="p" className="text-cyan-300 uppercase tracking-[0.35em] text-sm mb-4 font-black inline-block" />
            <Editable path="zonesTitle" langContext={lang} as="h2" className="text-5xl md:text-7xl font-black uppercase mb-12" />

            <div className="mx-auto mb-12 max-w-7xl border border-white/10 p-3 global-box">
              <img
                src={getOptimizedImageUrl(zonesImage, 1600)}
                alt="Festival panorama"
                loading="lazy"
                decoding="async"
                className="mx-auto w-full object-cover object-center rounded-[28px]"
                style={{
                  height: `clamp(${imageStyles.zonesMobileHeight || 340}px, 45vw, ${imageStyles.zonesDesktopHeight || 560}px)`,
                }}
              />
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 text-left">
              {t.zones.map((zone, index) => (
                <div key={index} className="border border-white/10 hover:border-cyan-300/50 hover:-translate-y-2 transition duration-300 global-box">
                  <div className="text-4xl mb-6">🏍️</div>
                  <Editable path={`zones.${index}`} langContext={lang} as="h3" className="text-2xl font-black" />
                  <Editable path="zoneText" langContext={lang} multiline as="p" className="text-white/55 mt-3 inline-block" />
                </div>
              ))}
            </div>
          </div>
        </section>
</>
  );
};

export default memo(Zones);
