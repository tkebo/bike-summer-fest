import { memo, useState } from "react";
import { useCMS } from "../hooks/useCMS";
import { getOptimizedImageUrl } from "../lib/cloudinary";

const INTRO_KEY = "bsf_intro_seen";

const IntroPortal = () => {
  const [visible, setVisible] = useState(() => localStorage.getItem(INTRO_KEY) !== "true");
  const [opening, setOpening] = useState(false);
  const { cmsData, isConfiguredImageActive } = useCMS();
  const introImage = isConfiguredImageActive(cmsData.config.introImage) ? getOptimizedImageUrl(cmsData.config.introImage, 640) : "";

  const enter = () => {
    setOpening(true);
    localStorage.setItem(INTRO_KEY, "true");
    window.setTimeout(() => setVisible(false), 900);
  };

  if (!visible) return null;

  return (
    <div className={`fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden bg-black transition-all duration-700 ${opening ? "scale-125 opacity-0 pointer-events-none" : "scale-100 opacity-100"}`}>
      <style>{`
        @keyframes helmetFloat { 50% { transform: translateY(-14px); } }
        @keyframes portalPulse { 50% { opacity: .95; transform: scale(1.16); } }
        @keyframes neonPulse { 50% { box-shadow: 0 0 110px rgba(0,217,255,.5); } }
      `}</style>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,217,255,.22),transparent_34%),linear-gradient(135deg,#02040a,#08101f_55%,#000)]" />
      <div className="absolute h-[42rem] w-[42rem] rounded-full border border-cyan-300/15 opacity-60" style={{ animation: "portalPulse 3.5s ease-in-out infinite" }} />
      <div className="relative flex flex-col items-center text-center">
        {introImage && <img src={introImage} alt="" className="mb-6 h-28 w-28 rounded-full border border-cyan-300/30 object-cover shadow-[0_0_45px_rgba(0,217,255,.35)]" />}
        <div className="relative h-52 w-64 md:h-64 md:w-80" style={{ animation: "helmetFloat 3s ease-in-out infinite" }}>
          <div className="absolute inset-x-8 top-4 h-48 rounded-t-[110px] rounded-b-[58px] border border-cyan-300/40 bg-zinc-950 shadow-[0_0_80px_rgba(0,217,255,.25)]" style={{ animation: "neonPulse 2.4s ease-in-out infinite" }} />
          <div className={`absolute left-1/2 top-20 h-24 w-52 -translate-x-1/2 rounded-[44px] border border-cyan-200/40 bg-cyan-300/20 backdrop-blur-xl transition-transform duration-700 ${opening ? "-translate-y-16 scale-y-0" : "translate-y-0 scale-y-100"}`} />
          <div className="absolute bottom-8 left-1/2 h-5 w-32 -translate-x-1/2 rounded-full bg-orange-500 shadow-[0_0_35px_rgba(249,115,22,.8)]" />
        </div>
        <div className="mt-8 text-3xl font-black uppercase tracking-[0.35em] text-white md:text-5xl">Bike Summer Fest</div>
        <button onClick={enter} className="mt-8 rounded-2xl bg-cyan-300 px-8 py-4 font-black text-black shadow-[0_0_45px_rgba(0,217,255,.45)] transition hover:scale-105">Enter</button>
        <button onClick={enter} className="mt-4 text-sm font-black uppercase tracking-widest text-white/50 hover:text-white">Skip intro</button>
      </div>
    </div>
  );
};

export default memo(IntroPortal);
