import { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import { PMTiles, Protocol } from "pmtiles";
import { LayerSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import styles from "../styles/Home.module.css";
import maptiler3dGl from "../assets/maptiler-3d-gl-style.json";
import hexbins from "../assets/hexbins.json";

const reversedCoords = [
  [-111.71806250174325, 36.81016863071161],
  [-109.14252854363387, 36.0170846646508],
  [-108.77406431229974, 33.85213017118887],
  [-110.85300767351492, 32.49429833728578],
  [-113.32908943921504, 33.25422633612703],
  [-113.8236571977957, 35.40342703312881],
  [-111.71806250174325, 36.81016863071161],
].reverse();

function MaplibreMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const mapFile = new PMTiles("/epd-map/us.pmtiles");

  useEffect(() => {
    let protocol = new Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile);
    protocol.add(mapFile);

    const map = new maplibregl.Map({
      container: mapContainerRef.current!,
      center: [-95.712891, 39.09024],
      pitch: 40,
      zoom: 4,
      maxBounds: [
        [-178, 10],
        [-50, 80],
      ],
      minZoom: 4,
      maxZoom: 17,
      maplibreLogo: true,
      logoPosition: "bottom-left",
      style: {
        version: 8,
        sources: {
          openmaptiles: {
            type: "vector",
            tiles: ["pmtiles://" + mapFile.source.getKey() + "/{z}/{x}/{y}"],
            minzoom: 4,
            maxzoom: 14,
          },
        },
        layers: maptiler3dGl.layers as LayerSpecification[],
        glyphs: "/epd-map/{fontstack}/{range}.pbf",
      },
    });
    mapRef.current = map;

    map.addControl(
      new maplibregl.AttributionControl({
        compact: true,
        customAttribution: `<a href="https://protomaps.com">Protomaps</a> | <a href="https://openmaptiles.org">© OpenMapTiles</a> | <a href="http://www.openstreetmap.org/copyright"> © OpenStreetMap contributors</a>`,
      }),
      "bottom-left"
    );
    map.addControl(new maplibregl.NavigationControl({}), "bottom-right");

    console.log(hexbins);
    map.on("load", function () {
      map.resize();

      map.addSource("national-park", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "Polygon",
                coordinates: [
                  [
                    [-121.353637, 40.584978],
                    [-121.284551, 40.584758],
                    [-121.275349, 40.541646],
                    [-121.246768, 40.541017],
                    [-121.251343, 40.423383],
                    [-121.32687, 40.423768],
                    [-121.360619, 40.43479],
                    [-121.363694, 40.409124],
                    [-121.439713, 40.409197],
                    [-121.439711, 40.423791],
                    [-121.572133, 40.423548],
                    [-121.577415, 40.550766],
                    [-121.539486, 40.558107],
                    [-121.520284, 40.572459],
                    [-121.487219, 40.550822],
                    [-121.446951, 40.56319],
                    [-121.370644, 40.563267],
                    [-121.353637, 40.584978],
                  ],
                ],
              },
            },
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [-121.415061, 40.506229],
              },
            },
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [-121.505184, 40.488084],
              },
            },
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [-121.354465, 40.488737],
              },
            },
          ],
        },
      });

      map.addLayer({
        id: "park-boundary",
        type: "fill",
        source: "national-park",
        paint: {
          "fill-color": "#888888",
          "fill-opacity": 0.4,
        },
        filter: ["==", "$type", "Polygon"],
      });

      map.addSource("hexes", {
        type: "geojson",
        data: hexbins,
      });

      map.addLayer({
        id: "boundary",
        type: "fill-extrusion",
        source: "hexes",
        paint: {
          // See the MapLibre Style Specification for details on data expressions.
          // https://maplibre.org/maplibre-style-spec/expressions/

          // Get the fill-extrusion-color from the source 'color' property.
          "fill-extrusion-color": ["get", "color"],

          // Get fill-extrusion-height from the source 'height' property.
          "fill-extrusion-height": ["*", ["get", "height"], 100],

          // Get fill-extrusion-base from the source 'base_height' property.
          "fill-extrusion-base": ["get", "base_height"],

          // Make extrusions slightly opaque for see through indoor walls.
          "fill-extrusion-opacity": 0.8,
        },
      });
    });

    return () => {
      map.remove();
    };
  }, [hexbins]);

  return (
    <>
      <div ref={mapContainerRef} className={styles.mapContainer}>
        <div ref={mapContainerRef}></div>
      </div>
    </>
  );
}

export default MaplibreMap;
