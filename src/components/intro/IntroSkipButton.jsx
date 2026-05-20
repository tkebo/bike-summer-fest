const IntroSkipButton = ({ onSkip, onToggleMute, muted, visible }) => {
  if (!visible) return null;
  return (
    <div className="fixed right-4 top-4 z-30 flex gap-2 md:right-8 md:top-8">
      <button type="button" aria-label={muted ? "Unmute intro sound" : "Mute intro sound"} onClick={onToggleMute} className="min-h-11 rounded-full border border-white/15 bg-black/45 px-4 py-2 text-xs font-black uppercase tracking-widest text-white/70 backdrop-blur-xl">
        {muted ? "Sound off" : "Sound on"}
      </button>
      <button type="button" aria-label="Skip intro" onClick={onSkip} className="min-h-11 rounded-full border border-cyan-300/25 bg-black/45 px-4 py-2 text-xs font-black uppercase tracking-widest text-cyan-100 backdrop-blur-xl">
        Skip intro
      </button>
    </div>
  );
};

export default IntroSkipButton;
