const FeatureLayer = await $arcgis.import("@arcgis/core/layers/FeatureLayer.js");
const reactiveUtils = await $arcgis.import("@arcgis/core/core/reactiveUtils.js");

// Get references to the ArcGIS Map and Feature Table components.
const viewElement = document.querySelector("arcgis-map");
const editorElement = document.querySelector("arcgis-editor");
const tableElement = document.querySelector("arcgis-feature-table");

// Create reference to primary data layer
const layer = new FeatureLayer({
  title: "Boston",
  url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Boston_Street_Light_Locations/FeatureServer/0"
});

await viewElement.viewOnReady();

// Add layers to the map.
viewElement.map.add(layer);

//////////////////////////////////////////////////////
//  Additional Table Configuration
//////////////////////////////////////////////////////

// Configure the table with the correct layer and template.
tableElement.layer = layer;
tableElement.tableTemplate = createTableTemplate();

// Configure an action column to zoom to specific features.
tableElement.actionColumnConfig = {
  icon: "pencil",
  label: "Edit this feature",
  callback: ({ feature }) => {
    editorElement.startUpdateWorkflowAtFeatureEdit(feature.clone());
  },
};

//////////////////////////////////////////////////////
//  User Interface
//////////////////////////////////////////////////////

// Panels
const panelTable = document.getElementById("panel-table");
const panelMap = document.getElementById("panel-map");

// Actions
const actionDisplayMap = document.getElementById("display-map");
const actionDisplayTable = document.getElementById("display-table");
const actionZoomToSelection = document.getElementById("zoom-to-selection");

function toggleMapTablePanels() {
  panelMap.hidden = !panelMap.hidden;
  panelTable.hidden = !panelTable.hidden;
}

// Switch between map and table panels
actionDisplayMap.onclick = () => toggleMapTablePanels();
actionDisplayTable.onclick = () => toggleMapTablePanels();

//////////////////////////////////////////////////////
//  Selection
//////////////////////////////////////////////////////

// Update the map to ensure all selected features are visible in the view.
actionZoomToSelection.onclick = () => tableElement.zoomToSelection();

const selectionCombobox = document.getElementById("selection-combobox");
const selectionInput = document.getElementById("selection-input");
const selectionButton = document.getElementById("selection-button");

setUpCombobox();

async function setUpCombobox() {
  await layer.load();

  layer.fields.forEach((field) => {
    if (field.type === "string") {
      const child = document.createElement("calcite-combobox-item");
      child.value = `${field.name}`;
      child.heading = `${field.alias}`;

      selectionCombobox.appendChild(child);
    }
  });
}

selectionButton.onclick = async (e) => {
  selectionButton.loading = true;

  const value = selectionInput.value;
  const fieldName = selectionCombobox.value;

  if (value) {
    // Build the definition expression
    const normalizedValue = `${value}`;
    const where = `${fieldName} LIKE '%${normalizedValue}%'`

    // Create the query and get results
    const query = layer.createQuery();
    query.where = where;
    query.outFields = ["ObjectId"];

    // Execute query to get relevant features
    const response = await layer.queryFeatures(query);
    const features = response.features;

    if (features.length) {
      viewElement.selectionManager.replace(layer, features);
    }
    selectionButton.loading = false;
  }
};

//////////////////////////////////////////////////////
//  Editing
//////////////////////////////////////////////////////

// Refresh the table after a successful edit
reactiveUtils.on(
  () => editorElement.activeWorkflow,
  "commit",
  () => tableElement.refresh()
);

//////////////////////////////////////////////////////
//  Templates
//////////////////////////////////////////////////////

// Returns configuration options for the FeatureTable
function createTableTemplate() {
  // Autocast to TableTemplate
  return {
    // Autocast to appropriate column template
    columnTemplates: [
      {
        type: "field",
        fieldName: "ObjectId",
        label: "ID",
        width: "110px",
        flexGrow: 0,
        autoWidth: false,
      },
      {
        type: "field",
        fieldName: "status",
        icon: "activity-monitor",
        width: "120px",
        formatFunction: ({ value }) => {
          switch (value) {
            case 0:
              return `<span style="font-style: italic;">Disabled</span>`;
            case 1:
              return `<span style="font-weight: bold;">Active</span>`;
            case 2:
              return `<span style="color: red;">Service Requested</span>`;
            default:
              return value;
          }
        }
      },
      {
        type: "field",
        fieldName: "EditDate",
        direction: "desc",
        label: "Last Inspection"
      },
      {
        type: "field",
        fieldName: "notes"
      }
    ]
  };
}
