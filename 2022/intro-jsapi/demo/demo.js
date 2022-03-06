require([
  "esri/Map",
  "esri/views/MapView",
  // "esri/layers/CSVLayer",
  // "esri/widgets/Legend",
  // "esri/layers/support/LabelClass",
  // "esri/renderers/SimpleRenderer",
  // "esri/geometry/geometryEngine",
  // "esri/Graphic",
  // "esri/widgets/Slider"
], function (Map, MapView, CSVLayer, Legend, LabelClass, SimpleRenderer, geometryEngine, Graphic, Slider) {

  // initialize the Map
  const map = new Map({
    basemap: "gray-vector",
    // *** add layer to the map
  });

  // initialize the 2D MapView
  const view = new MapView({
    container: "viewDiv",
    map: map,
    center: [-90, 34],
    zoom: 4
  });

  
  // initialize the CSVLayer
  const csvLayer = new CSVLayer({
    url: "https://banuelosj.github.io/DevSummit-presentation/2022/intro-jsapi/data/horror_film_locations.csv",
    title: "Horror film locations",
  });

  // initialize the legend
  // const legend = new Legend({
  //   view: view
  // });
  // // add the legend to the view
  // view.ui.add(legend, "top-left");

  // initialize the LabelClass
  //labelingInfo: [labelClass]
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

  // initialize the simple renderer
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

  // initialize the popupTemplate
  // this autocasts to new PopupTemplate()
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
  };

  // steps to generate the geometryEngine buffer
  let DISTANCE = 20;
  let csvLayerView;
  let highlight;

  // access the layerView of the CSVLayer
  // we want to query the features and highlight features
  // in the client-side
  view.whenLayerView(csvLayer).then(layerView => {
    csvLayerView = layerView;
  });

  // adding a view click event
  view.on("click", (event) => {
    clearCards();  // clears existing calcite-cards
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
    // returns a the buffer polygon
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

  // query and highlight the features that fall withing the buffer radius
  function selectFeaturesInRadius(polygon) {
    const query = csvLayerView.createQuery();
    query.geometry = polygon;
    
    // client-side query using the layerView
    csvLayerView.queryFeatures(query).then((result) => {
      if(highlight) {
        highlight.remove()
      }
      // highlight the features and add the cards to the panel
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


  // *** Calcite Design System components ***
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

  // remove the cards from the panel
  function clearCards() {
    const children = panel.querySelectorAll('*');
    children.forEach((child) => {
      if(child.nodeName === "CALCITE-CARD") {
        panel.removeChild(child);
      }
    })
    //console.log(children);
  }

  // add the Slider widget that controls the radius of the buffer
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

  // listen to change in the slider thumb and update the 
  // radius accordingly
  radiusSlider.on("thumb-drag", updateRadius);

  function updateRadius(event) {
    DISTANCE = event.value;
  }

});