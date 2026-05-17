import { AdminCard, AdminField } from "./AdminUI";

const SeoManagerModule = ({ cmsData, updateContent }) => (
  <AdminCard title="SEO manager">
    <div className="grid gap-3 md:grid-cols-2">
      <AdminField label="Page title" value={cmsData.config.seo.pageTitle} onChange={(value) => updateContent("config.seo.pageTitle", value)} />
      <AdminField label="Open Graph image" value={cmsData.config.seo.ogImage} onChange={(value) => updateContent("config.seo.ogImage", value)} />
      <AdminField label="Meta description" multiline value={cmsData.config.seo.metaDescription} onChange={(value) => updateContent("config.seo.metaDescription", value)} />
      <AdminField label="Share title" value={cmsData.config.seo.shareTitle} onChange={(value) => updateContent("config.seo.shareTitle", value)} />
      <AdminField label="Share description" multiline value={cmsData.config.seo.shareDescription} onChange={(value) => updateContent("config.seo.shareDescription", value)} />
    </div>
  </AdminCard>
);

export default SeoManagerModule;
