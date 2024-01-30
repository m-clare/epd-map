import * as d3 from "d3";
import { hexbin } from "d3-hexbin";
import materials from "./data/materialsMapped.json";
import fs from "fs";

const width = 975;
const height = 610;
const scaleValue = 1300;
const radius = 6;

const projection = d3
  .geoAlbersUsa()
  .scale(scaleValue)
  .translate([width * 0.5, height * 0.5]);

const customHexbin = hexbin()
  .extent([
    [0, 0],
    [width, height],
  ])
  .radius(radius);

let hexBins = [];
if (Array.isArray(materials)) {
  const projectedData = materials
    .map((d) => projection([d.longitude, d.latitude]))
    .filter((d) => d !== null);
  hexBins = customHexbin(projectedData);
}

function svgPathToCoordinates(pathData) {
  const coordinates = [];
  const pathCommands =
    pathData.match(
      /[a-df-z]?\s*-?\d+(\.\d+)?(?:[eE][+-]?\d+)?,?\s*-?\d+(\.\d+)?(?:[eE][+-]?\d+)?/g
    ) || [];

  let currentX = 0;
  let currentY = 0;

  let startingPoint = [];
  pathCommands.forEach((command) => {
    console.log(command);
    const cmd = command[0];
    const values = command
      .slice(1)
      .split(/[,\s]+/)
      .map(parseFloat);

    switch (cmd) {
      case "m":
        currentX = values[0];
        currentY = values[1];
        coordinates.push([currentX, currentY]);
        startingPoint = [currentX, currentY];
        break;
      case "l":
        currentX = currentX + values[0];
        currentY = currentY + values[1];
        coordinates.push([currentX, currentY]);
        break;
      // Handle other path commands as needed
    }
  });

  coordinates.push(startingPoint);

  return coordinates;
}

const baseHex = svgPathToCoordinates(customHexbin.hexagon(radius));

const hexFeatures = hexBins.map((hex, i) => {
  const newCoordinates = baseHex.map((point) => [
    point[0] + hex.x,
    point[1] + hex.y,
  ]);
  const latLong = newCoordinates.map((point) => projection.invert(point));
  return {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [latLong],
    },
    properties: {
      count: hex.length,
      height: hex.length,
      base_height: 0,
      color: "green",
    },
    id: `h_${i}`,
  };
});

const output = { type: "FeatureCollection", features: hexFeatures };

try {
  fs.writeFileSync("../app/src/assets/hexbins.json", JSON.stringify(output));
} catch (err) {
  console.log(err);
}
