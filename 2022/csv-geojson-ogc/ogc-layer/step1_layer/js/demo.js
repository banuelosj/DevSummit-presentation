/**
 * Step 1: Add a WFSLayer.
 * This sample demonstrates how to initialize a WFSLayer and add it to the map.
 */
require([
  "esri/Map",
  "esri/views/MapView",
  // "esri/layers/WFSLayer"
], (Map, MapView, WFSLayer) => {
  // *** initialize a WFSLayer

  // add the WFSLayer to the map
  const map = new Map({
    basemap: "gray-vector",
    // *** add WFSLayer
  });

  // initialize the view with an extent
  const view = new MapView({
    container: "viewDiv",
    map: map,
    center: [-100, 34],
    zoom: 4
  });
    
});