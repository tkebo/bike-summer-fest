import { AdminCard, AdminField } from "./AdminUI";

const EventSettingsModule = ({ cmsData, updateContent }) => (
  <AdminCard title="Countdown and event settings">
    <div className="grid gap-3 md:grid-cols-2">
      <AdminField label="Festival date" type="datetime-local" value={cmsData.config.festivalDate.slice(0, 16)} onChange={(value) => updateContent("config.festivalDate", `${value}:00`)} />
      <AdminField label="Timezone" value={cmsData.config.timezone} onChange={(value) => updateContent("config.timezone", value)} />
      <AdminField label="Event location" value={cmsData.config.eventLocation} onChange={(value) => updateContent("config.eventLocation", value)} />
      <AdminField label="KA labels" value={Object.values(cmsData.ka.countdownLabels).join(", ")} onChange={(value) => {
        const [days, hours, minutes, seconds] = value.split(",").map((item) => item.trim());
        updateContent("ka.countdownLabels", { days, hours, minutes, seconds });
      }} />
      <AdminField label="EN labels" value={Object.values(cmsData.en.countdownLabels).join(", ")} onChange={(value) => {
        const [days, hours, minutes, seconds] = value.split(",").map((item) => item.trim());
        updateContent("en.countdownLabels", { days, hours, minutes, seconds });
      }} />
    </div>
  </AdminCard>
);

export default EventSettingsModule;
