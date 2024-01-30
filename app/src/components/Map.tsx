import { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import { PMTiles, Protocol } from "pmtiles";
import { LayerSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import styles from "../styles/Home.module.css";
import maptiler3dGl from "../assets/maptiler-3d-gl-style.json";
import hexbins from "../assets/hexbins.json";

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

    map.on("load", function () {
      map.resize();

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
