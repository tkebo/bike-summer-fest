import { AdminCard } from "./AdminUI";
import VisualEditor from "../VisualEditor";

const AdminMediaModule = () => (
  <AdminCard title="Media library">
    <p className="mb-4 text-sm text-white/55">Use the Media tab in the floating editor module for upload, reuse, metadata, soft delete, restore, and image assignment.</p>
    <VisualEditor forceEmbedded />
  </AdminCard>
);

export default AdminMediaModule;
