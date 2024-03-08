/**
 * Title: Load a FeatureLayer
 * This sample demonstrates how to bring in a FeatureLayer from a feature service url onto a map.
 */
require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer"
], function (Map, MapView, FeatureLayer) {
  
  // initialize a feature layer from a service url
  const featureLayer = new FeatureLayer({
    url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/Landscape_Trees_Editable/FeatureServer/0",
    title: "Landscape Trees"
  });

  // create an instance of the map and add the FeatureLayer
  const map = new Map({
    basemap: "gray-vector",
    layers: [featureLayer]
  });

  // create an instance of the view
  const view = new MapView({
    container: "viewDiv",
    map: map,
    extent: {
      xmin: -9177811,
      ymin: 4247000,
      xmax: -9176791,
      ymax: 4247784,
      spatialReference: 102100
    }
  });
});