import { useState, useEffect } from 'react';

export function useTouch() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detect if device supports touch
    const checkTouch = () => {
      return (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0 ||
        window.matchMedia('(pointer: coarse)').matches
      );
    };

    setIsTouch(checkTouch());

    // Optional: listen for media query changes if device is docked/undocked
    const mediaQuery = window.matchMedia('(pointer: coarse)');
    const handleChange = (e) => setIsTouch(e.matches || checkTouch());

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return isTouch;
}
