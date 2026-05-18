import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import IntroScene from "./IntroScene";
import IntroSkipButton from "./IntroSkipButton";
import { IntroAudioManager } from "./IntroAudioManager";
import { INTRO_ARRIVAL_EVENT, INTRO_REPLAY_EVENT } from "./introEvents";

const INTRO_KEY = "bikefest_intro_seen";
const LEGACY_INTRO_KEY = "bsf_intro_seen";

const readSeen = () => localStorage.getItem(INTRO_KEY) === "true" || localStorage.getItem(LEGACY_INTRO_KEY) === "true";

const presetTimings = {
  short: [350, 850],
  cinematic: [900, 2300],
  ultra: [1200, 3200],
};

const IntroManager = ({ settings, audioSettings, lang, onComplete }) => {
  const [phase, setPhase] = useState("dark");
  const [visible, setVisible] = useState(() => settings.enabled !== false && !readSeen());
  const [muted, setMuted] = useState(false);
  const audio = useRef(null);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const weakDevice = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) || (navigator.deviceMemory && navigator.deviceMemory <= 4);
  const liteMode = reducedMotion || settings.introMode === "lite" || (settings.mobileLiteMode && window.matchMedia("(max-width: 767px)").matches);
  const quality = liteMode ? "ultra-lite" : weakDevice ? "safe" : "full";
  const visorText = lang === "ka" ? settings.visorTextKa : settings.visorTextEn;
  const timings = useMemo(() => liteMode ? [300, 700] : presetTimings[settings.durationPreset], [liteMode, settings.durationPreset]);

  useEffect(() => {
    audio.current = new IntroAudioManager(audioSettings);
    return () => audio.current?.destroy();
  }, [audioSettings]);

  useEffect(() => {
    const replay = () => {
      if (settings.replayEnabled === false) return;
      localStorage.removeItem(INTRO_KEY);
      setVisible(true);
      setPhase("dark");
    };
    window.addEventListener(INTRO_REPLAY_EVENT, replay);
    return () => window.removeEventListener(INTRO_REPLAY_EVENT, replay);
  }, [settings.replayEnabled]);

  const finish = useCallback(() => {
    localStorage.setItem(INTRO_KEY, "true");
    localStorage.setItem(LEGACY_INTRO_KEY, "true");
    setPhase("arrival");
    window.dispatchEvent(new Event(INTRO_ARRIVAL_EVENT));
    window.setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 650);
  }, [onComplete]);

  useEffect(() => {
    if (!visible) return undefined;
    const awakening = window.setTimeout(() => {
      setPhase("awakening");
      if (!liteMode) {
        audio.current?.ambienceBed();
        audio.current?.engineWake();
        audio.current?.metallicHit();
      }
    }, timings[0]);
    const portal = window.setTimeout(() => setPhase("portal"), timings[1]);
    const autoSkip = window.setTimeout(() => finish(), settings.autoSkipAfterMs);
    return () => {
      window.clearTimeout(awakening);
      window.clearTimeout(portal);
      window.clearTimeout(autoSkip);
    };
  }, [finish, liteMode, settings.autoSkipAfterMs, timings, visible]);

  const enterPortal = async () => {
    if (phase !== "portal") return;
    await audio.current?.bassImpact();
    await audio.current?.transitionSweep();
    await audio.current?.stinger();
    setPhase("transition");
    window.setTimeout(finish, liteMode ? 520 : 1050 / settings.transitionSpeed);
  };

  if (!visible || settings.enabled === false) return null;

  return (
    <>
      <IntroScene
        phase={phase}
        liteMode={liteMode}
        quality={quality}
        settings={settings}
        visorText={visorText}
        onEnter={enterPortal}
        onEasterEgg={() => audio.current?.easterEggRoar()}
      />
      <IntroSkipButton
        visible={settings.skipEnabled !== false}
        muted={muted}
        onSkip={finish}
        onToggleMute={() => {
          const nextMuted = !muted;
          setMuted(nextMuted);
          audio.current?.setMuted(nextMuted);
        }}
      />
    </>
  );
};

export default IntroManager;
