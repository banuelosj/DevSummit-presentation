import { useEffect, useState } from "react";
import { 
  ArcgisMap, 
  ArcgisUtilityNetworkValidateTopology, 
  ArcgisUtilityNetworkTrace, 
  ArcgisVersionManagement,
} from "@arcgis/map-components-react";
import esriConfig from "@arcgis/core/config";

const ArcGISMap = ({ showValidateTopology, showTrace }) => {
  esriConfig.portalUrl = "https://myHostName.esri.com/portal"; // replace with valid portal url
  const webmapId = "30674c721c3e407ba68ec2993d016d09"; // replace with webmap id

  const [utilityNetwork, setUtilityNetwork] = useState(null);
  const [currentGDBVersion, setCurrentGDBVersion] = useState("");

  useEffect(() => {
    // Need to hard-code GDB version since UtilityNetworkTrace component 
    // does not yet recognize UtilityNetwork.gdbVersion switch.
    setCurrentGDBVersion("owner.version_name") // replace with valid geodatabase version for this data
  }, [])

  async function loadUtilityNetwork(view) {
    if (view.map.utilityNetworks?.length > 0) {
      let utilityNetworkFromMap = view.map.utilityNetworks.getItemAt(0);
      await utilityNetworkFromMap.load();

      if (utilityNetworkFromMap.loadStatus === "loaded") {
        // Need to set the gdb version manually here because at 4.29
        // VersionManagement component does not fire an event to switch versions
        // so we cannot listen for that event and switch the gdb version with state.
        // 4.30 will have this event so we can assign GDB_VERSION to state variable.
        utilityNetworkFromMap.gdbVersion = currentGDBVersion;
        setUtilityNetwork(utilityNetworkFromMap);
      }
    } else {
      console.log("No utility networks found in this map!");
    }
  }

  async function configureEditor(view) {
    const editor = document.querySelector("arcgis-editor");

    const featureSnappingSource = [];
    await view.map.loadAll();

    // loop through the editable layers on the map
    view.map.editableLayers.items.forEach((layer) => {
      // if the layer.type is subtype-group or group loop through the
      // sublayers to set them as feature snapping sources
      if(layer.type === "subtype-group" || layer.type === "group") {
        layer.sublayers.items.forEach((sublayer) => {
          featureSnappingSource.push({ layer: sublayer, enabled: true })
        });
      } else {
        featureSnappingSource.push({ layer: layer, enabled: true });
      }
    });

    // set snapping to be on be default, turn off geometry guides
    // all layers will be enabled for snapping on load
    editor.snappingOptions = {
      enabled: true,
      selfEnabled: false,
      featureSources: featureSnappingSource
    }

    // turn on tooltips so the editing constraints can be turned on
    // with the TAB shortcut key while actively drawing
    editor.tooltipOptions = { enabled: true }
  }

  return(
    <ArcgisMap
      itemId={webmapId}
      onArcgisViewReadyChange={async ({ target }) => {
        const view = target.view;
        view.ui.move(["zoom"], "bottom-right");
        configureEditor(view);
        loadUtilityNetwork(view);
      }}
    >
      <ArcgisVersionManagement position="top-left"></ArcgisVersionManagement>
      { showTrace ? 
        <ArcgisUtilityNetworkTrace 
          position="top-right" 
          utilityNetwork={utilityNetwork}
          gdbVersion={currentGDBVersion}
        ></ArcgisUtilityNetworkTrace> : null 
      }
      { 
        showValidateTopology ? 
        <ArcgisUtilityNetworkValidateTopology 
          position="top-right" 
          utilityNetwork={utilityNetwork}
        >
        </ArcgisUtilityNetworkValidateTopology> : null 
      }
    </ArcgisMap>
  );
};

export default ArcGISMap;