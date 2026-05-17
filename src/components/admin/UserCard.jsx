import RoleBadge from "./RoleBadge";

const formatTimestamp = (timestamp) => timestamp?.toDate?.().toLocaleString?.() || "Not available";
const roles = ["owner", "admin", "editor", "viewer"];

const UserCard = ({
  user,
  currentUid,
  ownerCount,
  onRoleChange,
  onToggleActive,
  onRemove,
}) => {
  const isCurrentUser = user.uid === currentUid;
  const isLastOwner = user.role === "owner" && ownerCount <= 1;

  return (
    <article className={`rounded-2xl border p-4 ${isCurrentUser ? "border-cyan-300/40 bg-cyan-300/[0.06]" : "border-white/10 bg-black/20"}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-black">{user.displayName || "Unnamed user"}</h3>
            <RoleBadge role={user.role} />
            {isCurrentUser && <span className="rounded-full bg-white/10 px-2 py-1 text-xs font-black">current session</span>}
            {!user.active && <span className="rounded-full bg-orange-400/15 px-2 py-1 text-xs font-black text-orange-300">inactive</span>}
          </div>
          <div className="mt-2 text-sm text-white/60">{user.email}</div>
          <div className="mt-2 grid gap-1 text-xs text-white/40">
            <span>Created: {formatTimestamp(user.createdAt)}</span>
            <span>Updated: {formatTimestamp(user.updatedAt)}</span>
            <span>Provider: {user.provider || "unknown"}</span>
            <span>Last login: placeholder</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={user.role}
            disabled={isCurrentUser && user.role === "owner"}
            onChange={(event) => onRoleChange(user, event.target.value)}
            className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-xs"
          >
            {roles.map((role) => <option key={role} value={role}>{role}</option>)}
          </select>
          <button onClick={() => onToggleActive(user)} disabled={isCurrentUser || isLastOwner} className="rounded-xl border border-white/15 px-3 py-2 text-xs disabled:opacity-30">
            {user.active ? "Deactivate" : "Activate"}
          </button>
          <button onClick={() => onRemove(user)} disabled={isCurrentUser || isLastOwner} className="rounded-xl border border-orange-400/30 px-3 py-2 text-xs text-orange-300 disabled:opacity-30">
            Remove access
          </button>
        </div>
      </div>
    </article>
  );
};

export default UserCard;
