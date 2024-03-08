/**
 * Title: Editor, more advanced features
 * This sample demonstrates how to utilize more of the Editor capabilities with
 * snapping, editing constraints, arcade, etc.
 */
require([
  "esri/WebMap",
  "esri/views/MapView",
  "esri/widgets/Editor"
], function (WebMap, MapView, Editor) {

  // initialize the WebMap with the item id 
  // of the webmap in ArcGIS Online
  const webmap = new WebMap({
    portalItem: {
      id: "71e7b61721ba48b6adb1769524baf917"
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
});