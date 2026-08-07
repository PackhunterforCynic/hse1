import gsap from 'gsap';

/**
 * Cinematic page transitions
 */
export const pageTransition = {
  in: (container, onComplete) => {
    const tl = gsap.timeline({ onComplete });
    tl.set(container, { autoAlpha: 1 });
    
    // Example: Mask wipe down to reveal the page
    tl.fromTo(container,
      { clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)' },
      { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', duration: 1, ease: 'power3.inOut' }
    );
    return tl;
  },
  
  out: (container, onComplete) => {
    const tl = gsap.timeline({ onComplete });
    // Example: Mask wipe up to hide the page
    tl.to(container, {
      clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
      duration: 1,
      ease: 'power3.inOut'
    });
    return tl;
  }
};
