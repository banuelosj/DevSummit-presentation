/**
 * Step 1: Display a map.
 * This sample demonstrates how to load a map with a basemap. It also
 * shows how to center a view and set a zoom level.
 */
require([
  "esri/Map",
  "esri/views/MapView"
], function (Map, MapView) {
  
  // create an instance of the map and add the CSVLayer
  const map = new Map({
    basemap: "topo-vector"
  });

  // create an instance of the view
  const view = new MapView({
    container: "viewDiv",
    map: map,
    center: [-90, 34],
    zoom: 4
  });
});