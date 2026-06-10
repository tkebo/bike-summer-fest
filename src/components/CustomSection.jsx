import { memo } from "react";
import { useCMS } from "../hooks/useCMS";
import { isSafeHttpUrl } from "../security/sanitize";

const getLocalizedValue = (content, key, lang) => {
  const suffix = lang === "ka" ? "Ka" : "En";
  return content?.[`${key}${suffix}`] || content?.[`${key}En`] || content?.[`${key}Ka`] || "";
};

const CustomSection = ({ section }) => {
  const { lang } = useCMS();
  const content = section?.content || {};
  const title = getLocalizedValue(content, "title", lang);
  const eyebrow = getLocalizedValue(content, "eyebrow", lang);
  const text = getLocalizedValue(content, "text", lang);
  const buttonText = getLocalizedValue(content, "buttonText", lang);
  const hasButton = buttonText && isSafeHttpUrl(content.buttonUrl);
  const hasMedia = Boolean(content.image);
  const isVideo = content.mediaType === "video";
  const splitLayout = section?.layout === "split";
  const sectionStyle = {
    padding: `${section?.paddingY ?? 112}px ${section?.paddingX ?? 48}px`,
    backgroundImage: section?.backgroundImage ? `linear-gradient(rgba(5, 8, 20, ${(section.overlayOpacity || 0) / 100}), rgba(5, 8, 20, ${(section.overlayOpacity || 0) / 100})), url("${section.backgroundImage}")` : undefined,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
  const innerStyle = {
    maxWidth: `${section?.maxWidth || 1280}px`,
    gap: `${section?.gap || 24}px`,
  };

  return (
    <section id={section?.anchor || section?.instanceId || "custom"} className="custom-content-section" style={sectionStyle}>
      <div className={`mx-auto grid items-center ${splitLayout ? "lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]" : "text-center"}`} style={innerStyle}>
        <div className={splitLayout ? "" : "mx-auto max-w-3xl"}>
          {eyebrow && <p className="mb-4 text-sm font-black uppercase tracking-[0.32em] text-cyan-300">{eyebrow}</p>}
          {title && <h2 className="text-4xl font-black uppercase leading-tight md:text-6xl">{title}</h2>}
          {text && <p className="mt-5 whitespace-pre-line text-base leading-8 text-white/70 md:text-lg">{text}</p>}
          {hasButton && (
            <a
              href={content.buttonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex min-h-12 items-center justify-center rounded-full bg-cyan-300 px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-black transition hover:bg-white"
            >
              {buttonText}
            </a>
          )}
        </div>
        {hasMedia && (
          <div className={`overflow-hidden border border-white/10 bg-white/[0.04] ${splitLayout ? "" : "mt-8"}`} style={{ borderRadius: `${section?.radius || 32}px` }}>
            {isVideo ? (
              <video src={content.image} controls preload="metadata" className="h-full max-h-[560px] w-full object-cover" />
            ) : (
              <img src={content.image} alt={title || eyebrow || "Section media"} loading="lazy" decoding="async" className="h-full max-h-[560px] w-full object-cover" />
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default memo(CustomSection);
