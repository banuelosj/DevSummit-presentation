  // Add query to zoom to relevant extent
  const targetFireQuery = fireLayer.createQuery();
  targetFireQuery.where = "FIRE_NAME = 'HENNESSEY'";
  targetFireQuery.returnGeometry = true;
  fireLayer.queryFeatures(targetFireQuery).then((results) => {
    // Go to the specific extent
    view.goTo(results.features[0].geometry);
  });

  // Set the layer to be ordered
  const order =
    fireLayer.orderBy[0].order === "ascending" ? "descending" : "ascending";

  fireLayer.orderBy = [
    {
      field: "YEAR_",
      order,
    },
  ];

  // toggles UI icon and description for the sortOrder button
  if (order === "ascending") {
    sortOrder.text = descText;
    sortOrder.icon = `sort-descending-arrow`;
  } else {
    sortOrder.text = ascText;
    sortOrder.icon = `sort-ascending-arrow`;
  }