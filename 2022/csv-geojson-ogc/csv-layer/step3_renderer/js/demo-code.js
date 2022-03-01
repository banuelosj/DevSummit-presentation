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
        title: "Wind Speed (kts)"  // override legend title for this layer
      }
    }
  ]
});

// create a fire data SimpleRenderer with size visual variables
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
        title: "Daily Acres burned (acres)"  // override legend title for this layer
      }
    }
  ]
});