import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

const AUDIT_LOGS_REF = collection(db, "audit_logs");

export const AUDIT_ACTIONS = {
  LOGIN: "login",
  LOGOUT: "logout",
  DRAFT_SAVE: "draft_save",
  PUBLISH: "publish",
  RESTORE_VERSION: "restore_version",
  IMPORT_CONFIG: "import_config",
  EXPORT_CONFIG: "export_config",
  MEDIA_UPLOAD: "media_upload",
  MEDIA_DEACTIVATE: "media_deactivate",
  MEDIA_RESTORE: "media_restore",
  MEDIA_DELETE: "media_delete",
  SPONSOR_ADD: "sponsor_add",
  SPONSOR_EDIT: "sponsor_edit",
  SPONSOR_DELETE: "sponsor_delete",
  TICKET_ADD: "ticket_add",
  TICKET_EDIT: "ticket_edit",
  TICKET_DELETE: "ticket_delete",
  SCHEDULE_EDIT: "schedule_edit",
  USER_INVITE: "user_invite",
  USER_ROLE_CHANGE: "user_role_change",
  USER_DEACTIVATE: "user_deactivate",
  USER_REMOVE: "user_remove",
  SECURITY_PLACEHOLDER: "security_action",
};

export const logAudit = async (action, {
  actorUid = "",
  actorEmail = "",
  actorRole = "",
  targetType = "",
  targetId = "",
  summary = "",
  metadata = {},
} = {}) => {
  try {
    await addDoc(AUDIT_LOGS_REF, {
      action,
      actorUid,
      actorEmail,
      actorRole,
      targetType,
      targetId,
      summary,
      createdAt: serverTimestamp(),
      metadata,
    });
  } catch (error) {
    console.warn("Audit log write skipped", error);
  }
};
