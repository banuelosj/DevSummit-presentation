timeInfo: {
  startField: "observation_time"  // the field that determines the time extent of the layer
}

// initialize the TimeSlider widget
const timeSlider = new TimeSlider({
  container: "timeSlider",
  view: view,
  timeVisible: true, // show the time stamps on the timeslider
  fullTimeExtent: {
    start: new Date("2022-02-18T14:30:00Z"),
    end: new Date("2022-02-19T00:35:00Z")
  }
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