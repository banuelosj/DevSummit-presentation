view.ui.add("infoDiv", "top-right");

// dropdown
const filterSelect = document.getElementById("filter");

view.whenLayerView(droughtWFSLayer)
  .then((layerView) => {
    filterSelect.addEventListener("input", (event) => {
      // adding a SQL where clause filter using the option value prop from index.html
      // Ex: <option value="fid_dev=1">Drought Could Develop</option>
      layerView.featureEffect = new FeatureEffect({
        filter: {
          where: event.target.value
        },
        // add a drop shadow to highlight features the satisfy the filter query
        includedEffect: "drop-shadow(-10px, 10px, 6px gray)",
        // features that don't satisfy the filter query will have their opacity updated
        excludedEffect: "opacity(30%)"
      });
    });
});

