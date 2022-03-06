/**
 * Step 5: Add a popup.
 * This sample demonstrates how to configure a popupTemplate for
 * the CSVLayer.
 */
require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/CSVLayer",
  "esri/widgets/Legend",
  "esri/layers/support/LabelClass",
  "esri/renderers/SimpleRenderer"
], function (Map, MapView, CSVLayer, Legend, LabelClass, SimpleRenderer) {
  // initialize the popupTemplate
  // this autocasts as new PopupTemplate()
  const popupTemplate = {
    title: "{movie}",
    content: [
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: "film_shot_location",
            label: "Film location"
          },
          {
            fieldName: "film_release_date",
            label: "Release year"
          },
          {
            fieldName: "rating",
            label: "Movie rating"
          }
        ]
      }
    ]
  }

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
          { value: 4, size: 50, label: "> 4 stars"},
          { value: 3, size: 40, label:"3 stars"},
          { value: 2, size: 30, label:"2 stars"},
          { value: 1, size: 20, label:"< 1 stars"}
        ],
        legendOptions: {
          title: "Movie rating"
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
    renderer: simpleRenderer,
    popupTemplate: popupTemplate
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