import "./App.css";
import { useState } from "react";
import ArcGISMap from "./ArcGISMap";
import { ArcgisEditor } from "@arcgis/map-components-react";

import {
  CalciteShell,
  CalciteAction,
  CalciteTooltip,
  CalcitePanel
} from "@esri/calcite-components-react";

const App = () => {
  const panelDescription = "City of Naperville Water District";
  // public editing dataset
  // const webmapId = "67d9c6bdcd894435be4f926e362ae24a";
  const webmapId = "c267debf3db54ffb926d9af707ba9b0b";

  const [showTrace, setShowTrace] = useState(false);
  const [showValidateTopology, setShowValidateTopology] = useState(false);

  return (
    <CalciteShell>
      <div className="grid-container">
        <CalcitePanel
          id="map-panel"
          className="grid-map"
          description={panelDescription}
        >
          <div slot="header-actions-end" className="header-action-div">
            <CalciteAction 
              id="validate-topology-action" 
              icon="check-square"
              onClick={() => {
                if (showTrace) {
                  setShowTrace(false);
                }
                setShowValidateTopology(!showValidateTopology);
              }}
            ></CalciteAction>
            <CalciteTooltip placement="bottom" referenceElement="validate-topology-action">Validate topology</CalciteTooltip>
            <CalciteAction 
              id="utility-network-trace-action" 
              icon="utility-network-trace"
              onClick={() => {
                if (showValidateTopology) {
                  setShowValidateTopology(false);
                }
                setShowTrace(!showTrace);
              }}
            ></CalciteAction>
            <CalciteTooltip placement="bottom" referenceElement="utility-network-trace-action">Run a trace</CalciteTooltip>
            <CalciteAction 
              id="version-management-action" 
              icon="code-branch"
              disabled
            >
            </CalciteAction>
            <CalciteTooltip placement="bottom" referenceElement="version-management-action">Manage Versions</CalciteTooltip>
          </div>
          <ArcGISMap 
            itemId={webmapId} 
            showValidateTopology={showValidateTopology} 
            showTrace={showTrace} 
          />
        </CalcitePanel>
        <CalcitePanel className="grid-panel" id="panel">
          <ArcgisEditor referenceElement="arcgis-map"></ArcgisEditor>
        </CalcitePanel>
      </div>
    </CalciteShell>
  )
};

export default App;