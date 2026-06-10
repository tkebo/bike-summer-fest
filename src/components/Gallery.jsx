import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useCMS } from "../hooks/useCMS";
import Editable from "./Editable";
import AdminFrame from "./AdminFrame";
import { getOptimizedImageUrl, getResponsiveImageSrcSet } from "../lib/cloudinary";
import { isSafeHttpUrl } from "../security/sanitize";

const Gallery = () => {
  const { cmsData, lang, isConfiguredImageActive } = useCMS();
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const activeGalleryImages = cmsData.config.galleryImages?.filter(isConfiguredImageActive);
  const fallbackImages = [
    cmsData.config.images.gallery1,
    cmsData.config.images.gallery2,
    cmsData.config.images.gallery3,
  ].filter(Boolean);
  const galleryImagesSource = activeGalleryImages?.length ? activeGalleryImages : fallbackImages;
  const imageStyles = cmsData.config.imageStyles || {};
  const maxGalleryItems = Math.min(Math.max(Number(imageStyles.galleryGridLimit) || 6, 1), 24);
  const galleryImages = useMemo(() => {
    if (!galleryImagesSource.length) return [];
    return galleryImagesSource.slice(0, maxGalleryItems);
  }, [galleryImagesSource, maxGalleryItems]);
  const externalGalleryUrl = cmsData.config.externalGalleryUrl || "";
  const hasExternalGallery = isSafeHttpUrl(externalGalleryUrl);
  const activeImage = activeImageIndex === null ? null : galleryImages[activeImageIndex];
  const openGalleryLabel = cmsData[lang]?.galleryOpenButton || (lang === "ka" ? "გალერიის გახსნა" : "Open Gallery");
  const closeLabel = lang === "ka" ? "დახურვა" : "Close";
  const previousLabel = lang === "ka" ? "წინა" : "Previous";
  const nextLabel = lang === "ka" ? "შემდეგი" : "Next";

  const showPreviousImage = useCallback(() => {
    setActiveImageIndex((current) => (current === null ? null : (current - 1 + galleryImages.length) % galleryImages.length));
  }, [galleryImages.length]);

  const showNextImage = useCallback(() => {
    setActiveImageIndex((current) => (current === null ? null : (current + 1) % galleryImages.length));
  }, [galleryImages.length]);

  useEffect(() => {
    if (activeImageIndex === null) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setActiveImageIndex(null);
      if (event.key === "ArrowLeft") showPreviousImage();
      if (event.key === "ArrowRight") showNextImage();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeImageIndex, galleryImages.length, showNextImage, showPreviousImage]);

  return (
<>
        {/* GALLERY SECTION */}
        <section id="gallery" className="px-6 md:px-12 py-28">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <Editable path="galleryLabel" langContext={lang} as="p" className="text-cyan-300 uppercase tracking-[0.35em] text-sm mb-4 font-black inline-block" />
                <Editable path="galleryTitle" langContext={lang} as="h2" className="text-5xl md:text-7xl font-black uppercase" />
              </div>
              {hasExternalGallery && (
                <a
                  href={externalGalleryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-cyan-300/35 bg-cyan-300 px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-black transition hover:bg-white"
                >
                  {openGalleryLabel}
                </a>
              )}
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3" style={{ gap: `${imageStyles.galleryGridGap || 16}px` }}>
              {galleryImages.map((img, index) => (
                <AdminFrame key={`${img}-${index}`} frameKey={`galleryBlock${index}`} label={`Gallery ${index + 1}`} className="overflow-hidden border border-white/10 global-box" style={{ padding: 0 }}>
                  <button
                    type="button"
                    onClick={() => setActiveImageIndex(index)}
                    className="group block w-full cursor-zoom-in overflow-hidden text-left"
                    aria-label={`${openGalleryLabel} ${index + 1}`}
                  >
                    <img
                      src={getOptimizedImageUrl(img, 720)}
                      srcSet={getResponsiveImageSrcSet(img, [360, 540, 720, 960])}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      alt={`Gallery ${index + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full transition duration-500 group-hover:scale-110"
                      style={{
                        height: `${imageStyles.galleryHeight || 384}px`,
                        objectFit: imageStyles.galleryFit || "cover",
                        objectPosition: `${imageStyles.galleryPositionX || 50}% ${imageStyles.galleryPositionY || 50}%`,
                      }}
                    />
                  </button>
                </AdminFrame>
              ))}
            </div>
          </div>
        </section>
        {activeImage && (
          <div
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 px-4 py-6 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            onClick={() => setActiveImageIndex(null)}
          >
            <button
              type="button"
              onClick={() => setActiveImageIndex(null)}
              className="absolute right-4 top-4 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-black uppercase text-white transition hover:bg-white hover:text-black"
            >
              {closeLabel}
            </button>
            {galleryImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    showPreviousImage();
                  }}
                  className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-3xl font-black text-white transition hover:bg-cyan-300 hover:text-black md:left-6"
                  aria-label={previousLabel}
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    showNextImage();
                  }}
                  className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-3xl font-black text-white transition hover:bg-cyan-300 hover:text-black md:right-6"
                  aria-label={nextLabel}
                >
                  ›
                </button>
              </>
            )}
            <div className="max-h-[86vh] w-full max-w-6xl" onClick={(event) => event.stopPropagation()}>
              <img
                src={getOptimizedImageUrl(activeImage, 1600)}
                srcSet={getResponsiveImageSrcSet(activeImage, [720, 960, 1280, 1600])}
                sizes="100vw"
                alt={`Gallery ${activeImageIndex + 1}`}
                className="mx-auto max-h-[86vh] w-auto rounded-2xl object-contain shadow-2xl"
              />
              <div className="mt-4 text-center text-xs font-black uppercase tracking-[0.18em] text-white/55">
                {activeImageIndex + 1} / {galleryImages.length}
              </div>
            </div>
          </div>
        )}
</>
  );
};

export default memo(Gallery);
