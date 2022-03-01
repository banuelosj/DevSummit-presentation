 // Typical usage for FeatureTable widget. This will recognize all fields in the layer if none are set.
 const featureTable = new FeatureTable({
    view: view,
    layer: fireLayer,
    container: "container", //document.createElement("div")
  });