import Graphic from "@arcgis/core/Graphic";

export function createGraphicsFromPercentage(lightCoverageValue) {
  const notCoveredValue = 100 - lightCoverageValue;
  return [
    new Graphic({
      attributes: {
        FID: 1,
        light_coverage_percentage: lightCoverageValue,
        light_coverage_description: "Light coverage",
      },
      geometry: {
        type: "point",
        x: -9757785.26198818,
        y: 5120250.3701223647,
        spatialReference: { wkid: 102100 }
      }
    }),
    new Graphic({
      attributes: {
        FID: 2,
        light_coverage_percentage: notCoveredValue,
        light_coverage_description: "No coverage",
      },
      geometry: {
        type: "point",
        x: -9759030.6666025445,
        y: 5143985.3321441785,
        spatialReference: { wkid: 102100 }
      }
    })
  ];
}