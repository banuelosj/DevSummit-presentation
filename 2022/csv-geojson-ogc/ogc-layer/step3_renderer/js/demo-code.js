// Assign the expression to the `valueExpression` property and
// set up the unique value infos based on the decode values
// you set up in the expression.
const droughtArcade = document.getElementById("drought-renderer").text;

// initialize the Legend widget
const legend = new Legend({
  view: view
});

// add the Legend to the view
view.ui.add(legend, "top-right");

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