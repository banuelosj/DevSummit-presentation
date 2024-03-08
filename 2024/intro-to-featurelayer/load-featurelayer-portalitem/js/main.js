/**
 * Title: Load a FeatureLayer from a PortalItem.
 * This sample demonstrates how to bring in a FeatureLayer from a portalItem. The portalItem
 * saves the layer properties configured in MapViewer / SceneViewer.
 */
require([
  "esri/Map",
  "esri/views/SceneView",
  "esri/layers/FeatureLayer"
], function (Map, SceneView, FeatureLayer) {

  // initialize a FeatureLayer from a PortalItem
  const featureLayer = new FeatureLayer({
    portalItem: {
      id: "0235b1d4d4974941b7a4615735643e33",
      // working with Portal Enterprise
      // portal: {
      //   url: "https://machine.domainName.com/portal"
      // }
    }
  });
  
  // create an instance of the map and add the CSVLayer
  const map = new Map({
    basemap: "gray-vector",
    layers: [featureLayer]
  });

  // create an instance of the view
  const view = new SceneView ({
    container: "viewDiv",
    map: map,
    camera: {
      heading: 0.256,
      tilt: 60.80,
      position: [
        -82.44,
        35.5925,
        1087
      ]
    }
  });
});