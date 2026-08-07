import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export const useMagnetic = (options = { strength: 50 }) => {
  const ref = useRef(null);

  useGSAP(() => {
    const element = ref.current;
    if (!element) return;

    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const xTo = gsap.quickTo(element, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
    const yTo = gsap.quickTo(element, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

    let bounds = { width: 0, height: 0, left: 0, top: 0 };

    const handleMouseEnter = () => {
      bounds = element.getBoundingClientRect();
    };

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const x = clientX - (bounds.left + bounds.width / 2);
      const y = clientY - (bounds.top + bounds.height / 2);
      
      xTo(x * (options.strength / 100));
      yTo(y * (options.strength / 100));
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, { scope: ref, dependencies: [options.strength] });

  return ref;
};
