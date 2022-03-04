/**
 * Step 2: Add a Renderer.
 * This sample demonstrates how to configure renderer with the WFSLayer.
 */
require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/WFSLayer",
  "esri/widgets/Legend",
  "esri/smartMapping/renderers/type"
], (Map, MapView, WFSLayer, Legend, typeRendererCreator) => {
  // Assign the expression to the `valueExpression` property and
  // set up the unique value infos based on the decode values
  // you set up in the expression.
  const droughtArcade = document.getElementById("drought-renderer").text;

  // initialize a WFSLayer
  const droughtWFSLayer = new WFSLayer({
    url: "https://idpgis.ncep.noaa.gov/arcgis/services/NWS_Climate_Outlooks/cpc_drought_outlk/MapServer/WFSServer",
    name: "Seasonal_Drought_Outlook",
    title: "US Seasonal Drought Outlook (Feb - May 2022)",
    copyright: "NOAA/NWS/NCEP/Climate Prediction Center",
    outFields: ['*']
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

  // visualization based on categorical field
  let typeParams = {
    layer: droughtWFSLayer,
    view: view,
    valueExpression: droughtArcade,
    defaultSymbolEnabled: false
  };
  
  // when the promise resolves, apply the visual variables to the renderer
  typeRendererCreator
    .createRenderer(typeParams)
    .then(function (response) {
      droughtWFSLayer.renderer = response.renderer;
    });
    
});