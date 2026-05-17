import { AdminCard, AdminField, AdminSelect } from "./AdminUI";

const SponsorsManagerModule = ({ cmsData, updateContent }) => {
  const sponsors = cmsData.config.sponsors || [];
  const updateSponsor = (index, key, value) => updateContent(`config.sponsors.${index}.${key}`, value);
  return (
    <AdminCard
      title="Sponsors manager"
      actions={<button onClick={() => updateContent("config.sponsors", [...sponsors, { name: "", logo: "", category: "general", website: "", active: true, order: sponsors.length + 1 }])} className="rounded-xl bg-cyan-300 px-3 py-2 text-xs font-black text-black">Add sponsor</button>}
    >
      <div className="grid gap-4">
        {sponsors.map((sponsor, index) => (
          <div key={index} className="grid gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 md:grid-cols-3">
            <AdminField label="Name" value={sponsor.name} onChange={(value) => updateSponsor(index, "name", value)} />
            <AdminField label="Logo URL" value={sponsor.logo} onChange={(value) => updateSponsor(index, "logo", value)} />
            <AdminField label="Category" value={sponsor.category} onChange={(value) => updateSponsor(index, "category", value)} />
            <AdminField label="Website" value={sponsor.website} onChange={(value) => updateSponsor(index, "website", value)} />
            <AdminField label="Order" type="number" value={sponsor.order} onChange={(value) => updateSponsor(index, "order", Number(value))} />
            <AdminSelect label="Status" value={String(sponsor.active)} onChange={(value) => updateSponsor(index, "active", value === "true")} options={["true", "false"]} />
          </div>
        ))}
      </div>
    </AdminCard>
  );
};

export default SponsorsManagerModule;
