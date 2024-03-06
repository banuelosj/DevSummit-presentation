/**
 * Title: Editor Snapping + Tooltips
 * This sample demonstrates how to programmatically enable snapping
 * and tooltips for Editor.
 */

// Obtain the Map and Editor components
const arcgisMap = document.querySelector("arcgis-map");
const editor = document.querySelector("arcgis-editor");

// Wait for the Map to finish loading
arcgisMap.addEventListener("arcgisViewReadyChange", async (event) => {
  view = event.target.view;
  // Make sure the layers are loaded
  await view.map.loadAll();
  // Enable snapping on only the editable layers on the map
  enableSnappingAndTooltips(view.map.editableLayers.items);
});

function enableSnappingAndTooltips(layers) {
  // Enable tooltips
  editor.tooltipOptions = { enabled: true }

  // Enable snapping
  const featureSnappingSource = [];

  layers.forEach((layer) => {
    // If the layer is a SubtypeGroupLayer or GroupLayer
    // only pass the sublayers as feature snapping sources
    if(layer.type === "subtype-group" || layer.type === "group") {
      layer.sublayers.items.forEach((sublayer) => {
        featureSnappingSource.push({ layer: sublayer, enabled: true })
      });
    } else {
      featureSnappingSource.push({ layer: layer, enabled: true });
    }
  });

  editor.snappingOptions = {
    enabled: true,       // enable snapping
    selfEnabled: true,  // turns off geometry guides
    featureSources: featureSnappingSource // pass the layers to have snapping enabled
  }
}
