// Assign the expression to the `valueExpression` property and
// set up the unique value infos based on the decode values
// you set up in the expression.
const droughtArcade = document.getElementById("drought-renderer").text;

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