// *** Step 1 - Add GeoJSON Layer

// Create GeoJSONLayer from GeoJSON data
const fireLayer = new GeoJSONLayer({
  url: "https://banuelosj.github.io/DevSummit-presentation/2022/csv-geojson-ogc/data/FirePerimeters.geojson",
  copyright:
    "State of California and the Department of Forestry and Fire Protection",
  title: "California Fire Perimeters",
});

// Add California FeatureLayer for visualization
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

// Create and add the Legend
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

// *** END Step 1

// *** Step 2 - Add renderer

// When layer loads, create the renderer
fireLayer.when(() => {
  // visualization based on categorical field
  let typeParams = {
    layer: fireLayer,
    view: view,
    field: "YEAR_",
    sortBy: "value",
    defaultSymbolEnabled: false,
  };

  // when the promise resolves, apply the visual variables to the renderer
  typeRendererCreator.createRenderer(typeParams).then(function (response) {
    fireLayer.renderer = response.renderer;
  });
});

// *** END Step 2 - Add renderer

// *** Step 3 - Add popup

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

// *** END Step 3

// *** Step 4 Add Orderby

const sortOrder = document.getElementById("sort-order");
const ascText = "Sort features with older fires on top";
const descText = "Sort features with newer fires on top";
// logic for toggling ascending and descending order in click event
sortOrder.addEventListener("click", () => {

  // Add query to zoom to relevant extent at beginning of click event
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

  // *** END Step 4 Add Orderby

  // *** Step 5 Add FeatureTable

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

