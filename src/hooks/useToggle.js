import React, { useCallback, useState } from 'react';

const useToggle = (initialState = false) => {
  const [isOpen, setState] = useState(initialState);

  // This function change the boolean value to it's opposite value
  const toggle = useCallback(() => setState((isToggle) => !isToggle), []);
  const open = useCallback(() => setState(true), []);
  const close = useCallback(() => setState(false), []);

  return { isOpen, toggle, open, close };
};
export default useToggle;
