import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // import.meta.env.BASE_URL matches the "base" set in vite.config.ts, so
    // the worker registers correctly whether the app is served from the
    // domain root or from a GitHub Pages project path like /offline-notes-lab/.
    const base = import.meta.env.BASE_URL;
    navigator.serviceWorker
      .register(`${base}sw.js`, { scope: base })
      .catch((error) => console.warn("Service worker registration failed", error));
  });
}
