import { ALLOWED_IMAGE_MIME_TYPES, SECURITY_LIMITS } from "./securityConfig";
import { validateImageFile } from "./sanitize";

export const validateFutureImageUpload = (file) => {
  return validateImageFile(file, ALLOWED_IMAGE_MIME_TYPES, SECURITY_LIMITS.maxImageBytes);
};

export const uploadRoadmap = {
  providers: ["Cloudinary signed upload", "Supabase Storage with RLS", "Firebase Storage rules"],
  requiredControls: [
    "accept only image MIME types",
    "enforce max file size before upload",
    "sanitize filenames",
    "store generated public IDs instead of raw user filenames",
    "scan server-side where possible",
    "separate public media from private admin-only assets",
  ],
};
