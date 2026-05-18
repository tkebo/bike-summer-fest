import { lazy, Suspense, useMemo, useState } from "react";
import { defaultContent } from "../../data/defaultContent";
import { AUDIT_ACTIONS, logAudit } from "../../security/securityAudit";

const SponsorEditor = lazy(() => import("./SponsorEditor"));

const categoryOptions = ["all", "main", "stage", "media", "beer", "energy", "moto", "tourism", "food", "tech", "general"];

const createSponsor = (index) => ({
  id: `sponsor-${Date.now()}`,
  name: "",
  logo: "",
  website: "",
  category: "general",
  order: index + 1,
  active: true,
  featured: false,
  showInGrid: true,
  showInMarquee: true,
  ka: { description: "" },
  en: { description: "" },
});

const SponsorsManager = ({
  cmsData,
  updateContent,
  mediaAssets,
  mediaUploadProgress,
  createMediaAsset,
  user,
  adminProfile,
}) => {
  const [language, setLanguage] = useState("ka");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const sponsors = [...(cmsData.config.sponsors || [])].sort((left, right) => left.order - right.order);

  const filteredSponsors = useMemo(() => sponsors.filter((sponsor) => {
    const query = search.toLowerCase();
    const matchesSearch = !query || sponsor.name.toLowerCase().includes(query) || sponsor[language]?.description?.toLowerCase().includes(query);
    const matchesCategory = category === "all" || sponsor.category === category;
    return matchesSearch && matchesCategory;
  }), [category, language, search, sponsors]);

  const commit = (nextSponsors) => updateContent("config.sponsors", nextSponsors.map((sponsor, index) => ({ ...sponsor, order: index + 1 })));
  const audit = (action, sponsor, summary) => logAudit(action, {
    actorUid: user?.uid || "",
    actorEmail: user?.email || "",
    actorRole: adminProfile?.role || "",
    targetType: "sponsor",
    targetId: sponsor?.id || "",
    summary,
  });
  const patchById = (id, nextPatch) => commit(sponsors.map((sponsor) => (sponsor.id === id ? { ...sponsor, ...nextPatch } : sponsor)));
  const patchLocaleById = (id, nextPatch) => patchById(id, { [language]: { ...sponsors.find((sponsor) => sponsor.id === id)[language], ...nextPatch } });
  const move = (fromIndex, toIndex) => {
    const next = [...sponsors];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    commit(next);
  };
  const reset = (index, id) => patchById(id, defaultContent.config.sponsors[index] || createSponsor(index));

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-xl font-black">Sponsors Manager</h2>
            <p className="mt-1 text-sm text-white/55">Shared sponsor entities with KA/EN descriptions and Media Library logos.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setLanguage("ka")} className={`rounded-xl px-4 py-2 font-black ${language === "ka" ? "bg-cyan-300 text-black" : "bg-white/5 text-white/70"}`}>ქართული</button>
            <button onClick={() => setLanguage("en")} className={`rounded-xl px-4 py-2 font-black ${language === "en" ? "bg-cyan-300 text-black" : "bg-white/5 text-white/70"}`}>English</button>
            <button onClick={() => {
              const sponsor = createSponsor(sponsors.length);
              commit([...sponsors, sponsor]);
              audit(AUDIT_ACTIONS.SPONSOR_ADD, sponsor, "Sponsor added");
            }} className="rounded-xl bg-cyan-300 px-4 py-2 font-black text-black">Add sponsor</button>
            <button onClick={() => commit(defaultContent.config.sponsors)} className="rounded-xl border border-white/15 px-4 py-2 font-black">Reset defaults</button>
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_180px]">
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search sponsor" className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm" />
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm">
            {categoryOptions.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
      </section>

      {filteredSponsors.map((sponsor) => {
        const index = sponsors.findIndex((item) => item.id === sponsor.id);
        return (
          <Suspense key={`${sponsor.id}-${sponsor.website}`} fallback={<div className="h-36 animate-pulse rounded-2xl border border-white/10 bg-white/[0.045]" />}>
            <SponsorEditor
              sponsor={sponsor}
              language={language}
              index={index}
              total={sponsors.length}
              mediaAssets={mediaAssets}
              mediaUploadProgress={mediaUploadProgress}
              createMediaAsset={createMediaAsset}
              onPatch={(nextPatch) => patchById(sponsor.id, nextPatch)}
              onPatchLocale={(nextPatch) => patchLocaleById(sponsor.id, nextPatch)}
              onDuplicate={() => {
                const duplicate = { ...sponsor, id: `${sponsor.id}-copy-${Date.now()}` };
                commit([...sponsors.slice(0, index + 1), duplicate, ...sponsors.slice(index + 1)]);
                audit(AUDIT_ACTIONS.SPONSOR_ADD, duplicate, "Sponsor duplicated");
              }}
              onToggleActive={() => {
                patchById(sponsor.id, { active: !sponsor.active });
                audit(AUDIT_ACTIONS.SPONSOR_EDIT, sponsor, `Sponsor ${sponsor.active ? "disabled" : "enabled"}`);
              }}
              onDelete={() => {
                commit(sponsors.filter((item) => item.id !== sponsor.id));
                audit(AUDIT_ACTIONS.SPONSOR_DELETE, sponsor, "Sponsor deleted");
              }}
              onMove={move}
              onReset={() => reset(index, sponsor.id)}
            />
          </Suspense>
        );
      })}
    </div>
  );
};

export default SponsorsManager;
