
  const firesURL = "https://banuelosj.github.io/DevSummit-presentation/2022/csv-geojson-ogc/data/FirePerimeters.geojson";
  // Create GeoJSONLayer from GeoJSON data
  const fireLayer = new GeoJSONLayer({
    url: firesURL,
    copyright:
      "State of California and the Department of Forestry and Fire Protection",
    title: "California Fire Perimeters",
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