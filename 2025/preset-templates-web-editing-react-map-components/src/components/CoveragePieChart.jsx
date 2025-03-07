import { useEffect, useRef } from "react";
import "./CoveragePieChart.css";

import {
  CalciteBlock
} from "@esri/calcite-components-react";

import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { PieChartModel } from "@arcgis/charts-model";

const CoveragePieChart = ({ features }) => {
  const pieChartRef = useRef(null);

  useEffect(() => {
    const layer = createClientSideFeatureLayer(features);
    setupModel(layer);
  }, [features]);

  async function setupModel(layer) {
    const model = new PieChartModel();
    await model.setup({ layer });

    // data props
    await model.setCategory("light_coverage_description");
    await model.setNumericFields(["light_coverage_percentage"]);

    // general props
    model.setTitleText("Light Coverage");
    // model.setDescriptionText("Percentage of parking lot covered by light");
    // model.setLegendTitleText("Legend");
    model.setInnerRadiusSize(40);

    const config = model.getConfig();

    pieChartRef.current.layer = layer;
    pieChartRef.current.model = config;
    pieChartRef.current.refresh();
  }

  function createClientSideFeatureLayer(graphics) {
    const featureLayer = new FeatureLayer({
      source: graphics,
      objectIdField: "FID",
      fields: [
        {
          name: "FID",
          type: "oid"
        }, 
        {
          type: "double",
          name: "light_coverage_percentage"
        },
        {
          type: "string",
          name: "light_coverage_description"
        }
      ],
      renderer: {
        type: "simple",
        symbol: {
          type: "simple-marker",
          color: "#7A003C",
          size: 14
        }
      }
    });

    return featureLayer;
  }

  return (
    <CalciteBlock open>
      <arcgis-chart ref={pieChartRef} id="pie-chart"></arcgis-chart>
    </CalciteBlock>
  );
};


export default CoveragePieChart;