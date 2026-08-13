import { useViewport } from './useViewport';

// Breakpoints mapped to Tailwind defaults + some custom semantics
const BREAKPOINTS = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export function useBreakpoint() {
  const { width } = useViewport();

  const breakpoints = {
    isXs: width >= BREAKPOINTS.xs && width < BREAKPOINTS.sm,
    isSm: width >= BREAKPOINTS.sm && width < BREAKPOINTS.md,
    isMd: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
    isLg: width >= BREAKPOINTS.lg && width < BREAKPOINTS.xl,
    isXl: width >= BREAKPOINTS.xl && width < BREAKPOINTS['2xl'],
    is2xl: width >= BREAKPOINTS['2xl'],
    
    // Convenience boolean helpers
    isMobile: width < BREAKPOINTS.md,
    isTablet: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
    isDesktop: width >= BREAKPOINTS.lg,
    
    // Current semantic breakpoint string (useful for debugging/logging)
    current: 'xs'
  };

  if (breakpoints.is2xl) breakpoints.current = '2xl';
  else if (breakpoints.isXl) breakpoints.current = 'xl';
  else if (breakpoints.isLg) breakpoints.current = 'lg';
  else if (breakpoints.isMd) breakpoints.current = 'md';
  else if (breakpoints.isSm) breakpoints.current = 'sm';

  return breakpoints;
}
