import { useRef, useState, useEffect, RefObject } from 'react';

type ListenableElement = Pick<HTMLElement, 'addEventListener' | 'removeEventListener'>;
type HoverProps<T> = { ref: RefObject<T> };

/*
* Because there are issues with React syntetic events `onMouseEnter` and `onMouseLeave`,
* we decided to re-implement `useHover` using vanilla dom events.
*/
export const useDOMHover = <T extends ListenableElement = HTMLDivElement>(): [boolean, HoverProps<T>] => {
  const ref = useRef<T>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const handleMouseEnter = () => setHovered(true);
    const handleMouseLeave = () => setHovered(false);

    const el = ref.current;

    el && el.addEventListener('mouseenter', handleMouseEnter);
    el && el.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      el && el.removeEventListener('mouseenter', handleMouseEnter);
      el && el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return [hovered, { ref }];
};
