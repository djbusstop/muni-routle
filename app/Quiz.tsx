"use client";

import { useEffect, useId, useRef, useState } from "react";
import clsx from "clsx";
import L from "leaflet";
import { Feature } from "geojson";

import routes from "./muni_simple_routes.json";
import "leaflet/dist/leaflet.css";

const NUMBER_OF_GUESSES = 5;

export default function Quiz() {
  const mapId = useId();
  const map = useRef<L.Map>(null);

  const [answer, setAnswer] = useState<string>();
  const [guesses, setGuesses] = useState<string[]>([]);
  const gameOver = Boolean(
    // Ran out of guesses
    guesses.length === NUMBER_OF_GUESSES ||
      // Solved the quiz
      (answer && guesses.includes(answer))
  );

  const routesHashmap = routes.features.reduce(
    (acc: Record<string, Feature[]>, feature) => {
      const routeName = feature.properties.route_name;
      if (routeName in acc) {
        return {
          ...acc,
          [routeName]: [...acc[routeName], feature as Feature],
        };
      } else {
        return {
          ...acc,
          [routeName]: [feature as Feature],
        };
      }
    },
    {}
  );

  useEffect(() => {
    if (!map.current) {
      // Initialize map
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

      // Pick a random route as the answer
      const random = Math.floor(
        Math.random() * Object.keys(routesHashmap).length
      );
      const [name, features] = Object.entries(routesHashmap)[random];
      setAnswer(name);

      // Add random route to map
      features.forEach(
        (feature) =>
          map.current &&
          L.geoJSON(feature, { style: { color: "#bf2b45" } }).addTo(map.current)
      );
    }
  }, []);

  return (
    <main className={clsx(["w-dvw", "h-dvh", "flex", "flex-col"])}>
      <h1 className={clsx("text-center")}>ROUTLE</h1>
      <div className={clsx(["w-full", "flex-grow"])} id={mapId} />
      <div className={clsx(["flex", "flex-col", "gap-1", "p-2"])}>
        {new Array(NUMBER_OF_GUESSES).fill(0).map((value, index) => {
          const guess = guesses.at(index);
          console.log(guess);
          return (
            <div key={index} className={clsx(["min-h-8"])}>
              <div
                className={clsx([
                  "bg-gray-800",
                  "min-h-4",
                  "px-2",
                  "h-full",
                  "w-full",
                  "rounded",
                  "flex",
                  "items-center",
                  "justify-between",
                  "font-bold",
                ])}
              >
                {guess && (
                  <>
                    <span>{guess}</span>
                    <span>{guess === answer ? "✅" : "❌"}</span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className={clsx(["flex", "gap-2", "overflow-scroll"])}>
        {Object.entries(routesHashmap).map(([name, features]) => {
          const disabled = guesses.includes(name) || gameOver;
          return (
            <button
              disabled={disabled}
              className={clsx([
                "font-semibold",
                "bg-transparent",
                "py-2",
                "px-4",
                "rounded",
                "border",
                disabled
                  ? ["border-gray-600", "text-gray-600"]
                  : [
                      "hover:bg-gray-800",
                      "text-gray-300",
                      "hover:text-white",
                      "border-gray-300",
                    ],
              ])}
              key={name}
              onClick={() => {
                setGuesses([...guesses, name]);

                if (name === answer) {
                  alert("wow correct");
                  return;
                }

                if (guesses.length === NUMBER_OF_GUESSES - 1) {
                  alert(`Correct answer was ${answer}`);
                  return;
                }

                // Add guess to map
                features.forEach(
                  (feature) =>
                    map.current &&
                    L.geoJSON(feature, { style: { color: "#005695" } })
                      .addTo(map.current)
                      .bringToBack()
                );
              }}
            >
              {name}
            </button>
          );
        })}
      </div>
    </main>
  );
}
