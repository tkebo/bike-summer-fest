import { memo } from "react";
import { useCMS } from "../hooks/useCMS";
import Editable from "./Editable";

const Newsletter = () => {
  const { t, lang } = useCMS();
  return (
<>
        {/* NEWSLETTER */}
        <section id="newsletter" className="px-6 md:px-12 py-28 bg-[#07101f] flex justify-center">
          <div className="w-full max-w-5xl mx-auto text-center border border-white/10 md:p-14 global-box">
            <Editable path="newsletterLabel" langContext={lang} as="p" className="text-cyan-300 uppercase tracking-[0.35em] text-sm mb-5 font-black inline-block" />
            <h2 className="text-5xl md:text-7xl font-black uppercase leading-none">
              <Editable path="newsletterTitle1" langContext={lang} as="span" />
              <Editable path="newsletterTitle2" langContext={lang} as="span" className="block text-orange-500" />
            </h2>
            <Editable path="newsletterText" langContext={lang} multiline as="p" className="text-white/60 max-w-2xl mx-auto mt-6 leading-relaxed inline-block" />

            <form onSubmit={(e) => { e.preventDefault(); window.location.href = `mailto:info@bikesummerfest.ge?subject=Bike Summer Fest Newsletter&body=Email: ${e.currentTarget.email.value}`; }} className="mt-10 flex flex-col sm:flex-row justify-center gap-4 max-w-2xl mx-auto">
              <input name="email" type="email" required placeholder={t.newsletterInput} className="flex-1 rounded-2xl border border-white/10 bg-black/35 px-5 py-4 text-white outline-none focus:border-cyan-300 placeholder:text-white/35" />
              <button type="submit" className="rounded-2xl bg-cyan-300 px-8 py-4 font-black text-black hover:scale-105 transition shadow-[0_0_40px_rgba(0,217,255,.35)]">
                <Editable path="newsletterBtn" langContext={lang} as="span" />
              </button>
            </form>
          </div>
        </section>
</>
  );
};

export default memo(Newsletter);
