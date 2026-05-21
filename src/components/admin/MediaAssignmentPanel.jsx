const assignments = [
  ["hero-desktop", "Hero desktop background"],
  ["hero-tablet", "Hero tablet background"],
  ["hero-mobile", "Hero mobile background"],
  ["section", "Section background"],
  ["gallery", "Gallery"],
  ["sponsor", "Sponsor logo"],
  ["center-mark", "Hero center mark"],
  ["intro", "Intro portal image"],
  ["faq", "FAQ / location image"],
  ["zones", "Zones panorama"],
];

const MediaAssignmentPanel = ({ onAssign }) => (
  <div className="grid grid-cols-2 gap-2">
    {assignments.map(([key, label]) => (
      <button key={key} onClick={() => onAssign(key)} className="rounded-xl border border-white/15 px-3 py-2 text-xs font-black hover:bg-white/5">
        Use as {label}
      </button>
    ))}
  </div>
);

export default MediaAssignmentPanel;
