import { memo } from "react";
import { motion } from "framer-motion";
import { useCMS } from "../hooks/useCMS";
import Editable from "./Editable";
import Countdown from "./Countdown";
import AdminFrame from "./AdminFrame";

const Header = () => {
  const { ev, lang, setLang, navItems, menuOpen, setMenuOpen, closeMenu, introArrivalActive } = useCMS();
  return (
<>
          {/* HEADER */}
          <header 
            className="absolute left-0 right-0 z-40" 
            style={{ 
              top: `${ev("headerTop")}px`, 
              paddingLeft: "clamp(12px, 2vw, 32px)", 
              paddingRight: "clamp(12px, 2vw, 32px)" 
            }}
          >
            <div
              className="relative mx-auto bg-black/72 backdrop-blur-2xl transition-all"
              style={{
                width: ev("headerWidth") === 0 ? "auto" : `${ev("headerWidth")}px`,
                height: ev("headerHeight") === 0 ? "auto" : `${ev("headerHeight")}px`,
                maxWidth: ev("headerMaxWidth") === 0 ? "none" : `${ev("headerMaxWidth")}px`,
                paddingLeft: `${ev("headerPaddingX")}px`,
                paddingRight: `${ev("headerPaddingX")}px`,
                paddingTop: `${ev("headerPaddingY")}px`,
                paddingBottom: `${ev("headerPaddingY")}px`,
                borderRadius: `${ev("headerBorderRadius")}px`,
                backgroundColor: `rgba(0,0,0,${ev("headerBgOpacity") / 100})`,
                backdropFilter: `blur(${ev("headerBlur")}px)`,
                border: `1px solid rgba(0,217,255,${ev("headerBorderOpacity") / 100})`,
                boxShadow: `0 0 80px rgba(0,217,255,${ev("headerGlow") / 100})`,
              }}
            >
              <div className="flex items-start justify-between gap-6 h-full">
                <div className="flex-1 min-w-0">
                  <AdminFrame frameKey="logo" label="Logo" className="inline-block" resize={false}>
                  <div 
                    className={`font-black whitespace-nowrap inline-block ${introArrivalActive ? "intro-arrival-logo" : ""}`}
                    style={{ 
                      fontSize: `clamp(34px, 5vw, ${ev("logoFontSize")}px)`,
                      letterSpacing: `${ev("logoLetterSpacing")}em`, 
                      lineHeight: ev("logoLineHeight"),
                      transform: `translate(${ev("logoPosX")}px, ${ev("logoPosY")}px)`
                    }}
                  >
                    <Editable path="logo.part1" langContext={lang} fallback="BIKE" as="span" />{" "}
                    <Editable 
                      path="logo.part2" 
                      langContext={lang} 
                      fallback="SUMMER"
                      as="span" 
                      className="transition-colors"
                      style={{ 
                        color: ev("logoSummerColor"), 
                        textShadow: `0 0 ${ev("logoSummerGlow")}px ${ev("logoSummerColor")}` 
                      }} 
                    />{" "}
                    <Editable path="logo.part3" langContext={lang} fallback="FEST" as="span" />
                  </div>
                  </AdminFrame>

                  <div className="mt-4 flex items-center gap-10">
                    <div className="text-orange-500 font-black tracking-[0.45em] text-sm md:text-lg whitespace-nowrap">
                      — SINCE 2026 —
                    </div>

                    <nav className="hidden xl:flex text-base uppercase font-black" style={{ gap: `${ev("navGap")}px` }}>
                      {navItems.slice(0, 6).map((item) => (
                        <Editable 
                          key={item.href} 
                          path={item.path} 
                          langContext={lang} 
                          as="a" 
                          href={item.href} 
                          className="custom-nav-link flex items-center justify-center" 
                          style={{
                            width: ev("navWidth") === 0 ? "auto" : `${ev("navWidth")}px`,
                            height: ev("navHeight") === 0 ? "auto" : `${ev("navHeight")}px`,
                            padding: `${ev("navPaddingY")}px ${ev("navPaddingX")}px`,
                            borderRadius: `${ev("navBorderRadius")}px`,
                            fontSize: `${ev("navFontSize")}px`,
                            letterSpacing: `${ev("navLetterSpacing")}em`,
                            backgroundColor: `rgba(255,255,255,${ev("navBgOpacity") / 100})`,
                          }}
                        />
                      ))}
                    </nav>
                  </div>
                </div>

                <div className="hidden lg:flex items-center gap-5" style={{ paddingTop: ev("headerHeight") === 0 ? "70px" : "0", alignSelf: ev("headerHeight") === 0 ? "flex-start" : "center" }}>
                  <div
                    className="grid font-black"
                    style={{
                      gap: `${ev("langGap")}px`,
                      transform: `translate(${ev("langPosX")}px, ${ev("langPosY")}px) scale(${ev("langScale")})`,
                      transformOrigin: "center",
                    }}
                  >
                    {[
                      ["ka", "KA"],
                      ["en", "EN"],
                    ].map(([code, label]) => (
                      <button
                        key={code}
                        onClick={() => setLang(code)}
                        className={lang === code ? "lang-btn-active" : "lang-btn-inactive"}
                        style={{
                          width: ev("langWidth") === 0 ? "auto" : `${ev("langWidth")}px`,
                          height: ev("langHeight") === 0 ? "auto" : `${ev("langHeight")}px`,
                          padding: `${ev("langPaddingY")}px ${ev("langPaddingX")}px`,
                          fontSize: `${ev("langFontSize")}px`,
                          letterSpacing: `${ev("langLetterSpacing")}em`,
                          lineHeight: ev("langLineHeight"),
                          borderRadius: `${ev("langBorderRadius")}px`,
                          backgroundColor: `rgba(255,255,255,${(lang === code ? ev("langActiveBgOpacity") : ev("langBgOpacity")) / 100})`,
                          border: `1px solid rgba(255,255,255,${ev("langBorderOpacity") / 100})`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <Editable 
                    path="nav.tickets" 
                    langContext={lang} 
                    as="a" 
                    href="#tickets" 
                    className="font-black text-white transition hover:scale-105" 
                    style={{
                      width: ev("ticketBtnWidth") === 0 ? "auto" : `${ev("ticketBtnWidth")}px`,
                      height: ev("ticketBtnHeight") === 0 ? "auto" : `${ev("ticketBtnHeight")}px`,
                      padding: `${ev("ticketBtnPaddingY")}px ${ev("ticketBtnPaddingX")}px`,
                      fontSize: `${ev("ticketBtnFontSize")}px`,
                      borderRadius: `${ev("ticketBtnBorderRadius")}px`,
                      backgroundColor: ev("ticketBtnBgColor"),
                      boxShadow: `0 0 ${ev("ticketBtnGlow")}px ${ev("ticketBtnBgColor")}80`,
                      transform: `translate(${ev("ticketBtnPosX")}px, ${ev("ticketBtnPosY")}px)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center"
                    }}
                  />
                </div>

                <button onClick={() => setMenuOpen(!menuOpen)} className="xl:hidden w-12 h-12 rounded-2xl border border-white/10 bg-white/10 text-white font-black text-xl">
                  {menuOpen ? "✕" : "☰"}
                </button>
              </div>

              <Countdown />
            </div>

            {menuOpen && (
              <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} className="xl:hidden max-w-[1680px] mx-auto mt-3 rounded-3xl border border-white/10 bg-black/85 backdrop-blur-2xl p-5 z-50 relative">
                <div className="grid gap-3">
                  {navItems.map((item) => (
                    <Editable key={item.href} path={item.path} langContext={lang} as="a" href={item.href} onClick={closeMenu} className="block rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-black uppercase tracking-widest hover:bg-white/10" />
                  ))}
                </div>
              </motion.div>
            )}
          </header>
</>
  );
};

export default memo(Header);
