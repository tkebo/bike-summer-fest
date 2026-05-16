import { memo } from "react";
import { useCMS } from "../hooks/useCMS";
import Editable from "./Editable";

const Footer = () => {
  const { t, lang, formData, handleChange, handleSubmit, requestTypes } = useCMS();
  return (
<>
        {/* FOOTER */}
        <footer id="contact" className="px-6 md:px-12 py-28 border-t border-white/10 bg-black/50">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <Editable path="footerLabel" langContext={lang} as="p" className="text-cyan-300 uppercase tracking-[0.4em] text-sm mb-5 font-black inline-block" />
              <Editable path="footerTitle" langContext={lang} as="h2" className="text-5xl md:text-7xl font-black uppercase leading-none" />
              <Editable path="footerText" langContext={lang} multiline as="p" className="text-white/60 max-w-2xl mt-6 leading-relaxed inline-block" />
              <div className="mt-8 border border-white/10 global-box">
                <p className="text-white/70">info@bikesummerfest.ge</p>
                <p className="text-white/70 mt-2">+995 555 123 456</p>
                <p className="text-white/45 mt-4">Anaklia / Ganmukhuri, Georgia</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="border border-white/10 md:p-8 global-box">
              <div className="grid gap-5">
                <label className="grid gap-2">
                  <span className="text-sm text-white/70 font-bold"><Editable path="form.name" langContext={lang} as="span" /></span>
                  <input name="name" value={formData.name} onChange={handleChange} required placeholder={t.form.placeholderName} className="w-full rounded-2xl border border-white/10 bg-black/35 px-5 py-4 text-white outline-none focus:border-cyan-300 placeholder:text-white/35" />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm text-white/70 font-bold"><Editable path="form.contact" langContext={lang} as="span" /></span>
                  <input name="contact" value={formData.contact} onChange={handleChange} required placeholder={t.form.placeholderContact} className="w-full rounded-2xl border border-white/10 bg-black/35 px-5 py-4 text-white outline-none focus:border-cyan-300 placeholder:text-white/35" />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm text-white/70 font-bold"><Editable path="form.type" langContext={lang} as="span" /></span>
                  <select name="type" value={formData.type} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-black/35 px-5 py-4 text-white outline-none focus:border-cyan-300">
                    {requestTypes.map((item) => <option key={item.value} value={item.value}>{t.form[item.value]}</option>)}
                  </select>
                </label>
                <label className="grid gap-2">
                  <span className="text-sm text-white/70 font-bold"><Editable path="form.message" langContext={lang} as="span" /></span>
                  <textarea name="message" value={formData.message} onChange={handleChange} rows="5" required placeholder={t.form.placeholderMessage} className="w-full rounded-2xl border border-white/10 bg-black/35 px-5 py-4 text-white outline-none focus:border-cyan-300 placeholder:text-white/35 resize-none" />
                </label>
                <button type="submit" className="mt-2 inline-flex justify-center rounded-2xl bg-orange-500 px-9 py-4 font-black hover:bg-orange-400 transition shadow-[0_0_40px_rgba(255,122,24,.4)]">
                  <Editable path="contact" langContext={lang} as="span" />
                </button>
              </div>
            </form>
          </div>
        </footer>
</>
  );
};

export default memo(Footer);
