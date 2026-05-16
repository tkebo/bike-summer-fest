/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { defaultContent } from "../data/defaultContent";
import { defaultEditor } from "../data/defaultEditor";
import { designTabs } from "../data/designTabs";
import { useCountdown } from "../hooks/useCountdown";
import { useFirebaseCMS } from "../hooks/useFirebaseCMS";
import { setNestedValue, mergeWithDefaults } from "../utils/cmsHelpers";
import { createEditorValueResolver } from "../utils/themeHelpers";
import { downloadJson, readJsonFile } from "../utils/exportImport";
import { sanitizeText, sanitizeDeep } from "../security/sanitize";
import { isAdminUser, isFirestoreAdmin, requireAdminAction } from "../security/authPolicy";
import { ROLES } from "../security/securityConfig";
import { createVersionedBackup, validateImportedContent, validateImportedEditor } from "../security/schemaValidation";

export const CMSContext = createContext(null);

const getInitialCmsData = () => {
  try {
    const saved = localStorage.getItem("bsf_cms_data");
    return saved ? mergeWithDefaults(defaultContent, JSON.parse(saved)) : defaultContent;
  } catch {
    return defaultContent;
  }
};

const getInitialEditor = () => {
  try {
    const saved = localStorage.getItem("bsf_editor");
    return saved ? { ...defaultEditor, ...JSON.parse(saved) } : defaultEditor;
  } catch {
    return defaultEditor;
  }
};

