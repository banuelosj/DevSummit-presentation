require([
  "esri/Map",
  "esri/views/MapView",
  // "esri/layers/CSVLayer"
], (Map, MapView, CSVLayer) => {
  // *** initialize windCSVLayer

  // *** initialize fireCSVLayer


  const map = new Map({
    basemap: "gray-vector",
    // *** add layers to the map
  });

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