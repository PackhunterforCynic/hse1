import { useRef } from 'react';
import { Link } from 'react-router';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useCursor } from '../../context/CursorContext';

export default function GsapButton({ 
  to, 
  href, 
  onClick, 
  children, 
  variant = 'primary', 
  className = '', 
  strength = 45 
}) {
  const buttonRef = useRef(null);
  const glowRef = useRef(null);
  const textRef = useRef(null);
  const { updateCursor, resetCursor } = useCursor();

  useGSAP(() => {
    const el = buttonRef.current;
    const glow = glowRef.current;
    const text = textRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.8, ease: "elastic.out(1, 0.4)" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.8, ease: "elastic.out(1, 0.4)" });
    
    // Glow position trackers
    const glowXTo = glow ? gsap.quickTo(glow, "x", { duration: 0.5, ease: "power2.out" }) : null;
    const glowYTo = glow ? gsap.quickTo(glow, "y", { duration: 0.5, ease: "power2.out" }) : null;

    let bounds = { width: 0, height: 0, left: 0, top: 0 };

    const handleMouseEnter = (e) => {
      bounds = el.getBoundingClientRect();
      const relX = e.clientX - bounds.left;
      const relY = e.clientY - bounds.top;

      if (glow) {
        gsap.set(glow, { x: relX - 64, y: relY - 64, scale: 0.2, opacity: 0 });
        gsap.to(glow, { scale: 3, opacity: 1, duration: 0.6, ease: "power3.out" });
      }

      if (text) {
        gsap.to(text, { scale: 1.04, y: -1, duration: 0.3, ease: "power2.out" });
      }

      updateCursor({ active: true, text: 'GO', blend: true });
    };

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const relX = clientX - bounds.left;
      const relY = clientY - bounds.top;
      
      const offsetX = clientX - (bounds.left + bounds.width / 2);
      const offsetY = clientY - (bounds.top + bounds.height / 2);

      xTo(offsetX * (strength / 100));
      yTo(offsetY * (strength / 100));

      if (glowXTo && glowYTo) {
        glowXTo(relX - 64);
        glowYTo(relY - 64);
      }
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);

      if (glow) {
        gsap.to(glow, { scale: 0, opacity: 0, duration: 0.5, ease: "power2.in" });
      }
      if (text) {
        gsap.to(text, { scale: 1, y: 0, duration: 0.4, ease: "power2.out" });
      }
      resetCursor();
    };

    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, { scope: buttonRef, dependencies: [strength] });

  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';
  const isText = variant === 'text';

  const baseClasses = `relative inline-flex items-center justify-center overflow-hidden font-mono text-xs uppercase tracking-[0.25em] transition-all duration-300 rounded-full cursor-none group min-h-[44px] min-w-[44px] ${className}`;
  
  const variantClasses = {
    primary: 'px-8 py-4 bg-[#CFA65B] text-[#0C1220] font-semibold shadow-[0_4px_20px_rgba(207,166,91,0.3)] md:hover:shadow-[0_8px_30px_rgba(207,166,91,0.5)] border border-[#CFA65B]',
    outline: 'px-8 py-4 bg-transparent text-white/90 border border-white/20 md:hover:border-[#CFA65B] md:hover:text-white',
    text: 'px-4 py-2 text-white/80 md:hover:text-[#CFA65B] border-b border-transparent md:hover:border-[#CFA65B]'
  }[variant] || '';

  const innerContent = (
    <>
      {/* Liquid spotlight hover glow */}
      {!isText && (
        <span 
          ref={glowRef} 
          className={`absolute pointer-events-none w-32 h-32 rounded-full blur-md -z-10 opacity-0 ${
            isPrimary ? 'bg-white/40' : 'bg-[#CFA65B]/30'
          }`} 
        />
      )}
      <span ref={textRef} className="relative z-10 inline-flex items-center gap-2 transform-gpu">
        {children}
      </span>
    </>
  );

  if (to) {
    return (
      <Link ref={buttonRef} to={to} className={`${baseClasses} ${variantClasses}`}>
        {innerContent}
      </Link>
    );
  }

  if (href) {
    return (
      <a ref={buttonRef} href={href} target="_blank" rel="noopener noreferrer" className={`${baseClasses} ${variantClasses}`}>
        {innerContent}
      </a>
    );
  }

  return (
    <button ref={buttonRef} onClick={onClick} type="button" className={`${baseClasses} ${variantClasses}`}>
      {innerContent}
    </button>
  );
}
