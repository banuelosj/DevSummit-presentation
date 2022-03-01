// Create popup template for layer
const fireTemplate = {
  title: "{FIRE_NAME} Wildfire",
  content: formatContent,
  outFields: ["*"],
  fieldInfos: [
    {
      fieldName: "FIRE_NAME",
      label: "Incident Name",
    },
    {
      fieldName: "GIS_ACRES",
      label: "Acres Burned",
      format: {
        places: 0,
        digitSeparator: true,
      },
    },
    {
      fieldName: "CONT_DATE",
      label: "Contained Date",
    },
    {
      fieldName: "ALARM_DATE",
      label: "Start Date",
    },
    {
      fieldName: "CAUSE",
      label: "Fire Cause",
    },
  ],
};

// formats the popup template content
function formatContent(feature) {
  let fire_name = feature.graphic.attributes.FIRE_NAME;
  let start_date = new Date(feature.graphic.attributes.ALARM_DATE);
  let end_date = new Date(feature.graphic.attributes.CONT_DATE);
  return (
    fire_name +
    " burned <b>{GIS_ACRES}</b> acres of land from <span class='popupSpan'>" +
    start_date.toLocaleString() +
    "</span> until <span class='popupSpan'>" +
    end_date.toLocaleString() +
    "</span>."
  );
}