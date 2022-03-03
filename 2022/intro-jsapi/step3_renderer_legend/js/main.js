/**
 * Step 3: Adding a renderer to the layer.
 * This sample demonstrates how to set a simple renderer with a size
 * visual variables onto the CSVLayer. The symbol used is a PictureMarkerSymbol.
 * This app also adds the legend widget.
 */
require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/CSVLayer",
  "esri/widgets/Legend"
], function (Map, MapView, CSVLayer, Legend) {
  // create an instance of a simple renderer
  // this object will autocast to a new SimpleRenderer()
  const simpleRenderer = {
    type: "simple",
    symbol: {
      type: "picture-marker",
      url: "https://jbanuelos1.esri.com/images/cobweb.png",
      width: "64px",
      height: "64px"
    },
    visualVariables: [
      {
        type: "size",
        field: "imdb_rating",
        stops: [
          { value: 9, size: 50, label: "> 9 stars"},
           { value: 6, size: 40, label:"6 stars"},
          { value: 3, size: 30, label:"3 stars"},
          { value: 1, size: 20, label:"< 1 stars"}
        ],
        legendOptions: {
          title: "IMDB rating"
        }
      }
    ]
  }

  const csvLayer = new CSVLayer({
    url: "https://jbanuelos1.esri.com/data/csv/horror_film_locations_new.csv",
    renderer: simpleRenderer
  });

  const map = new Map({
    basemap: "gray-vector",
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