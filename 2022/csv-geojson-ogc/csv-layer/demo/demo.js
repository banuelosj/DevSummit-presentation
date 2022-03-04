require([
  "esri/Map",
  "esri/views/MapView",
  // "esri/layers/CSVLayer",
  // "esri/renderers/SimpleRenderer",
  // "esri/widgets/Legend",
  // "esri/widgets/TimeSlider"
], (Map, MapView, CSVLayer, SimpleRenderer, Legend, TimeSlider) => {

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

  // initialize the Legend widget
  const legend = new Legend({
    view: view
  });

  // add the Legend to the view
  view.ui.add(legend, "top-right");

  // initialize the TimeSlider widget
  const timeSlider = new TimeSlider({
    container: "timeSlider",
    view: view,
    timeVisible: true, // show the time stamps on the timeslider
    fullTimeExtent: {
      start: new Date("2022-02-18T14:30:00Z"),
      end: new Date("2022-02-19T00:35:00Z")
    }
  });

  // set the TimeSlider widget time extent and stops
  // wait for the layer to load first
  windCSVLayer.when(() => {
    timeSlider.fullTimeExtent = windCSVLayer.timeInfo.fullTimeExtent;
    timeSlider.stops = {
      interval: {
        value: 30,
        unit: "minutes"
      }
    };
    timeSlider.playRate = 1500;  // 1500 milliseconds
  });
    
});