import { useCallback, useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { uploadImage } from "../lib/cloudinary";
import { validateFutureImageUpload } from "../security/uploadPolicy";
import { AUDIT_ACTIONS, logAudit } from "../security/securityAudit";

const MEDIA_COLLECTION = collection(db, "media");

export const useMediaLibrary = (user, isAdmin) => {
  const [mediaAssets, setMediaAssets] = useState([]);
  const [mediaLoading, setMediaLoading] = useState(true);
  const [mediaError, setMediaError] = useState("");
  const [mediaUploadProgress, setMediaUploadProgress] = useState(0);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      MEDIA_COLLECTION,
      (snapshot) => {
        setMediaAssets(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
        setMediaLoading(false);
      },
      (error) => {
        console.error(error);
        setMediaError(error.message);
        setMediaLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  const activeMediaAssets = useMemo(() => mediaAssets.filter((asset) => asset.active !== false), [mediaAssets]);
  const uploadHistory = useMemo(
    () => [...mediaAssets].sort((left, right) => (right.createdAt?.seconds || 0) - (left.createdAt?.seconds || 0)).slice(0, 8),
    [mediaAssets]
  );

  const createMediaAsset = useCallback(async (file, type = "general") => {
    if (!isAdmin) throw new Error("Admin access is required");
    const validation = validateFutureImageUpload(file);
    if (!validation.ok) throw new Error(validation.reason);

    setMediaError("");
    const upload = await uploadImage(file, setMediaUploadProgress);
    const title = file.name.replace(/\.[^.]+$/, "");
    const ref = await addDoc(MEDIA_COLLECTION, {
      url: upload.secure_url,
      optimizedUrl: upload.secure_url,
      publicId: upload.public_id,
      type,
      alt: "",
      title,
      tags: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: user.uid,
      active: true,
    });
    await logAudit(AUDIT_ACTIONS.MEDIA_UPLOAD, {
      actorUid: user.uid,
      actorEmail: user.email || "",
      targetType: "media",
      targetId: ref.id,
      summary: `Uploaded ${title}`,
      metadata: { type, publicId: upload.public_id },
    });
    setMediaUploadProgress(0);
    return { id: ref.id, url: upload.secure_url, publicId: upload.public_id, type, alt: "", title, tags: [], active: true };
  }, [isAdmin, user]);

  const updateMediaAsset = useCallback(async (assetId, patch) => {
    if (!isAdmin) throw new Error("Admin access is required");
    await updateDoc(doc(db, "media", assetId), {
      ...patch,
      updatedAt: serverTimestamp(),
    });
  }, [isAdmin]);

  const softDeleteMediaAsset = useCallback(async (assetId) => {
    await updateMediaAsset(assetId, { active: false });
    await logAudit(AUDIT_ACTIONS.MEDIA_DEACTIVATE, {
      actorUid: user.uid,
      actorEmail: user.email || "",
      targetType: "media",
      targetId: assetId,
      summary: "Media asset deactivated",
    });
  }, [updateMediaAsset, user]);
  const restoreMediaAsset = useCallback(async (assetId) => {
    await updateMediaAsset(assetId, { active: true });
    await logAudit(AUDIT_ACTIONS.MEDIA_RESTORE, {
      actorUid: user.uid,
      actorEmail: user.email || "",
      targetType: "media",
      targetId: assetId,
      summary: "Media asset restored",
    });
  }, [updateMediaAsset, user]);

  const hardDeleteMediaAsset = useCallback(async (asset) => {
    if (!isAdmin) throw new Error("Admin access is required");
    await deleteDoc(doc(db, "media", asset.id));
    await logAudit(AUDIT_ACTIONS.MEDIA_DELETE, {
      actorUid: user.uid,
      actorEmail: user.email || "",
      targetType: "media",
      targetId: asset.id,
      summary: `Permanently deleted ${asset.title || "media asset"}`,
      metadata: { publicId: asset.publicId || "", url: asset.url || "" },
    });
  }, [isAdmin, user]);

  return {
    mediaAssets,
    activeMediaAssets,
    uploadHistory,
    mediaLoading,
    mediaError,
    mediaUploadProgress,
    createMediaAsset,
    updateMediaAsset,
    softDeleteMediaAsset,
    restoreMediaAsset,
    hardDeleteMediaAsset,
  };
};
