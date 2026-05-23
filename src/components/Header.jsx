import { memo } from "react";
import { motion } from "framer-motion";
import { useCMS } from "../hooks/useCMS";
import Editable from "./Editable";
import Countdown from "./Countdown";
import AdminFrame from "./AdminFrame";

const Header = () => {
  const { ev, lang, setLang, navItems, menuOpen, setMenuOpen, closeMenu, introArrivalActive } = useCMS();
  const languageOptions = [
    ["ka", "KA"],
    ["en", "EN"],
  ];
  return (
<>
          {/* HEADER */}
          <header 
            className="compactHeader absolute left-0 right-0 z-40" 
            style={{ 
              top: `${ev("headerTop")}px`, 
              paddingLeft: "clamp(12px, 2vw, 32px)", 
              paddingRight: "clamp(12px, 2vw, 32px)" 
            }}
          >
            <div
              className="compactHeaderBox site-header-shell relative mx-auto bg-black/72 backdrop-blur-2xl transition-all"
              style={{
                width: ev("headerWidth") === 0 ? "auto" : `min(100%, ${ev("headerWidth")}px)`,
                height: ev("headerHeight") === 0 ? "auto" : `${ev("headerHeight")}px`,
                maxWidth: ev("headerMaxWidth") === 0 ? "100%" : `min(100%, ${ev("headerMaxWidth")}px)`,
                paddingLeft: `clamp(14px, 3vw, ${ev("headerPaddingX")}px)`,
                paddingRight: `clamp(14px, 3vw, ${ev("headerPaddingX")}px)`,
                paddingTop: `clamp(12px, 2vw, ${ev("headerPaddingY")}px)`,
                paddingBottom: `clamp(12px, 2vw, ${ev("headerPaddingY")}px)`,
                borderRadius: `clamp(18px, 4vw, ${ev("headerBorderRadius")}px)`,
                backgroundColor: `rgba(0,0,0,${ev("headerBgOpacity") / 100})`,
                backdropFilter: `blur(${ev("headerBlur")}px)`,
                border: `1px solid rgba(0,217,255,${ev("headerBorderOpacity") / 100})`,
                boxShadow: `0 0 80px rgba(0,217,255,${ev("headerGlow") / 100})`,
              }}
            >
              <div className="compactLogoRow flex items-start justify-between gap-6 h-full">
                <div className="min-w-0 flex-1 overflow-hidden">
                  <AdminFrame frameKey="logo" label="Logo" className="inline-block" resize={false}>
                  <div 
                    className={`compactLogo site-logo-wordmark font-black inline-block ${introArrivalActive ? "intro-arrival-logo" : ""}`}
                    style={{ 
                      fontSize: `clamp(24px, 5vw, ${ev("logoFontSize")}px)`,
                      letterSpacing: `clamp(0.02em, 0.8vw, ${ev("logoLetterSpacing")}em)`, 
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
                    <div
                      className="text-orange-500 font-black tracking-[0.45em] text-sm md:text-lg whitespace-nowrap"
                      style={{ transform: `translate(${ev("logoSincePosX")}px, ${ev("logoSincePosY")}px)` }}
                    >
                      — SINCE 2026 —
                    </div>

                    <nav
                      className="hidden xl:flex flex-wrap text-base uppercase font-black"
                      style={{
                        gap: `${ev("navGap")}px`,
                        rowGap: "12px",
                        transform: `translate(${ev("navPosX")}px, ${ev("navPosY")}px)`,
                      }}
                    >
                      {navItems.map((item) => (
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

                <div className="hidden xl:flex items-center gap-5" style={{ paddingTop: ev("headerHeight") === 0 ? "70px" : "0", alignSelf: ev("headerHeight") === 0 ? "flex-start" : "center" }}>
                  <div
                    className="grid font-black"
                    style={{
                      gap: `${ev("langGap")}px`,
                      transform: `translate(${ev("langPosX")}px, ${ev("langPosY")}px) scale(${ev("langScale")})`,
                      transformOrigin: "center",
                    }}
                  >
                    {languageOptions.map(([code, label]) => (
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

                <button onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close menu" : "Open menu"} className="burgerButton xl:hidden min-h-12 min-w-12 rounded-2xl border border-white/10 bg-white/10 text-white font-black text-xl">
                  {menuOpen ? "✕" : "☰"}
                </button>
              </div>

              <div className="compactCountdownWrap">
                <Countdown />
              </div>
            </div>

            {menuOpen && (
              <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} className="mobile-menu-panel xl:hidden max-w-[1680px] mx-auto mt-3 rounded-3xl border border-white/10 bg-black/85 backdrop-blur-2xl p-5 z-50 relative">
                <div className="mb-4 grid grid-cols-2 gap-3 lg:hidden">
                  {languageOptions.map(([code, label]) => (
                    <button
                      key={code}
                      onClick={() => setLang(code)}
                      className={`min-h-11 rounded-2xl border px-4 py-3 text-sm font-black ${lang === code ? "border-cyan-300 bg-cyan-300 text-black" : "border-white/10 bg-white/5 text-white"}`}
                    >
                      {label}
                    </button>
                  ))}
                  <Editable path="nav.tickets" langContext={lang} as="a" href="#tickets" onClick={closeMenu} className="col-span-2 flex min-h-11 items-center justify-center rounded-2xl bg-orange-500 px-4 py-3 text-sm font-black text-white" />
                </div>
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