export const CMSProvider = ({ children }) => {
  const [cmsData, setCmsData] = useState(getInitialCmsData);
  const [editor, setEditor] = useState(getInitialEditor);
  const [adminMode, setAdminMode] = useState(false);
  const [lang, setLang] = useState("ka");
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorTab, setEditorTab] = useState("design");
  const [activeDesignCategory, setActiveDesignCategory] = useState("header");
  const [editorSaveStatus, setEditorSaveStatus] = useState("Saved");
  const [formData, setFormData] = useState({ name: "", contact: "", type: "ticket", message: "" });
  const [cloudHydrated, setCloudHydrated] = useState(false);
  const {
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
  } = useFirebaseCMS();
  const isAdmin = isFirestoreAdmin(user, adminProfile) || (import.meta.env.DEV && isAdminUser(user));
  const session = useMemo(() => ({
    isAuthenticated: Boolean(user),
    role: isAdmin ? ROLES.ADMIN : ROLES.VIEWER,
    token: null,
    email: user?.email ?? null,
    uid: user?.uid ?? null,
  }), [isAdmin, user]);

  const ev = useMemo(() => createEditorValueResolver(editor, defaultEditor), [editor]);
  const t = cmsData[lang] || defaultContent[lang];
  const countdownLabels = defaultContent[lang].countdownLabels;
  const timeLeft = useCountdown(cmsData.config.festivalDate);

  useEffect(() => {
    localStorage.setItem("bsf_cms_data", JSON.stringify(cmsData));
  }, [cmsData]);

  useEffect(() => {
    localStorage.setItem("bsf_editor", JSON.stringify(editor));
    const timeout = window.setTimeout(() => setEditorSaveStatus("Saved"), 450);
    return () => window.clearTimeout(timeout);
  }, [editor]);

  useEffect(() => {
    if (!authReady || !adminReady) return undefined;

    let active = true;
    loadCloudConfig(isAdmin).then((snapshot) => {
      if (!active) return;
      if (snapshot?.content) {
        setCmsData(mergeWithDefaults(defaultContent, validateImportedContent(snapshot.content)));
      } else if (snapshot?.ka || snapshot?.en || snapshot?.config) {
        setCmsData(mergeWithDefaults(defaultContent, validateImportedContent(snapshot)));
      } else if (!isAdmin) {
        setCmsData(defaultContent);
      }

      if (snapshot?.editor) {
        setEditor({ ...defaultEditor, ...validateImportedEditor(snapshot.editor) });
      }
      setCloudHydrated(true);
    });

    return () => {
      active = false;
    };
  }, [adminReady, authReady, isAdmin, loadCloudConfig]);

  useEffect(() => {
    if (!isAdmin || !cloudHydrated) return undefined;

    const timeout = window.setTimeout(() => {
      saveDraft({ content: cmsData, editor });
    }, 700);

    return () => window.clearTimeout(timeout);
  }, [cloudHydrated, cmsData, editor, isAdmin, saveDraft]);

  const updateContent = useCallback((path, value) => {
    requireAdminAction(session, "content:write");
    setCmsData((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      setNestedValue(next, path, sanitizeDeep(value));
      return next;
    });
  }, [session]);

  const resetCms = useCallback(() => {
    requireAdminAction(session, "admin:write");
    if (window.confirm("Reset all CMS content? This will replace local MVP content with defaults.")) {
      setCmsData(defaultContent);
      localStorage.removeItem("bsf_cms_data");
    }
  }, [session]);

  const exportData = useCallback(() => {
    if (window.confirm("Export a versioned CMS backup JSON file?")) {
      downloadJson("festival_cms_backup.json", createVersionedBackup("cms", cmsData));
    }
  }, [cmsData]);

  const importData = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!window.confirm("Import CMS JSON? Current local content will be merged with the validated backup.")) {
      event.target.value = "";
      return;
    }
    requireAdminAction(session, "content:write");
    readJsonFile(file)
      .then((json) => setCmsData(mergeWithDefaults(defaultContent, validateImportedContent(json))))
      .catch(() => alert("Invalid JSON file"));
    event.target.value = "";
  }, [session]);

  const updateEditor = useCallback((key, value, type = "range") => {
    requireAdminAction(session, "design:write");
    setEditorSaveStatus("Saving...");
    setEditor((current) => ({ ...current, [key]: type === "color" ? value : Number(value) }));
  }, [session]);

  const patchEditor = useCallback((patch) => {
    requireAdminAction(session, "design:write");
    setEditorSaveStatus("Saving...");
    setEditor((current) => ({ ...current, ...patch }));
  }, [session]);

  const updateFrame = useCallback((frameKey, patch) => {
    requireAdminAction(session, "design:write");
    setEditorSaveStatus("Saving...");
    setEditor((current) => {
      const next = { ...current };
      Object.entries(patch).forEach(([key, value]) => {
        next[`${frameKey}${key}`] = value;
      });
      return next;
    });
  }, [session]);

  const toggleSectionVisibility = useCallback((sectionKey) => {
    patchEditor({
      sectionVisibility: {
        ...editor.sectionVisibility,
        [sectionKey]: !editor.sectionVisibility?.[sectionKey],
      },
    });
  }, [editor.sectionVisibility, patchEditor]);

  const setPreviewMode = useCallback((previewMode) => {
    patchEditor({ previewMode });
  }, [patchEditor]);

  const reorderSections = useCallback((fromIndex, toIndex) => {
    const order = [...(editor.sectionOrder || defaultEditor.sectionOrder)];
    const [moved] = order.splice(fromIndex, 1);
    order.splice(toIndex, 0, moved);
    patchEditor({ sectionOrder: order });
  }, [editor.sectionOrder, patchEditor]);

  const saveEditor = useCallback(() => {
    requireAdminAction(session, "design:write");
    localStorage.setItem("bsf_editor", JSON.stringify(editor));
    setEditorSaveStatus("Saved");
  }, [editor, session]);

  const logoutAdmin = useCallback(async () => {
    setAdminMode(false);
    setEditorOpen(false);
    await logout();
  }, [logout]);

  const publishSite = useCallback(async () => {
    requireAdminAction(session, "admin:write");
    await publish({ content: cmsData, editor });
  }, [cmsData, editor, publish, session]);

  const exportEditorData = useCallback(() => {
    localStorage.setItem("bsf_editor", JSON.stringify(editor));
    setEditorSaveStatus("Saved");
    if (window.confirm("Export a versioned design backup JSON file?")) {
      downloadJson("festival_design_backup.json", createVersionedBackup("design", editor));
    }
  }, [editor]);

  const importEditorData = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!window.confirm("Import design JSON? Unknown fields will be ignored.")) {
      event.target.value = "";
      return;
    }
    requireAdminAction(session, "design:write");
    readJsonFile(file)
      .then((json) => {
        const nextEditor = { ...defaultEditor, ...validateImportedEditor(json) };
        setEditor(nextEditor);
        localStorage.setItem("bsf_editor", JSON.stringify(nextEditor));
        setEditorSaveStatus("Saved");
      })
      .catch(() => alert("Invalid design JSON file"));
    event.target.value = "";
  }, [session]);

  const resetEditor = useCallback(() => {
    requireAdminAction(session, "design:write");
    if (window.confirm("Reset all visual editor settings to defaults?")) {
      setEditor(defaultEditor);
      localStorage.removeItem("bsf_editor");
      setEditorSaveStatus("Reset");
    }
  }, [session]);

  const renderDesignSliders = useCallback((categoryKey) => {
    return designTabs[categoryKey].map(([key, label, min, max, step = 1, type = "range"]) => {
      const val = editor[key] !== undefined ? editor[key] : defaultEditor[key];
      return (
        <label key={key} className="block mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/70">{label}</span>
            <span className="text-cyan-300 font-black">{val}</span>
          </div>
          {type === "color" ? (
            <input type="color" value={val} onChange={(e) => updateEditor(key, e.target.value, "color")} className="w-full h-10 rounded cursor-pointer bg-transparent border-0 p-0" />
          ) : (
            <input type="range" min={min} max={max} step={step} value={val} onChange={(e) => updateEditor(key, e.target.value, "range")} className="w-full accent-cyan-400" />
          )}
        </label>
      );
    });
  }, [editor, updateEditor]);

  const navItems = useMemo(() => [
    { href: "#about", path: "nav.about", defaultLabel: "ABOUT" },
    { href: "#zones", path: "nav.zones", defaultLabel: "ZONES" },
    { href: "#schedule", path: "nav.schedule", defaultLabel: "SCHEDULE" },
    { href: "#tickets", path: "nav.ticketsBlock", defaultLabel: "PASSES" },
    { href: "#sponsors", path: "nav.sponsors", defaultLabel: "SPONSORS" },
    { href: "#social", path: "nav.social", defaultLabel: "SOCIAL" },
    { href: "#faq", path: "nav.faq", defaultLabel: "FAQ" },
    { href: "#gallery", path: "nav.gallery", defaultLabel: "GALLERY" },
    { href: "#newsletter", path: "nav.newsletter", defaultLabel: "NEWS" },
  ], []);

  const requestTypes = useMemo(() => [
    { value: "ticket", path: "form.ticket" },
    { value: "sponsor", path: "form.sponsor" },
    { value: "participant", path: "form.participant" },
    { value: "other", path: "form.other" },
  ], []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: sanitizeText(value, 1000) }));
  }, []);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    const subject = `Bike Summer Fest 2026 - ${formData.type}`;
    const body = lang === "ka"
      ? `სახელი: ${formData.name}%0D%0Aკონტაქტი: ${formData.contact}%0D%0Aმოთხოვნის ტიპი: ${formData.type}%0D%0Aშეტყობინება: ${formData.message}`
      : `Name: ${formData.name}%0D%0AContact: ${formData.contact}%0D%0ARequest type: ${formData.type}%0D%0AMessage: ${formData.message}`;
    window.location.href = `mailto:info@bikesummerfest.ge?subject=${encodeURIComponent(subject)}&body=${body}`;
  }, [formData, lang]);

  const value = useMemo(() => ({
    cmsData,
    setCmsData,
    editor,
    setEditor,
    adminMode: isAdmin ? adminMode : false,
    setAdminMode,
    lang,
    setLang,
    menuOpen,
    setMenuOpen,
    openFaq,
    setOpenFaq,
    editorOpen,
    setEditorOpen,
    editorTab,
    setEditorTab,
    activeDesignCategory,
    setActiveDesignCategory,
    editorSaveStatus,
    setEditorSaveStatus,
    formData,
    setFormData,
    session,
    user,
    isAdmin,
    authReady,
    adminProfile,
    adminReady,
    cloudStatus,
    cloudSaveStatus,
    publishStatus,
    cloudHydrated,
    ev,
    t,
    countdownLabels,
    timeLeft,
    designTabs,
    navItems,
    requestTypes,
    updateContent,
    resetCms,
    exportData,
    importData,
    updateEditor,
    patchEditor,
    updateFrame,
    toggleSectionVisibility,
    setPreviewMode,
    reorderSections,
    saveEditor,
    exportEditorData,
    importEditorData,
    resetEditor,
    loginWithGoogle,
    logout: logoutAdmin,
    publishSite,
    renderDesignSliders,
    closeMenu,
    handleChange,
    handleSubmit,
  }), [
    cmsData, editor, adminMode, lang, menuOpen, openFaq, editorOpen, editorTab,
    activeDesignCategory, editorSaveStatus, formData, ev, t, countdownLabels,
    timeLeft, navItems, requestTypes, updateContent, resetCms, exportData,
    importData, updateEditor, patchEditor, updateFrame, toggleSectionVisibility,
    setPreviewMode, reorderSections, saveEditor, exportEditorData, importEditorData,
    resetEditor, renderDesignSliders, closeMenu, handleChange, handleSubmit,
    session, user, isAdmin, authReady, adminProfile, adminReady, cloudStatus, cloudSaveStatus, publishStatus,
    cloudHydrated, loginWithGoogle, logoutAdmin, publishSite,
  ]);

  return <CMSContext.Provider value={value}>{children}</CMSContext.Provider>;
};
