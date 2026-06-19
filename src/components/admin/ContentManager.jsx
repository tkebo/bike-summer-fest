import { useMemo, useState } from "react";
import { defaultContent } from "../../data/defaultContent";
import ContentField from "./ContentField";
import ArrayEditor from "./ArrayEditor";

const groups = [
  { key: "logo", title: "Logo", objectFields: ["logo"] },
  { key: "navigation", title: "Navigation", objectFields: ["nav"] },
  { key: "hero", title: "Hero", fields: ["heroDate", "heroSubtitle", "heroExploreBtn", "heroGetTicketsBtn", "heroText"], configFields: ["ticketButtonLink"], arrays: ["heroTitleLines"] },
  { key: "countdown", title: "Countdown labels", objectFields: ["countdownLabels"] },
  { key: "highlights", title: "Highlights", fields: ["highlightsLabel", "highlightsTitle"], arrays: ["highlights"] },
  { key: "about", title: "About", fields: ["aboutLabel", "slogan1", "slogan2", "slogan3", "aboutText"] },
  { key: "zones", title: "Zones", fields: ["zonesLabel", "zonesTitle", "zoneText"], arrays: ["zones"] },
  { key: "schedule", title: "Schedule", fields: ["scheduleLabel", "scheduleTitle"], arrays: ["days"] },
  { key: "tickets", title: "Tickets", fields: ["ticketsLabel", "ticketsTitle", "ticketButton"], arrays: ["ticketCards"] },
  { key: "sponsors", title: "Sponsors", fields: ["sponsorsLabel", "sponsorsTitle1", "sponsorsTitle2", "sponsorsText", "sponsorshipOffer", "sponsorMarqueeLabel", "sponsorMarqueeTitle"], arrays: ["sponsorCards", "sponsorMarqueeItems"] },
  { key: "social", title: "Social", fields: ["socialLabel", "socialTitle", "socialText", "socialButton"], arrays: ["socialCards"] },
  { key: "faq", title: "FAQ", fields: ["faqLabel", "faqTitle", "locationTitle", "locationText", "openMap"], arrays: ["faqItems"] },
  { key: "gallery", title: "Gallery", fields: ["galleryLabel", "galleryTitle", "galleryOpenButton"] },
  { key: "newsletter", title: "Newsletter", fields: ["newsletterLabel", "newsletterTitle1", "newsletterTitle2", "newsletterText", "newsletterInput", "newsletterBtn"] },
  { key: "footer", title: "Footer", fields: ["footerLabel", "footerTitle", "footerText", "contact"] },
  { key: "form", title: "Contact form labels", objectFields: ["form"] },
];

const objectArrayShapes = {
  highlights: [
    { key: "value", label: "Value" },
    { key: "label", label: "Label" },
  ],
  ticketCards: [
    { key: "name", label: "Name" },
    { key: "price", label: "Price" },
    { key: "desc", label: "Description", multiline: true },
    { key: "features", label: "Features", multiline: true },
  ],
  days: [
    { key: "day", label: "Day" },
    { key: "title", label: "Title" },
    { key: "text", label: "Description", multiline: true },
  ],
  socialCards: [
    { key: "name", label: "Name" },
    { key: "icon", label: "Icon" },
    { key: "text", label: "Text", multiline: true },
  ],
  faqItems: [
    { key: "q", label: "Question" },
    { key: "a", label: "Answer", multiline: true },
  ],
};

const multilineFields = new Set([
  "heroText",
  "aboutText",
  "zoneText",
  "sponsorsText",
  "socialText",
  "locationText",
  "newsletterText",
  "footerText",
]);

const flattenGroupKeys = (group) => [
  ...(group.fields || []),
  ...(group.configFields || []),
  ...(group.arrays || []),
  ...(group.objectFields || []),
];

const ContentManager = ({ cmsData, updateContent, editorSaveStatus }) => {
  const [language, setLanguage] = useState("ka");
  const [search, setSearch] = useState("");
  const [openGroups, setOpenGroups] = useState(() => Object.fromEntries(groups.map((group) => [group.key, true])));
  const visibleGroups = useMemo(() => groups.filter((group) => flattenGroupKeys(group).some((key) => `${group.title} ${key}`.toLowerCase().includes(search.toLowerCase()))), [search]);

  const resetGroup = (group) => {
    flattenGroupKeys(group).forEach((field) => updateContent(`${language}.${field}`, defaultContent[language][field]));
  };

  const renderObjectFields = (field) => Object.entries(cmsData[language][field]).map(([key, value]) => (
    <ContentField key={key} label={`${field}.${key}`} value={value} onChange={(nextValue) => updateContent(`${language}.${field}.${key}`, nextValue)} />
  ));

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-2">
            <button onClick={() => setLanguage("ka")} className={`rounded-xl px-4 py-2 font-black ${language === "ka" ? "bg-cyan-300 text-black" : "bg-white/5 text-white/70"}`}>ქართული</button>
            <button onClick={() => setLanguage("en")} className={`rounded-xl px-4 py-2 font-black ${language === "en" ? "bg-cyan-300 text-black" : "bg-white/5 text-white/70"}`}>English</button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/5 px-3 py-2 text-xs font-black text-cyan-200">{editorSaveStatus === "Saving..." ? "Unsaved" : "Saved"}</span>
            <button className="rounded-xl border border-white/15 px-3 py-2 text-xs font-black text-white/70">Copy KA {"->"} EN</button>
            <button className="rounded-xl border border-white/15 px-3 py-2 text-xs font-black text-white/70">Copy EN {"->"} KA</button>
          </div>
        </div>
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search content field" className="mt-4 w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300" />
      </section>

      {visibleGroups.map((group) => (
        <section key={group.key} className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
          <button onClick={() => setOpenGroups((current) => ({ ...current, [group.key]: !current[group.key] }))} className="flex w-full items-center justify-between text-left">
            <h2 className="text-lg font-black">{group.title}</h2>
            <span className="text-sm text-cyan-200">{openGroups[group.key] ? "Collapse" : "Expand"}</span>
          </button>
          {openGroups[group.key] && (
            <div className="mt-4 space-y-5">
              <div className="flex justify-end">
                <button onClick={() => resetGroup(group)} className="rounded-xl border border-orange-400/30 px-3 py-2 text-xs font-black text-orange-300">Reset group to default</button>
              </div>
              {!!group.fields?.length && (
                <div className="grid gap-3 md:grid-cols-2">
                  {group.fields.map((field) => (
                    <ContentField key={field} label={field} value={cmsData[language][field]} multiline={multilineFields.has(field)} onChange={(value) => updateContent(`${language}.${field}`, value)} />
                  ))}
                </div>
              )}
              {!!group.configFields?.length && (
                <div className="grid gap-3 md:grid-cols-2">
                  {group.configFields.map((field) => (
                    <ContentField key={field} label={`config.${field}`} value={cmsData.config[field]} onChange={(value) => updateContent(`config.${field}`, value)} />
                  ))}
                </div>
              )}
              {group.objectFields?.map((field) => (
                <div key={field}>
                  <div className="mb-3 text-xs font-black uppercase text-cyan-200">{field}</div>
                  <div className="grid gap-3 md:grid-cols-2">{renderObjectFields(field)}</div>
                </div>
              ))}
              {group.arrays?.map((field) => (
                <ArrayEditor
                  key={field}
                  label={field}
                  items={cmsData[language][field]}
                  itemShape={objectArrayShapes[field]}
                  onChange={(value) => updateContent(`${language}.${field}`, value)}
                />
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
};

export default ContentManager;
