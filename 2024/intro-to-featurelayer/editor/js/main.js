/**
 * Title: Editor
 * This sample demonstrates how to bring in the Editor widget to edit
 * FeatureLayers that are editable on the map.
 */
require([
  "esri/Map",
  "esri/views/SceneView",
  "esri/widgets/Editor",
  "esri/layers/FeatureLayer"
], function (Map, SceneView, Editor, FeatureLayer) {

  // define the renderer
  const renderer = {
    type: "unique-value",
    field: "Cmn_Name",
    defaultSymbol: {
      type: "web-style",
      styleName: "EsriLowPolyVegetationStyle",
      name: "Sassafras"
    },
    uniqueValueInfos: [{
      value: "Flowering dogwood",
      symbol: {
        type: "web-style",
        styleName: "EsriLowPolyVegetationStyle",
        name: "Cornus"
      }
    },
    {
      value: "Eastern hemlock",
      symbol: {
        type: "web-style",
        styleName: "EsriLowPolyVegetationStyle",
        name: "Abies"
      }
    },
    {
      value: "Norway spruce",
      symbol: {
        type: "web-style",
        styleName: "EsriLowPolyVegetationStyle",
        name: "Picea"
      }
    },
    {
      value: "White oak",
      symbol: {
        type: "web-style",
        styleName: "EsriLowPolyVegetationStyle",
        name: "Quercus"
      }
    }],
    label: "tree",
    // add visual variables to show height and carbon storage in color
    visualVariables: [{
      type: "size",
      axis: "height", // specify which axis to apply the data values to
      field: "Height",
      valueUnit: "feet",
    },
    {
      type: "color",
      field: "C_Storage", // Carbon storage
      stops: [{
        value: 0,
        color: "#f7fcb9"
      }, // features with zero carbon
      {
        value: 10000,
        color: "#31a354"
      } // features with 100000 carbon
      ],
      legendOptions: {
        title: "Carbon Storage"
      }
    }]
  };

  // initialize a FeatureLayer from a PortalItem
  const featureLayer = new FeatureLayer({
    portalItem: {
      id: "0235b1d4d4974941b7a4615735643e33",
      // working with Portal Enterprise
      // portal: {
      //   url: "https://machine.domainName.com/portal"
      // }
    },
    renderer: renderer
  });

  const landscape_inspection_table = new FeatureLayer({
    url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/Landscape_Trees_Editable/FeatureServer/1",
    title: "Landscape tree inspection"
  });
  
  // create an instance of the map and add the CSVLayer
  const map = new Map({
    basemap: "gray-3d",
    //basemap: "gray-vector",
    layers: [featureLayer, landscape_inspection_table]
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

  // initialize the Editor widget
  const editor = new Editor({ view });
  view.ui.add(editor, "top-right");
});