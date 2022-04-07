import React, { useRef, useEffect, useState } from 'react';

// stylesheets
import './App.css';
import "@esri/calcite-components/dist/calcite/calcite.css";

import MovieList from './MovieList';

// calcite components
import "@esri/calcite-components/dist/components/calcite-panel";
import "@esri/calcite-components/dist/components/calcite-label";
import "@esri/calcite-components/dist/components/calcite-block";
import {
  CalcitePanel,
  CalciteLabel,
  CalciteBlock
} from "@esri/calcite-components-react";


// esri @arcgis/core imports
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import CSVLayer from '@arcgis/core/layers/CSVLayer';
import Legend from '@arcgis/core/widgets/Legend';
import LabelClass from '@arcgis/core/layers/support/LabelClass';
import SimpleRenderer from '@arcgis/core/renderers/SimpleRenderer';
import * as geometryEngine from '@arcgis/core/geometry/geometryEngine';
import Graphic from '@arcgis/core/Graphic';
import Slider from '@arcgis/core/widgets/Slider';

// popupTemplate
const popupTemplate = {  // autocasts as new PopupTemplate()
   title: "{movie}",
   content: [{
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
   }]
};

// renderer
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

// create a label class
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

const App = () => {
   const mapDiv = useRef(null);
   const sliderDiv = useRef(null);

   const [cards, setCards] = useState([]);

   useEffect(() => {
      let DISTANCE = 20;
      let csvLayerView;
      let highlight;

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
         container: mapDiv.current,
         map, // shorthand for map: map
         center: [-90, 34],
         zoom: 4
      });

      const legend = new Legend({
         view: view
      });
     
      view.ui.add(legend, "top-right");

      view.whenLayerView(csvLayer).then(layerView => {
         csvLayerView = layerView;
      });

      view.on("click", (event) => {
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
            } else {
               // clears the panel from the cards
               setCards([]);
            }
         });
      }

      // highlight the query results
      function highlightResults(features) {
         // create an array of objectids from the query results
         let objectIDs = features.map((feature) => {
         return feature.attributes.__OBJECTID
         });
         // you can pass an array of objectids to highlight
         highlight = csvLayerView.highlight(objectIDs);
      }

      // UI
      function populatePanel(features) {
         const featureResults = features.map((feature) => {
            return { 
               date: feature.attributes.film_release_date,
               movie: feature.attributes.movie,
               rating: feature.attributes.rating,
               shot_location: feature.attributes.film_shot_location
            }
         });
         setCards(featureResults);
      };
   
      const radiusSlider = new Slider({
         container: sliderDiv.current,
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

   }, []);

   return (
      <>
         <CalcitePanel id="panel" heading="Movies filmed nearby">
            <CalciteBlock open id="headingBlock">
               <CalciteLabel>Radius (miles)
                  <div className="radiusSlider" ref={sliderDiv}></div>
               </CalciteLabel>
            </CalciteBlock>
            <MovieList movies={cards} />
         </CalcitePanel>
         <div className="mapDiv" ref={mapDiv}></div>
      </>
   );
};

export default App;