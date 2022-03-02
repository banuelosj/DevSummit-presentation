require([
  "esri/Map",
  "esri/views/MapView",
  //"esri/layers/GeoJSONLayer",
  //"esri/layers/FeatureLayer",
  //"esri/smartMapping/renderers/type",
  //"esri/widgets/Legend",
  //"esri/widgets/FeatureTable"
], (
  Map,
  MapView,
  GeoJSONLayer,
  FeatureLayer,
  typeRendererCreator,
  Legend,
  FeatureTable
) => {

  const map = new Map({
    basemap: "gray-vector",
    // *** Add layers to map
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
