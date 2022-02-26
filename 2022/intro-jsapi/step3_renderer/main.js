/**
 * Step 3: Adding a renderer to the layer.
 * This sample demonstrates how to set a simple renderer with color
 * visual variables onto the CSVLayer.
 */
require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/CSVLayer"
], function (Map, MapView, CSVLayer) {
  // create an instance of a simple renderer
  // this object will autocast to a new SimpleRenderer()
  const simpleRenderer = {
    type: "simple",
    symbol: {
      type: "simple-marker",
      style: "circle",
      color: "#F0BAB4",
      size: 14
    },
    // color visual variables based of the 'imdb_rating' field
    visualVariables: [
      {
        type: "color",
        field: "imdb_rating",
        stops: [
          { value: 9, color: "#1a9641"}, // green
          { value: 7, color: "#a6d96a"},
          { value: 5, color: "#ffffbf"},
          { value: 3, color: "#fdae61"},
          { value: 1, color: "#d7191c"} // red
        ],
        legendOptions: {
          title: "IMDB rating"
        }
      }
    ]
  }

  const csvLayer = new CSVLayer({
    url: "https://jbanuelos1.esri.com/data/csv/horror_film_locations.csv",
    renderer: simpleRenderer
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