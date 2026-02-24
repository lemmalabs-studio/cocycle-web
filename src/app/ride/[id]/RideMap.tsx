"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface RideMapProps {
  coordinates: Coordinate[];
  startLat: number;
  startLng: number;
  cafeLat?: number;
  cafeLng?: number;
  hasCafe: boolean;
}

export default function RideMap({
  coordinates,
  startLat,
  startLng,
  cafeLat,
  cafeLng,
  hasCafe,
}: RideMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize Mapbox
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

    // Calculate bounds from coordinates
    let bounds: mapboxgl.LngLatBounds;

    if (coordinates.length > 0) {
      bounds = new mapboxgl.LngLatBounds();
      coordinates.forEach((coord) => {
        bounds.extend([coord.longitude, coord.latitude]);
      });
    } else {
      // Fallback to start point
      bounds = new mapboxgl.LngLatBounds(
        [startLng - 0.02, startLat - 0.02],
        [startLng + 0.02, startLat + 0.02]
      );
    }

    // Create map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      bounds: bounds,
      fitBoundsOptions: {
        padding: 50,
      },
      interactive: false, // Disable interactions for preview
    });

    map.current.on("load", () => {
      if (!map.current) return;

      // Add route line if coordinates exist
      if (coordinates.length > 0) {
        map.current.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: coordinates.map((c) => [c.longitude, c.latitude]),
            },
          },
        });

        map.current.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#5B7FFF",
            "line-width": 4,
          },
        });
      }

      // Add start marker
      const startMarkerEl = document.createElement("div");
      startMarkerEl.className = "start-marker";
      startMarkerEl.innerHTML = `
        <div style="
          width: 24px;
          height: 24px;
          background-color: #22C55E;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        "></div>
      `;

      new mapboxgl.Marker({ element: startMarkerEl })
        .setLngLat([startLng, startLat])
        .addTo(map.current);

      // Add café marker if exists
      if (hasCafe && cafeLat && cafeLng) {
        const cafeMarkerEl = document.createElement("div");
        cafeMarkerEl.className = "cafe-marker";
        cafeMarkerEl.innerHTML = `
          <div style="
            width: 28px;
            height: 28px;
            background-color: #FF8A5B;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
          ">☕</div>
        `;

        new mapboxgl.Marker({ element: cafeMarkerEl })
          .setLngLat([cafeLng, cafeLat])
          .addTo(map.current);
      }
    });

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [coordinates, startLat, startLng, cafeLat, cafeLng, hasCafe]);

  return (
    <div ref={mapContainer} className="w-full h-full" />
  );
}