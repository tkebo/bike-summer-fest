const roleStyles = {
  owner: "bg-orange-400/15 text-orange-300",
  admin: "bg-cyan-300/15 text-cyan-200",
  editor: "bg-emerald-300/15 text-emerald-200",
  viewer: "bg-white/10 text-white/70",
};

const RoleBadge = ({ role }) => (
  <span className={`rounded-full px-2 py-1 text-xs font-black ${roleStyles[role] || roleStyles.viewer}`}>
    {role}
  </span>
);

export default RoleBadge;
