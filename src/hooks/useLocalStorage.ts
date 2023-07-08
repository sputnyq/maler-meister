import { useEffect, useState } from 'react';

export function useLocalStorage<T>(storageKey: string, fallbackState: any) {
  const initialValue = localStorage.getItem(storageKey) ? localStorage.getItem(storageKey) : fallbackState;
  const [value, setValue] = useState<T>(JSON.parse(initialValue));

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(value));
  }, [value, storageKey]);

  return [value, setValue];
}
