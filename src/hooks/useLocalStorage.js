import { useCallback, useEffect, useState } from "react";

export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try { const saved = localStorage.getItem(key); return saved ? JSON.parse(saved) : initialValue; } catch { return initialValue; }
  });
  useEffect(() => { localStorage.setItem(key, JSON.stringify(value)); }, [key, value]);
  const remove = useCallback(() => { localStorage.removeItem(key); setValue(initialValue); }, [initialValue, key]);
  return [value, setValue, remove];
};
