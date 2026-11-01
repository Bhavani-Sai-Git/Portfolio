import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Optional analytics: only loads when VITE_PLAUSIBLE_DOMAIN is set (see .env.example).
const plausibleDomain = import.meta.env.VITE_PLAUSIBLE_DOMAIN;
if (plausibleDomain && import.meta.env.PROD) {
  const s = document.createElement("script");
  s.defer = true;
  s.dataset.domain = plausibleDomain;
  s.src = "https://plausible.io/js/script.js";
  document.head.appendChild(s);
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
