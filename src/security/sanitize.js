import { ALLOWED_EXTERNAL_URL_HOSTS, SECURITY_LIMITS } from "./securityConfig";

const SCRIPT_LIKE_PROTOCOL = /^\s*(javascript|data|vbscript):/i;

const stripControlChars = (value) => {
  return Array.from(value)
    .filter((char) => {
      const code = char.charCodeAt(0);
      return code === 9 || code === 10 || code === 13 || (code >= 32 && code !== 127);
    })
    .join("");
};

export const sanitizeText = (value, maxLength = SECURITY_LIMITS.maxTextLength) => {
  if (typeof value !== "string") return value;
  return stripControlChars(value)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .slice(0, maxLength);
};

export const sanitizeFilename = (filename) => {
  return String(filename)
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120);
};

export const isSafeUrl = (url) => {
  if (typeof url !== "string") return false;
  if (url.startsWith("/")) return true;
  if (SCRIPT_LIKE_PROTOCOL.test(url)) return false;

  try {
    const parsed = new URL(url);
    return ["https:"].includes(parsed.protocol) && ALLOWED_EXTERNAL_URL_HOSTS.includes(parsed.hostname);
  } catch {
    return false;
  }
};

export const sanitizeUrl = (url, fallback = "") => {
  const clean = sanitizeText(url, 2048);
  return isSafeUrl(clean) ? clean : fallback;
};

export const sanitizeDeep = (value) => {
  if (Array.isArray(value)) return value.map(sanitizeDeep);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [sanitizeText(key, 120), sanitizeDeep(item)])
    );
  }
  return sanitizeText(value);
};

export const validateImageFile = (file, allowedTypes, maxBytes) => {
  if (!file) return { ok: false, reason: "Missing file" };
  if (!allowedTypes.includes(file.type)) return { ok: false, reason: "Only image files are allowed" };
  if (file.size > maxBytes) return { ok: false, reason: "Image file is too large" };
  return { ok: true, filename: sanitizeFilename(file.name) };
};
