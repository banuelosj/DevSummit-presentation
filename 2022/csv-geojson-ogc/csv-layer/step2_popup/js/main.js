/**
 * Step 2: Configure a PopupTemplate.
 * This sample demonstrates how to configure popup content for a CSVLayer. There is
 * an example using fieldInfos and an example with a custom arcade expression.
 */
require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/CSVLayer"
], (Map, MapView, CSVLayer) => {
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
    url: "https://jbanuelos1.esri.com/data/csv/wind_data_2_18_full.csv",
    copyright: "NOAA",
    popupTemplate: windPopupTemplate
  });

  // date variables for the fire data definition expression
  const startTime = "2022-02-18";
  const endTime = "2022-02-19";
  const dateField = "FireDiscoveryDateTime";

  // initialize a CSVLayer with a definition expression set to only
  // display data from 2/18/2022 which is the date interval for the wind data layer
  const fireCSVLayer = new CSVLayer({
    title: "Wildland Fire Locations",
    url: "https://jbanuelos1.esri.com/data/csv/WFIGS_2022_Wildland_Fire_Locations.csv",
    copyright: "WFIGS",
    definitionExpression: `${dateField} > DATE '${startTime}' AND ${dateField} < DATE '${endTime}'`,
    popupTemplate: firePopupTemplate
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
    
});