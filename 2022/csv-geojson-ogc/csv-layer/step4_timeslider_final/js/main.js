/**
 * Step 4: Add TimeSlider widget.
 * This sample demonstrates how to add the TimeSlider widget to the application.
 * The widget will filter the wind data hourly for February 18, 2022.
 */
require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/CSVLayer",
  "esri/renderers/SimpleRenderer",
  "esri/widgets/Legend",
  "esri/widgets/TimeSlider"
], (Map, MapView, CSVLayer, SimpleRenderer, Legend, TimeSlider) => {
  // create a wind data SimpleRenderer with rotation and size visual variables.
  const windRenderer = new SimpleRenderer({
    symbol: {
      type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
      path: "M14.5,29 23.5,0 14.5,9 5.5,0z",
      color: [10, 86, 160, 0.40],
      outline: {
        color: ["#5e6472"],
        width: 0.30
      },
      angle: 180,
      size: 15
    },
    visualVariables: [
      {
        type: "rotation",  // autocasts as new RotationVariable()
        field: "wind_dir_degrees",
        rotationType: "geographic"  // rotates the symbol from the north in a clockwise direction
      },
      {
        type: "size",  // autocasts as new SizeVariable()
        field: "wind_speed_kt",
        minDataValue: 0,  // min data value for "wind_speed_kt" field
        maxDataValue: 70,  // max data value for "wind_speed_kt" field
        minSize: 8,  // the min size of the symbol
        maxSize: 40,  // the max size of the symbol
        legendOptions: {
          title: "Wind speed (kts)"  // override legend title for this layer
        }
      }
    ]
  });

  // create a wind data SimpleRenderer
  const fireRenderer = new SimpleRenderer({
    symbol: {
      type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
      color: "#ffa69e",
      path: "M216 24c0-24-31-33-44-13C48 192 224 200 224 288c0 36-29 64-65 64-35-1-63-30-63-65v-86c0-22-26-32-41-17C28 213 0 261 0 320c0 106 86 192 192 192s192-86 192-192c0-170-168-193-168-296z",
      outline: {
        color: "#A5A48C",
        width: 0.75
      },
      size: 10
    },
    visualVariables: [
      {
        type: "size",  // autocasts as new SizeVariable()
        field: "DailyAcres",
        stops: [
          { value: 0.8, size: 12, label: "< 0.8 acres" },
          { value: 2, size: 18, label: "< 2 acres" },
          { value: 20, size: 24, label: "< 20 acres" },
          { value: 265, size: 32, label: "> 265 acres" }
        ],
        legendOptions: {
          title: "Daily acres burned"  // override legend title for this layer
        }
      }
    ]
  });

  // create a PopupTemplate for the wind data layer using fieldInfos.
  const windPopupTemplate = {
    title: "Station: {station_id}",
    content: [
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: "observation_time",
            label: "Obseration time"
          },
          {
            fieldName: "wind_speed_kt",
            label: "Wind speed (kt)"
          },
          {
            fieldName: "wind_dir_degrees",
            label: "Wind direction (degrees)"
          },
          {
            fieldName: "altim_in_hg",
            label: "Altimeter (inHg)",
            format: { // round up to 0 decimal places
              digitSeparator: true,
              places: 0
            }
          },
          {
            fieldName: "wind_gust_kt",
            label: "Wind gust (kt)"
          }
        ]
      }
    ]
  };

  // create a PopupTemplate for the fire data layer with a custom arcade expression.
  const firePopupTemplate = {
    title: "{IncidentName}",
    content: `
      This fire incident in <b>{POOCounty}</b> county, <b>{POOState}</b>, was discovered on <span class="popupSpan">{FireDiscoveryDateTime}</span>.
      <br>{expression/acres-expression}
      <p>Cause of fire: <b><i>{FireCause}</i></b>.</p>
    `,
    expressionInfos: [
      {
        // If there is an acre count, display the number within a sentence. Otherwise display nothing.
        name: "acres-expression",
        expression: "IIF($feature.DailyAcres > 0, 'This fire is reported to affect ' + $feature.DailyAcres + ' acres daily.', '')"
      }
    ]
  }

  // initialize a CSVLayer
  const windCSVLayer = new CSVLayer({
    title: "Wind Station Data",
    url: "https://banuelosj.github.io/DevSummit-presentation/2022/csv-geojson-ogc/data/wind_data_2_18_full.csv",
    copyright: "NOAA",
    popupTemplate: windPopupTemplate,
    renderer: windRenderer,
    timeInfo: {
      startField: "observation_time"  // the field that determines the time extent of the layer
    }
  });

  // date variables for the fire data definition expression
  const startTime = "2022-02-18";
  const endTime = "2022-02-19";
  const dateField = "ModifiedOnDateTime_dt";

  // initialize a CSVLayer with a definition expression set to only
  // display data from 2/18/2022 which is the date interval for the wind data layer
  const fireCSVLayer = new CSVLayer({
    title: "Wildland Fire Locations",
    url: "https://banuelosj.github.io/DevSummit-presentation/2022/csv-geojson-ogc/data/WFIGS_2022_Wildland_Fire_Locations.csv",
    copyright: "WFIGS",
    definitionExpression: `${dateField} > DATE '${startTime}' AND ${dateField} < DATE '${endTime}'`,
    popupTemplate: firePopupTemplate,
    renderer: fireRenderer
  });

  // add the two CSVLayers to the map
  const map = new Map({
    basemap: "gray-vector",
    layers: [fireCSVLayer, windCSVLayer]
  });

  // initialize the view with an extent
  const view = new MapView({
    container: "viewDiv",
    map: map,
    extent: {
      type: "extent",
      xmin: -13961980.792761113,
      ymin: 3774234.6804606593,
      xmax: -12639192.111282196,
      ymax: 5214430.898644948,
      spatialReference: { wkid: 102100 }
    }
  });

  // initialize the Legend widget
  const legend = new Legend({
    view: view
  });

  // add the Legend to the view
  view.ui.add(legend, "top-right");

  // initialize the TimeSlider widget
  const timeSlider = new TimeSlider({
    container: "timeSlider",
    view: view,
    timeVisible: true // show the time stamps on the timeslider
  });

  // set the TimeSlider widget time extent and stops
  // wait for the layer to load first
  windCSVLayer.when(() => {
    timeSlider.fullTimeExtent = windCSVLayer.timeInfo.fullTimeExtent;
    timeSlider.stops = {
      interval: {
        value: 30,
        unit: "minutes"
      }
    };
    timeSlider.playRate = 1500;  // 1500 milliseconds
  });
    
});