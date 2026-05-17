import { AdminCard } from "./AdminUI";

const UsersRolesModule = ({ user, adminProfile }) => (
  <AdminCard title="Users and roles">
    <div className="grid gap-3 text-sm">
      <div className="flex justify-between"><span>Current user</span><span>{user?.email}</span></div>
      <div className="flex justify-between"><span>UID</span><span className="truncate pl-4">{user?.uid}</span></div>
      <div className="flex justify-between"><span>Role</span><span className="text-cyan-300">{adminProfile?.role || "viewer"}</span></div>
      <div className="flex justify-between"><span>Status</span><span>{adminProfile?.active ? "active" : "inactive"}</span></div>
      <p className="rounded-xl bg-black/25 p-3 text-white/55">Role documents live in Firestore `admins/&#123;uid&#125;`. Owner-managed CRUD UI is prepared as the next hardening step.</p>
    </div>
  </AdminCard>
);

export default UsersRolesModule;
