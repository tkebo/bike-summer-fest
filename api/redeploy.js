const json = (response, status, body) => {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify(body));
};

const readAdminProfile = async (projectId, token) => {
  const meResponse = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.FIREBASE_WEB_API_KEY || process.env.VITE_FIREBASE_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken: token }),
  });
  if (!meResponse.ok) throw new Error("Invalid Firebase token");
  const me = await meResponse.json();
  const uid = me.users?.[0]?.localId;
  if (!uid) throw new Error("Missing Firebase uid");

  const profileResponse = await fetch(`https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/admins/${uid}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!profileResponse.ok) throw new Error("Admin profile not found");
  const profile = await profileResponse.json();
  return {
    uid,
    role: profile.fields?.role?.stringValue || "",
    active: profile.fields?.active?.booleanValue === true,
  };
};

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    json(response, 405, { ok: false, error: "Method not allowed" });
    return;
  }

  const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID;
  if (!deployHookUrl || !projectId) {
    json(response, 500, { ok: false, error: "Deploy hook is not configured" });
    return;
  }

  const token = String(request.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!token) {
    json(response, 401, { ok: false, error: "Missing Firebase token" });
    return;
  }

  try {
    const profile = await readAdminProfile(projectId, token);
    if (!profile.active || !["owner", "admin"].includes(profile.role)) {
      json(response, 403, { ok: false, error: "Publish permission is required" });
      return;
    }

    const deployResponse = await fetch(deployHookUrl, { method: "POST" });
    if (!deployResponse.ok) {
      const details = await deployResponse.text();
      json(response, 502, { ok: false, error: "Vercel deploy hook failed", details: details.slice(0, 300) });
      return;
    }

    json(response, 202, { ok: true, status: "queued" });
  } catch (error) {
    json(response, 401, { ok: false, error: error.message || "Deploy authorization failed" });
  }
}
