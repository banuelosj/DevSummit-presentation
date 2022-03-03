/**
 * Step 2: Adding a layer to the map.
 * This sample demonstrates how to add csv data with lat/long
 * coordinates to a map using a CSVLayer.
 * Note: CSV data must have columns for latitude and longitude coordinates.
 */
require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/CSVLayer"
], function (Map, MapView, CSVLayer) {
  // create an instance of a CSVLayer
  // pass in the url to the data
  const csvLayer = new CSVLayer({
    url: "https://jbanuelos1.esri.com/data/csv/horror_film_locations_new.csv"
  });

  const map = new Map({
    basemap: "topo-vector",
    layers: [csvLayer]
  });

  const view = new MapView({
    container: "viewDiv",
    map: map,
    center: [-90, 34],
    zoom: 4
  });
});