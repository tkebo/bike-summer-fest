export const defaultEditor = {
    // Header
    headerWidth: 1680, headerHeight: 0, headerPaddingX: 32, headerPaddingY: 16, 
    headerMaxWidth: 1680, headerBorderRadius: 32, headerBgOpacity: 72, headerBlur: 24, 
    headerBorderOpacity: 20, headerGlow: 16, headerTop: 10,
    
    // Logo
    logoFontSize: 86, logoLetterSpacing: 0.22, logoLineHeight: 1, 
    logoPosX: 0, logoPosY: 0, logoSummerColor: "#67e8f9", logoSummerGlow: 28,
    // (Legacy support)
    logoSize: 86, logoSpacing: 0.22,
    
    // Nav
    navWidth: 0, navHeight: 0, navPaddingX: 0, navPaddingY: 0, navGap: 48, 
    navBorderRadius: 0, navFontSize: 16, navLetterSpacing: 0.1, navBgOpacity: 0, 
    navHoverColor: "#67e8f9", navActiveColor: "#ffffff",
    langActiveColor: "#ffffff", langInactiveColor: "#94a3b8",

    // Language Switcher
    langWidth: 0, langHeight: 0, langPaddingX: 0, langPaddingY: 0, langGap: 4,
    langFontSize: 18, langLetterSpacing: 0, langLineHeight: 1.2, langBorderRadius: 0,
    langBgOpacity: 0, langActiveBgOpacity: 0, langBorderOpacity: 0,
    langPosX: 0, langPosY: 0, langScale: 1,
    
    // Ticket Button
    ticketBtnWidth: 0, ticketBtnHeight: 0, ticketBtnPaddingX: 32, ticketBtnPaddingY: 16, 
    ticketBtnFontSize: 16, ticketBtnBorderRadius: 12, ticketBtnBgColor: "#f97316", 
    ticketBtnGlow: 35, ticketBtnPosX: 0, ticketBtnPosY: 0,
    // (Legacy support)
    buttonPaddingX: 32, buttonPaddingY: 16, buttonFontSize: 16,
    
    // Countdown
    countdownWidth: 820, countdownHeight: 0, countdownPadding: 20, countdownBottom: -82, 
    countdownBorderRadius: 44, countdownBgOpacity: 76, countdownGlow: 20, 
    countdownNumberSize: 60, countdownLabelSize: 16, countdownLabelColor: "#ffffff", countdownGap: 28,
    countdownScale: 1, countdownPosX: 0, countdownPosY: 0,
    countdownLeftPercent: 50, countdownTranslateX: -50, countdownTop: -1, countdownZIndex: 20,
    countdownItemWidth: 0, countdownItemPaddingX: 0, countdownItemPaddingY: 0,
    countdownNumberMinSize: 24, countdownNumberLineHeight: 1,
    countdownLabelMarginTop: 8, countdownLabelLetterSpacing: 0.08,
    
    // Hero Text
    heroTop: 300, heroTitleSize: 112, heroTitleLineHeight: 0.86, heroTitleLetterSpacing: 0, 
    heroTitlePosX: 0, heroTitlePosY: 0, heroSubtitleSize: 20, heroCtaBtnGap: 32,
    heroOverlayOpacity: 25,
    heroContentPosX: 0, heroContentPosY: 0, heroContentWidth: 720, heroContentHeight: 0,
    heroCtaPosX: 0, heroCtaPosY: 0, heroCtaWidth: 0, heroCtaHeight: 0,

    // Theme
    accentCyanColor: "#67e8f9", accentOrangeColor: "#f97316", globalFontScale: 1,
    pageBgColor: "#050814", overlayBgColor: "#000000", buttonTextColor: "#ffffff",
    glowCyanColor: "#67e8f9", glowOrangeColor: "#f97316",

    // Global Box
    boxWidth: 0, boxHeight: 0, boxPadding: 32, boxMargin: 0, boxBorderRadius: 32, 
    boxBgOpacity: 5, boxBlur: 12, boxGlow: 8, boxFontSize: 16,
    
    // Section Controls
    sectionMaxWidth: 1280, sectionPaddingX: 48, sectionPaddingY: 112,
    galleryBlock0PosX: 0, galleryBlock0PosY: 0, galleryBlock0Width: 0, galleryBlock0Height: 0,
    galleryBlock1PosX: 0, galleryBlock1PosY: 0, galleryBlock1Width: 0, galleryBlock1Height: 0,
    galleryBlock2PosX: 0, galleryBlock2PosY: 0, galleryBlock2Width: 0, galleryBlock2Height: 0,
    ticketCard0PosX: 0, ticketCard0PosY: 0, ticketCard0Width: 0, ticketCard0Height: 0,
    ticketCard1PosX: 0, ticketCard1PosY: 0, ticketCard1Width: 0, ticketCard1Height: 0,
    ticketCard2PosX: 0, ticketCard2PosY: 0, ticketCard2Width: 0, ticketCard2Height: 0,
    sectionVisibility: {
      hero: true,
      about: true,
      zones: true,
      schedule: true,
      tickets: true,
      sponsors: true,
      faq: true,
      gallery: true,
      newsletter: true,
      footer: true,
    },
    sectionOrder: ["hero", "about", "zones", "schedule", "tickets", "sponsors", "faq", "gallery", "newsletter", "footer"],
    previewMode: "desktop",
  };
