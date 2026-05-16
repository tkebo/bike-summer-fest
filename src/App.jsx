import { CMSProvider } from "./context/CMSContext";
import AdminOverlay from "./components/AdminOverlay";
import IntroPortal from "./components/IntroPortal";
import Hero from "./components/Hero";
import About from "./components/About";
import Zones from "./components/Zones";
import Schedule from "./components/Schedule";
import Tickets from "./components/Tickets";
import Sponsors from "./components/Sponsors";
import FAQ from "./components/FAQ";
import Gallery from "./components/Gallery";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";
import VisualEditor from "./components/VisualEditor";
import { useCMS } from "./hooks/useCMS";

const sectionComponents = {
  hero: Hero,
  about: About,
  zones: Zones,
  schedule: Schedule,
  tickets: Tickets,
  sponsors: Sponsors,
  faq: FAQ,
  gallery: Gallery,
  newsletter: Newsletter,
  footer: Footer,
};

const previewWidths = {
  desktop: "100%",
  tablet: "820px",
  mobile: "390px",
};

function Platform() {
  const { editor } = useCMS();
  const order = editor.sectionOrder || Object.keys(sectionComponents);
  const visibility = editor.sectionVisibility || {};
  const previewMode = editor.previewMode || "desktop";

  return (
    <main className="min-h-screen bg-[#050814] text-white overflow-hidden">
      <AdminOverlay />
      <IntroPortal />
      <div
        className="mx-auto min-h-screen transition-all duration-300"
        style={{ maxWidth: previewWidths[previewMode], width: "100%" }}
      >
        {order.map((key) => {
          const Section = sectionComponents[key];
          if (!Section || visibility[key] === false) return null;
          return <Section key={key} />;
        })}
      </div>
      <VisualEditor />
    </main>
  );
}

export default function App() {
  return (
    <CMSProvider>
      <Platform />
    </CMSProvider>
  );
}
