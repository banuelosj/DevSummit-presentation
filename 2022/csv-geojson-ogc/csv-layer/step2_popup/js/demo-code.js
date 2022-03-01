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