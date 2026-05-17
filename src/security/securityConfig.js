export const APP_ENV = import.meta.env.MODE;

export const STORAGE_MODE = {
  MVP_LOCAL: "mvp-local",
  REMOTE_DATABASE: "remote-database",
};

export const CURRENT_STORAGE_MODE = STORAGE_MODE.MVP_LOCAL;

export const ROLES = {
  VIEWER: "viewer",
  EDITOR: "editor",
  ADMIN: "admin",
  OWNER: "owner",
};

export const ROLE_PERMISSIONS = {
  [ROLES.VIEWER]: ["content:read"],
  [ROLES.EDITOR]: ["content:read", "content:write", "design:write"],
  [ROLES.ADMIN]: ["content:read", "content:write", "design:write", "admin:write", "publish:write"],
  [ROLES.OWNER]: ["content:read", "content:write", "design:write", "admin:write", "publish:write"],
};

export const SECURITY_LIMITS = {
  maxTextLength: 5000,
  maxJsonBytes: 512 * 1024,
  maxImageBytes: 5 * 1024 * 1024,
};

export const ALLOWED_IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];

export const ALLOWED_EXTERNAL_URL_HOSTS = [
  "www.google.com",
  "google.com",
  "maps.google.com",
  "images.unsplash.com",
  "res.cloudinary.com",
];

export const CONFIG_BACKUP_VERSION = 1;
