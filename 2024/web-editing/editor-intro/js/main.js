/**
 * Title: Editor Responsiveness
 * This sample demonstrates how to bring in the Editor and LayerList widgets.
 */
require([
  "esri/WebMap",
  "esri/views/MapView",
  "esri/widgets/Editor",
  "esri/widgets/LayerList"
], function (WebMap, MapView, Editor, LayerList) {

  // initialize the WebMap with the item id 
  // of the webmap in ArcGIS Online
  const webmap = new WebMap({
    portalItem: {
      id: "7ec48b1162c94e2eaec05db995801042"
    }
  })

  // create an instance of the view and pass the webmap
  const view = new MapView ({
    container: "viewDiv",
    map: webmap
  });

  // initialize the Editor widget
  const editor = new Editor({ view });
  view.ui.add(editor, "top-right");

  // LayerList
  const layerList = new LayerList({ view });
  view.ui.add(layerList, "top-left");

  // move the zoom widget to the bottom left
  view.ui.move([ "zoom" ], "bottom-right");
});