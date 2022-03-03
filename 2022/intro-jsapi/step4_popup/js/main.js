/**
 * Step 4: Add a popup
 */
require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/CSVLayer",
  "esri/widgets/Legend"
], function (Map, MapView, CSVLayer, Legend) {

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
  }

  const csvLayer = new CSVLayer({
    url: "https://jbanuelos1.esri.com/data/csv/horror_film_locations.csv",
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