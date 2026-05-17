import { memo } from "react";
import { useCMS } from "../hooks/useCMS";
import Editable from "./Editable";
import AdminFrame from "./AdminFrame";
import { getOptimizedImageUrl } from "../lib/cloudinary";

const Gallery = () => {
  const { cmsData, lang, isConfiguredImageActive } = useCMS();
  const activeGalleryImages = cmsData.config.galleryImages?.filter(isConfiguredImageActive);
  const galleryImages = activeGalleryImages?.length
    ? activeGalleryImages
    : [cmsData.config.images.gallery1, cmsData.config.images.gallery2, cmsData.config.images.gallery3];
  return (
<>
        {/* GALLERY SECTION */}
        <section id="gallery" className="px-6 md:px-12 py-28">
          <div className="max-w-7xl mx-auto">
            <Editable path="galleryLabel" langContext={lang} as="p" className="text-cyan-300 uppercase tracking-[0.35em] text-sm mb-4 font-black inline-block" />
            <Editable path="galleryTitle" langContext={lang} as="h2" className="text-5xl md:text-7xl font-black uppercase mb-12" />

            <div className="grid md:grid-cols-3 gap-6">
              {galleryImages.map((img, index) => (
                <AdminFrame key={index} frameKey={`galleryBlock${index}`} label={`Gallery ${index + 1}`} className="overflow-hidden border border-white/10 global-box" style={{ padding: 0 }}>
                  <img src={getOptimizedImageUrl(img, 720)} alt="Gallery" className="h-96 w-full object-cover hover:scale-110 transition duration-500" />
                </AdminFrame>
              ))}
            </div>
          </div>
        </section>
</>
  );
};

export default memo(Gallery);
