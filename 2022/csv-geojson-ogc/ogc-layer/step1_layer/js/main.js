/**
 * Step 1: Add a WFSLayer.
 * This sample demonstrates how to initialize a WFSLayer and add it to the map.
 */
require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/WFSLayer",
  "esri/widgets/Legend"
], (Map, MapView, WFSLayer, Legend) => {
  // initialize a WFSLayer
  const droughtWFSLayer = new WFSLayer({
    url: "https://idpgis.ncep.noaa.gov/arcgis/services/NWS_Climate_Outlooks/cpc_drought_outlk/MapServer/WFSServer",
    name: "Seasonal_Drought_Outlook",
    title: "US Seasonal Drought Forecast (Feb - May 2022)",
    copyright: "NOAA/NWS/NCEP/Climate Prediction Center"
  });

  // add the WFSLayer to the map
  const map = new Map({
    basemap: "gray-vector",
    layers: [droughtWFSLayer]
  });

  // initialize the view with an extent
  const view = new MapView({
    container: "viewDiv",
    map: map,
    center: [-100, 34],
    zoom: 4
  });
  
  // initialize the Legend widget
  const legend = new Legend({
    view: view
  });

  // add the Legend to the view
  view.ui.add(legend, "top-right");
});