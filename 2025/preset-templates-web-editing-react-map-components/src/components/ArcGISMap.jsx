import { useState, useEffect } from "react";
import CoveragePieChart from "./CoveragePieChart";

import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-expand";
import "@arcgis/map-components/components/arcgis-placement";

import { createGraphicsFromPercentage } from '../functions/create-graphics';
import { getDifferenceGeometry, getFeaturesUnion, getAreaPercentageLeft } from "../functions/light-coverage-operations";
import { setVersionOnAllLayers } from "../functions/set-layer-version";

const ArcGISMap = ({ isChartVisible }) => {
  const [graphics, setGraphics] = useState([]);

  const PARKING_LOT_LAYER_TITLE = "PS Parking Lots";
  const LIGHT_COVERAGE_LAYER = "LightingCoverage";
  const webmapId = "7ea2caab7cac4cd29f61b3035bd216dd";
  const _GLOBAL_VERSION = "admin.Palm_Springs_Parking_Union";
  let view;

  useEffect(() => {
    if(isChartVisible) {
      const mapComponent = document.querySelector("arcgis-map");
      const loadMap = async () => {
        await mapComponent.componentOnReady();
        view = mapComponent.view;
        const graphicsForChart = await queryAndAnalyzeCoverage(view.map.layers, PARKING_LOT_LAYER_TITLE, LIGHT_COVERAGE_LAYER);
        if(graphics.length > 0) {
          setGraphics(graphicsForChart.map(graphic => {
            return { ...graphics, attributes: graphic.attributes}
          }));
        } else {
          setGraphics(graphicsForChart)
        }
      };
      loadMap();
    }
  }, [isChartVisible]);

  async function loadLayers(view) {
    await view.map.loadAll();
    const layers = view.map.layers;

    setVersionOnAllLayers(layers, _GLOBAL_VERSION);
    configureSnapping(layers);
    const graphicsForChart = await queryAndAnalyzeCoverage(view.map.layers, PARKING_LOT_LAYER_TITLE, LIGHT_COVERAGE_LAYER);
    setGraphics(graphicsForChart);
  }

  async function queryAndAnalyzeCoverage(layers) {
    const parkingLotLayer = layers.find(layer => layer.title === PARKING_LOT_LAYER_TITLE);
    const lightCoverageLayer = layers.find(layer => layer.title === LIGHT_COVERAGE_LAYER);
    const lightCoveragePercentage = await performCoverageAnalysis(parkingLotLayer, lightCoverageLayer);
    return createGraphicsFromPercentage(lightCoveragePercentage);
  }

  async function performCoverageAnalysis(layerToIntersect, intersectingLayer) {
    return await getCoveragePercentage(layerToIntersect, intersectingLayer);
  }

  async function getCoveragePercentage(layer, intersectingLayer) {
    // Query current extent for the features
    const layerQuery = layer.createQuery();
    layerQuery.geometry = view.extent;
    layerQuery.returnGeometry = true;

    const intersectingLayerQuery = intersectingLayer.createQuery();
    intersectingLayerQuery.geometry = view.extent;
    intersectingLayerQuery.returnGeometry = true;

    const layerQueryResult = await layer.queryFeatures(layerQuery);
    const layerGeometry = layerQueryResult.features[0].geometry;

    const intersectingLayerQueryResult = await intersectingLayer.queryFeatures(intersectingLayerQuery);
    const intersectingLayerFeatures = intersectingLayerQueryResult.features;

    if(intersectingLayerFeatures.length > 1) {
      const intersectingLayerFeatureGeometries = intersectingLayerFeatures.map((feature) => {
        return feature.geometry;
      });

      const intersectingLayerFeaturesUnion = getFeaturesUnion(intersectingLayerFeatureGeometries);
      const differenceGeometry = getDifferenceGeometry(layerGeometry, intersectingLayerFeaturesUnion);
      const percentageOfCoverage = getAreaPercentageLeft(layerGeometry, differenceGeometry);
      return percentageOfCoverage;
    } else {
      const differenceGeometry = getDifferenceGeometry(layerGeometry, intersectingLayerFeatures[0].geometry);
      const percentageOfCoverage = getAreaPercentageLeft(layerGeometry, differenceGeometry);
      return percentageOfCoverage;
    }
  }

  function configureSnapping(layers) {
    const editor = document.querySelector("arcgis-editor");
    const featureSnappingSources = [];

    layers.forEach((layer) => {
      featureSnappingSources.push({ layer, enabled: true });
    });

    editor.snappingOptions = {
      enabled: true,
      selfEnabled: false,
      featureSources: featureSnappingSources
    }
  }

  return (
    <arcgis-map
      itemId={webmapId}
      onarcgisViewReadyChange={async ({ target }) => {
        view = target.view;
        loadLayers(view);
      }}
    >
      <arcgis-zoom position="top-left"></arcgis-zoom>
      <arcgis-expand 
        position="bottom-right" 
        mode="floating"
        expanded={isChartVisible}
      >
        <arcgis-placement>
          { graphics.length > 0 ?
            <div>
              <p style={{padding: 0, marginBlock: 0}}>{graphics[0].attributes["light_coverage_percentage"]}</p>
              <CoveragePieChart features={graphics}></CoveragePieChart> 
            </div> : null
            
          }
        </arcgis-placement>
      </arcgis-expand>
    </arcgis-map>
  );
};

export default ArcGISMap;