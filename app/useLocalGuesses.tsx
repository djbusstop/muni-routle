"use client";

import { useState } from "react";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isToday);

export const localDate = (date?: dayjs.ConfigType) =>
  dayjs(date).tz("America/Los_Angeles");

export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (newValue: T) => void] {
  const [value, setValue] = useState<T>(
    getLocalStorageValue(key, defaultValue)
  );
  return [
    value,
    (newValue: T) => {
      localStorage.setItem(key, JSON.stringify(newValue));
      setValue(newValue);
    },
  ];
}

function getLocalStorageValue<T>(key: string, defaultValue: T): T {
  const isBrowser = typeof window !== "undefined";
  const stringValue = isBrowser ? localStorage.getItem(key) : null;

  if (stringValue === null || stringValue.length == 0) {
    if (isBrowser) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
    }
    return defaultValue;
  }

  try {
    return JSON.parse(stringValue);
  } catch {
    return defaultValue;
  }
}

type LocalStorageGuesses = { created: number; guesses: string[] };

const GUESSES_KEY = "mr-guesses";

const useLocalGuesses = () => {
  const [localGuesses, setLocalGuesses] = useLocalStorage<LocalStorageGuesses>(
    GUESSES_KEY,
    {
      created: new Date().getTime(),
      guesses: [],
    }
  );

  // Only return guesses if guesses are from today
  const guesses = localDate(localGuesses.created).isToday()
    ? localGuesses.guesses
    : [];

  const addGuess = (guess: string) => {
    // If date is today, add guess to guesses
    if (localDate(localGuesses.created).isToday()) {
      setLocalGuesses({
        ...localGuesses,
        guesses: [...localGuesses.guesses, guess],
      });
      return;
    }
    // If not, wipe guesses and set new date
    setLocalGuesses({
      created: new Date().getTime(),
      guesses: [guess],
    });
  };

  return { guesses, addGuess };
};

export default useLocalGuesses;
