require([
  "esri/Map",
  "esri/views/MapView",
  // "esri/layers/CSVLayer",
  // "esri/widgets/Legend",
  // "esri/renderers/SimpleRenderer",
  // "esri/widgets/TimeSlider"
], (Map, MapView, CSVLayer, Legend, SimpleRenderer, TimeSlider) => {

  // add the two CSVLayers to the map
  const map = new Map({
    basemap: "gray-vector",
    // *** add layers to the map
  });

  // initialize the view with an extent
  const view = new MapView({
    container: "viewDiv",
    map: map,
    extent: {
      type: "extent",
      xmin: -13961980.792761113,
      ymin: 3774234.6804606593,
      xmax: -12639192.111282196,
      ymax: 5214430.898644948,
      spatialReference: { wkid: 102100 }
    }
  });
    
});