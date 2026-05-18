import { useCallback, useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  deleteDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, db, googleProvider } from "../lib/firebase";
import { isAdminUser } from "../security/authPolicy";
import { AUDIT_ACTIONS, logAudit } from "../security/securityAudit";

const DRAFT_REF = () => doc(db, "site", "draft");
const PUBLISHED_REF = () => doc(db, "site", "published");
const ADMIN_REF = (uid) => doc(db, "admins", uid);
const VERSIONS_REF = () => collection(db, "site_versions");
const ADMINS_COLLECTION = () => collection(db, "admins");
const INVITES_COLLECTION = () => collection(db, "pending_invites");
const INVITE_REF = (email) => doc(db, "pending_invites", email.toLowerCase());

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
    displayName: user.displayName || "",
    email: user.email.toLowerCase(),
    role: "owner",
    active: true,
    provider: user.providerData?.[0]?.providerId || "google.com",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(ADMIN_REF(user.uid), profile);
  return profile;
}

export async function loadPendingInvite(email) {
  const snap = await getDoc(INVITE_REF(email));
  return snap.exists() ? snap.data() : null;
}

export async function acceptPendingInvite(user, invite) {
  const profile = {
    displayName: user.displayName || "",
    email: user.email.toLowerCase(),
    role: invite.role,
    active: true,
    provider: user.providerData?.[0]?.providerId || "google.com",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(ADMIN_REF(user.uid), profile);
  await deleteDoc(INVITE_REF(user.email));
  return profile;
}

export async function loadAdminUsers() {
  const snapshot = await getDocs(ADMINS_COLLECTION());
  return snapshot.docs.map((item) => ({ uid: item.id, ...item.data() }));
}

export async function loadPendingInvites() {
  const snapshot = await getDocs(INVITES_COLLECTION());
  return snapshot.docs.map((item) => ({ email: item.id, ...item.data() }));
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
  const [adminUsers, setAdminUsers] = useState([]);
  const [pendingInvites, setPendingInvites] = useState([]);

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
          const invite = await loadPendingInvite(nextUser.email.toLowerCase());
          setAdminProfile(invite ? await acceptPendingInvite(nextUser, invite) : null);
        }
        await logAudit(AUDIT_ACTIONS.LOGIN, {
          actorUid: nextUser.uid,
          actorEmail: nextUser.email || "",
          actorRole: existingProfile?.role || "pending",
          targetType: "auth",
          targetId: nextUser.uid,
          summary: "User logged in",
        });
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
    if (user) {
      await logAudit(AUDIT_ACTIONS.LOGOUT, {
        actorUid: user.uid,
        actorEmail: user.email || "",
        actorRole: adminProfile?.role || "",
        targetType: "auth",
        targetId: user.uid,
        summary: "User logged out",
      });
    }
    await signOut(auth);
  }, [adminProfile, user]);

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
      await logAudit(AUDIT_ACTIONS.DRAFT_SAVE, {
        actorUid: user?.uid || "",
        actorEmail: user?.email || "",
        actorRole: adminProfile?.role || "",
        targetType: "site",
        targetId: "draft",
        summary: "Draft autosaved",
      });
      setCloudStatus("Connected");
      setCloudSaveStatus("Draft Saved");
      return true;
    } catch (error) {
      console.error(error);
      setCloudStatus("Offline");
      setCloudSaveStatus("Offline");
      return false;
    }
  }, [adminProfile, user]);

  const publish = useCallback(async (data, note = "") => {
    try {
      setPublishStatus("Publishing...");
      const versionId = await createVersion(data, note, user);
      await publishDraft({ ...data, versionId }, user);
      setPublishedMeta(await loadPublishedConfig());
      setVersions(await loadVersions());
      setCloudStatus("Connected");
      setPublishStatus("Published");
      await logAudit(AUDIT_ACTIONS.PUBLISH, {
        actorUid: user?.uid || "",
        actorEmail: user?.email || "",
        actorRole: adminProfile?.role || "",
        targetType: "site",
        targetId: "published",
        summary: note || "Draft published",
        metadata: { versionId },
      });
      return true;
    } catch (error) {
      console.error(error);
      setCloudStatus("Offline");
      setPublishStatus("Publish failed");
      return false;
    }
  }, [adminProfile, user]);

  const refreshVersions = useCallback(async () => {
    try {
      setVersions(await loadVersions());
    } catch (error) {
      console.error(error);
    }
  }, []);

  const refreshAdminUsers = useCallback(async () => {
    setAdminUsers(await loadAdminUsers());
    setPendingInvites(await loadPendingInvites());
  }, []);

  const inviteAdminUser = useCallback(async (email, role) => {
    await setDoc(INVITE_REF(email), {
      email: email.toLowerCase(),
      role,
      active: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    await refreshAdminUsers();
    await logAudit(AUDIT_ACTIONS.USER_INVITE, {
      actorUid: user?.uid || "",
      actorEmail: user?.email || "",
      actorRole: adminProfile?.role || "",
      targetType: "pending_invite",
      targetId: email,
      summary: `Invited ${email} as ${role}`,
    });
  }, [adminProfile?.role, refreshAdminUsers, user]);

  const updateAdminUser = useCallback(async (uid, patch) => {
    await updateDoc(ADMIN_REF(uid), {
      ...patch,
      updatedAt: serverTimestamp(),
    });
    await refreshAdminUsers();
    await logAudit(
      patch.role ? AUDIT_ACTIONS.USER_ROLE_CHANGE : AUDIT_ACTIONS.USER_DEACTIVATE,
      {
        actorUid: user?.uid || "",
        actorEmail: user?.email || "",
        actorRole: adminProfile?.role || "",
        targetType: "admin_user",
        targetId: uid,
        summary: patch.role ? `Changed role to ${patch.role}` : `Changed active state to ${patch.active}`,
        metadata: patch,
      }
    );
  }, [adminProfile?.role, refreshAdminUsers, user]);

  const removeAdminUser = useCallback(async (uid) => {
    await deleteDoc(ADMIN_REF(uid));
    await refreshAdminUsers();
    await logAudit(AUDIT_ACTIONS.USER_REMOVE, {
      actorUid: user?.uid || "",
      actorEmail: user?.email || "",
      actorRole: adminProfile?.role || "",
      targetType: "admin_user",
      targetId: uid,
      summary: "Removed admin access",
    });
  }, [adminProfile?.role, refreshAdminUsers, user]);

  const removePendingInvite = useCallback(async (email) => {
    await deleteDoc(INVITE_REF(email));
    await refreshAdminUsers();
  }, [refreshAdminUsers]);

  const subscribeToDraft = useCallback((onChange) => {
    return onSnapshot(DRAFT_REF(), (snapshot) => {
      onChange(snapshot.exists() ? snapshot.data() : null);
    });
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
    adminUsers,
    pendingInvites,
    loginWithGoogle,
    logout,
    loadCloudConfig,
    saveDraft,
    publish,
    refreshVersions,
    refreshAdminUsers,
    inviteAdminUser,
    updateAdminUser,
    removeAdminUser,
    removePendingInvite,
    subscribeToDraft,
  };
};
