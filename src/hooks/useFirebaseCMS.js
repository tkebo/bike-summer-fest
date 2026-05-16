import { useCallback, useEffect, useState } from "react";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, db, googleProvider } from "../lib/firebase";

const DRAFT_REF = () => doc(db, "site", "draft");
const PUBLISHED_REF = () => doc(db, "site", "published");
const ADMIN_REF = (uid) => doc(db, "admins", uid);

export async function loadPublishedConfig() {
  const snap = await getDoc(PUBLISHED_REF());
  return snap.exists() ? snap.data() : null;
}

export async function loadDraftConfig() {
  const snap = await getDoc(DRAFT_REF());
  return snap.exists() ? snap.data() : null;
}

export async function loadAdminProfile(uid) {
  const snap = await getDoc(ADMIN_REF(uid));
  return snap.exists() ? snap.data() : null;
}

export async function saveDraftConfig(data) {
  await setDoc(DRAFT_REF(), {
    ...data,
    status: "draft",
    updatedAt: serverTimestamp(),
  });
  return true;
}

export async function publishDraft(data) {
  await setDoc(PUBLISHED_REF(), {
    ...data,
    status: "published",
    publishedAt: serverTimestamp(),
  });
  return true;
}

export const useFirebaseCMS = () => {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [adminProfile, setAdminProfile] = useState(null);
  const [adminReady, setAdminReady] = useState(false);
  const [cloudStatus, setCloudStatus] = useState("Connecting");
  const [cloudSaveStatus, setCloudSaveStatus] = useState("Idle");
  const [publishStatus, setPublishStatus] = useState("Not published");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      if (!nextUser?.uid) {
        setAdminProfile(null);
        setAdminReady(true);
        setAuthReady(true);
        return;
      }

      setAdminReady(false);
      try {
        setAdminProfile(await loadAdminProfile(nextUser.uid));
      } catch (error) {
        console.error(error);
        setAdminProfile(null);
      } finally {
        setAdminReady(true);
        setAuthReady(true);
      }
    });
    return unsubscribe;
  }, []);

  const loginWithGoogle = useCallback(async () => {
    await signInWithPopup(auth, googleProvider);
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
  }, []);

  const loadCloudConfig = useCallback(async (authenticated) => {
    try {
      setCloudStatus("Connected");
      if (authenticated) {
        return (await loadDraftConfig()) || (await loadPublishedConfig());
      }
      return await loadPublishedConfig();
    } catch (error) {
      console.error(error);
      setCloudStatus("Offline");
      return null;
    }
  }, []);

  const saveDraft = useCallback(async (data) => {
    try {
      setCloudSaveStatus("Saving draft...");
      await saveDraftConfig(data);
      setCloudStatus("Connected");
      setCloudSaveStatus("Draft Saved");
      return true;
    } catch (error) {
      console.error(error);
      setCloudStatus("Offline");
      setCloudSaveStatus("Offline");
      return false;
    }
  }, []);

  const publish = useCallback(async (data) => {
    try {
      setPublishStatus("Publishing...");
      await publishDraft(data);
      setCloudStatus("Connected");
      setPublishStatus("Published");
      return true;
    } catch (error) {
      console.error(error);
      setCloudStatus("Offline");
      setPublishStatus("Publish failed");
      return false;
    }
  }, []);

  return {
    user,
    authReady,
    adminProfile,
    adminReady,
    cloudStatus,
    cloudSaveStatus,
    publishStatus,
    loginWithGoogle,
    logout,
    loadCloudConfig,
    saveDraft,
    publish,
  };
};
