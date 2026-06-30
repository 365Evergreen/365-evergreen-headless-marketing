import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@evergreen/designTokens/tokens.css"; 
import "@evergreen/designTokens/global.css";


import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
