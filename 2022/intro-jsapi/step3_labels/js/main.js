/**
 * Step 3: Adding a labels to the layer
 * This sample demonstrates how to add labels to the CSVLayer
 * using the LabelClass
 */
require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/CSVLayer",
  "esri/widgets/Legend",
  "esri/layers/support/LabelClass"
], function (Map, MapView, CSVLayer, Legend, LabelClass) {
  // create a label class
  const labelClass = new LabelClass({
    labelExpressionInfo: { expression: "$feature.movie" },
    symbol: {
      type: "text",  // autocasts as new TextSymbol()
      color: "#00A0FF",
      font: {
        // autocast as new Font()
        family: "Playfair Display",
        size: 12,
        weight: "bold"
      }
    },
    labelPlacement: "above-center",
  });

  // create an instance of a CSVLayer
  // pass in the url to the data
  const csvLayer = new CSVLayer({
    url: "https://banuelosj.github.io/DevSummit-presentation/2022/intro-jsapi/data/horror_film_locations.csv",
    title: "Horror film locations",
    labelingInfo: [labelClass]
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