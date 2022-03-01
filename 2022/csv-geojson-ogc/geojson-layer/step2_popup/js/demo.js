/**
 * Step 2: Add Popups
 * This sample demonstrates how to add Popups to the layer using a PopupTemplate
 * and a function to configure the content.
 */
require([
    "esri/Map",
    "esri/layers/GeoJSONLayer",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/widgets/Legend"
  ], (
    Map,
    GeoJSONLayer,
    MapView,
    FeatureLayer,
    Legend
  ) => {
    const firesURL = "https://banuelosj.github.io/DevSummit-presentation/2022/csv-geojson-ogc/data/FirePerimeters.geojson";
    
    // *** Add PopupTemplate code


    // *** Add function to format PopupTemplate Content
    
    // Create GeoJSONLayer from GeoJSON data
    const fireLayer = new GeoJSONLayer({
      url: firesURL,
      copyright:
        "State of California and the Department of Forestry and Fire Protection",
      title: "California Fire Perimeters",
      // *** Add Popup Template to layer
    });
  
    const states = new FeatureLayer({
      url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/USA_States_Generalized/FeatureServer/0",
      definitionExpression: "STATE_NAME = 'California'",
      opacity: 1,
      renderer: {
        type: "simple",
        symbol: {
          type: "simple-fill",
          color: [10, 86, 160, 0.4],
          outline: {
            // autocasts as new SimpleLineSymbol()
            width: 1,
            color: "white",
          },
        },
      },
      effect: "drop-shadow(-10px, 10px, 6px gray)",
    });
  
    const map = new Map({
      layers: [states, fireLayer],
      basemap: "gray-vector",
    });
  
    const view = new MapView({
      container: "viewDiv",
      extent: {
        type: "extent",
        xmin: -13961980.792761113,
        ymin: 3774234.6804606593,
        xmax: -12639192.111282196,
        ymax: 5214430.898644948,
        spatialReference: { wkid: 102100 },
      },
      map: map,
    });
        // Create the Legend
        const legend = new Legend({
          view: view,
          layerInfos: [
            {
              title: "California Fire Perimeters",
              layer: fireLayer,
            },
          ],
          container: "legend",
        });
        view.ui.add(legend, "top-right");
  });
  