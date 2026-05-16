import { useCMS } from "../hooks/useCMS";
import { hasPermission } from "../security/authPolicy";

const ProtectedAdminRoute = ({ children }) => {
  const { session } = useCMS();

  if (!session?.isAuthenticated) {
    return null;
  }

  if (session?.isAuthenticated && !hasPermission(session.role, "admin:write")) {
    return null;
  }

  return children;
};

export default ProtectedAdminRoute;
