// set the geodatabase version on all layers passed
export function setVersionOnAllLayers(layers, version) {
  layers.forEach((layer) => {
    if(layer.type !== "feature") {
      return;
    } else {
      layer.gdbVersion = version;
    }
  });
}