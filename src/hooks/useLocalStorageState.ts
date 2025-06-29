import { useState, useEffect } from 'react';

/**
 * Return the local storage value
 * @param key
 * @param defaultValue
 * @returns
 */
function getSavedValue<T>(key: string, defaultValue: T) {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error(`Error parsing localStorage key "${key}":`, error);
  }
  return defaultValue;
}

/**
 * 
 * @param key
 * @param defaultValue
 * @returns
 */
export function useLocalStorageState<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => getSavedValue(key, defaultValue));

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}