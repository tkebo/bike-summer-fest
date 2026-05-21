const CLOUD_NAME = "dpnj2gjdy";
const UPLOAD_PRESET = "bike-summer-fest";
const FOLDER = "bike-summer-fest";
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

const isTrustedUploadResponse = (payload) => {
  try {
    const parsedUrl = new URL(payload.secure_url);
    return parsedUrl.protocol === "https:"
      && parsedUrl.hostname === "res.cloudinary.com"
      && parsedUrl.pathname.includes(`/${CLOUD_NAME}/`)
      && String(payload.public_id || "").startsWith(`${FOLDER}/`);
  } catch {
    return false;
  }
};

export const uploadImage = (file, onProgress) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", FOLDER);

    const request = new XMLHttpRequest();
    request.open("POST", UPLOAD_URL);
    request.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        onProgress?.(Math.round((event.loaded / event.total) * 100));
      }
    });
    request.addEventListener("load", () => {
      try {
        const payload = JSON.parse(request.responseText);
        if (request.status >= 200 && request.status < 300) {
          if (!isTrustedUploadResponse(payload)) {
            reject(new Error("Unexpected upload response"));
            return;
          }
          resolve(payload);
          return;
        }
        reject(new Error(payload.error?.message || "Cloudinary upload failed"));
      } catch {
        reject(new Error("Cloudinary upload failed"));
      }
    });
    request.addEventListener("error", () => reject(new Error("Cloudinary upload failed")));
    request.send(formData);
  });
};

export const getOptimizedImageUrl = (url, width = "auto") => {
  if (!url?.includes("/upload/")) return url;
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
};

export const getResponsiveImageSrcSet = (url, widths = [480, 720, 960, 1400]) => {
  if (!url?.includes("/upload/")) return undefined;
  return widths.map((width) => `${getOptimizedImageUrl(url, width)} ${width}w`).join(", ");
};
