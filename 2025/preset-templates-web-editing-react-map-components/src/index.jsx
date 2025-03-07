import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./components/App";

import { defineCustomElements as defineCalciteElements } from "@esri/calcite-components/dist/loader";
// CDN hosted assets
defineCalciteElements(window, {
  resourcesUrl: "https://js.arcgis.com/calcite-components/3.0.3/assets"
});

import { defineCustomElements as defineChartsElements } from "@arcgis/charts-components/dist/loader";
defineChartsElements(window, { resourcesUrl: "https://js.arcgis.com/charts-components/4.32/assets" });

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
