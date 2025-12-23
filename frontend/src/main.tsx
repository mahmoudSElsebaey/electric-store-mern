import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import App from "./App.tsx";
import { StoreProvider } from "./context/StoreContext.tsx";
import { ToastProvider } from "./context/ToastContext.tsx";
import "./i18n";
// import 'bootstrap/dist/css/bootstrap.min.css';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <StoreProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </StoreProvider>
    </HelmetProvider>
  </StrictMode>
);
