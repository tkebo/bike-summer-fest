import { motion } from "framer-motion";

const HelmetPortal = ({ phase, visorText, onEnter, interactive, settings }) => (
  <motion.button
    type="button"
    onClick={interactive ? onEnter : undefined}
    className="relative grid h-[300px] w-[340px] place-items-center outline-none md:h-[360px] md:w-[430px]"
    animate={phase === "transition" ? { scale: 2.1, opacity: 0 } : { scale: [1, 1.018, 1], opacity: 1 }}
    transition={{ duration: phase === "transition" ? 0.8 : 4, ease: "easeInOut", repeat: phase === "transition" ? 0 : Infinity }}
  >
    <div className="absolute left-2 top-24 h-24 w-28 rotate-[-22deg] rounded-[60%] border border-white/10 bg-zinc-950/95 shadow-[inset_0_0_25px_rgba(255,255,255,.04)]" />
    <div className="absolute right-2 top-24 h-24 w-28 rotate-[22deg] rounded-[60%] border border-white/10 bg-zinc-950/95 shadow-[inset_0_0_25px_rgba(255,255,255,.04)]" />
    <div className="absolute inset-x-16 top-10 h-56 rounded-t-[150px] rounded-b-[78px] border border-white/10 bg-[linear-gradient(145deg,#141414,#020202_52%,#191919)] shadow-[0_0_90px_rgba(0,217,255,.16),inset_0_0_38px_rgba(255,255,255,.04)]" />
    <div className="absolute inset-x-20 top-12 h-52 rounded-t-[145px] rounded-b-[72px] opacity-50 [background:repeating-linear-gradient(112deg,rgba(255,255,255,.08)_0_1px,transparent_1px_14px)]" />
    <div className="absolute inset-x-24 top-16 h-16 rounded-t-[120px] border-t border-white/20 bg-white/[0.03]" />
    <div className="absolute inset-x-20 top-28 h-px bg-cyan-200/45" style={{ boxShadow: `0 0 ${24 + settings.glowStrength * 38}px rgba(0,217,255,.85)` }} />
    <div className="absolute left-16 top-44 h-14 w-3 rounded-full bg-cyan-300/65 shadow-[0_0_24px_rgba(0,217,255,.75)]" />
    <div className="absolute right-16 top-44 h-14 w-3 rounded-full bg-cyan-300/65 shadow-[0_0_24px_rgba(0,217,255,.75)]" />
    <div className={`helmet-visor absolute left-1/2 top-[126px] h-24 w-[250px] -translate-x-1/2 rounded-[48px] border border-cyan-100/35 bg-[linear-gradient(135deg,rgba(0,217,255,.28),rgba(255,255,255,.12),rgba(0,0,0,.72))] backdrop-blur-2xl transition duration-500 ${interactive ? "shadow-[0_0_80px_rgba(0,217,255,.38)]" : ""}`}>
      <span className="absolute inset-0 grid place-items-center text-sm font-black uppercase tracking-[0.34em] text-cyan-50 md:text-base">{visorText}</span>
    </div>
    <div className="absolute bottom-14 left-1/2 h-5 w-40 -translate-x-1/2 rounded-full bg-orange-500 shadow-[0_0_45px_rgba(249,115,22,.75)]" />
    <div className="absolute left-10 top-48 h-4 w-20 rotate-[34deg] rounded-full bg-zinc-900" />
    <div className="absolute right-10 top-48 h-4 w-20 rotate-[-34deg] rounded-full bg-zinc-900" />
    <div className="pointer-events-none absolute inset-x-12 top-12 h-48 rounded-[50%] opacity-35 [background:radial-gradient(circle_at_50%_35%,rgba(255,255,255,.32),transparent_54%)]" />
  </motion.button>
);

export default HelmetPortal;
