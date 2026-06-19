import { defaultContent } from "../data/defaultContent";
import { defaultEditor } from "../data/defaultEditor";
import { allowedSectionIds } from "../data/sectionRegistry";
import { CONFIG_BACKUP_VERSION } from "./securityConfig";
import { sanitizeDeep, sanitizeHttpUrl, sanitizeUrl } from "./sanitize";

const BLOCKED_KEYS = new Set([
  "__proto__",
  "prototype",
  "constructor",
  "script",
  "scripts",
  "onload",
  "onerror",
  "onclick",
  "dangerouslySetInnerHTML",
]);

const SPONSOR_CATEGORIES = new Set([
  "main",
  "stage",
  "media",
  "beer",
  "energy",
  "moto",
  "tourism",
  "food",
  "tech",
  "general",
]);
const SCHEDULE_EVENT_TYPES = new Set([
  "ride",
  "concert",
  "sport",
  "competition",
  "sponsor",
  "food",
  "beach",
  "ceremony",
  "general",
]);
const isValidDateString = (value) => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
const isValidTimeString = (value) => typeof value === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
const isValidEmail = (value) => typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const sanitizePhone = (value) => sanitizeDeep(value || "").replace(/[^\d+()\-\s]/g, "");
const sanitizeActionUrl = (value, fallback = "") => {
  const clean = sanitizeDeep(value || "");
  if (/^#[A-Za-z][\w-]*$/.test(clean)) return clean;
  if (clean.startsWith("/")) return sanitizeUrl(clean, fallback);
  return sanitizeHttpUrl(clean, fallback);
};

const isPlainObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

const sanitizeSectionContent = (content) => {
  if (!isPlainObject(content)) return undefined;
  return {
    eyebrowKa: sanitizeDeep(content.eyebrowKa || ""),
    eyebrowEn: sanitizeDeep(content.eyebrowEn || ""),
    titleKa: sanitizeDeep(content.titleKa || ""),
    titleEn: sanitizeDeep(content.titleEn || ""),
    textKa: sanitizeDeep(content.textKa || ""),
    textEn: sanitizeDeep(content.textEn || ""),
    image: sanitizeUrl(content.image || "", ""),
    mediaType: content.mediaType === "video" ? "video" : "image",
    buttonTextKa: sanitizeDeep(content.buttonTextKa || ""),
    buttonTextEn: sanitizeDeep(content.buttonTextEn || ""),
    buttonUrl: sanitizeHttpUrl(content.buttonUrl || "", ""),
  };
};

const assertNoBlockedKeys = (value, path = "root") => {
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoBlockedKeys(item, `${path}.${index}`));
    return;
  }
  if (!isPlainObject(value)) return;

  Object.keys(value).forEach((key) => {
    if (BLOCKED_KEYS.has(key) || /^on[A-Z]/.test(key)) {
      throw new Error(`Blocked field "${key}" at ${path}`);
    }
    assertNoBlockedKeys(value[key], `${path}.${key}`);
  });
};

const unwrapBackup = (payload) => {
  if (payload && payload.meta && payload.data) {
    if (payload.meta.version > CONFIG_BACKUP_VERSION) {
      throw new Error("Unsupported backup version");
    }
    return payload.data;
  }
  return payload;
};

