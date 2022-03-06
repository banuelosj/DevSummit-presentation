/**
 * Step 7: Add calcite components
 * This sample demonstrates how to use the Calcite Design System to create a panel
 * of cards populated with the feature attribute information of the features
 * that fall within the radius of the buffer.
 * We will also be utilizing the Slider widget to control the buffer radius.
 */
require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/CSVLayer",
  "esri/widgets/Legend",
  "esri/layers/support/LabelClass",
  "esri/renderers/SimpleRenderer",
  "esri/geometry/geometryEngine",
  "esri/Graphic",
  "esri/widgets/Slider"
], function (Map, MapView, CSVLayer, Legend, LabelClass, SimpleRenderer, geometryEngine, Graphic, Slider) {

  const popupTemplate = {
    title: "{movie}",
    content: [
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: "film_shot_location",
            label: "Film location"
          },
          {
            fieldName: "film_release_date",
            label: "Release year"
          },
          {
            fieldName: "rating",
            label: "Movie rating"
          }
        ]
      }
    ]
  }

  const simpleRenderer = new SimpleRenderer({
    symbol: {
      type: "picture-marker",
      url: "https://banuelosj.github.io/DevSummit-presentation/2022/intro-jsapi/data/cobweb.png",
      width: "64px",
      height: "64px"
    },
    visualVariables: [
      {
        type: "size",
        field: "rating",
        stops: [
          { value: 4, size: 50, label: "> 4 stars"},
          { value: 3, size: 40, label:"3 stars"},
          { value: 2, size: 30, label:"2 stars"},
          { value: 1, size: 20, label:"< 1 stars"}
        ],
        legendOptions: {
          title: "Movie rating"
        }
      }
    ]
  });

  const labelClass = new LabelClass({
    labelExpressionInfo: { expression: "$feature.movie" },
    symbol: {
      type: "text",  // autocasts as new TextSymbol()
      color: "#00A0FF",
      font: {
        // autocast as new Font()
        family: "Playfair Display",
        size: 12,
        weight: "bold"
      }
    },
    labelPlacement: "above-center",
  });

  const csvLayer = new CSVLayer({
    url: "https://banuelosj.github.io/DevSummit-presentation/2022/intro-jsapi/data/horror_film_locations.csv",
    title: "Horror film locations",
    labelingInfo: [labelClass],
    renderer: simpleRenderer,
    popupTemplate: popupTemplate,
    popupEnabled: false
  });

  const map = new Map({
    basemap: "gray-vector",
    layers: [csvLayer]
  });

  const view = new MapView({
    container: "viewDiv",
    map: map,
    center: [-90, 34],
    zoom: 4
  });

  const legend = new Legend({
    view: view
  });

  view.ui.add(legend, "top-left");

  let DISTANCE = 20;
  let csvLayerView;
  let highlight;

  view.whenLayerView(csvLayer).then(layerView => {
    csvLayerView = layerView;
  });

  view.on("click", (event) => {
    clearCards();
    addPoint(event.mapPoint);
  });

  // adds a marker on the location where the view was clicked
  function addPoint(point) {
    if(view.graphics.length > 0) {
      view.graphics.removeAll();
    }

    // create the point graphic
    const pointGraphic = new Graphic({
      geometry: point,
      symbol: {
        type: "simple-marker",
        color: "#00A0FF",
        size: 12,
        outline: {
          width: 1,
          color: "#000000"
        }
      }
    });

    // create the buffer
    createBuffer(point);
    // add the point graphic to the map
    view.graphics.add(pointGraphic);
  };

  // generate the buffer
  function createBuffer(point) {
    // obtain the buffer polygon
    const bufferPolygon = geometryEngine.geodesicBuffer(point, DISTANCE, "miles");
    
    // create a graphic from the buffer polygon
    const bufferGraphic = new Graphic({
      geometry: bufferPolygon,
      symbol: {
        type: "simple-fill",
        color: [247, 99, 0, 0.3],
        style: "solid",
        outline: {
          color: "#ffffff",
          width: 1
        }
      }
    });

    // add the buffer graphic to the map
    view.graphics.add(bufferGraphic);
    // select the features
    selectFeaturesInRadius(bufferPolygon);
    // zoom to the location
    view.goTo({ target: bufferPolygon });
  };

  // query and highlight the features that fall withing the buffer
  // radius
  function selectFeaturesInRadius(polygon) {
    const query = csvLayerView.createQuery();
    query.geometry = polygon;
    
    // client-side queries
    csvLayerView.queryFeatures(query).then((result) => {
      if(highlight) {
        highlight.remove()
      }
      if(!!result.features.length) {
        highlightResults(result.features);
        populatePanel(result.features);
      }
    });
  };

  // highlight the query results
  function highlightResults(features) {
    // create an array of objectids from the query results
    let objectIDs = features.map((feature) => {
      return feature.attributes.__OBJECTID
    });
    // you can pass an array of objectids to highlight
    highlight = csvLayerView.highlight(objectIDs);
  };

  const panel = document.getElementById("panel");

  function populatePanel(features) {
    features.forEach((feature) => {
      const movieCard = document.createElement("calcite-card");
      const titleSpan = document.createElement("span");
      titleSpan["slot"] = "title";
      titleSpan.innerText = feature.attributes.movie
      
      const subtitleSpan = document.createElement("span");
      subtitleSpan["slot"] = "subtitle";
      subtitleSpan.innerText = feature.attributes.film_release_date;

      const rating = document.createElement("calcite-rating");
      rating["average"] = feature.attributes.rating;
      rating["slot"] = "footer-leading";
      rating["show-chip"] = true;
      rating.disabled = true;

      const description = document.createElement("p");
      description.style["font-size"] = "16px";
      description.innerHTML = `<span style="color: #00A0FF"><b><i>${feature.attributes.movie}</i></b></span> was filmed in ${feature.attributes.film_shot_location}`;

      movieCard.appendChild(titleSpan);
      movieCard.appendChild(subtitleSpan);
      movieCard.appendChild(description);
      movieCard.appendChild(rating);

      panel.appendChild(movieCard);
    });
  };

  function clearCards() {
    const children = panel.querySelectorAll('*');
    children.forEach((child) => {
      if(child.nodeName === "CALCITE-CARD") {
        panel.removeChild(child);
      }
    })
    //console.log(children);
  }

  const radiusSlider = new Slider({
    container: "radiusSlider",
    min: 1,
    max: 200,
    values: [20],
    steps: 1,
    visibleElements: {
      rangeLabels: true,
      labels: true
    }
  });

  // listen to change and input events on UI components
  radiusSlider.on("thumb-drag", updateRadius);

  function updateRadius(event) {
    DISTANCE = event.value;
  }

});