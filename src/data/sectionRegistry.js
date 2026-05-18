import Hero from "../components/Hero";
import About from "../components/About";
import Zones from "../components/Zones";
import Schedule from "../components/Schedule";
import Tickets from "../components/Tickets";
import Sponsors from "../components/Sponsors";
import FAQ from "../components/FAQ";
import Gallery from "../components/Gallery";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";

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
  "intro-portal": { label: "Intro Portal", component: null, renderKey: "intro-portal" },
};

export const allowedSectionIds = Object.keys(sectionRegistry);

export const createDefaultSections = () => allowedSectionIds.map((id, index) => ({
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
