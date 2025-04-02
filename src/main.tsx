import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <h1 className="bg-red-100 color-white">Test</h1>
        <App />
    </StrictMode>
);
