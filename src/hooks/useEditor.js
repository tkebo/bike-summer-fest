import { useMemo } from "react";
import { useCMS } from "./useCMS";

export const useEditor = () => {
  const {
    editor,
    setEditor,
    ev,
    designTabs,
    activeDesignCategory,
    setActiveDesignCategory,
    editorSaveStatus,
    updateEditor,
    saveEditor,
    exportEditorData,
    importEditorData,
    resetEditor,
    renderDesignSliders,
  } = useCMS();

  return useMemo(() => ({
    editor,
    setEditor,
    ev,
    designTabs,
    activeDesignCategory,
    setActiveDesignCategory,
    editorSaveStatus,
    updateEditor,
    saveEditor,
    exportEditorData,
    importEditorData,
    resetEditor,
    renderDesignSliders,
  }), [
    editor,
    setEditor,
    ev,
    designTabs,
    activeDesignCategory,
    setActiveDesignCategory,
    editorSaveStatus,
    updateEditor,
    saveEditor,
    exportEditorData,
    importEditorData,
    resetEditor,
    renderDesignSliders,
  ]);
};
