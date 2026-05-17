import { AdminCard, AdminField, AdminSelect } from "./AdminUI";

const TicketsManagerModule = ({ cmsData, updateContent }) => (
  <div className="grid gap-4">
    {["ka", "en"].map((locale) => (
      <AdminCard key={locale} title={`${locale.toUpperCase()} ticket packages`}>
        <div className="grid gap-4">
          {cmsData[locale].ticketCards.map((ticket, index) => (
            <div key={index} className="grid gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 md:grid-cols-2">
              <AdminField label="Name" value={ticket.name} onChange={(value) => updateContent(`${locale}.ticketCards.${index}.name`, value)} />
              <AdminField label="Price" value={ticket.price} onChange={(value) => updateContent(`${locale}.ticketCards.${index}.price`, value)} />
              <AdminSelect label="Status" value={ticket.status || "coming soon"} onChange={(value) => updateContent(`${locale}.ticketCards.${index}.status`, value)} options={["coming soon", "available", "sold out"]} />
              <AdminField label="CTA link" value={ticket.ctaLink || "#contact"} onChange={(value) => updateContent(`${locale}.ticketCards.${index}.ctaLink`, value)} />
              <AdminField label="Description" value={ticket.desc} multiline onChange={(value) => updateContent(`${locale}.ticketCards.${index}.desc`, value)} />
              <AdminField label="Features" value={ticket.features.join(", ")} multiline onChange={(value) => updateContent(`${locale}.ticketCards.${index}.features`, value.split(",").map((item) => item.trim()).filter(Boolean))} />
            </div>
          ))}
        </div>
      </AdminCard>
    ))}
  </div>
);

export default TicketsManagerModule;
