// When layer loads, create the renderer
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

  // Create the Legend
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