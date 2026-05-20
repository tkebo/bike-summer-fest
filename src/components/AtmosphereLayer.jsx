import { memo, useEffect, useMemo, useRef } from "react";

const modeMultipliers = {
  subtle: 0.55,
  balanced: 1,
  ultra: 1.35,
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const AtmosphereLayer = ({ editor }) => {
  const layerRef = useRef(null);
  const modeMultiplier = modeMultipliers[editor.atmosphereMode] || modeMultipliers.balanced;
  const style = useMemo(() => ({
    "--atmosphere-particles": clamp((editor.atmosphereParticleDensity / 100) * modeMultiplier, 0, 1.6),
    "--atmosphere-lasers": clamp((editor.atmosphereLaserIntensity / 100) * modeMultiplier, 0, 1.6),
    "--atmosphere-opacity": clamp((editor.atmosphereOpacity / 100) * modeMultiplier, 0, 1.4),
    "--atmosphere-glow": clamp((editor.atmosphereGlobalGlow / 100) * modeMultiplier, 0, 1.6),
    "--atmosphere-grain": clamp(editor.atmosphereGrainStrength / 100, 0, 1),
    "--atmosphere-fog": clamp((editor.atmosphereFogIntensity / 100) * modeMultiplier, 0, 1.5),
    "--atmosphere-parallax": clamp(editor.atmosphereParallaxAmount / 100, 0, 1),
    "--atmosphere-speed": clamp(editor.atmosphereTransitionSpeed || 1, 0.2, 3),
    "--atmosphere-mouse-x": "0px",
    "--atmosphere-mouse-y": "0px",
  }), [editor, modeMultiplier]);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return undefined;

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
  }, []);

  return (
    <div ref={layerRef} className="festival-atmosphere pointer-events-none fixed inset-0 z-[25]" style={style} aria-hidden="true">
      <div className="festival-atmosphere-fog" />
      <div className="festival-atmosphere-particles" />
      <div className="festival-atmosphere-embers" />
      <div className="festival-atmosphere-lasers" />
      <div className="festival-atmosphere-pulses" />
      <div className="festival-atmosphere-vignette" />
      <div className="festival-atmosphere-grain" />
    </div>
  );
};

export default memo(AtmosphereLayer);
