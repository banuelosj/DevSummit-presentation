require([
  "esri/Map",
  "esri/layers/GeoJSONLayer",
  "esri/views/MapView",
  "esri/layers/FeatureLayer"
], (
  Map,
  GeoJSONLayer,
  MapView,
  FeatureLayer
) => {
  const firesURL = "https://opendata.arcgis.com/datasets/84fa4b424c1b4a9f91a1d4e014d4ad0b_0.geojson";
  //const firesURL = "https://banuelosj.github.io/DevSummit-presentation/2022/csv-geojson-ogc/data/FirePerimeters.geojson";

  // Create GeoJSONLayer from GeoJSON data
  const fireLayer = new GeoJSONLayer({
    url: firesURL,
    copyright:
      "State of California and the Department of Forestry and Fire Protection",
    title: "California Fire Perimeters",
  });

  const states = new FeatureLayer({
    url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/USA_States_Generalized/FeatureServer/0",
    definitionExpression: "STATE_NAME = 'California'",
    opacity: 1,
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-fill",
        color: [10, 86, 160, 0.4],
        outline: {
          // autocasts as new SimpleLineSymbol()
          width: 1,
          color: "white",
        },
      },
    },
    effect: "drop-shadow(-10px, 10px, 6px gray)",
  });

  const map = new Map({
    layers: [states, fireLayer],
    basemap: "gray-vector",
  });

  const view = new MapView({
    container: "viewDiv",
    extent: {
      type: "extent",
      xmin: -13961980.792761113,
      ymin: 3774234.6804606593,
      xmax: -12639192.111282196,
      ymax: 5214430.898644948,
      spatialReference: { wkid: 102100 },
    },
    map: map,
  });
});
