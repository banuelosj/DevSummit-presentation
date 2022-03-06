/**
 * Step 4: Adding a renderer to the layer.
 * This sample demonstrates how to set a simple renderer with a size
 * visual variables onto the CSVLayer. The symbol used is a PictureMarkerSymbol.
 */
require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/CSVLayer",
  "esri/widgets/Legend",
  "esri/layers/support/LabelClass",
  "esri/renderers/SimpleRenderer"
], function (Map, MapView, CSVLayer, Legend, LabelClass, SimpleRenderer) {
  // create an instance of a simple renderer
  const simpleRenderer = new SimpleRenderer({
    symbol: {
      type: "picture-marker",
      url: "https://banuelosj.github.io/DevSummit-presentation/2022/intro-jsapi/data/cobweb.png",
      width: "64px",
      height: "64px"
    },
    visualVariables: [
      {
        type: "size",
        field: "rating",
        stops: [
          { value: 9, size: 50, label: "> 9 stars"},
           { value: 6, size: 40, label:"6 stars"},
          { value: 3, size: 30, label:"3 stars"},
          { value: 1, size: 20, label:"< 1 stars"}
        ],
        legendOptions: {
          title: "Moview rating"
        }
      }
    ]
  });

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

  const csvLayer = new CSVLayer({
    url: "https://banuelosj.github.io/DevSummit-presentation/2022/intro-jsapi/data/horror_film_locations.csv",
    title: "Horror film locations",
    labelingInfo: [labelClass],
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