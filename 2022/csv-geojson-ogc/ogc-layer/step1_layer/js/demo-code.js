// initialize a WFSLayer
const droughtWFSLayer = new WFSLayer({
  url: "https://idpgis.ncep.noaa.gov/arcgis/services/NWS_Climate_Outlooks/cpc_drought_outlk/MapServer/WFSServer",
  name: "Seasonal_Drought_Outlook",
  title: "US Seasonal Drought Outlook (Feb - May 2022)",
  copyright: "NOAA/NWS/NCEP/Climate Prediction Center"
});

// initialize the Legend widget
const legend = new Legend({
  view: view
});

// add the Legend to the view
view.ui.add(legend, "top-right");