import * as areaOperator from "@arcgis/core/geometry/operators/areaOperator.js"
import * as differenceOperator from "@arcgis/core/geometry/operators/differenceOperator.js"
import * as unionOperator from "@arcgis/core/geometry/operators/unionOperator.js"

export function getFeaturesUnion(geometries) {
  return unionOperator.executeMany(geometries);
}

export function getDifferenceGeometry(geometry, subtractor) {
  return differenceOperator.execute(geometry, subtractor);
} 

export function getArea(geometry, unit) {
  return areaOperator.execute(geometry, { unit });
}

export function getAreaPercentageLeft(initialGeometry, differenceGeom) {
  if (differenceGeom === null) {
    // complete coverage
    return 100;
  }
  const initialGeoemtryArea = getArea(initialGeometry, "square-meters");
  const differenceGeomArea = getArea(differenceGeom, "square-meters");

  let percentageCovered = (differenceGeomArea / initialGeoemtryArea) * 100;
  percentageCovered = 100 - percentageCovered.toFixed(1);
  return percentageCovered;
}