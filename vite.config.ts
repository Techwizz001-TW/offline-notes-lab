import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// "base" matches the GitHub repository name, so the built assets resolve
// correctly when served from https://<your-username>.github.io/offline-notes-lab/
// If you rename the repo, update this value to match it (use "/" only if you
// deploy to a root-level <your-username>.github.io repository).
export default defineConfig({
  base: "/offline-notes-lab/",
  plugins: [react()],
});
