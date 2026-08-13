import { useState, useEffect, useRef } from 'react';

export function useContainerSize(ref) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const observerRef = useRef(null);

  useEffect(() => {
    if (!ref || !ref.current || typeof window === 'undefined') return;

    if (!observerRef.current) {
      observerRef.current = new ResizeObserver((entries) => {
        if (!Array.isArray(entries) || !entries.length) return;
        
        const entry = entries[0];
        
        // Use borderBoxSize if available for better accuracy, fallback to contentRect
        let newWidth = entry.contentRect.width;
        let newHeight = entry.contentRect.height;

        if (entry.borderBoxSize && entry.borderBoxSize.length > 0) {
          newWidth = entry.borderBoxSize[0].inlineSize;
          newHeight = entry.borderBoxSize[0].blockSize;
        }

        setSize({
          width: Math.round(newWidth),
          height: Math.round(newHeight),
        });
      });
    }

    observerRef.current.observe(ref.current);

    return () => {
      if (observerRef.current && ref.current) {
        observerRef.current.unobserve(ref.current);
      }
    };
  }, [ref]);

  return size;
}
