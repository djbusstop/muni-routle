"use client";

import { useEffect, useId, useRef, useState } from "react";
import clsx from "clsx";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import seedrandom from "seedrandom";
import { GeoJSON } from "geojson";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import routesList, { routesHashmap } from "./routesList";
import useLocalGuesses from "./useLocalGuesses";
import routes from "./muni_simple_routes.json";

dayjs.extend(utc);
dayjs.extend(timezone);

// Seed for random number comes from date string
const dateString = dayjs().tz("America/Los_Angeles").format("YYYY-MM-DD");
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
      const rng = seedrandom(dateString);
      const random = Math.floor(rng() * routesList.length);
      const { route, features } = routesList[random];
      setAnswer(route);

      // Add answer route to map
      features.forEach(
        (feature) =>
          map.current &&
          L.geoJSON(feature, {
            style: { color: "#005695" },
            interactive: false,
          }).addTo(map.current)
      );

      // Add saved guesses to map
      guesses
        .filter((guess) => guess !== answer)
        .forEach((guess) => {
          const features = routesHashmap[guess];
          features.forEach(
            (feature) =>
              map.current &&
              L.geoJSON(feature, {
                style: { color: "#bf2b45" },
                interactive: false,
              })
                .addTo(map.current)
                .bringToBack()
          );
        });
    }
  }, []);

  return (
    <>
      {/* Map */}
      <div className={clsx(["w-full", "flex-grow"])} id={mapId} />
      {/* Guesses */}
      <div className={clsx(["w-full", "flex", "justify-center", "px-6"])}>
        <div
          className={clsx([
            "flex",
            "justify-between",
            "gap-2",
            "w-full",
            "max-w-xs",
          ])}
        >
          {new Array(NUMBER_OF_GUESSES).fill(0).map((value, index) => {
            const guess = guesses.at(index);
            const isWrong = answer && guess && guess !== answer;
            const isRight = answer && guess && guess === answer;
            return (
              <div
                className={clsx([
                  "rounded",
                  "min-h-9",
                  "min-w-9",
                  "flex",
                  "items-center",
                  "text-lg",
                  "justify-center",
                  "font-bold",
                  !guess && ["bg-gray-300", "dark:bg-gray-800"],
                  isWrong && [
                    "bg-red-100",
                    "dark:bg-red-900",
                    "text-red-900",
                    "dark:text-red-100",
                  ],
                  isRight && [
                    "bg-green-200",
                    "dark:bg-green-900",
                    "text-green-900",
                    "dark:text-green-100",
                  ],
                ])}
                key={index}
              >
                {guess}
              </div>
            );
          })}
        </div>
      </div>
      {/* Options */}
      <div
        className={clsx([
          "mt-2",
          "flex",
          "flex-col",
          "overflow-scroll",
          "max-h-[180px]",
          "border-t",
          "border-gray-700",
          "dark:border-gray-300",
        ])}
      >
        {routesList.map(({ route, name }) => {
          const disabled = guesses.includes(route) || gameOver;
          return (
            <button
              disabled={disabled}
              className={clsx([
                "font-semibold",
                "bg-transparent",
                "py-2",
                "px-4",
                "border-b",
                "last:border-b-0",
                "border-gray-400",
                "dark:border-gray-500",
                disabled
                  ? ["text-gray-400", "dark:text-gray-500"]
                  : [
                      "text-gray-700",
                      "active:bg-gray-100",
                      "active:text-black",
                      "dark:text-gray-300",
                      "dark:active:bg-gray-900",
                      "dark:active:text-white",
                    ],
              ])}
              key={route}
              onClick={() => {
                addGuess(route);
                // Draw on map
                const features = routesHashmap[route];
                features.forEach(
                  (feature) =>
                    map.current &&
                    L.geoJSON(feature, {
                      style: { color: "#bf2b45" },
                      interactive: false,
                    })
                      .addTo(map.current)
                      .bringToBack()
                );

                // If final guess is wrong
                if (
                  route !== answer &&
                  guesses.length + 1 === NUMBER_OF_GUESSES
                ) {
                  const answerName =
                    answer &&
                    routesHashmap[answer].at(0)?.properties?.route_title;
                  alert(
                    `You ran out of guesses. The correct answer is ${answer} ${answerName}.`
                  );
                  return;
                }

                if (route === answer) {
                  alert(`Correct! The answer is ${answer} ${name}.`);
                  return;
                }
              }}
            >
              {route} {name}
            </button>
          );
        })}
      </div>
    </>
  );
}
