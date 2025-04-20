import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
// main.jsx o App.jsx
import "primereact/resources/themes/lara-light-blue/theme.css"; // o el tema que elijas
import "primereact/resources/primereact.min.css";
// Estilos de íconos
import "primeicons/primeicons.css";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
