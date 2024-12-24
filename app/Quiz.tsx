"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
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
import worm from "./worm.svg";

dayjs.extend(utc);
dayjs.extend(timezone);

// Seeded random number generator using date as seed
const rng = seedrandom(dayjs().tz("America/Los_Angeles").format("YYYY-MM-DD"));

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
      const random = Math.floor(rng() * routesList.length);
      const { route, features } = routesList[random];
      setAnswer(route);

      // Add answer route to map
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
    guesses
      .filter((guess) => guess !== answer)
      .forEach((guess) => {
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
      <div
        className={clsx(["w-full", "flex", "gap-2", "justify-between", "px-6"])}
      >
        {new Array(NUMBER_OF_GUESSES).fill(0).map((value, index) => {
          const guess = guesses.at(index);
          return (
            <div
              className={clsx([
                "rounded",
                "bg-gray-300",
                "dark:bg-gray-800",
                "min-h-8",
                "min-w-8",
                "flex",
                "items-center",
                "justify-center",
              ])}
              key={index}
            >
              {guess && <>{guess === answer ? "✅" : "❌"}</>}
            </div>
          );
        })}
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
                "border-gray-500",
                disabled
                  ? ["text-gray-300", "dark:text-gray-600"]
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
                if (guesses.length + 1 === NUMBER_OF_GUESSES) {
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
              {route} {name}{" "}
              {guesses.includes(route) && <>{route === answer ? "✅" : "❌"}</>}
            </button>
          );
        })}
      </div>
    </main>
  );
}
