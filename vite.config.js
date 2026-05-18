import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    modulePreload: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/firebase")) return "firebase";
          if (id.includes("node_modules/gsap")) return "intro";
          if (id.includes("node_modules/framer-motion")) return "motion";
          if (id.includes("/src/lib/cloudinary")) return "media-utils";
          if (id.includes("/src/components/admin/Media")) return "media";
          if (id.includes("/src/components/VisualEditor")) return "editor";
          if (id.includes("/src/components/ProtectedAdminRoute")) return "admin-core";
          if (id.includes("/src/components/intro/")) return "intro";
          if (
            (id.includes("/src/components/") && !id.includes("/src/components/admin/")) ||
            id.includes("/src/data/sectionRegistry")
          ) return "public-site";
        },
      },
    },
  },
})
