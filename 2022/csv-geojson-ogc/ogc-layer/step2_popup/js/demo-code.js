// create a PopupTemplate and configure an aracade expression
const droughtPopupTemplate = {
  title: "Drought Outlook (Feb - May 2022)",
  content: `The seasonal drought outlook demonstrates <b>{expression/drought-outlook-category}</b> in this region of the United States. <br>Date submitted: <span class="popupSpan">{idp_filedate}</span>`,
  expressionInfos: [
    {
      // arcade expression to display the feature category
      name: "drought-outlook-category",
      expression: "When($feature.fid_persis == 1, 'drought persistence is likely', $feature.fid_dev == 1, 'potential drought development is likely', $feature.fid_improv == 1, 'drought improvement is favored', $feature.fid_remove == 1, 'drought removal is favored', 'n/a')"
    }
  ]
};