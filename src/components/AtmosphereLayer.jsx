import { memo, useEffect, useMemo, useRef } from "react";

const modeMultipliers = {
  subtle: 0.55,
  balanced: 1,
  ultra: 1.35,
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const AtmosphereLayer = ({ editor }) => {
  const layerRef = useRef(null);
  const reducedMotion = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const mobileViewport = typeof window !== "undefined" && window.matchMedia?.("(max-width: 767px)").matches;
  const modeMultiplier = modeMultipliers[editor.atmosphereMode] || modeMultipliers.balanced;
  const mobileMultiplier = mobileViewport ? 0.45 : 1;
  const style = useMemo(() => ({
    "--atmosphere-particles": reducedMotion ? 0 : clamp((editor.atmosphereParticleDensity / 100) * modeMultiplier * mobileMultiplier, 0, 1.6),
    "--atmosphere-lasers": reducedMotion ? 0 : clamp((editor.atmosphereLaserIntensity / 100) * modeMultiplier * mobileMultiplier, 0, 1.6),
    "--atmosphere-opacity": reducedMotion ? 0.25 : clamp((editor.atmosphereOpacity / 100) * modeMultiplier * mobileMultiplier, 0, 1.4),
    "--atmosphere-glow": reducedMotion ? 0.2 : clamp((editor.atmosphereGlobalGlow / 100) * modeMultiplier * mobileMultiplier, 0, 1.6),
    "--atmosphere-grain": mobileViewport ? 0 : clamp(editor.atmosphereGrainStrength / 100, 0, 1),
    "--atmosphere-fog": reducedMotion ? 0.1 : clamp((editor.atmosphereFogIntensity / 100) * modeMultiplier * mobileMultiplier, 0, 1.5),
    "--atmosphere-parallax": reducedMotion || mobileViewport ? 0 : clamp(editor.atmosphereParallaxAmount / 100, 0, 1),
    "--atmosphere-speed": clamp(editor.atmosphereTransitionSpeed || 1, 0.2, 3),
    "--atmosphere-mouse-x": "0px",
    "--atmosphere-mouse-y": "0px",
  }), [editor, mobileMultiplier, mobileViewport, modeMultiplier, reducedMotion]);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || reducedMotion || mobileViewport) return undefined;

    let frame = 0;
    const handlePointerMove = (event) => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const x = (event.clientX / window.innerWidth - 0.5) * 24;
        const y = (event.clientY / window.innerHeight - 0.5) * 24;
        layer.style.setProperty("--atmosphere-mouse-x", `${x}px`);
        layer.style.setProperty("--atmosphere-mouse-y", `${y}px`);
      });
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [mobileViewport, reducedMotion]);

  return (
    <div ref={layerRef} className="festival-atmosphere pointer-events-none fixed inset-0 z-[25]" style={style} aria-hidden="true">
      <div className="festival-atmosphere-fog" />
      <div className="festival-atmosphere-particles" />
      {!mobileViewport && !reducedMotion && <div className="festival-atmosphere-embers" />}
      {!reducedMotion && <div className="festival-atmosphere-lasers" />}
      {!mobileViewport && !reducedMotion && <div className="festival-atmosphere-pulses" />}
      <div className="festival-atmosphere-vignette" />
      {!mobileViewport && <div className="festival-atmosphere-grain" />}
    </div>
  );
};

export default memo(AtmosphereLayer);
