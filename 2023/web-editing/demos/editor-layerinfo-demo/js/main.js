require([
  "esri/WebMap",
  "esri/views/MapView",
  "esri/widgets/Editor",
  "esri/widgets/Expand",
  "esri/widgets/LayerList"
], function (WebMap, MapView, Editor, Expand, LayerList) {

  let webmap = new WebMap({
    portalItem: {
      id: "67d9c6bdcd894435be4f926e362ae24a",
      portal: {
         url: "https://arcgis.com"
      }
    }
  });

  const view = new MapView({
    container: "viewDiv",
    map: webmap,
    popup: {
      autoOpenEnabled: false
    }
  });

  const layerList = new LayerList({ view });

  const layerListExpand = new Expand({
    view: view,
    content: layerList,
    expanded: false,
    group: "top-left"
  });

  const layerInfoExpand = new Expand({
    view,
    content: document.getElementById("layerInfoPanel"),
    expanded: true,
    expandTooltip: "Update Layer settings",
    expandIconClass: "esri-icon-layers",
    group: "top-left"
  });

  const editor = new Editor({
    view: view,
  });

  view.ui.add(editor, "top-right");
  view.ui.add([layerListExpand, layerInfoExpand], "top-left");

  view.when(async () => {
    await view.map.loadAll();
    generateLayerInfos(view.map.editableLayers);
    populateLayerInfoTable(view.map.editableLayers);
  });

  const layerInfoTable = document.getElementById("layerInfoTable");

  function populateLayerInfoTable(layers) {
    if(!layers) {
      console.log("No editable layers on the map...");
      return;
    }
    
    layers.forEach(layer => {
      if(layer.type === "feature") {
        const tr = document.createElement("tr");
        setLayerRow(layer, tr);
        layerInfoTable.appendChild(tr);
      }
    });
  }

  function setLayerRow(layer, row) {
    const td = document.createElement("td");
    td.innerText = layer.title;
    row.appendChild(td);

    const tdEditEnabled = document.createElement("td");
    const checkboxEditEnabled = document.createElement("calcite-checkbox");
    checkboxEditEnabled.checked = layer.capabilities.operations.supportsEditing;
    // disabled when service does not supports edits
    // cannot override this at the client side if the service does not support this
    checkboxEditEnabled.disabled = !layer.capabilities.operations.supportsEditing;
    checkboxEditEnabled.addEventListener("calciteCheckboxChange", function(evt) { handleCheckedUpdate(evt, layer, "supportsEdits") });
    tdEditEnabled.appendChild(checkboxEditEnabled);
    row.appendChild(tdEditEnabled);

    const tdAdds = document.createElement("td");
    const checkboxAdds = document.createElement("calcite-checkbox");
    // disabled when service does not support adds (create)
    // cannot override this at the client side if the service does not support this
    checkboxAdds.checked = layer.capabilities.operations.supportsAdd;
    checkboxAdds.disabled = !layer.capabilities.operations.supportsAdd;
    checkboxAdds.addEventListener("calciteCheckboxChange", function(evt) { handleCheckedUpdate(evt, layer, "allowAdds") });
    tdAdds.appendChild(checkboxAdds);
    row.appendChild(tdAdds);

    const tdUpdate = document.createElement("td");
    const checkboxUpdate = document.createElement("calcite-checkbox");
    checkboxUpdate.checked = layer.capabilities.operations.supportsUpdate;
    // disabled when service does not support update
    // cannot override this at the client side if the service does not support this
    checkboxUpdate.disabled = !layer.capabilities.operations.supportsUpdate;
    checkboxUpdate.addEventListener("calciteCheckboxChange", function(evt) { handleCheckedUpdate(evt, layer, "allowUpdates") });
    tdUpdate.appendChild(checkboxUpdate);
    row.appendChild(tdUpdate);

    const tdDelete = document.createElement("td");
    const checkboxDelete = document.createElement("calcite-checkbox");
    checkboxDelete.checked = layer.capabilities.operations.supportsDelete;
    // disabled when service does not support deletes
    // cannot override this at the client side if the service does not support this
    checkboxDelete.disabled = !layer.capabilities.operations.supportsDelete;
    checkboxDelete.addEventListener("calciteCheckboxChange", function(evt) { handleCheckedUpdate(evt, layer, "allowDelete") });
    tdDelete.appendChild(checkboxDelete);
    row.appendChild(tdDelete);

    const tdGeometry = document.createElement("td");
    const checkboxGeometry = document.createElement("calcite-checkbox");
    checkboxGeometry.checked = !layer.capabilities.editing.supportsGeometryUpdate;
    // disabled when service does not support enabled geometry updates
    // cannot override this at the client side if the service does not support this
    checkboxGeometry.disabled = !layer.capabilities.editing.supportsGeometryUpdate;
    checkboxGeometry.addEventListener("calciteCheckboxChange", function(evt) { handleCheckedUpdate(evt, layer, "geometryEdits") });
    tdGeometry.appendChild(checkboxGeometry);
    row.appendChild(tdGeometry);

    const tdAttr = document.createElement("td");
    const checkboxAttr = document.createElement("calcite-checkbox");
    checkboxAttr.checked = false;
    checkboxAttr.addEventListener("calciteCheckboxChange", function(evt) { handleCheckedUpdate(evt, layer, "attributeEdits") });
    tdAttr.appendChild(checkboxAttr);
    row.appendChild(tdAttr);
  }

  function handleCheckedUpdate(e, layer, operation) {
    let tempLayerInfo = [];
    tempLayerInfo = [...editor.layerInfos];

    editor.layerInfos.forEach((layerInfo, index) => {
      if(layerInfo.layer == layer) {
        switch (operation) {
          case "supportsEdits":
            tempLayerInfo[index].enabled = e.target.checked;
            break;
          case "allowAdds": 
            tempLayerInfo[index].addEnabled = e.target.checked;
            break;
          case "allowUpdates": 
            tempLayerInfo[index].updateEnabled = e.target.checked;
            break;
          case "allowDelete": 
            tempLayerInfo[index].deleteEnabled = e.target.checked;
            break;
          case "geometryEdits": 
            tempLayerInfo[index].geometryUpdatesEnabled = !e.target.checked;
            break;
          case "attributeEdits": 
            tempLayerInfo[index].attributeUpdatesEnabled = !e.target.checked;
            break;
          default:
            console.log("unable to handle checked event...");
        }
      }
    });

    editor.layerInfos = tempLayerInfo;
  }

  function generateLayerInfos(layers) {
    layerInfos = [];
    layers.items.forEach((layer) => {
      let layerInfo = {
        layer: layer,
        enabled: layer.capabilities.operations.supportsEditing,
        addEnabled: layer.capabilities.operations.supportsAdd,
        updateEnabled: layer.capabilities.operations.supportsUpdate,
        deleteEnabled: layer.capabilities.operations.supportsDelete,
        geometryUpdatesEnabled: layer.capabilities.editing.supportsGeometryUpdate,
        attributeUpdatesEnabled: true // usually always true from service
      }
      layerInfos.push(layerInfo);
    });
    editor.layerInfos = layerInfos;
  }

});