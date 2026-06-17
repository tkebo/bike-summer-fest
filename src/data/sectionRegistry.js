import { lazy } from "react";
import Hero from "../components/Hero";

const About = lazy(() => import("../components/About"));
const Zones = lazy(() => import("../components/Zones"));
const Schedule = lazy(() => import("../components/Schedule"));
const Tickets = lazy(() => import("../components/Tickets"));
const Sponsors = lazy(() => import("../components/Sponsors"));
const FAQ = lazy(() => import("../components/FAQ"));
const Gallery = lazy(() => import("../components/Gallery"));
const Newsletter = lazy(() => import("../components/Newsletter"));
const Footer = lazy(() => import("../components/Footer"));
const CustomSection = lazy(() => import("../components/CustomSection"));

export const sectionRegistry = {
  hero: { label: "Hero", component: Hero, renderKey: "hero" },
  highlights: { label: "Highlights", component: About, renderKey: "about" },
  about: { label: "About", component: About, renderKey: "about" },
  zones: { label: "Zones", component: Zones, renderKey: "zones" },
  panorama: { label: "Panorama", component: Zones, renderKey: "zones" },
  schedule: { label: "Schedule", component: Schedule, renderKey: "schedule" },
  tickets: { label: "Tickets", component: Tickets, renderKey: "tickets" },
  sponsors: { label: "Sponsors", component: Sponsors, renderKey: "sponsors" },
  "sponsor-marquee": { label: "Sponsor Marquee", component: Sponsors, renderKey: "sponsors" },
  social: { label: "Social", component: Sponsors, renderKey: "sponsors" },
  faq: { label: "FAQ", component: FAQ, renderKey: "faq" },
  gallery: { label: "Gallery", component: Gallery, renderKey: "gallery" },
  newsletter: { label: "Newsletter", component: Newsletter, renderKey: "newsletter" },
  footer: { label: "Footer", component: Footer, renderKey: "footer" },
  custom: { label: "Custom Section", component: CustomSection, renderKey: "custom" },
  "intro-portal": { label: "Intro Portal", component: null, renderKey: "intro-portal" },
};

export const allowedSectionIds = Object.keys(sectionRegistry);

const defaultSectionIds = allowedSectionIds.filter((id) => id !== "custom");

export const createDefaultSections = () => defaultSectionIds.map((id, index) => ({
  id,
  label: sectionRegistry[id].label,
  visible: true,
  order: index + 1,
  anchor: id,
  layout: id === "hero" ? "full-width" : "centered",
  backgroundImage: "",
  overlayOpacity: 0,
  paddingX: 48,
  paddingY: 112,
  maxWidth: 1280,
  gap: 24,
  radius: 32,
}));
