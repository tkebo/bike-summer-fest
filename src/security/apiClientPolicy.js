export const apiSecurityRoadmap = {
  auth: "All mutating API calls must include an authenticated user token.",
  authorization: "Server must verify admin/editor/viewer role on every request.",
  validation: "Server must re-validate CMS payloads even if the frontend validates them.",
  rateLimiting: "Admin and upload endpoints require rate limiting.",
  secrets: "Never ship service role keys or private API secrets to the browser.",
};

export const createAuthenticatedHeaders = (session) => {
  if (!session?.token) {
    throw new Error("Authenticated API calls require a token");
  }

  return {
    Authorization: `Bearer ${session.token}`,
    "Content-Type": "application/json",
  };
};
