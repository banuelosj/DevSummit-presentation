import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./components/App";

// import defineCustomElements to register custom elements with the custom elements registry
import { defineCustomElements as defineMapComponentElements } from "@arcgis/map-components/dist/loader";
// Register custom elements
defineMapComponentElements(window, { resourcesUrl: "https://js.arcgis.com/map-components/4.29/assets" });

import { defineCustomElements as defineCalciteElements } from "@esri/calcite-components/dist/loader";
// CDN hosted assets
defineCalciteElements(window, {
  resourcesUrl: "https://js.arcgis.com/calcite-components/2.7.0/assets"
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
