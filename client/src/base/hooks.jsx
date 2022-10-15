import { useCallback, useState, useEffect } from 'react';

export const useBoolean = (initial = false) => {
  const [state, setState] = useState(initial);

  const off = useCallback(() => setState(false), []);
  const on = useCallback(() => setState(true), []);
  return [
    state,
    {
      off,
      on,
    },
  ];
};

export const useToggle = (initial = false) => {
  const [state, setState] = useState(initial);

  const off = useCallback(() => setState(false), []);
  const on = useCallback(() => setState(true), []);
  const toggle = useCallback(() => setState((prev) => !prev), []);

  return [
    state,
    {
      off,
      on,
      toggle,
    },
  ];
};

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value]);
  return debouncedValue;
};