const validateContentShape = (payload) => {
  const data = unwrapBackup(payload);
  assertNoBlockedKeys(data);
  if (!isPlainObject(data)) throw new Error("Content config must be an object");

  ["ka", "en", "config"].forEach((key) => {
    if (key in data && !isPlainObject(data[key])) {
      throw new Error(`Invalid "${key}" section`);
    }
  });

  const sanitized = sanitizeDeep(data);
  const images = sanitized.config?.images;
  if (images) {
    ["hero", "gallery1", "gallery2", "gallery3"].forEach((key) => {
      if (images[key]) images[key] = sanitizeUrl(images[key], defaultContent.config.images[key]);
    });
  }

  if (sanitized.config?.heroImage) {
    sanitized.config.heroImage = sanitizeUrl(sanitized.config.heroImage, "");
  }
  sanitized.config.ticketButtonLink = sanitizeActionUrl(sanitized.config?.ticketButtonLink || "#tickets", "#tickets");
  if (sanitized.config?.introImage) {
    sanitized.config.introImage = sanitizeUrl(sanitized.config.introImage, "");
  }
  if (Array.isArray(sanitized.config?.galleryImages)) {
    sanitized.config.galleryImages = sanitized.config.galleryImages
      .map((url) => sanitizeUrl(url, ""))
      .filter(Boolean);
  }
  if (sanitized.config?.externalGalleryUrl) {
    sanitized.config.externalGalleryUrl = sanitizeHttpUrl(sanitized.config.externalGalleryUrl, "");
  }
  if (Array.isArray(sanitized.config?.sponsorLogos)) {
    sanitized.config.sponsorLogos = sanitized.config.sponsorLogos
      .map((url) => sanitizeUrl(url, ""))
      .filter(Boolean);
  }
  if (sanitized.config?.faqImage) {
    sanitized.config.faqImage = sanitizeUrl(sanitized.config.faqImage, "");
  }
  if (sanitized.config?.zonesImage) {
    sanitized.config.zonesImage = sanitizeUrl(sanitized.config.zonesImage, "");
  }
  if (isPlainObject(sanitized.config?.introSettings)) {
    const introSettings = sanitized.config.introSettings;
    sanitized.config.introSettings = {
      enabled: introSettings.enabled !== false,
      skipEnabled: introSettings.skipEnabled !== false,
      replayEnabled: introSettings.replayEnabled !== false,
      mobileLiteMode: introSettings.mobileLiteMode !== false,
      autoSkipAfterMs: Math.min(Math.max(Number(introSettings.autoSkipAfterMs) || 12000, 2000), 30000),
      volume: Math.min(Math.max(Number(introSettings.volume) || 0, 0), 1),
      visorTextKa: sanitizeDeep(introSettings.visorTextKa || "ENTER THE RIDE"),
      visorTextEn: sanitizeDeep(introSettings.visorTextEn || "ENTER THE RIDE"),
      introMode: ["cinematic", "lite"].includes(introSettings.introMode) ? introSettings.introMode : "cinematic",
      cinematicIntensity: Math.min(Math.max(Number(introSettings.cinematicIntensity) || 0, 0), 1),
      particleDensity: Math.min(Math.max(Number(introSettings.particleDensity) || 0, 0), 1),
      fogDensity: Math.min(Math.max(Number(introSettings.fogDensity) || 0, 0), 1),
      glowStrength: Math.min(Math.max(Number(introSettings.glowStrength) || 0, 0), 1),
      cameraMotionAmount: Math.min(Math.max(Number(introSettings.cameraMotionAmount) || 0, 0), 1),
      transitionSpeed: Math.min(Math.max(Number(introSettings.transitionSpeed) || 1, 0.5), 2),
      durationPreset: ["short", "cinematic", "ultra"].includes(introSettings.durationPreset) ? introSettings.durationPreset : "cinematic",
    };
  }
  if (isPlainObject(sanitized.config?.introAudio)) {
    const introAudio = sanitized.config.introAudio;
    sanitized.config.introAudio = {
      enabled: introAudio.enabled !== false,
      masterVolume: Math.min(Math.max(Number(introAudio.masterVolume) || 0, 0), 1),
      engineVolume: Math.min(Math.max(Number(introAudio.engineVolume) || 0, 0), 1),
      ambienceVolume: Math.min(Math.max(Number(introAudio.ambienceVolume) || 0, 0), 1),
      uiVolume: Math.min(Math.max(Number(introAudio.uiVolume) || 0, 0), 1),
    };
  }
  if (isPlainObject(sanitized.config?.imageStyles)) {
    const imageStyles = sanitized.config.imageStyles;
    sanitized.config.imageStyles = {
      galleryHeight: Math.min(Math.max(Number(imageStyles.galleryHeight) || 384, 120), 900),
      galleryGridLimit: Math.min(Math.max(Number(imageStyles.galleryGridLimit) || 6, 1), 24),
      galleryGridGap: Math.min(Math.max(Number(imageStyles.galleryGridGap) || 16, 0), 64),
      galleryFit: ["cover", "contain"].includes(imageStyles.galleryFit) ? imageStyles.galleryFit : "cover",
      galleryPositionX: Math.min(Math.max(Number(imageStyles.galleryPositionX) || 50, 0), 100),
      galleryPositionY: Math.min(Math.max(Number(imageStyles.galleryPositionY) || 50, 0), 100),
      zonesMobileHeight: Math.min(Math.max(Number(imageStyles.zonesMobileHeight) || 340, 120), 900),
      zonesDesktopHeight: Math.min(Math.max(Number(imageStyles.zonesDesktopHeight) || 560, 180), 1200),
      zonesFit: ["cover", "contain"].includes(imageStyles.zonesFit) ? imageStyles.zonesFit : "cover",
      zonesPositionX: Math.min(Math.max(Number(imageStyles.zonesPositionX) || 50, 0), 100),
      zonesPositionY: Math.min(Math.max(Number(imageStyles.zonesPositionY) || 50, 0), 100),
      faqHeight: Math.min(Math.max(Number(imageStyles.faqHeight) || 320, 120), 900),
      faqFit: ["cover", "contain"].includes(imageStyles.faqFit) ? imageStyles.faqFit : "cover",
      faqPositionX: Math.min(Math.max(Number(imageStyles.faqPositionX) || 50, 0), 100),
      faqPositionY: Math.min(Math.max(Number(imageStyles.faqPositionY) || 50, 0), 100),
      sponsorLogoHeight: Math.min(Math.max(Number(imageStyles.sponsorLogoHeight) || 64, 24), 240),
      sponsorLogoMaxWidth: Math.min(Math.max(Number(imageStyles.sponsorLogoMaxWidth) || 220, 80), 480),
      sponsorLogoPadding: Math.min(Math.max(Number(imageStyles.sponsorLogoPadding) || 20, 0), 64),
      sponsorLogoCleanMode: imageStyles.sponsorLogoCleanMode !== false,
      heroBackgroundScale: Math.min(Math.max(Number(imageStyles.heroBackgroundScale) || 100, 50), 200),
    };
  }
  if (isPlainObject(sanitized.config?.heroCenterMark)) {
    const mark = sanitized.config.heroCenterMark;
    sanitized.config.heroCenterMark = {
      enabled: mark.enabled !== false,
      line1: sanitizeDeep(mark.line1 ?? "BIKE"),
      line2: sanitizeDeep(mark.line2 ?? "SUMMER"),
      line3: sanitizeDeep(mark.line3 ?? "FEST"),
      line4: sanitizeDeep(mark.line4 ?? "2026"),
      image: sanitizeUrl(mark.image || "", ""),
      imageAlt: sanitizeDeep(mark.imageAlt || "Bike Summer Fest center mark"),
      imageFit: ["cover", "contain"].includes(mark.imageFit) ? mark.imageFit : "contain",
      imageOpacity: Math.min(Math.max(Number(mark.imageOpacity) || 45, 0), 100),
      backgroundEnabled: mark.backgroundEnabled !== false,
    };
  }
  if (Array.isArray(sanitized.config?.ticketPackages)) {
    sanitized.config.ticketPackages = sanitized.config.ticketPackages
      .filter((ticket) => isPlainObject(ticket))
      .map((ticket, index) => ({
        id: sanitizeDeep(ticket.id || `package-${index + 1}`),
        order: Number.isFinite(Number(ticket.order)) ? Number(ticket.order) : index + 1,
        active: ticket.active !== false,
        highlighted: ticket.highlighted === true,
        status: ["coming_soon", "available", "sold_out", "hidden"].includes(ticket.status) ? ticket.status : "coming_soon",
        price: sanitizeDeep(ticket.price || ""),
        currency: sanitizeDeep(ticket.currency || ""),
        ctaLink: sanitizeActionUrl(ticket.ctaLink || "#contact", "#contact"),
        ka: {
          name: sanitizeDeep(ticket.ka?.name || ""),
          desc: sanitizeDeep(ticket.ka?.desc || ""),
          ctaText: sanitizeDeep(ticket.ka?.ctaText || ""),
          features: Array.isArray(ticket.ka?.features) ? ticket.ka.features.map(sanitizeDeep) : [],
        },
        en: {
          name: sanitizeDeep(ticket.en?.name || ""),
          desc: sanitizeDeep(ticket.en?.desc || ""),
          ctaText: sanitizeDeep(ticket.en?.ctaText || ""),
          features: Array.isArray(ticket.en?.features) ? ticket.en.features.map(sanitizeDeep) : [],
        },
      }));
  }
  if (Array.isArray(sanitized.config?.sponsors)) {
    sanitized.config.sponsors = sanitized.config.sponsors
      .filter((sponsor) => isPlainObject(sponsor))
      .map((sponsor, index) => ({
        id: sanitizeDeep(sponsor.id || `sponsor-${index + 1}`),
        name: sanitizeDeep(sponsor.name || ""),
        logo: sanitizeUrl(sponsor.logo || "", ""),
        website: sanitizeHttpUrl(sponsor.website || "", ""),
        category: SPONSOR_CATEGORIES.has(sponsor.category) ? sponsor.category : "general",
        order: Number.isFinite(Number(sponsor.order)) ? Number(sponsor.order) : index + 1,
        active: sponsor.active !== false,
        featured: sponsor.featured === true,
        showInGrid: sponsor.showInGrid !== false,
        showInMarquee: sponsor.showInMarquee !== false,
        logoMaxWidth: Math.min(Math.max(Number(sponsor.logoMaxWidth) || 0, 0), 600),
        logoMaxHeight: Math.min(Math.max(Number(sponsor.logoMaxHeight) || 0, 0), 260),
        ka: {
          description: sanitizeDeep(sponsor.ka?.description || ""),
        },
        en: {
          description: sanitizeDeep(sponsor.en?.description || ""),
        },
      }));
  }
  if (Array.isArray(sanitized.config?.scheduleDays)) {
    sanitized.config.scheduleDays = sanitized.config.scheduleDays
      .filter((day) => isPlainObject(day))
      .map((day, index) => ({
        id: sanitizeDeep(day.id || `day-${index + 1}`),
        order: Number.isFinite(Number(day.order)) ? Number(day.order) : index + 1,
        active: day.active !== false,
        date: isValidDateString(day.date) ? day.date : "",
        label: sanitizeDeep(day.label || ""),
        ka: {
          title: sanitizeDeep(day.ka?.title || ""),
          description: sanitizeDeep(day.ka?.description || ""),
        },
        en: {
          title: sanitizeDeep(day.en?.title || ""),
          description: sanitizeDeep(day.en?.description || ""),
        },
        events: Array.isArray(day.events)
          ? day.events
            .filter((event) => isPlainObject(event))
            .map((event, eventIndex) => ({
              id: sanitizeDeep(event.id || `event-${eventIndex + 1}`),
              order: Number.isFinite(Number(event.order)) ? Number(event.order) : eventIndex + 1,
              active: event.active !== false,
              highlighted: event.highlighted === true,
              time: isValidTimeString(event.time) ? event.time : "",
              location: sanitizeDeep(event.location || ""),
              zone: sanitizeDeep(event.zone || ""),
              type: SCHEDULE_EVENT_TYPES.has(event.type) ? event.type : "general",
              ka: {
                title: sanitizeDeep(event.ka?.title || ""),
                description: sanitizeDeep(event.ka?.description || ""),
              },
              en: {
                title: sanitizeDeep(event.en?.title || ""),
                description: sanitizeDeep(event.en?.description || ""),
              },
            }))
          : [],
      }));
  }
  if (isPlainObject(sanitized.config?.eventSettings)) {
    const eventSettings = sanitized.config.eventSettings;
    sanitized.config.eventSettings = {
      name: sanitizeDeep(eventSettings.name || ""),
      year: sanitizeDeep(eventSettings.year || ""),
      dates: {
        start: isValidDateString(eventSettings.dates?.start) ? eventSettings.dates.start : "",
        end: isValidDateString(eventSettings.dates?.end) ? eventSettings.dates.end : "",
        displayKa: sanitizeDeep(eventSettings.dates?.displayKa || ""),
        displayEn: sanitizeDeep(eventSettings.dates?.displayEn || ""),
      },
      location: {
        ka: sanitizeDeep(eventSettings.location?.ka || ""),
        en: sanitizeDeep(eventSettings.location?.en || ""),
        country: sanitizeDeep(eventSettings.location?.country || ""),
        region: sanitizeDeep(eventSettings.location?.region || ""),
        venue: sanitizeDeep(eventSettings.location?.venue || ""),
        mapUrl: sanitizeHttpUrl(eventSettings.location?.mapUrl || "", ""),
      },
      contact: {
        email: isValidEmail(eventSettings.contact?.email) ? eventSettings.contact.email : "",
        phone: sanitizePhone(eventSettings.contact?.phone),
      },
      countdown: {
        enabled: eventSettings.countdown?.enabled !== false,
        targetDate: isValidDateString(eventSettings.countdown?.targetDate) ? eventSettings.countdown.targetDate : "",
        targetTime: isValidTimeString(eventSettings.countdown?.targetTime) ? eventSettings.countdown.targetTime : "",
        timezone: sanitizeDeep(eventSettings.countdown?.timezone || ""),
        mode: ["start_date", "end_date", "custom_deadline"].includes(eventSettings.countdown?.mode)
          ? eventSettings.countdown.mode
          : "start_date",
        labels: {
          ka: {
            days: sanitizeDeep(eventSettings.countdown?.labels?.ka?.days || ""),
            hours: sanitizeDeep(eventSettings.countdown?.labels?.ka?.hours || ""),
            minutes: sanitizeDeep(eventSettings.countdown?.labels?.ka?.minutes || ""),
            seconds: sanitizeDeep(eventSettings.countdown?.labels?.ka?.seconds || ""),
          },
          en: {
            days: sanitizeDeep(eventSettings.countdown?.labels?.en?.days || ""),
            hours: sanitizeDeep(eventSettings.countdown?.labels?.en?.hours || ""),
            minutes: sanitizeDeep(eventSettings.countdown?.labels?.en?.minutes || ""),
            seconds: sanitizeDeep(eventSettings.countdown?.labels?.en?.seconds || ""),
          },
        },
        finishedMessageKa: sanitizeDeep(eventSettings.countdown?.finishedMessageKa || ""),
        finishedMessageEn: sanitizeDeep(eventSettings.countdown?.finishedMessageEn || ""),
      },
      socials: {
        facebook: sanitizeHttpUrl(eventSettings.socials?.facebook || "", ""),
        instagram: sanitizeHttpUrl(eventSettings.socials?.instagram || "", ""),
        tiktok: sanitizeHttpUrl(eventSettings.socials?.tiktok || "", ""),
        youtube: sanitizeHttpUrl(eventSettings.socials?.youtube || "", ""),
        telegram: sanitizeHttpUrl(eventSettings.socials?.telegram || "", ""),
        whatsapp: sanitizeHttpUrl(eventSettings.socials?.whatsapp || "", ""),
      },
    };
  }
  if (isPlainObject(sanitized.config?.seo)) {
    const seo = sanitized.config.seo;
    sanitized.config.seo = {
      title: {
        ka: sanitizeDeep(seo.title?.ka || ""),
        en: sanitizeDeep(seo.title?.en || ""),
      },
      description: {
        ka: sanitizeDeep(seo.description?.ka || ""),
        en: sanitizeDeep(seo.description?.en || ""),
      },
      keywords: Array.isArray(seo.keywords) ? seo.keywords.map(sanitizeDeep) : [],
      canonicalUrl: sanitizeHttpUrl(seo.canonicalUrl || "", ""),
      robots: {
        index: seo.robots?.index !== false,
        follow: seo.robots?.follow !== false,
      },
      openGraph: {
        title: {
          ka: sanitizeDeep(seo.openGraph?.title?.ka || ""),
          en: sanitizeDeep(seo.openGraph?.title?.en || ""),
        },
        description: {
          ka: sanitizeDeep(seo.openGraph?.description?.ka || ""),
          en: sanitizeDeep(seo.openGraph?.description?.en || ""),
        },
        image: sanitizeUrl(seo.openGraph?.image || "", ""),
        type: seo.openGraph?.type === "website" ? "website" : "website",
      },
      twitter: {
        title: {
          ka: sanitizeDeep(seo.twitter?.title?.ka || ""),
          en: sanitizeDeep(seo.twitter?.title?.en || ""),
        },
        description: {
          ka: sanitizeDeep(seo.twitter?.description?.ka || ""),
          en: sanitizeDeep(seo.twitter?.description?.en || ""),
        },
        image: sanitizeUrl(seo.twitter?.image || "", ""),
        card: seo.twitter?.card === "summary_large_image" ? "summary_large_image" : "summary_large_image",
      },
      icons: {
        favicon: sanitizeUrl(seo.icons?.favicon || "", ""),
        appleTouchIcon: sanitizeUrl(seo.icons?.appleTouchIcon || "", ""),
        themeColor: /^#[0-9a-fA-F]{6}$/.test(seo.icons?.themeColor || "") ? seo.icons.themeColor : "#050814",
      },
    };
  }
  if (Array.isArray(sanitized.config?.sections)) {
    sanitized.config.sections = sanitized.config.sections
      .filter((section) => isPlainObject(section) && allowedSectionIds.includes(section.id))
      .map((section, index) => {
        const nextSection = {
          id: section.id,
          label: sanitizeDeep(section.label || section.id),
          visible: section.visible !== false,
          order: Number.isFinite(Number(section.order)) ? Number(section.order) : index + 1,
          anchor: sanitizeDeep(section.anchor || section.id),
          layout: ["grid", "split", "centered", "full-width", "cards"].includes(section.layout) ? section.layout : "centered",
          backgroundImage: sanitizeUrl(section.backgroundImage || "", ""),
          overlayOpacity: Number.isFinite(Number(section.overlayOpacity)) ? Number(section.overlayOpacity) : 0,
          paddingX: Number.isFinite(Number(section.paddingX)) ? Number(section.paddingX) : 48,
          paddingY: Number.isFinite(Number(section.paddingY)) ? Number(section.paddingY) : 112,
          maxWidth: Number.isFinite(Number(section.maxWidth)) ? Number(section.maxWidth) : 1280,
          gap: Number.isFinite(Number(section.gap)) ? Number(section.gap) : 24,
          radius: Number.isFinite(Number(section.radius)) ? Number(section.radius) : 32,
        };
        if (section.id === "custom") {
          const content = sanitizeSectionContent(section.content);
          if (content) nextSection.content = content;
        }
        return nextSection;
      });
  }

  return sanitized;
};

