import { useEffect } from "react";
import { useCMS } from "../../hooks/useCMS";
import SiteCanvas from "../SiteCanvas";
import SEOHead from "../SEOHead";
import AdminOverlay from "../AdminOverlay";
import { defaultContent } from "../../data/defaultContent";
import { defaultEditor } from "../../data/defaultEditor";
import { mergeWithDefaults } from "../../utils/cmsHelpers";
import { validateImportedContent, validateImportedEditor } from "../../security/schemaValidation";

const AdminPreviewPage = () => {
  const { cmsData, editor, subscribeToDraft, setLivePreviewSnapshot } = useCMS();

  useEffect(() => subscribeToDraft((snapshot) => {
    if (!snapshot) return;
    setLivePreviewSnapshot({
      content: snapshot.content ? mergeWithDefaults(defaultContent, validateImportedContent(snapshot.content)) : cmsData,
      editor: snapshot.editor ? { ...defaultEditor, ...validateImportedEditor(snapshot.editor) } : editor,
    });
  }), [cmsData, editor, setLivePreviewSnapshot, subscribeToDraft]);

  return (
    <main className="min-h-screen bg-[#050814] text-white">
      <SEOHead />
      <AdminOverlay />
      <div className="fixed left-1/2 top-4 z-[999] -translate-x-1/2 rounded-full border border-orange-400/30 bg-black/80 px-4 py-2 text-xs font-black text-orange-300 backdrop-blur-xl">
        Live Draft Preview
      </div>
      <SiteCanvas cmsData={cmsData} editor={editor} />
    </main>
  );
};

export default AdminPreviewPage;
