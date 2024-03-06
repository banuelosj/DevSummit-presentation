/**
 * Title: Editor FormTemplate
 * This sample demonstrates how to set a FormTemplate programmatically for a layer
 * using Editor.layerinfos
 */
require([
  "esri/Map",
  "esri/views/MapView",
  "esri/widgets/Editor",
  "esri/widgets/LayerList",
  "esri/layers/FeatureLayer",
  "esri/form/FormTemplate",
  "esri/form/elements/FieldElement",
  "esri/form/elements/RelationshipElement"
], function (
  Map, MapView, 
  Editor, LayerList, FeatureLayer, 
  FormTemplate, FieldElement, RelationshipElement
) {

  // initialize the formTemplate
  const parcelsTemplate = new FormTemplate({
    title: "NZ Parcels",
    elements: [
      new FieldElement({
        fieldName: "parcel_id",
        label: "id"
      }),
      new FieldElement({
        fieldName: "land_district",
        label: "land district"
      }),
      new FieldElement({
        fieldName: "survey_area",
        label: "survey area",
        editableExpression: false
      }),
      new FieldElement({
        fieldName: "last_update_date",
        label: "date last updated",
      }),
      new RelationshipElement({
        displayCount: 1,
        label: "Permits",
        orderByFields: [
          {
            field: "issue_date",
            order: "desc"
          }
        ],
        relationshipId: 0
      }),
      new RelationshipElement({
        displayCount: 3,
        label: "Owners",
        orderByFields: [
          {
            field: "owner",
            order: "desc"
          }
        ],
        relationshipId: 1
      })
    ]
  });

  // initialize the FeatureLayer
  const featureLayer = new FeatureLayer({
    url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/NewZealandParcels/FeatureServer/0",
    title: "New Zealand Parcels",
    formTemplate: parcelsTemplate
  });

  // related tables
  const permitsTable = new FeatureLayer({
    url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/NewZealandParcels/FeatureServer/3",
    title: "Parcel permits"
  });

  const ownersTable = new FeatureLayer({
    url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/NewZealandParcels/FeatureServer/2",
    title: "Parcel owners"
  });

  // initialize the Map
  const map = new Map({
    basemap: "streets-vector",
    layers: [featureLayer, permitsTable, ownersTable]
  });

  // create an instance of the view
  const view = new MapView ({
    container: "viewDiv",
    map,
    center: [169.96640, -46.12805],
    zoom: 19
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