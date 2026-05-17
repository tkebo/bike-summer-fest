import { AdminCard, AdminField } from "./AdminUI";

const textGroups = [
  ["hero", ["heroDate", "heroSubtitle", "heroText", "heroExploreBtn", "heroGetTicketsBtn"]],
  ["sections", ["aboutLabel", "aboutText", "zonesLabel", "zonesTitle", "zoneText", "ticketsLabel", "ticketsTitle", "sponsorsLabel", "sponsorsText", "galleryLabel", "galleryTitle"]],
  ["footer", ["newsletterLabel", "newsletterTitle1", "newsletterTitle2", "newsletterText", "footerLabel", "footerTitle", "footerText"]],
];

const ContentManagerModule = ({ cmsData, updateContent }) => (
  <div className="grid gap-4">
    {["ka", "en"].map((locale) => (
      <AdminCard key={locale} title={`${locale.toUpperCase()} content`}>
        <div className="grid gap-5">
          {textGroups.map(([group, fields]) => (
            <div key={group}>
              <div className="mb-3 text-xs font-black uppercase text-cyan-200">{group}</div>
              <div className="grid gap-3 md:grid-cols-2">
                {fields.map((field) => (
                  <AdminField key={field} label={field} value={cmsData[locale][field]} multiline={field.toLowerCase().includes("text")} onChange={(value) => updateContent(`${locale}.${field}`, value)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </AdminCard>
    ))}
  </div>
);

export default ContentManagerModule;
