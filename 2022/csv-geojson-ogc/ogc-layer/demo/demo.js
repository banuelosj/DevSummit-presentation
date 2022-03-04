require([
  "esri/Map",
  "esri/views/MapView",
  // "esri/layers/WFSLayer",
  // "esri/widgets/Legend",
  // "esri/smartMapping/renderers/type",
  // "esri/layers/support/FeatureEffect"
], (Map, MapView, WFSLayer, Legend, typeRendererCreator, FeatureEffect) => {

  // initialize the 
  const map = new Map({
    basemap: "gray-vector",
    // *** add layer to the map
  });

  // initialize the view with an extent
  const view = new MapView({
    container: "viewDiv",
    map: map,
    center: [-100, 34],
    zoom: 4
  });
    
});