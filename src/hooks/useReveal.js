import { useEffect, useRef } from 'react';
import { animateTextReveal, animateMaskReveal, splitText } from '../lib/animations/reveal';

export const useTextReveal = (options = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const elements = splitText(ref.current, options.splitType || 'words');
    
    const animation = animateTextReveal(elements, {
      ...options,
      scrollTrigger: options.scrollTrigger ? {
        trigger: ref.current,
        start: 'top 85%',
        ...options.scrollTrigger
      } : null
    });

    return () => {
      animation.kill();
    };
  }, []);

  return ref;
};

export const useMaskReveal = (options = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    
    const animation = animateMaskReveal(ref.current, {
      ...options,
      scrollTrigger: options.scrollTrigger ? {
        trigger: ref.current,
        start: 'top 85%',
        ...options.scrollTrigger
      } : null
    });

    return () => {
      animation.kill();
    };
  }, []);

  return ref;
};
