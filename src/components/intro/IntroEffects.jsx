const baseParticles = Array.from({ length: 42 }, (_, index) => ({
  id: index,
  left: `${5 + ((index * 19) % 90)}%`,
  delay: `${(index % 9) * 0.12}s`,
  duration: `${1.9 + (index % 7) * 0.28}s`,
}));

const IntroEffects = ({ phase, liteMode, quality, settings }) => {
  const particleCount = liteMode ? 0 : Math.max(8, Math.round(baseParticles.length * settings.particleDensity * (quality === "safe" ? 0.55 : 1)));
  const particles = baseParticles.slice(0, particleCount);
  const blur = quality === "full" ? 34 : 16;

  return (
    <>
      <div className="absolute inset-0 opacity-80 [background:radial-gradient(circle_at_center,rgba(0,217,255,.2),transparent_34%),linear-gradient(180deg,#000,#050814_55%,#000)]" />
      <div className="intro-floor absolute bottom-[-18%] left-[-10%] right-[-10%] h-[42%]" />
      <div className="intro-reflection absolute bottom-[-8%] left-1/2 h-[34%] w-[52%] -translate-x-1/2 rounded-[50%]" style={{ filter: `blur(${blur}px)` }} />
      <div className="intro-smoke intro-smoke-a absolute inset-[-20%]" style={{ opacity: 0.22 + settings.fogDensity * 0.36 }} />
      <div className="intro-smoke intro-smoke-b absolute inset-[-24%]" style={{ opacity: 0.1 + settings.fogDensity * 0.28 }} />
      <div className="intro-light-streak absolute inset-0 opacity-55" />
      {!liteMode && <div className="intro-rain absolute inset-0" />}
      <div className="intro-grain absolute inset-0 opacity-20" />
      {!liteMode && (
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((particle) => (
            <span
              key={particle.id}
              className={`intro-particle absolute bottom-[-10%] h-1 w-1 rounded-full ${phase === "portal" || phase === "transition" ? "bg-orange-300" : "bg-cyan-200"}`}
              style={{
                left: particle.left,
                animationDelay: particle.delay,
                animationDuration: particle.duration,
              }}
            />
          ))}
        </div>
      )}
      <div className={`absolute inset-0 transition-opacity duration-500 ${phase === "transition" ? "opacity-100" : "opacity-0"}`}>
        <div className="intro-tunnel absolute inset-[-20%]" />
        {!liteMode && <div className="intro-speed-lines absolute inset-[-10%]" />}
      </div>
    </>
  );
};

export default IntroEffects;
