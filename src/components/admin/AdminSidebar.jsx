const adminModules = [
  ["dashboard", "Dashboard"],
  ["content", "Content"],
  ["design", "Design"],
  ["media", "Media"],
  ["sections", "Sections"],
  ["tickets", "Tickets"],
  ["sponsors", "Sponsors"],
  ["schedule", "Schedule"],
  ["event-settings", "Event Settings"],
  ["seo", "SEO"],
  ["users", "Users"],
  ["visual-builder", "Visual Builder"],
  ["security", "Security"],
  ["publish", "Publish"],
];

const AdminSidebar = ({ activeModule, onSelect }) => (
  <aside className="border-b border-white/10 bg-black/25 p-4 lg:min-h-[calc(100vh-73px)] lg:border-b-0 lg:border-r">
    <nav className="flex gap-2 overflow-x-auto lg:grid lg:overflow-visible">
      {adminModules.map(([key, label]) => (
        <button
          key={key}
          onClick={() => onSelect(key)}
          className={`whitespace-nowrap rounded-xl px-4 py-3 text-left text-sm font-black transition ${
            activeModule === key ? "bg-cyan-300 text-black" : "bg-white/[0.045] text-white/70 hover:bg-white/[0.08]"
          }`}
        >
          {label}
        </button>
      ))}
    </nav>
  </aside>
);

export default AdminSidebar;
