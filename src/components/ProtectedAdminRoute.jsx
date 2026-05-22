import { useCMS } from "../hooks/useCMS";
import { hasPermission } from "../security/authPolicy";

const ProtectedAdminRoute = ({ children }) => {
  const { session, user, authReady, adminReady, authError, loginWithGoogle, logout } = useCMS();

  if (!authReady || !adminReady) {
    return <div className="flex min-h-screen items-center justify-center bg-[#050814] text-sm font-black text-white/70">Loading admin...</div>;
  }

  if (!session?.isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050814] p-4 text-white">
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-black/70 p-5 text-center">
          <h1 className="text-xl font-black">Admin Login</h1>
          <button onClick={loginWithGoogle} className="mt-5 w-full rounded-2xl bg-cyan-300 px-6 py-4 font-black text-black">Continue with Google</button>
          {authError && (
            <p className="mt-4 break-words rounded-xl border border-orange-400/30 bg-orange-500/10 p-3 text-left text-xs font-bold text-orange-200">
              {authError}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (!hasPermission(session.role, "content:read")) {
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
