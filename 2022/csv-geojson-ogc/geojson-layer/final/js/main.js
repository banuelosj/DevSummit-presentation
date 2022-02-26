require([
  "esri/Map",
  "esri/layers/GeoJSONLayer",
  "esri/views/MapView",
  "esri/widgets/Legend",
  "esri/layers/FeatureLayer",
  "esri/smartMapping/renderers/type",
  "esri/widgets/FeatureTable",
], (
  Map,
  GeoJSONLayer,
  MapView,
  Legend,
  FeatureLayer,
  typeRendererCreator,
  FeatureTable
) => {
  const firesURL =
    "https://laurenb.esri.com/DevSummit/2022/GeoJSON-Demo/data/FirePerimeters.geojson";

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

  // Typical usage for FeatureTable widget. This will recognize all fields in the layer if none are set.
  const featureTable = new FeatureTable({
    view: view,
    layer: fireLayer,
    container: "container", //document.createElement("div")
  });
  const appContainer = document.getElementById("appContainer");
  const tableContainer = document.getElementById("container");
  const featuretableSwitch = document.getElementById("feature-table-switch");
  // Don't initially display the FeatureTable
  appContainer.removeChild(tableContainer);
  featuretableSwitch.addEventListener("calciteSwitchChange", (evt) => {
    toggleFeatureTable();
  });

  function toggleFeatureTable() {
    // Check if the table is displayed, if so, toggle off. If not, display.
    if (!featuretableSwitch.checked) {
      appContainer.removeChild(tableContainer);
    } else {
      appContainer.appendChild(tableContainer);
    }
  }

  const sortOrder = document.getElementById("sort-order");
  const ascText = "Sort features with older fires on top";
  const descText = "Sort features with newer fires on top";
  // logic for toggling ascending and descending order
  sortOrder.addEventListener("click", () => {
    // Add query to zoom to relevant extent
    const targetFireQuery = fireLayer.createQuery();
    targetFireQuery.where = "FIRE_NAME = 'HENNESSEY'";
    targetFireQuery.returnGeometry = true;
    fireLayer.queryFeatures(targetFireQuery).then((results) => {
      // Go to the specific extent
      view.goTo(results.features[0].geometry);
    });

    // Set the layer to be ordered
    const order =
      fireLayer.orderBy[0].order === "ascending" ? "descending" : "ascending";

    fireLayer.orderBy = [
      {
        field: "YEAR_",
        order,
      },
    ];

    // toggles UI icon and description for the sortOrder button
    if (order === "ascending") {
      sortOrder.text = descText;
      sortOrder.icon = `sort-descending-arrow`;
    } else {
      sortOrder.text = ascText;
      sortOrder.icon = `sort-ascending-arrow`;
    }
  });
});
