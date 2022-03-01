require([
  "esri/Map",
  "esri/layers/GeoJSONLayer",
  "esri/views/MapView",
  "esri/widgets/Legend",
  "esri/layers/FeatureLayer",
  "esri/smartMapping/renderers/type"
], (
  Map,
  GeoJSONLayer,
  MapView,
  Legend,
  FeatureLayer,
  typeRendererCreator
) => {
  const firesURL = "https://opendata.arcgis.com/datasets/84fa4b424c1b4a9f91a1d4e014d4ad0b_0.geojson";
  //const firesURL = "https://banuelosj.github.io/DevSummit-presentation/2022/csv-geojson-ogc/data/FirePerimeters.geojson";

  // Create popup template for layer
  const fireTemplate = {
    title: "{FIRE_NAME} Wildfire",
    content: formatContent,
    outFields: ["*"],
    fieldInfos: [
      {
        fieldName: "FIRE_NAME",
        label: "Incident Name",
      },
      {
        fieldName: "GIS_ACRES",
        label: "Acres Burned",
        format: {
          places: 0,
          digitSeparator: true,
        },
      },
      {
        fieldName: "CONT_DATE",
        label: "Contained Date",
      },
      {
        fieldName: "ALARM_DATE",
        label: "Start Date",
      },
      {
        fieldName: "CAUSE",
        label: "Fire Cause",
      },
    ],
  };

  // formats the popup template content
  function formatContent(feature) {
    let fire_name = feature.graphic.attributes.FIRE_NAME;
    let start_date = new Date(feature.graphic.attributes.ALARM_DATE);
    let end_date = new Date(feature.graphic.attributes.CONT_DATE);
    return (
      fire_name +
      " burned <b>{GIS_ACRES}</b> acres of land from <span class='popupSpan'>" +
      start_date.toLocaleString() +
      "</span> until <span class='popupSpan'>" +
      end_date.toLocaleString() +
      "</span>."
    );
  }

  // Create GeoJSONLayer from GeoJSON data
  const fireLayer = new GeoJSONLayer({
    url: firesURL,
    copyright:
      "State of California and the Department of Forestry and Fire Protection",
    popupTemplate: fireTemplate,
    orderBy: [
      {
        field: "YEAR_",
      },
    ],
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

  fireLayer.when(() => {
    // visualization based on categorical field
    let typeParams = {
      layer: fireLayer,
      view: view,
      field: "YEAR_",
      sortBy: "value",
      defaultSymbolEnabled: false
    };

    // when the promise resolves, apply the visual variables to the renderer
    typeRendererCreator.createRenderer(typeParams).then(function (response) {
      fireLayer.renderer = response.renderer;
    });
  });

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
