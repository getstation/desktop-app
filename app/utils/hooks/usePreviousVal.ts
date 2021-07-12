import { useRef, useEffect } from 'react';

/**
 * Return previous value before affecting the new one with react effect
 */
function usePrevious<T>(value: T, defaultValue: T) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef<T>();

  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return (ref.hasOwnProperty('current') && ref.current !== undefined) ? ref.current : defaultValue;
}

export { usePrevious };
