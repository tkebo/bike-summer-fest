import { memo } from "react";
import { useCMS } from "../hooks/useCMS";
import AdminFrame from "./AdminFrame";

const Countdown = () => {
  const { ev, timeLeft, countdownLabels, countdownFinished, eventSettings, lang, introArrivalActive } = useCMS();
  if (eventSettings.countdown.enabled === false) return null;
  const finishedMessage = lang === "ka" ? eventSettings.countdown.finishedMessageKa : eventSettings.countdown.finishedMessageEn;
  return (
<>
              {/* COUNTDOWN */}
              <AdminFrame
                frameKey="countdown"
                label="Countdown"
                className={`cinematic-countdown absolute backdrop-blur-2xl flex items-center justify-center ${introArrivalActive ? "intro-arrival-countdown" : ""}`}
                style={{ 
                  left: `${ev("countdownLeftPercent")}%`,
                  top: ev("countdownTop") >= 0 ? `${ev("countdownTop")}px` : "auto",
                  bottom: ev("countdownTop") >= 0 ? "auto" : `${ev("countdownBottom")}px`,
                  zIndex: ev("countdownZIndex"),
                  transform: `translate(${ev("countdownTranslateX")}%, 0) scale(${ev("countdownScale")})`,
                  width: ev("countdownWidth") === 0 ? "auto" : `min(100%, ${ev("countdownWidth")}px)`, 
                  height: ev("countdownHeight") === 0 ? "auto" : `${ev("countdownHeight")}px`,
                  padding: `${ev("countdownPadding")}px`,
                  borderRadius: `${ev("countdownBorderRadius")}px`,
                  background: `linear-gradient(135deg, rgba(2,6,18,${ev("countdownBgOpacity") / 100}), rgba(0,217,255,0.08), rgba(255,122,24,0.055))`,
                  boxShadow: `0 0 85px rgba(0,217,255,${ev("countdownGlow") / 100})`,
                  border: "1px solid rgba(0,217,255,0.38)",
                  transformOrigin: "center"
                }}
              >
                {countdownFinished ? (
                  <div className="px-6 py-4 text-center font-black text-cyan-300">{finishedMessage}</div>
                ) : (
                <div className="cinematic-countdown-grid flex justify-center" style={{ gap: `${ev("countdownGap")}px` }}>
                  {[
                    { value: timeLeft.days, label: countdownLabels.days },
                    { value: timeLeft.hours, label: countdownLabels.hours },
                    { value: timeLeft.minutes, label: countdownLabels.minutes },
                    { value: timeLeft.seconds, label: countdownLabels.seconds }
                  ].map((item) => (
                    <div 
                      key={item.label} 
                      className="cinematic-countdown-cell text-center"
                      style={{
                        width: ev("countdownItemWidth") === 0 ? "auto" : `${ev("countdownItemWidth")}px`,
                        padding: `${ev("countdownItemPaddingY")}px ${ev("countdownItemPaddingX")}px`,
                      }}
                    >
                      <div 
                        className="cinematic-countdown-digit font-black text-cyan-300 drop-shadow-[0_0_28px_rgba(0,217,255,.95)]" 
                        style={{ 
                          fontSize: `clamp(${ev("countdownNumberMinSize")}px, 4vw, ${ev("countdownNumberSize")}px)`,
                          lineHeight: ev("countdownNumberLineHeight"),
                        }}
                      >
                        {item.value}
                      </div>
                      <div 
                        className="font-black countdown-label" 
                        style={{ 
                          color: ev("countdownLabelColor"),
                          fontSize: `${ev("countdownLabelSize")}px`,
                          marginTop: `${ev("countdownLabelMarginTop")}px`,
                          letterSpacing: `${ev("countdownLabelLetterSpacing")}em`,
                        }}
                      >
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
                )}
              </AdminFrame>
</>
  );
};

export default memo(Countdown);
