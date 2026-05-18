import { useEffect, useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import HelmetPortal from "./HelmetPortal";
import IntroEffects from "./IntroEffects";
import PortalTransition from "./PortalTransition";

const IntroScene = ({ phase, liteMode, quality, settings, visorText, onEnter, onEasterEgg }) => {
  const logoRef = useRef(null);
  const worldRef = useRef(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      gsap.fromTo(logoRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" });
      if (!liteMode) {
        gsap.to(worldRef.current, {
          xPercent: settings.cameraMotionAmount * 0.8,
          yPercent: settings.cameraMotionAmount * -0.45,
          scale: 1 + settings.cinematicIntensity * 0.035,
          duration: 7,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    }, worldRef);
    return () => context.revert();
  }, [liteMode, settings.cameraMotionAmount, settings.cinematicIntensity]);

  useEffect(() => {
    if (phase !== "awakening" || !worldRef.current || liteMode) return undefined;
    const animation = gsap.to(worldRef.current, { x: 2, y: -1, duration: 0.06, repeat: 5, yoyo: true });
    return () => animation.kill();
  }, [liteMode, phase]);

  return (
    <motion.div
      ref={worldRef}
      className="fixed inset-0 z-[10000] overflow-hidden bg-black text-white"
      animate={phase === "arrival" ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <style>{`
        .intro-floor { background: linear-gradient(180deg, transparent, rgba(0,0,0,.2), rgba(0,0,0,.95)), radial-gradient(circle at 50% 10%, rgba(0,217,255,.18), transparent 55%); transform: perspective(700px) rotateX(72deg); }
        .intro-reflection { background: radial-gradient(circle, rgba(0,217,255,.22), rgba(255,122,24,.08), transparent 70%); animation: introReflection 4s ease-in-out infinite alternate; }
        .intro-smoke { filter: blur(42px); animation: introSmoke 8s ease-in-out infinite alternate; }
        .intro-smoke-a { background: radial-gradient(circle at 30% 40%, rgba(255,255,255,.14), transparent 28%), radial-gradient(circle at 70% 55%, rgba(255,255,255,.08), transparent 32%); }
        .intro-smoke-b { background: radial-gradient(circle at 60% 30%, rgba(0,217,255,.14), transparent 26%), radial-gradient(circle at 40% 70%, rgba(255,122,24,.08), transparent 30%); animation-duration: 11s; }
        .intro-light-streak { background: linear-gradient(110deg, transparent 24%, rgba(255,255,255,.09) 42%, transparent 58%); animation: introStreak 5s ease-in-out infinite; }
        .intro-rain { background-image: linear-gradient(115deg, transparent 0 48%, rgba(255,255,255,.12) 49%, transparent 50%); background-size: 22px 22px; opacity: .18; animation: introRain .55s linear infinite; }
        .intro-grain { background-image: radial-gradient(rgba(255,255,255,.22) 1px, transparent 1px); background-size: 4px 4px; mix-blend-mode: soft-light; }
        .intro-particle { animation-name: introParticle; animation-iteration-count: infinite; animation-timing-function: linear; }
        .intro-tunnel { background: repeating-radial-gradient(circle at center, rgba(255,255,255,.8) 0 2px, rgba(0,217,255,.18) 3px 18px, transparent 19px 42px); animation: introTunnel .3s linear infinite; filter: blur(2px); }
        .intro-speed-lines { background: conic-gradient(from 0deg at center, transparent, rgba(255,255,255,.6), transparent 8%, transparent 50%, rgba(0,217,255,.5), transparent 58%); animation: introSpin .22s linear infinite; }
        @keyframes introSmoke { to { transform: translate3d(4%, -2%, 0) scale(1.08); } }
        @keyframes introReflection { to { transform: translateX(-50%) scaleX(1.12); opacity: .9; } }
        @keyframes introStreak { 50% { transform: translateX(12%); opacity: .75; } }
        @keyframes introRain { to { transform: translate3d(-22px,22px,0); } }
        @keyframes introParticle { from { transform: translate3d(0,0,0); opacity: 0; } 15% { opacity: 1; } to { transform: translate3d(0,-110vh,0); opacity: 0; } }
        @keyframes introTunnel { to { transform: scale(1.14) rotate(2deg); } }
        @keyframes introSpin { to { transform: rotate(360deg) scale(1.08); } }
      `}</style>
      <IntroEffects phase={phase} liteMode={liteMode} quality={quality} settings={settings} />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.div
          ref={logoRef}
          onDoubleClick={onEasterEgg}
          className="mb-8 cursor-default text-sm font-black uppercase tracking-[0.55em] text-white/55 md:text-base"
          animate={phase === "awakening" ? { opacity: [0.65, 1, 0.72], textShadow: ["0 0 0 rgba(0,217,255,0)", "0 0 28px rgba(0,217,255,.8)", "0 0 0 rgba(0,217,255,0)"] } : {}}
          transition={{ duration: 1.2, repeat: phase === "awakening" ? Infinity : 0 }}
        >
          Bike Summer Fest 2026
        </motion.div>
        <HelmetPortal phase={phase} visorText={visorText} onEnter={onEnter} interactive={phase === "portal"} settings={settings} />
        <motion.div
          className="mt-8 max-w-xl text-xs font-black uppercase tracking-[0.42em] text-white/45 md:text-sm"
          animate={{ opacity: phase === "portal" ? 1 : 0.5 }}
        >
          {phase === "dark" && "Sea wind. Distant engine."}
          {phase === "awakening" && "Engine awakening"}
          {phase === "portal" && "Touch the visor"}
          {phase === "transition" && "Ride through"}
        </motion.div>
      </div>
      <PortalTransition active={phase === "transition"} transitionSpeed={settings.transitionSpeed} liteMode={liteMode} />
    </motion.div>
  );
};

export default IntroScene;
