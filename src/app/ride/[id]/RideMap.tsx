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

    // Create map - now interactive!
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      bounds: bounds,
      fitBoundsOptions: {
        padding: 50,
      },
      // Enable all interactions
      interactive: true,
      scrollZoom: true,
      boxZoom: true,
      dragRotate: true,
      dragPan: true,
      keyboard: true,
      doubleClickZoom: true,
      touchZoomRotate: true,
    });

    // Add navigation controls (zoom in/out buttons + compass)
    map.current.addControl(
      new mapboxgl.NavigationControl({
        showCompass: true,
        showZoom: true,
        visualizePitch: true,
      }),
      "top-right"
    );

    // Add fullscreen control
    map.current.addControl(
      new mapboxgl.FullscreenControl(),
      "top-right"
    );

    // Add scale control
    map.current.addControl(
      new mapboxgl.ScaleControl({
        maxWidth: 100,
        unit: "metric",
      }),
      "bottom-left"
    );

    // Add geolocate control (show user's location)
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: false,
        showUserHeading: false,
      }),
      "top-right"
    );

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

        // Add route outline (darker, thicker line behind)
        map.current.addLayer({
          id: "route-outline",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#3B5998",
            "line-width": 6,
          },
        });

        // Add main route line
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

      // Add start marker with popup
      const startMarkerEl = document.createElement("div");
      startMarkerEl.className = "start-marker";
      startMarkerEl.style.cursor = "pointer";
      startMarkerEl.innerHTML = `
        <div style="
          width: 28px;
          height: 28px;
          background-color: #22C55E;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          </svg>
        </div>
      `;

      const startPopup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
      }).setHTML(`
        <div style="padding: 8px; font-family: system-ui, sans-serif;">
          <p style="font-weight: 600; color: #1A2B4A; margin: 0 0 4px 0;">Meeting Point</p>
          <p style="color: #6B7A90; font-size: 12px; margin: 0;">Start location</p>
        </div>
      `);

      new mapboxgl.Marker({ element: startMarkerEl })
        .setLngLat([startLng, startLat])
        .setPopup(startPopup)
        .addTo(map.current);

      // Add café marker with popup if exists
      if (hasCafe && cafeLat && cafeLng) {
        const cafeMarkerEl = document.createElement("div");
        cafeMarkerEl.className = "cafe-marker";
        cafeMarkerEl.style.cursor = "pointer";
        cafeMarkerEl.innerHTML = `
          <div style="
            width: 32px;
            height: 32px;
            background-color: #FF8A5B;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
          ">☕</div>
        `;

        const cafePopup = new mapboxgl.Popup({
          offset: 25,
          closeButton: false,
        }).setHTML(`
          <div style="padding: 8px; font-family: system-ui, sans-serif;">
            <p style="font-weight: 600; color: #1A2B4A; margin: 0 0 4px 0;">Café Stop</p>
            <p style="color: #6B7A90; font-size: 12px; margin: 0;">Coffee break ☕</p>
          </div>
        `);

        new mapboxgl.Marker({ element: cafeMarkerEl })
          .setLngLat([cafeLng, cafeLat])
          .setPopup(cafePopup)
          .addTo(map.current);
      }

      // Add end marker if route has coordinates
      if (coordinates.length > 0) {
        const endCoord = coordinates[coordinates.length - 1];
        
        const endMarkerEl = document.createElement("div");
        endMarkerEl.className = "end-marker";
        endMarkerEl.style.cursor = "pointer";
        endMarkerEl.innerHTML = `
          <div style="
            width: 28px;
            height: 28px;
            background-color: #EF4444;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/>
            </svg>
          </div>
        `;

        const endPopup = new mapboxgl.Popup({
          offset: 25,
          closeButton: false,
        }).setHTML(`
          <div style="padding: 8px; font-family: system-ui, sans-serif;">
            <p style="font-weight: 600; color: #1A2B4A; margin: 0 0 4px 0;">Finish</p>
            <p style="color: #6B7A90; font-size: 12px; margin: 0;">End of route</p>
          </div>
        `);

        new mapboxgl.Marker({ element: endMarkerEl })
          .setLngLat([endCoord.longitude, endCoord.latitude])
          .setPopup(endPopup)
          .addTo(map.current);
      }
    });

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [coordinates, startLat, startLng, cafeLat, cafeLng, hasCafe]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Fit route button */}
      <button
        onClick={() => {
          if (!map.current) return;

          let bounds: mapboxgl.LngLatBounds;

          if (coordinates.length > 0) {
            bounds = new mapboxgl.LngLatBounds();
            coordinates.forEach((coord) => {
              bounds.extend([coord.longitude, coord.latitude]);
            });
          } else {
            bounds = new mapboxgl.LngLatBounds(
              [startLng - 0.02, startLat - 0.02],
              [startLng + 0.02, startLat + 0.02]
            );
          }

          map.current.fitBounds(bounds, {
            padding: 50,
            duration: 1000,
          });
        }}
        className="absolute bottom-4 right-4 bg-white px-3 py-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium text-[#1A2B4A] z-10"
        title="Reset view to fit route"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
        Fit Route
      </button>
    </div>
  );
}