import "./App.css";
import { useState } from "react";
import ArcGISMap from "./ArcGISMap";
import "@arcgis/map-components/components/arcgis-editor";

import {
  CalciteAction,
  CalcitePanel,
  CalciteShell,
  CalciteTooltip
} from "@esri/calcite-components-react";

const App = () => {
  const [isChartVisible, setIsChartVisible] = useState(false);

  return (
    <CalciteShell>
      <div className="grid-container">
        <CalcitePanel
          id="map-panel"
          className="grid-map"
          description="City of Palm Springs"
        >
          <div slot="header-actions-end" className="header-action-div">
            <CalciteAction 
              id="coverage-chart-action" 
              icon="pie-chart"
              onClick={() => {
                setIsChartVisible(!isChartVisible);
              }}
            ></CalciteAction>
            <CalciteTooltip placement="bottom" referenceElement="coverage-chart-action">Coverage Percentage Chart</CalciteTooltip>
          </div>
          <ArcGISMap 
            isChartVisible={isChartVisible}
          />
        </CalcitePanel>
        <CalcitePanel className="grid-panel" id="panel">
          <arcgis-editor 
            referenceElement="arcgis-map"
            id="editor"
          ></arcgis-editor>
        </CalcitePanel>
      </div>
    </CalciteShell>
  )
};

export default App;