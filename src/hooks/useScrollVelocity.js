import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useScrollVelocity = (elementsSelector, options = {}) => {
  const { maxSkew = 5, maxStretch = 1.1 } = options;

  useEffect(() => {
    const elements = gsap.utils.toArray(elementsSelector);
    if (!elements.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // We can use ScrollTrigger's velocity feature or Lenis's scroll event.
    // Assuming GSAP's scroll proxy or native scroll
    let proxy = { skew: 0, stretch: 1 };
    let skewSetter = gsap.quickSetter(elements, "skewY", "deg");
    let stretchSetter = gsap.quickSetter(elements, "scaleY");

    const clampSkew = gsap.utils.clamp(-maxSkew, maxSkew);
    const clampStretch = gsap.utils.clamp(1, maxStretch);

    ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        let velocity = self.getVelocity();
        // Scale down velocity for subtle effect
        let skew = clampSkew(velocity / -1000); 
        let stretch = clampStretch(1 + Math.abs(velocity / 10000));
        
        // If scrolling really fast, apply skew and stretch
        if (Math.abs(velocity) > 50) {
          proxy.skew = skew;
          proxy.stretch = stretch;
          skewSetter(proxy.skew);
          stretchSetter(proxy.stretch);
        }
      }
    });

    // Continuously ease back to normal using gsap ticker
    gsap.ticker.add(() => {
      // Smoothly interpolate back to 0 skew and 1 scale
      proxy.skew += (0 - proxy.skew) * 0.1;
      proxy.stretch += (1 - proxy.stretch) * 0.1;
      
      // Only apply if there's a meaningful change
      if (Math.abs(proxy.skew) > 0.01) skewSetter(proxy.skew);
      if (Math.abs(proxy.stretch - 1) > 0.001) stretchSetter(proxy.stretch);
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
      gsap.ticker.remove();
    };
  }, [elementsSelector, maxSkew, maxStretch]);
};
