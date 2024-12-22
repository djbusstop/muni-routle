"use client";
import { useEffect, useId, useRef } from "react";
import routes from "./muni_simple_routes.json";
import L, { Map } from "leaflet";
import "leaflet/dist/leaflet.css";
import clsx from "clsx";

export default function Home() {
  const map = useRef<Map>(null);
  const mapId = useId();

  useEffect(() => {
    map.current = L.map(mapId, {
      zoomSnap: 0.1,
      zoom: 11.6,
      center: { lat: 37.7573, lng: -122.443985 },
      attributionControl: false,
      dragging: false,
      keyboard: false,
      zoomControl: false,
      scrollWheelZoom: false,
      touchZoom: false,
      boxZoom: false,
      doubleClickZoom: false,
    });
    const routesHashmap = routes.features.reduce(
      (acc: Record<string, unknown[]>, feature) => {
        const routeName = feature.properties.route_name;
        if (routeName in acc) {
          return {
            ...acc,
            [routeName]: [...acc[routeName], feature],
          };
        } else {
          return {
            ...acc,
            [routeName]: [feature],
          };
        }
      },
      {}
    );
    console.log(routesHashmap);
  }, []);

  return (
    <main className={clsx(["w-dvw", "h-dvh", "flex", "flex-col"])}>
      <h1>Muni lines quiz</h1>
      <div className={clsx(["w-full", "flex-grow", "bg-black"])} id={mapId} />
      <h2>Pick</h2>
    </main>
  );
}
