import { useEffect, useMemo, useState } from "react";
import { PERMISSION_LABELS, ROLE_PERMISSIONS } from "../../security/securityConfig";
import InviteUserModal from "./InviteUserModal";
import RoleBadge from "./RoleBadge";
import UserCard from "./UserCard";

const roles = ["all", "owner", "admin", "editor", "viewer"];

const UsersManager = ({
  user,
  adminUsers,
  pendingInvites,
  refreshAdminUsers,
  inviteAdminUser,
  updateAdminUser,
  removeAdminUser,
  removePendingInvite,
}) => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showInvite, setShowInvite] = useState(false);

  useEffect(() => {
    refreshAdminUsers();
  }, [refreshAdminUsers]);

  const ownerCount = adminUsers.filter((item) => item.active !== false && item.role === "owner").length;
  const filteredUsers = useMemo(() => adminUsers.filter((item) => {
    const query = search.toLowerCase();
    const matchesSearch = !query || item.email?.toLowerCase().includes(query) || item.displayName?.toLowerCase().includes(query);
    const matchesRole = roleFilter === "all" || item.role === roleFilter;
    return matchesSearch && matchesRole;
  }), [adminUsers, roleFilter, search]);

  const changeRole = async (targetUser, role) => {
    if (targetUser.uid === user.uid && targetUser.role === "owner") return;
    if (targetUser.role === "owner" && ownerCount <= 1 && role !== "owner") return;
    if (window.confirm(`Change ${targetUser.email} role to ${role}?`)) await updateAdminUser(targetUser.uid, { role });
  };

  const toggleActive = async (targetUser) => {
    if (window.confirm(`${targetUser.active ? "Deactivate" : "Activate"} ${targetUser.email}?`)) {
      await updateAdminUser(targetUser.uid, { active: !targetUser.active });
    }
  };

  const removeAccess = async (targetUser) => {
    if (window.confirm(`Remove access for ${targetUser.email}?`)) await removeAdminUser(targetUser.uid);
  };

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-xl font-black">Users & Roles</h2>
            <p className="mt-1 text-sm text-white/55">Owner-managed Firebase admin access and pending invites.</p>
          </div>
          <button onClick={() => setShowInvite(true)} className="rounded-xl bg-cyan-300 px-4 py-2 font-black text-black">Add user by email</button>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_180px]">
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search users" className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm" />
          <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm">
            {roles.map((role) => <option key={role} value={role}>{role}</option>)}
          </select>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {Object.entries(ROLE_PERMISSIONS).map(([role, permissions]) => (
          <article key={role} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
            <RoleBadge role={role} />
            <div className="mt-3 grid gap-2 text-sm text-white/60">
              {permissions.map((permission) => <span key={permission}>{PERMISSION_LABELS[permission] || permission}</span>)}
            </div>
          </article>
        ))}
      </section>

      <section className="space-y-3">
        {filteredUsers.map((item) => (
          <UserCard
            key={item.uid}
            user={item}
            currentUid={user.uid}
            ownerCount={ownerCount}
            onRoleChange={changeRole}
            onToggleActive={toggleActive}
            onRemove={removeAccess}
          />
        ))}
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.045] p-5">
        <h3 className="text-lg font-black">Pending invites</h3>
        <div className="mt-4 grid gap-3">
          {pendingInvites.map((invite) => (
            <div key={invite.email} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
              <div>
                <div className="font-black">{invite.email}</div>
                <div className="mt-2"><RoleBadge role={invite.role} /></div>
              </div>
              <div className="flex gap-2">
                <button className="rounded-xl border border-white/15 px-3 py-2 text-xs">Resend invite</button>
                <button onClick={() => removePendingInvite(invite.email)} className="rounded-xl border border-orange-400/30 px-3 py-2 text-xs text-orange-300">Remove invite</button>
              </div>
            </div>
          ))}
          {!pendingInvites.length && <div className="text-sm text-white/45">No pending invites.</div>}
        </div>
      </section>

      <section className="rounded-2xl border border-orange-400/20 bg-orange-400/[0.04] p-5">
        <h3 className="font-black text-orange-300">Danger zone</h3>
        <p className="mt-2 text-sm text-white/55">Current owner cannot demote self, and the final active owner cannot be deactivated or removed from this UI.</p>
      </section>

      {showInvite && <InviteUserModal onClose={() => setShowInvite(false)} onInvite={inviteAdminUser} />}
    </div>
  );
};

export default UsersManager;
