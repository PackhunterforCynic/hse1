import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Creates a smooth parallax effect for images inside a container
 */
export const animateParallax = (container, image, options = {}) => {
  const { speed = 1.2, scale = 1.1 } = options;
  
  gsap.set(image, { scale });
  
  return gsap.to(image, {
    yPercent: (speed - 1) * 100,
    ease: 'none',
    scrollTrigger: {
      trigger: container,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    }
  });
};
