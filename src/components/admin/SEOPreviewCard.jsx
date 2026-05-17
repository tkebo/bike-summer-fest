const SEOPreviewCard = ({ seo, language, eventSettings }) => {
  const title = seo.title[language];
  const description = seo.description[language];
  const ogTitle = seo.openGraph.title[language];
  const ogDescription = seo.openGraph.description[language];
  const twitterTitle = seo.twitter.title[language];
  const twitterDescription = seo.twitter.description[language];

  const jsonLdPreview = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: eventSettings.name,
    startDate: eventSettings.dates.start,
    endDate: eventSettings.dates.end,
    location: eventSettings.location[language],
    organizer: eventSettings.name,
    offers: {
      url: seo.canonicalUrl || "",
    },
  };

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
        <div className="text-xs font-black uppercase text-cyan-200">Google preview</div>
        <div className="mt-4 text-sm text-cyan-300">{seo.canonicalUrl || "https://example.com"}</div>
        <div className="mt-2 text-xl font-black">{title || "Untitled page"}</div>
        <div className="mt-2 text-sm text-white/55">{description || "Meta description preview."}</div>
      </section>
      <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
        <div className="text-xs font-black uppercase text-cyan-200">Facebook / Instagram</div>
        {seo.openGraph.image && <img src={seo.openGraph.image} alt="" className="mt-4 h-32 w-full rounded-xl object-cover" />}
        <div className="mt-4 font-black">{ogTitle || title}</div>
        <div className="mt-2 text-sm text-white/55">{ogDescription || description}</div>
      </section>
      <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
        <div className="text-xs font-black uppercase text-cyan-200">Twitter / X</div>
        {seo.twitter.image && <img src={seo.twitter.image} alt="" className="mt-4 h-32 w-full rounded-xl object-cover" />}
        <div className="mt-4 font-black">{twitterTitle || title}</div>
        <div className="mt-2 text-sm text-white/55">{twitterDescription || description}</div>
      </section>
      <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 xl:col-span-3">
        <div className="text-xs font-black uppercase text-cyan-200">JSON-LD preview placeholder</div>
        <pre className="mt-4 overflow-x-auto rounded-2xl bg-black/35 p-4 text-xs text-white/65">{JSON.stringify(jsonLdPreview, null, 2)}</pre>
      </section>
    </div>
  );
};

export default SEOPreviewCard;