const validateEditorShape = (payload) => {
  const data = unwrapBackup(payload);
  assertNoBlockedKeys(data);
  if (!isPlainObject(data)) throw new Error("Design config must be an object");

  const allowedKeys = new Set(Object.keys(defaultEditor));
  const nextEditor = {};

  Object.entries(data).forEach(([key, value]) => {
    if (!allowedKeys.has(key)) return;
    const defaultValue = defaultEditor[key];

    if (typeof defaultValue === "number") {
      const numeric = Number(value);
      if (Number.isFinite(numeric)) nextEditor[key] = numeric;
      return;
    }

    if (typeof defaultValue === "string") {
      if (key === "atmosphereMode") {
        nextEditor[key] = ["subtle", "balanced", "ultra"].includes(value) ? value : defaultEditor.atmosphereMode;
        return;
      }
      if (key.toLowerCase().includes("color") && !/^#[0-9a-fA-F]{6}$/.test(String(value))) {
        return;
      }
      nextEditor[key] = sanitizeDeep(value);
      return;
    }

    if (Array.isArray(defaultValue) && Array.isArray(value)) {
      nextEditor[key] = value
        .filter((item) => defaultValue.includes(item))
        .map((item) => sanitizeDeep(item));
      return;
    }

    if (isPlainObject(defaultValue) && isPlainObject(value)) {
      nextEditor[key] = Object.keys(defaultValue).reduce((accumulator, nestedKey) => {
        if (typeof value[nestedKey] === typeof defaultValue[nestedKey]) {
          accumulator[nestedKey] = sanitizeDeep(value[nestedKey]);
        }
        return accumulator;
      }, {});
    }
  });

  return nextEditor;
};

export const validateImportedContent = (payload) => validateContentShape(payload);
export const validateImportedEditor = (payload) => validateEditorShape(payload);

export const createVersionedBackup = (type, data) => ({
  meta: {
    app: "bike-summer-fest",
    type,
    version: CONFIG_BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
  },
  data,
});
