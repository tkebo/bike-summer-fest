import { AdminCard, AdminField, AdminSelect } from "./AdminUI";

const ScheduleManagerModule = ({ cmsData, updateContent }) => (
  <div className="grid gap-4">
    {["ka", "en"].map((locale) => (
      <AdminCard key={locale} title={`${locale.toUpperCase()} schedule`}>
        <div className="grid gap-4">
          {cmsData[locale].days.map((day, index) => (
            <div key={index} className="grid gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 md:grid-cols-2">
              <AdminField label="Day" value={day.day} onChange={(value) => updateContent(`${locale}.days.${index}.day`, value)} />
              <AdminField label="Time" value={day.time || ""} onChange={(value) => updateContent(`${locale}.days.${index}.time`, value)} />
              <AdminField label="Title" value={day.title} onChange={(value) => updateContent(`${locale}.days.${index}.title`, value)} />
              <AdminField label="Location" value={day.location || ""} onChange={(value) => updateContent(`${locale}.days.${index}.location`, value)} />
              <AdminField label="Description" value={day.text} multiline onChange={(value) => updateContent(`${locale}.days.${index}.text`, value)} />
              <AdminSelect label="Status" value={String(day.active ?? true)} onChange={(value) => updateContent(`${locale}.days.${index}.active`, value === "true")} options={["true", "false"]} />
            </div>
          ))}
        </div>
      </AdminCard>
    ))}
  </div>
);

export default ScheduleManagerModule;
