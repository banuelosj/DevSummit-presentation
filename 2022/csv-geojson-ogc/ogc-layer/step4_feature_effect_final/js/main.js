/**
 * Step 4: Add FeatureEffect on a client-side filter.
 * This sample demonstrates how to set FeatureEffects on the layerView of a WFSLayer
 * in order to filter features based off the field values.
 */
require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/WFSLayer",
  "esri/widgets/Legend",
  "esri/smartMapping/renderers/type",
  "esri/layers/support/FeatureEffect"
], (Map, MapView, WFSLayer, Legend, typeRendererCreator, FeatureEffect) => {
  // create a PopupTemplate and configure an aracade expression
  const droughtPopupTemplate = {
    title: "Drought Outlook (Feb - May 2022)",
    content: `The seasonal drought outlook demonstrates <b>{expression/drought-outlook-category}</b> in this region of the United States. <br>Date submitted: <span class="popupSpan">{idp_filedate}</span>`,
    expressionInfos: [
      {
        // arcade expression to display the feature category
        name: "drought-outlook-category",
        expression: "When($feature.fid_persis == 1, 'drought persistence is likely', $feature.fid_dev == 1, 'potential drought development is likely', $feature.fid_improv == 1, 'drought improvement is favored', $feature.fid_remove == 1, 'drought removal is favored', 'n/a')"
      }
    ]
  };

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
    outFields: ['*'],
    popupTemplate: droughtPopupTemplate
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
    view: view,
    container: "legendDiv"
  });

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
  
  view.ui.add("infoDiv", "top-right");

  // dropdown
  const filterSelect = document.getElementById("filter");

  view.whenLayerView(droughtWFSLayer)
    .then((layerView) => {
      filterSelect.addEventListener("input", (event) => {
        // adding a SQL where clause filter using the option value prop from index.html
        // Ex: <option value="fid_dev=1">Drought Could Develop</option>
        layerView.featureEffect = new FeatureEffect({
          filter: {
            where: event.target.value
          },
          // add a drop shadow to highlight features the satisfy the filter query
          includedEffect: "drop-shadow(-10px, 10px, 6px gray)",
          // features that don't satisfy the filter query will have their opacity updated
          excludedEffect: "opacity(30%)"
        });
      });
  });
    
});