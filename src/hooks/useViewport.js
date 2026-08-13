import { useState, useEffect } from 'react';

export function useViewport() {
  const [viewport, setViewport] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1280,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let resizeTimer;
    
    // Priority 1: ResizeObserver on document.documentElement for highly accurate layout size
    const observer = new ResizeObserver((entries) => {
      if (entries.length > 0) {
        // Debounce slightly to prevent thrashing
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          setViewport({
            width: window.innerWidth,
            height: window.innerHeight,
          });
        }, 150);
      }
    });

    observer.observe(document.documentElement);

    // Fallback/Supplemental: window resize event
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setViewport({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, 150);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  return viewport;
}
