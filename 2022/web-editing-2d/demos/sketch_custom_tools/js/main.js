require([
"esri/Graphic",
"esri/Map",
"esri/geometry/geometryEngine",
"esri/layers/FeatureLayer",
"esri/layers/GraphicsLayer",
"esri/views/MapView",
"esri/symbols/SimpleLineSymbol",
"esri/widgets/Sketch",
"dojo/domReady!"
], function (
  Graphic, 
  Map, 
  geometryEngine, 
  FeatureLayer, 
  GraphicsLayer, 
  MapView, 
  SimpleLineSymbol, 
  Sketch
) {
  // initialize the GraphcisLayer
  const graphicsLayer = new GraphicsLayer({ title: "graphicsLayer" });

  // Used to illustrate snapping options
  const pdxBikePathsFL = new FeatureLayer({
    url: "https://servicesqa.arcgis.com/SdQnSRS214Ul5Jv5/ArcGIS/rest/services/FL__3857__US_Portland__BikePaths/FeatureServer/0"
  });
  
  const map = new Map({
    basemap: "gray-vector",
    layers: [pdxBikePathsFL, graphicsLayer]
  });

  const view = new MapView({
    container: "viewDiv",
    map: map,
    extent: {
      xmax: -13656601.041805588,
      xmin: -13660422.893219948,
      ymax: 5707087.317567461,
      ymin: 5703265.466153101,
      spatialReference: 102100
    }
  });

  // Used to visualize the 'cut' operation
  const customPolylineSymbol = new SimpleLineSymbol({
    style: "dash",
    color: [12, 207, 255],
    width: 2
  });

  // Store current active operation ('cut' or 'union')
  let activeCustomOperation = null;
  
  // App state
  let sketch, defaultCreationMode, defaultPolygonSymbol, defaultPolylineSymbol

  view.ui.add("draw-container", "top-right");

  view.when(function(evt) {
    document.getElementById("draw-container").classList.remove("hidden");

    sketch = new Sketch({
      graphicsLayer,
      view,
      snappingOptions: {
        enabled: true,
        featureEnabled: true,
        selfEnabled: true,
        featureSources: [{ layer: pdxBikePathsFL }, { layer: graphicsLayer }]
      }
    }, "sketch");

    // Widget defaults
    // These values are temporarily overridden when 
    // using our custom tools
    defaultCreationMode = sketch.creationMode;
    defaultPolygonSymbol = sketch.viewModel.polygonSymbol;
    defaultPolylineSymbol = sketch.viewModel.polylineSymbol;

    //--------------------------------------------------------------------------
    //
    //  General tools
    //
    //--------------------------------------------------------------------------

    const cutButton = document.getElementById("cutBtn");
    const unionButton = document.getElementById("unionBtn");
    const magnifyBtn = document.getElementById("magnifyBtn");
    let magnifyHandle = null;
    
    // Magnify tool behavior
    magnifyBtn.onclick = () => {
      // Toggle active operation
      if (magnifyHandle) {
        view.magnifier.position = null;
        magnifyHandle.remove();
        magnifyHandle = null;
        magnifyBtn.classList.remove("esri-icon-zoom-out-magnifying-glass");
        magnifyBtn.classList.remove("action-button--selected");
        magnifyBtn.classList.add("esri-icon-zoom-in-magnifying-glass");
        return;
      }

      const offset = view.magnifier.size / 2;
      view.magnifier.offset = { x: offset, y: offset };

      // The magnifier will be displayed whenever the cursor hovers over the map.
      magnifyHandle = view.on("pointer-move", function (event) {
        view.magnifier.position = { x: event.x, y: event.y };
      });

      magnifyBtn.classList.add("esri-icon-zoom-out-magnifying-glass");
      magnifyBtn.classList.add("action-button--selected");
    };

    // Cut tool behavior
    cutButton.onclick = () => {
      // Toggle active operation
      if (activeCustomOperation) {
        resetCustomOperation();
        return;
      }

      // Initiate a 'cut' operation 
      activeCustomOperation = "cut";
      sketch.viewModel.polylineSymbol = customPolylineSymbol;
      sketch.creationMode = "single";
      sketch.create("polyline");
    };

    // Union tool behavior
    unionButton.onclick = () => {
      unionGraphics([...sketch.updateGraphics.items]);
    };

    //--------------------------------------------------------------------------
    //
    //  Create operation tools/workflows
    //
    //--------------------------------------------------------------------------

    const drawModeSelect = document.getElementById("drawModeSelect");
    const creationModeSelect = document.getElementById("creationModeSelect");

    // Modify 'draw mode'
    drawModeSelect.onchange = () => {
      sketch.viewModel.defaultCreateOptions.mode = drawModeSelect.value;
      sketch.create(sketch.activeTool);
    }

    // Modify 'creation mode'
    creationModeSelect.onchange = () => {
      sketch.creationMode = creationModeSelect.value;
    }

    //--------------------------------------------------------------------------
    //
    //  Update operation tools/workflows
    //
    //--------------------------------------------------------------------------

    const copyButton = document.getElementById("copyBtn");
    const rotateButton = document.getElementById("rotateBtn");
    const rotateInput = document.getElementById("rotateInput");

    // Duplicate selected graphics
    copyButton.onclick = () => {
      const graphics = sketch.updateGraphics.items;
      const clones = graphics.map((graphic) => graphic.clone());

      graphicsLayer.addMany(clones);
      sketch.update(clones, { tool: sketch.activeTool });
    };

    // Rotate selected graphics by specified ammount 
    rotateButton.onclick = () => {
      const graphics = [...sketch.updateGraphics.items];

      graphics.forEach((graphic) => {
        graphic.geometry = geometryEngine.rotate(graphic.geometry, rotateInput.value);
      });
      
      sketch.update(graphics, { tool: sketch.activeTool });
    };

    //--------------------------------------------------------------------------
    //
    //  UI Updates
    //
    //--------------------------------------------------------------------------

    const generalButtonContainer = document.getElementById("generalButtonContainer");
    const createButtonContainer = document.getElementById("createButtonContainer");
    const updateButtonContainer = document.getElementById("updateButtonContainer");

    sketch.watch("activeTool", (newValue) => {
      if (newValue) {
        // Updating
        if (sketch.updateGraphics.length) {
          generalButtonContainer.classList.add("hidden");
          createButtonContainer.classList.add("hidden");
          updateButtonContainer.classList.remove("hidden");
        }
        // Creating 
        else {
          generalButtonContainer.classList.add("hidden");
          createButtonContainer.classList.remove("hidden");
          updateButtonContainer.classList.add("hidden");
          
        }
      } else {
        generalButtonContainer.classList.remove("hidden");
        createButtonContainer.classList.add("hidden");
        updateButtonContainer.classList.add("hidden");
      }


      unionButton.classList.remove("action-button--selected");

      // Union button states
      if (activeCustomOperation === "union") {
        unionButton.classList.add("action-button--selected");
      }
    });

    sketch.on("create", (event) => {
      // Create operation has successfully finished
      // Check if a custom operation was used
      if (activeCustomOperation && event.state === "complete") {
        if (activeCustomOperation === "cut") {
          onCutOperationComplete(event.graphic);
        } else if (activeCustomOperation === "union") {
          onUnionOperationComplete(event.graphic);
        }

        resetCustomOperation();
      }
    });

    // Only show  the 'union' button if more than one graphic is selected
    sketch.watch("updateGraphics.length", (value) => {
      if (value > 1) {
        unionBtn.classList.remove("hidden");
      } else {
        unionBtn.classList.add("hidden");
      }
    });

  }); // end of view.when()

  //--------------------------------------------------------------------------
  //
  //  Operational logic
  //
  //--------------------------------------------------------------------------

  function resetCustomOperation() {
    sketch.cancel();
    sketch.viewModel.polygonSymbol = defaultPolygonSymbol;
    sketch.viewModel.polylineSymbol = defaultPolylineSymbol;
    activeCustomOperation = null;
  }

  function onCutOperationComplete(cutterGraphic) {
    // Remove the cut graphic from view
    graphicsLayer.remove(cutterGraphic);

    // Shallow clone for preserving original geometries
    // in the following loop.
    const layerGraphics = graphicsLayer.graphics.items.slice(0);

    // Loop through all graphics on the GraphicsLayer and
    // attempt to cut each graphic using the geometry of
    // the cut graphic.
    // Only valid cuts are acknowleged
    layerGraphics.forEach((graphic) => {
      // Get cut geometries
      const cutGeometries = geometryEngine.cut(graphic.geometry, cutterGraphic.geometry);

      // Found valid geometries
      if (cutGeometries.length) {
        // Create new graphics from the geometries
        const graphics = cutGeometries.map(
          (geometry) => new Graphic({ geometry, symbol: graphic.symbol })
        );

        // Remove the graphic that was cut from the view
        graphicsLayer.remove(graphic);

        // Add the newly created graphics to the view
        graphicsLayer.addMany(graphics);
      }
    });
  }

  function onUnionOperationComplete(unionGraphic) {
    // Remove the union graphic from view
    graphicsLayer.remove(unionGraphic);

    // Shallow clone for preserving original geometries
    // in the following loop.
    const layerGraphics = graphicsLayer.graphics.items.slice(0);

    // Array for storing union candidates
    const targetGraphics = [];

    layerGraphics.forEach((graphic) => {
      // Look for valid union candidates
      if (geometryEngine.contains(unionGraphic.geometry, graphic.geometry)) {
        // Save reference to candidate
        targetGraphics.push(graphic);
      }
    });

    if (targetGraphics.length > 1) {
      unionGraphics(targetGraphics);
    }
  }

  function unionGraphics(graphics) {
    // Get geometries from the target graphics
    const geometries = graphics.map((graphic) => graphic.geometry);

    // Combine the geometries
    const unionedGeometry = geometryEngine.union(geometries);

    // Check validity
    if (unionedGeometry) {
      // Create a graphic with the new geometry
      const unionedGraphic = new Graphic({
        geometry: unionedGeometry,
        symbol: graphics[0].symbol
      });

      // Remove target graphics from the view
      graphicsLayer.removeMany(graphics);

      // Add the graphic to the view
      graphicsLayer.add(unionedGraphic);
    }
  }

});