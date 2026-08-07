import { useRef, memo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const GsapScrollReveal = memo(function GsapScrollReveal({
  children,
  mode = 'fade', // 'fade', 'text', 'image', 'card', 'scrub'
  direction = 'up', // 'up', 'down', 'left', 'right', 'fromLeft', 'fromRight', 'fromDown'
  delay = 0,
  duration = 1.1,
  stagger = 0.05,
  className = '',
  once = true,
  tiltStrength = 15,
  as: Component = 'div',
  ...rest
}) {
  const containerRef = useRef(null);

  useGSAP(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Mode 1: Text Word Stagger Reveal (GPU Optimized)
    if (mode === 'text') {
      const textNodes = el.querySelectorAll('.gsap-word');
      if (textNodes.length > 0) {
        gsap.fromTo(textNodes, 
          { y: '110%', rotateZ: 3, opacity: 0 },
          {
            y: '0%',
            rotateZ: 0,
            opacity: 1,
            duration,
            stagger,
            ease: 'power4.out',
            delay,
            force3D: true,
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: once ? 'play none none none' : 'play reverse play reverse'
            }
          }
        );
      }
      return;
    }

    // Mode 2: Image Curtain Wipe + Zoom Out (Single Timeline to reduce ScrollTrigger count)
    if (mode === 'image') {
      const img = el.querySelector('img, video, .gsap-media');
      const tl = gsap.timeline({
        delay,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: once ? 'play none none none' : 'play reverse play reverse'
        }
      });

      tl.fromTo(el,
        { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)' },
        {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          duration: duration * 1.1,
          ease: 'power4.out'
        },
        0
      );

      if (img) {
        tl.fromTo(img,
          { scale: 1.25 },
          {
            scale: 1.0,
            duration: duration * 1.4,
            ease: 'power3.out',
            force3D: true
          },
          0
        );
      }
      return;
    }

    // Mode 3: Interactive 3D Card Tilt on Hover (Layout thrashing eliminated)
    if (mode === 'card') {
      let startX = 0;
      let startY = 0;
      if (direction === 'up' || direction === 'fromDown') startY = 75;
      if (direction === 'down' || direction === 'fromUp') startY = -75;
      if (direction === 'left' || direction === 'fromLeft') startX = -90;
      if (direction === 'right' || direction === 'fromRight') startX = 90;
      if (startX === 0 && startY === 0) startY = 50; // default up

      // Entry scroll reveal with spatial choreography
      gsap.fromTo(el,
        { opacity: 0, x: startX, y: startY },
        {
          opacity: 1, x: 0, y: 0, duration: 1.1, ease: 'power3.out', delay,
          force3D: true,
          scrollTrigger: { trigger: el, start: 'top 88%' }
        }
      );

      // Cache bounds on mouseenter to prevent layout thrashing inside mousemove
      let cachedBounds = null;
      const handleMouseEnter = () => {
        cachedBounds = el.getBoundingClientRect();
      };

      const handleMouseMove = (e) => {
        if (!cachedBounds) cachedBounds = el.getBoundingClientRect();
        const centerX = cachedBounds.left + cachedBounds.width / 2;
        const centerY = cachedBounds.top + cachedBounds.height / 2;
        const percentX = (e.clientX - centerX) / (cachedBounds.width / 2);
        const percentY = (e.clientY - centerY) / (cachedBounds.height / 2);

        gsap.to(el, {
          rotateX: -percentY * tiltStrength,
          rotateY: percentX * tiltStrength,
          transformPerspective: 1000,
          scale: 1.02,
          duration: 0.4,
          ease: 'power2.out',
          force3D: true,
          overwrite: 'auto'
        });
      };

      const handleMouseLeave = () => {
        cachedBounds = null;
        gsap.to(el, {
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          duration: 0.7,
          ease: 'elastic.out(1, 0.5)',
          force3D: true,
          overwrite: 'auto'
        });
      };

      el.addEventListener('mouseenter', handleMouseEnter, { passive: true });
      el.addEventListener('mousemove', handleMouseMove, { passive: true });
      el.addEventListener('mouseleave', handleMouseLeave, { passive: true });

      return () => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mousemove', handleMouseMove);
        el.removeEventListener('mouseleave', handleMouseLeave);
      };
    }

    // Mode 4: Standard Fade & Slide
    let x = 0;
    let y = 0;
    if (direction === 'up' || direction === 'fromDown') y = 60;
    if (direction === 'down' || direction === 'fromUp') y = -60;
    if (direction === 'left' || direction === 'fromLeft') x = -80;
    if (direction === 'right' || direction === 'fromRight') x = 80;

    gsap.fromTo(el,
      { opacity: 0, x, y },
      {
        opacity: 1, x: 0, y: 0,
        duration, ease: 'power3.out', delay,
        force3D: true,
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: once ? 'play none none none' : 'play reverse play reverse'
        }
      }
    );
  }, { scope: containerRef, dependencies: [mode, direction, delay] });

  // Render helper for Text words mode
  if (mode === 'text' && typeof children === 'string') {
    return (
      <Component ref={containerRef} className={`${className} inline-flex flex-wrap`} {...rest}>
        {children.split(' ').map((word, i) => (
          <span key={i} className="inline-block overflow-hidden pb-1 mr-[0.25em]">
            <span className="gsap-word inline-block origin-top-left transform-gpu">
              {word}
            </span>
          </span>
        ))}
      </Component>
    );
  }

  return (
    <Component ref={containerRef} className={`transform-gpu ${className}`} {...rest}>
      {children}
    </Component>
  );
});

export default GsapScrollReveal;
