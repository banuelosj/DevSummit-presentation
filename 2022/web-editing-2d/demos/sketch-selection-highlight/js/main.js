require([
  "esri/Map", 
  "esri/views/MapView", 
  "esri/Graphic",
  "esri/symbols/CIMSymbol",
  "esri/widgets/Sketch",
  "esri/layers/GraphicsLayer"
], function (
  Map,
  MapView,
  Graphic,
  CIMSymbol,
  Sketch,
  GraphicsLayer
) {

  const graphicsLayer = new GraphicsLayer();

  const map = new Map({
    basemap: "gray-vector",
    layers: [graphicsLayer]
  });

  const view = new MapView({
    center: [-135, 44],
    container: "viewDiv",
    map: map,
    zoom: 4,
    highlightOptions: {
      color: "#C576F6",
      fillOpacity: 0.2
    }
  });

  // symbols
  const cimSymbol = new CIMSymbol({
    data: {
      type: "CIMSymbolReference",
      symbol: {
        type: "CIMPointSymbol",
        symbolLayers: [{
          type: "CIMVectorMarker",
          enable: true,
          size: 32,
          frame: {
            xmin: 0,
            ymin: 0,
            xmax: 16,
            ymax: 16
          },
          markerGraphics: [{
            type: "CIMMarkerGraphic",
            geometry: {
              rings: [[[8, 16], [0, 0], [16, 0], [8, 16]]]
            },
            symbol: {
              type: "CIMPolygonSymbol",
              symbolLayers: [{
                type: "CIMSolidStroke",
                width: 5,
                color: [240, 94, 35, 255]
              }]
            }
          }]
        }]
      }
    }
  });

  const pictureMarkerSymbol = {
    type: "picture-marker",
    url: "https://static.arcgis.com/images/Symbols/Shapes/BlackStarLargeB.png",
    width: "90px",
    height: "90px"
  }

  const textSymbol = {
    type: "text",
    color: "white",
    haloColor: "black",
    haloSize: "1px",
    text: "Text Symbol",
    xoffset: 3,
    yoffset: 3,
    font: {
      size: 20,
      family: "Josefin Slab",
      weight: "bold"
    }
  };

  // graphics
  const cimGraphic = new Graphic({
    geometry: {
      type: "point",
      x: -15834980.403734665,
      y: 5002706.83558252,
      spatialReference: { wkid: 102100 }
    },
    symbol: cimSymbol
  });

  const pictureMarkerGraphic = new Graphic({
    geometry: {
      type: "point",
      x: -15834980.403734665,
      y: 5802706.83558252,
      spatialReference: { wkid: 102100 }
    },
    symbol: pictureMarkerSymbol
  });

  const textGraphic = new Graphic({
    geometry: {
      type: "point",
      x: -15834980.403734665,
      y: 6432706.83558252,
      spatialReference: { wkid: 102100 }
    },
    symbol: textSymbol
  });

  graphicsLayer.addMany([pictureMarkerGraphic, cimGraphic, textGraphic]);

  const sketch = new Sketch({
    view: view,
    layer: graphicsLayer
  });

  view.ui.add(sketch, "top-right");

});