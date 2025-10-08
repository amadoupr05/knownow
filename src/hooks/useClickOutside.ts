import { useEffect, RefObject } from 'react';

export const useClickOutside = (ref: RefObject<HTMLElement>, handler: () => void) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (ref.current && !ref.current.contains(target)) {
        handler();
      }
    };

    document.addEventListener('mousedown', handleClickOutside, true);
    document.addEventListener('touchstart', handleClickOutside, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('touchstart', handleClickOutside, true);
    };
  }, [ref, handler]);
};