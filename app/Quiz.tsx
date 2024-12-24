"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { GeoJSON } from "geojson";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import useLocalGuesses from "./useLocalGuesses";
import routes from "./muni_simple_routes.json";
import worm from "./worm.svg";
import routesHashmap from "./routesHashmap";

const NUMBER_OF_GUESSES = 5;

export default function Quiz() {
  const mapId = useId();
  const map = useRef<L.Map>(null);
  const { guesses, addGuess } = useLocalGuesses();

  const [answer, setAnswer] = useState<string>();
  const gameOver = Boolean(
    // Ran out of guesses
    guesses.length === NUMBER_OF_GUESSES ||
      // Solved the quiz
      (answer && guesses.includes(answer))
  );

  useEffect(() => {
    if (!map.current) {
      // Initialize map
      map.current = L.map(mapId, {
        attributionControl: false,
        dragging: false,
        keyboard: false,
        zoomControl: false,
        scrollWheelZoom: false,
        touchZoom: false,
        boxZoom: false,
        doubleClickZoom: false,
      });

      // Fit bounds
      map.current.fitBounds(L.geoJSON(routes as GeoJSON).getBounds());

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
          L.geoJSON(feature, {
            style: { color: "#bf2b45" },
            interactive: false,
          }).addTo(map.current)
      );
    }
  }, []);

  useEffect(() => {
    // Add guesses to map
    guesses.forEach((guess) => {
      const features = routesHashmap[guess];
      features.forEach(
        (feature) =>
          map.current &&
          L.geoJSON(feature, {
            style: { color: "#005695" },
            interactive: false,
          })
            .addTo(map.current)
            .bringToBack()
      );
    });
  }, [guesses]);

  return (
    <main className={clsx(["w-dvw", "h-dvh", "flex", "flex-col"])}>
      {/* Menu Bar */}
      <h1
        className={clsx([
          "flex",
          "justify-center",
          "max-h-10",
          "p-2",
          "items-center",
          "font-bold",
          "gap-1",
          "bg-gray-200",
          "dark:bg-gray-800",
        ])}
      >
        <Image priority alt="Muni" src={worm} width={60} />
        ROUTLE
      </h1>
      {/* Map */}
      <div className={clsx(["w-full", "flex-grow"])} id={mapId} />
      {/* Guesses */}
      <div className={clsx(["flex", "flex-col", "gap-1", "p-2"])}>
        {new Array(NUMBER_OF_GUESSES).fill(0).map((value, index) => {
          const guess = guesses.at(index);
          return (
            <div key={index} className={clsx(["min-h-8"])}>
              <div
                className={clsx([
                  "bg-gray-200",
                  "dark:bg-gray-800",
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
      {/* Buttons */}
      <div className={clsx(["flex", "gap-2", "overflow-scroll", "pb-2"])}>
        {Object.keys(routesHashmap).map((name) => {
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
                  ? [
                      "border-gray-300",
                      "text-gray-300",
                      "dark:border-gray-600",
                      "dark:text-gray-600",
                    ]
                  : [
                      "border-gray-700",
                      "text-gray-700",
                      "hover:bg-gray-100",
                      "hover:text-black",
                      "dark:border-gray-300",
                      "dark:text-gray-300",
                      "dark:hover:bg-gray-800",
                      "dark:hover:text-white",
                    ],
              ])}
              key={name}
              onClick={() => {
                addGuess(name);
                if (guesses.length + 1 === NUMBER_OF_GUESSES) {
                  alert(`Correct answer was ${answer}`);
                  return;
                }
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
