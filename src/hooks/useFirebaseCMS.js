import { useCallback, useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, db, googleProvider } from "../lib/firebase";
import { isAdminUser } from "../security/authPolicy";

const DRAFT_REF = () => doc(db, "site", "draft");
const PUBLISHED_REF = () => doc(db, "site", "published");
const ADMIN_REF = (uid) => doc(db, "admins", uid);
const VERSIONS_REF = () => collection(db, "site_versions");

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

export async function createBootstrapOwnerProfile(user) {
  const profile = {
    email: user.email.toLowerCase(),
    role: "owner",
    active: true,
  };
  await setDoc(ADMIN_REF(user.uid), profile);
  return profile;
}

export async function saveDraftConfig(data, user) {
  await setDoc(DRAFT_REF(), {
    ...data,
    status: "draft",
    updatedAt: serverTimestamp(),
    updatedBy: user?.email || "",
  });
  return true;
}

export async function publishDraft(data, user) {
  await setDoc(PUBLISHED_REF(), {
    ...data,
    status: "published",
    publishedAt: serverTimestamp(),
    publishedBy: user?.email || "",
  });
  return true;
}

export async function createVersion(data, note, user) {
  const ref = await addDoc(VERSIONS_REF(), {
    createdAt: serverTimestamp(),
    createdBy: user?.email || "",
    note,
    contentSnapshot: data.content,
    editorSnapshot: data.editor,
    seoSnapshot: data.content?.config?.seo || null,
    eventSettingsSnapshot: data.content?.config?.eventSettings || null,
    sectionsSnapshot: data.content?.config?.sections || [],
  });
  return ref.id;
}

export async function loadVersions() {
  const snapshot = await getDocs(query(VERSIONS_REF(), orderBy("createdAt", "desc")));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export const useFirebaseCMS = () => {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [adminProfile, setAdminProfile] = useState(null);
  const [adminReady, setAdminReady] = useState(false);
  const [cloudStatus, setCloudStatus] = useState("Connecting");
  const [cloudSaveStatus, setCloudSaveStatus] = useState("Idle");
  const [publishStatus, setPublishStatus] = useState("Not published");
  const [draftMeta, setDraftMeta] = useState(null);
  const [publishedMeta, setPublishedMeta] = useState(null);
  const [versions, setVersions] = useState([]);

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
        const existingProfile = await loadAdminProfile(nextUser.uid);
        if (existingProfile) {
          setAdminProfile(existingProfile);
          if (existingProfile.active) setVersions(await loadVersions());
        } else if (isAdminUser(nextUser)) {
          setAdminProfile(await createBootstrapOwnerProfile(nextUser));
          setVersions(await loadVersions());
        } else {
          setAdminProfile(null);
        }
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
      const published = await loadPublishedConfig();
      setPublishedMeta(published);
      if (authenticated) {
        const draft = await loadDraftConfig();
        setDraftMeta(draft);
        return draft || published;
      }
      return published;
    } catch (error) {
      console.error(error);
      setCloudStatus("Offline");
      return null;
    }
  }, []);

  const saveDraft = useCallback(async (data) => {
    try {
      setCloudSaveStatus("Saving draft...");
      await saveDraftConfig(data, user);
      setDraftMeta(await loadDraftConfig());
      setCloudStatus("Connected");
      setCloudSaveStatus("Draft Saved");
      return true;
    } catch (error) {
      console.error(error);
      setCloudStatus("Offline");
      setCloudSaveStatus("Offline");
      return false;
    }
  }, [user]);

  const publish = useCallback(async (data, note = "") => {
    try {
      setPublishStatus("Publishing...");
      const versionId = await createVersion(data, note, user);
      await publishDraft({ ...data, versionId }, user);
      setPublishedMeta(await loadPublishedConfig());
      setVersions(await loadVersions());
      setCloudStatus("Connected");
      setPublishStatus("Published");
      return true;
    } catch (error) {
      console.error(error);
      setCloudStatus("Offline");
      setPublishStatus("Publish failed");
      return false;
    }
  }, [user]);

  const refreshVersions = useCallback(async () => {
    try {
      setVersions(await loadVersions());
    } catch (error) {
      console.error(error);
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
    draftMeta,
    publishedMeta,
    versions,
    loginWithGoogle,
    logout,
    loadCloudConfig,
    saveDraft,
    publish,
    refreshVersions,
  };
};
