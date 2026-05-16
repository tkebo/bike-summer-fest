import { defaultContent } from "../data/defaultContent";
import { defaultEditor } from "../data/defaultEditor";
import { CONFIG_BACKUP_VERSION } from "./securityConfig";
import { sanitizeDeep, sanitizeUrl } from "./sanitize";

const BLOCKED_KEYS = new Set([
  "__proto__",
  "prototype",
  "constructor",
  "script",
  "scripts",
  "onload",
  "onerror",
  "onclick",
  "dangerouslySetInnerHTML",
]);

const isPlainObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

const assertNoBlockedKeys = (value, path = "root") => {
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoBlockedKeys(item, `${path}.${index}`));
    return;
  }
  if (!isPlainObject(value)) return;

  Object.keys(value).forEach((key) => {
    if (BLOCKED_KEYS.has(key) || /^on[A-Z]/.test(key)) {
      throw new Error(`Blocked field "${key}" at ${path}`);
    }
    assertNoBlockedKeys(value[key], `${path}.${key}`);
  });
};

const unwrapBackup = (payload) => {
  if (payload && payload.meta && payload.data) {
    if (payload.meta.version > CONFIG_BACKUP_VERSION) {
      throw new Error("Unsupported backup version");
    }
    return payload.data;
  }
  return payload;
};

const validateContentShape = (payload) => {
  const data = unwrapBackup(payload);
  assertNoBlockedKeys(data);
  if (!isPlainObject(data)) throw new Error("Content config must be an object");

  ["ka", "en", "config"].forEach((key) => {
    if (key in data && !isPlainObject(data[key])) {
      throw new Error(`Invalid "${key}" section`);
    }
  });

  const sanitized = sanitizeDeep(data);
  const images = sanitized.config?.images;
  if (images) {
    ["hero", "gallery1", "gallery2", "gallery3"].forEach((key) => {
      if (images[key]) images[key] = sanitizeUrl(images[key], defaultContent.config.images[key]);
    });
  }

  return sanitized;
};

const validateEditorShape = (payload) => {
  const data = unwrapBackup(payload);
  assertNoBlockedKeys(data);
  if (!isPlainObject(data)) throw new Error("Design config must be an object");

  const allowedKeys = new Set(Object.keys(defaultEditor));
  const nextEditor = {};

  Object.entries(data).forEach(([key, value]) => {
    if (!allowedKeys.has(key)) return;
    const defaultValue = defaultEditor[key];

    if (typeof defaultValue === "number") {
      const numeric = Number(value);
      if (Number.isFinite(numeric)) nextEditor[key] = numeric;
      return;
    }

    if (typeof defaultValue === "string") {
      nextEditor[key] = sanitizeDeep(value);
      return;
    }

    if (Array.isArray(defaultValue) && Array.isArray(value)) {
      nextEditor[key] = value
        .filter((item) => defaultValue.includes(item))
        .map((item) => sanitizeDeep(item));
      return;
    }

    if (isPlainObject(defaultValue) && isPlainObject(value)) {
      nextEditor[key] = Object.keys(defaultValue).reduce((accumulator, nestedKey) => {
        if (typeof value[nestedKey] === typeof defaultValue[nestedKey]) {
          accumulator[nestedKey] = sanitizeDeep(value[nestedKey]);
        }
        return accumulator;
      }, {});
    }
  });

  return nextEditor;
};

export const validateImportedContent = (payload) => validateContentShape(payload);
export const validateImportedEditor = (payload) => validateEditorShape(payload);

export const createVersionedBackup = (type, data) => ({
  meta: {
    app: "bike-summer-fest",
    type,
    version: CONFIG_BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
  },
  data,
});
