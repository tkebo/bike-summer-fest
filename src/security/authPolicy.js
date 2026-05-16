import { ROLE_PERMISSIONS, ROLES } from "./securityConfig";
import { ADMIN_EMAILS } from "../config/admins";

export const authRoadmap = {
  productionRequired: true,
  providers: ["Supabase Auth", "Firebase Auth", "custom JWT"],
  protectedRoutes: ["/admin"],
  requiredServerControls: [
    "authenticated API requests",
    "server-side role checks",
    "rate limiting",
    "database row-level security",
    "server-side validation",
  ],
};

export const createMvpSession = () => ({
  isAuthenticated: false,
  role: ROLES.VIEWER,
  token: null,
});

export const hasPermission = (role, permission) => {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
};

export const isAdminUser = (user) => {
  return Boolean(user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase()));
};

export const isFirestoreAdmin = (user, adminProfile) => {
  if (!user || !adminProfile?.active) return false;
  return ["owner", "admin", "editor"].includes(adminProfile.role);
};

export const requireAdminAction = (session, permission) => {
  if (!session?.isAuthenticated) {
    throw new Error("Admin authentication is required");
  }

  if (session?.isAuthenticated && !hasPermission(session.role, permission)) {
    throw new Error("Insufficient permissions");
  }

  return true;
};
