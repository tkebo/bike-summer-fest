import { lazy, Suspense, useState } from "react";
import { defaultContent } from "../../data/defaultContent";

const TicketPackageEditor = lazy(() => import("./TicketPackageEditor"));

const createPackage = (index) => ({
  id: `package-${Date.now()}`,
  order: index + 1,
  active: true,
  highlighted: false,
  status: "coming_soon",
  price: "Soon",
  currency: "GEL",
  ctaLink: "#contact",
  ka: { name: "", desc: "", ctaText: "მოთხოვნის გაგზავნა", features: [] },
  en: { name: "", desc: "", ctaText: "Send Request", features: [] },
});

const TicketsManager = ({ cmsData, updateContent }) => {
  const [language, setLanguage] = useState("ka");
  const packages = [...(cmsData.config.ticketPackages || [])].sort((left, right) => left.order - right.order);
  const commit = (nextPackages) => updateContent("config.ticketPackages", nextPackages.map((ticket, index) => ({ ...ticket, order: index + 1 })));
  const patch = (index, nextPatch) => commit(packages.map((ticket, ticketIndex) => (ticketIndex === index ? { ...ticket, ...nextPatch } : ticket)));
  const patchLocale = (index, nextPatch) => patch(index, { [language]: { ...packages[index][language], ...nextPatch } });
  const move = (fromIndex, toIndex) => {
    const next = [...packages];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    commit(next);
  };
  const reset = (index) => patch(index, defaultContent.config.ticketPackages[index] || createPackage(index));

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-black">Tickets Manager</h2>
            <p className="mt-1 text-sm text-white/55">Shared commercial fields with language-specific copy.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setLanguage("ka")} className={`rounded-xl px-4 py-2 font-black ${language === "ka" ? "bg-cyan-300 text-black" : "bg-white/5 text-white/70"}`}>ქართული</button>
            <button onClick={() => setLanguage("en")} className={`rounded-xl px-4 py-2 font-black ${language === "en" ? "bg-cyan-300 text-black" : "bg-white/5 text-white/70"}`}>English</button>
            <button onClick={() => commit([...packages, createPackage(packages.length)])} className="rounded-xl bg-cyan-300 px-4 py-2 font-black text-black">Add package</button>
          </div>
        </div>
      </section>
      {packages.map((ticket, index) => (
        <Suspense key={ticket.id} fallback={<div className="h-36 animate-pulse rounded-2xl border border-white/10 bg-white/[0.045]" />}>
          <TicketPackageEditor
            ticket={ticket}
            language={language}
            index={index}
            total={packages.length}
            onPatch={(nextPatch) => patch(index, nextPatch)}
            onPatchLocale={(nextPatch) => patchLocale(index, nextPatch)}
            onDuplicate={() => commit([...packages.slice(0, index + 1), { ...ticket, id: `${ticket.id}-copy-${Date.now()}` }, ...packages.slice(index + 1)])}
            onDisable={() => patch(index, { active: !ticket.active })}
          onDelete={() => commit(packages.filter((_, ticketIndex) => ticketIndex !== index))}
          onMove={move}
          onReset={() => reset(index)}
          />
        </Suspense>
      ))}
    </div>
  );
};

export default TicketsManager;
