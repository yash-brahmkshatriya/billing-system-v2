import { useCallback, useState } from 'react';

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
