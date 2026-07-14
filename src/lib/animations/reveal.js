import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Splits text into words/lines based on a separator and wraps them in overflow-hidden spans.
 * This simulates the SplitText premium plugin.
 */
export const splitText = (element, type = 'words') => {
  if (!element) return [];
  const text = element.innerText;
  element.innerHTML = '';
  
  let splitArr;
  if (type === 'chars') splitArr = text.split('');
  else if (type === 'words') splitArr = text.split(' ');
  else splitArr = text.split('\n');

  const wrappers = splitArr.map((part) => {
    // Add space after words, except for chars
    const content = (type === 'words' ? part + '\u00A0' : part);
    const outer = document.createElement('span');
    outer.style.display = 'inline-block';
    outer.style.overflow = 'hidden';
    outer.style.verticalAlign = 'top';
    
    const inner = document.createElement('span');
    inner.style.display = 'inline-block';
    inner.innerHTML = content;
    
    outer.appendChild(inner);
    element.appendChild(outer);
    return inner;
  });

  return wrappers;
};

/**
 * Cinematic text reveal (bottom up)
 */
export const animateTextReveal = (elements, options = {}) => {
  const { 
    delay = 0, 
    duration = 1.2, 
    stagger = 0.05, 
    ease = 'power4.out',
    scrollTrigger = null
  } = options;

  return gsap.fromTo(elements, 
    { y: '110%', rotation: 2, transformOrigin: 'top left' },
    {
      y: '0%',
      rotation: 0,
      duration,
      stagger,
      ease,
      delay,
      scrollTrigger
    }
  );
};

/**
 * Mask wipe reveal for images/containers
 */
export const animateMaskReveal = (element, options = {}) => {
  const {
    direction = 'up', // up, down, left, right, center
    duration = 1.5,
    ease = 'power4.out',
    delay = 0,
    scrollTrigger = null
  } = options;

  let clipPathStart = '';
  let clipPathEnd = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'; // full reveal

  switch (direction) {
    case 'up': clipPathStart = 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)'; break;
    case 'down': clipPathStart = 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)'; break;
    case 'left': clipPathStart = 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)'; break;
    case 'right': clipPathStart = 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)'; break;
    case 'center': clipPathStart = 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)'; break;
  }

  return gsap.fromTo(element,
    { clipPath: clipPathStart },
    {
      clipPath: clipPathEnd,
      duration,
      ease,
      delay,
      scrollTrigger
    }
  );
};
