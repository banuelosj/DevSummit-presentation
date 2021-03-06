/**
 * Step 6: Create a buffer using geometryEngine
 * This sample demonstrates how to create a buffer using the geometryEngine with
 * a distance of 20 miles. The buffer will be generated from
 * the map point location where a user clicks on the map.
 */
require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/CSVLayer",
  "esri/widgets/Legend",
  "esri/layers/support/LabelClass",
  "esri/renderers/SimpleRenderer",
  "esri/geometry/geometryEngine",
  "esri/Graphic"
], function (Map, MapView, CSVLayer, Legend, LabelClass, SimpleRenderer, geometryEngine, Graphic) {

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
    popupTemplate: popupTemplate,
    popupEnabled: false
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

  let DISTANCE = 20;
  let csvLayerView;
  let highlight;

  view.whenLayerView(csvLayer).then(layerView => {
    csvLayerView = layerView;
  });

  view.on("click", (event) => {
    addPoint(event.mapPoint);
  });

  // adds a marker on the location where the view was clicked
  function addPoint(point) {
    if(view.graphics.length > 0) {
      view.graphics.removeAll();
    }

    // create the point graphic
    const pointGraphic = new Graphic({
      geometry: point,
      symbol: {
        type: "simple-marker",
        color: "#00A0FF",
        size: 12,
        outline: {
          width: 1,
          color: "#000000"
        }
      }
    });

    // create the buffer
    createBuffer(point);
    // add the point graphic to the map
    view.graphics.add(pointGraphic);
    // zoom to the location
    view.goTo({ target: point, zoom: 11 });
  };

  // generate the buffer
  function createBuffer(point) {
    // obtain the buffer polygon
    const bufferPolygon = geometryEngine.geodesicBuffer(point, DISTANCE, "miles");
    
    // create a graphic from the buffer polygon
    const bufferGraphic = new Graphic({
      geometry: bufferPolygon,
      symbol: {
        type: "simple-fill",
        color: [247, 99, 0, 0.3],
        style: "solid",
        outline: {
          color: "#ffffff",
          width: 1
        }
      }
    });

    // add the buffer graphic to the map
    view.graphics.add(bufferGraphic);
    // select the features
    selectFeaturesInRadius(bufferPolygon);
  };

  // query and highlight the features that fall withing the buffer
  // radius
  function selectFeaturesInRadius(polygon) {
    const query = csvLayerView.createQuery();
    query.geometry = polygon;
    
    // client-side queries
    csvLayerView.queryFeatures(query).then((result) => {
      if(highlight) {
        highlight.remove()
      }
      if(!!result.features.length) {
        highlightResults(result.features);
      }
    });
  }

  // highlight the query results
  function highlightResults(features) {
    // create an array of objectids from the query results
    let objectIDs = features.map((feature) => {
      return feature.attributes.__OBJECTID
    });
    // you can pass an array of objectids to highlight
    highlight = csvLayerView.highlight(objectIDs);
  }

});