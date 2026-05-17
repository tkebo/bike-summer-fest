import { useCMS } from "../hooks/useCMS";
import { hasPermission } from "../security/authPolicy";

const ProtectedAdminRoute = ({ children }) => {
  const { session, user, authReady, adminReady, loginWithGoogle, logout } = useCMS();

  if (!authReady || !adminReady) {
    return <div className="flex min-h-screen items-center justify-center bg-[#050814] text-sm font-black text-white/70">Loading admin...</div>;
  }

  if (!session?.isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050814] p-4 text-white">
        <button onClick={loginWithGoogle} className="rounded-2xl bg-cyan-300 px-6 py-4 font-black text-black">Admin Login</button>
      </div>
    );
  }

  if (!hasPermission(session.role, "admin:write")) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050814] p-4 text-white">
        <div className="w-full max-w-sm rounded-2xl border border-orange-400/30 bg-black/80 p-5">
          <h1 className="font-black text-orange-400">Access denied</h1>
          <p className="mt-3 break-all text-sm text-white/60">{user?.email}</p>
          <button onClick={logout} className="mt-4 w-full rounded-xl border border-white/15 px-4 py-3 font-black">Logout</button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedAdminRoute;
