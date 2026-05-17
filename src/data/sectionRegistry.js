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
  hero: { label: "Hero", component: Hero },
  highlights: { label: "Highlights", component: About },
  about: { label: "About", component: About },
  zones: { label: "Zones", component: Zones },
  panorama: { label: "Panorama", component: Zones },
  schedule: { label: "Schedule", component: Schedule },
  tickets: { label: "Tickets", component: Tickets },
  sponsors: { label: "Sponsors", component: Sponsors },
  "sponsor-marquee": { label: "Sponsor Marquee", component: Sponsors },
  social: { label: "Social", component: Sponsors },
  faq: { label: "FAQ", component: FAQ },
  gallery: { label: "Gallery", component: Gallery },
  newsletter: { label: "Newsletter", component: Newsletter },
  footer: { label: "Footer", component: Footer },
  "intro-portal": { label: "Intro Portal", component: null },
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
