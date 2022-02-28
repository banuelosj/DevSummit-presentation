require([
  "esri/Map",
  "esri/layers/CSVLayer",
  "esri/layers/FeatureLayer",
  "esri/views/MapView",
  "esri/widgets/Legend",
  "esri/widgets/Expand",
  "esri/widgets/TimeSlider",
  "esri/layers/support/FeatureEffect"
], (Map, CSVLayer, FeatureLayer, MapView, Legend, Expand, TimeSlider, FeatureEffect) => {
  const fireDataUrl = "https://jbanuelos1.esri.com/data/csv/WFIGS_2022_Wildland_Fire_Locations_full.csv";
  const windDataUrl = "https://jbanuelos1.esri.com/data/csv/wind_data_2_14_full.csv";

  const rotationRenderer = {
    type: "simple", // autocasts as new SimpleRenderer()
    symbol: {
      type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
      path: "M14.5,29 23.5,0 14.5,9 5.5,0z",
      color: "#b8f2e6",
      outline: {
        color: ["#5e6472"],
        width: 0.30
      },
      angle: 180,
      size: 15
    },
    visualVariables: [
      {
        type: "rotation",
        field: "wind_dir_degrees",
        rotationType: "geographic"
      },
      {
        type: "size",
        field: "wind_speed_kt",
        minDataValue: 0,
        maxDataValue: 70,
        minSize: 8,
        maxSize: 40,
        legendOptions: {
          title: "Wind Speed (kts)"
        }
      }
    ]
  };

  const sizeRenderer = {
    type: "simple",
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
        type: "size",
        field: "DailyAcres",
        stops: [
          { value: 0.8, size: 12, label: "< 0.8 acres" },
          { value: 2, size: 18, label: "< 2 acres" },
          { value: 20, size: 24, label: "< 20 acres" },
          { value: 265, size: 32, label: "> 265 acres" }
        ],
        legendOptions: {
          title: "Daily Acres burned (acres)"
        }
      }
    ]
  };

  const windCSVLayer = new CSVLayer({
    title: "Wind Station Data",
    url: windDataUrl,
    copyright: "NOAA",
    latitudeField: "latitude",
    longitudeField: "longitude",
    renderer: rotationRenderer,
    popupTemplate: {
      title: "Station: {station_id}",
      content: [
        {
          // It is also possible to set the fieldInfos outside of the content
          // directly in the popupTemplate. If no fieldInfos is specifically set
          // in the content, it defaults to whatever may be set within the popupTemplate.
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
              format: {
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
    },
    timeInfo: {
      startField: "observation_time"
    },
    //refreshInterval: 2
  });

  const startTime = "2022-02-14";
  const endTime = "2022-02-15";
  const dateField = "FireDiscoveryDateTime"; // ModifiedOnDateTime_dt or FireDiscoveryDateTime

  const fireCSVLayer = new CSVLayer({
    title: "Wildland Fire Locations",
    url: fireDataUrl,
    copyright: "WFIGS",
    renderer: sizeRenderer,
    definitionExpression: `${dateField} > DATE '${startTime}' AND ${dateField} < DATE '${endTime}'`,
    popupTemplate: {
      title: "{IncidentName}",
      content: `
        This fire incident in <b>{POOCounty}</b> county, <b>{POOState}</b>, was discovered on <span class="popupSpan">{FireDiscoveryDateTime}</span>.
        <br>{expression/acres-expression}
        <p>Cause of fire: <b><i>{expression/cause-expression}</i></b>.</p>
      `,
      expressionInfos: [{
        name: "acres-expression",
        expression: "IIF($feature.DailyAcres > 0, 'This fire is reported to affect ' + $feature.DailyAcres + ' acres daily.', '')"
      }, {
        name: "cause-expression",
        expression: "IIF(Count($feature.FireCause) > 0, $feature.FireCause, 'Unknown')"
      }]
    }
  });

  // USA states layer
  const states = new FeatureLayer({
    url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/USA_States_Generalized/FeatureServer/0",
    //definitionExpression: "STATE_NAME = 'California'",
    legendEnabled: false,
    opacity: 1,
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-fill",
        color: [10, 86, 160, 0.40],
        outline: {
          // autocasts as new SimpleLineSymbol()
          width: 1,
          color: "white",
        },
      },
    },
    effect: "drop-shadow(-10px, 10px, 6px gray)"
  });

  const map = new Map({
    basemap: "gray-vector",
    layers: [states, fireCSVLayer, windCSVLayer]
  });

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

  const legend = new Legend({
    view: view
  });

  view.ui.add(legend, "top-right");

  view.whenLayerView(states).then((layerView) => {
    layerView.featureEffect = new FeatureEffect({
      filter: {
        where: "STATE_NAME = 'California'"
      },
      excludedEffect: "opacity(30%)"
    });
  });

  // time slider widget initialization
  const timeSlider = new TimeSlider({
    container: "timeSlider",
    view: view,
    timeVisible: true, // show the time stamps on the timeslider
    fullTimeExtent: {
      start: new Date("2022-02-14T15:10:00Z"),
      end: new Date("2022-02-14T21:56:00Z")
    }
  });

  view.whenLayerView(windCSVLayer).then((lv) => {
    // around up the full time extent to full hour
    timeSlider.fullTimeExtent = windCSVLayer.timeInfo.fullTimeExtent;
    timeSlider.stops = {
      interval: {
        value: 20,
        unit: "minutes"
      }
    };
  });

  // check refresh
  // windCSVLayer.on("refresh", (evt) => {
  //   if(evt.dataChanged) {
  //     console.log("data has changed after refresh...");
  //     const query = windCSVLayer.createQuery();
  //     query.where = "1=1";

  //     windCSVLayer.queryFeatureCount(query).then((results) => {
  //       console.log('numOfFeatures: ', results);
  //     });
  //   } else {
  //     console.log("data has not changed after refresh...");
  //   }
  // })
    
});