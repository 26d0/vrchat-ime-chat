import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./style.css";
import "./i18n";

const root = createRoot(document.getElementById("root")!);
root.render(<App />);