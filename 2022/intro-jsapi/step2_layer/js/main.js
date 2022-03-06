/**
 * Step 2: Adding a layer to the map.
 * This sample demonstrates how to add csv data with lat/long
 * coordinates to a map using a CSVLayer.
 * Note: CSV data must have columns for latitude and longitude coordinates.
 * This app also adds the legend widget.
 */
require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/CSVLayer",
  "esri/widgets/Legend"
], function (Map, MapView, CSVLayer, Legend) {
  // create an instance of a CSVLayer
  // pass in the url to the data
  const csvLayer = new CSVLayer({
    url: "https://banuelosj.github.io/DevSummit-presentation/2022/intro-jsapi/data/horror_film_locations.csv",
    title: "Horror film locations"
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

  const legend = new Legend({
    view: view
  });

  view.ui.add(legend, "top-right");
});