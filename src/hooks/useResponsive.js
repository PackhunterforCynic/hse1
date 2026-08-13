import { useViewport } from './useViewport';
import { useBreakpoint } from './useBreakpoint';
import { useOrientation } from './useOrientation';
import { useReducedMotion } from './useReducedMotion';
import { useTouch } from './useTouch';
import { usePerformanceProfile } from './usePerformanceProfile';

/**
 * A central composer hook that aggregates the state from focused responsive hooks.
 * This should be used when a component needs access to multiple responsive dimensions simultaneously.
 */
export function useResponsive() {
  const { width, height } = useViewport();
  const breakpoints = useBreakpoint();
  const { isLandscape, isPortrait } = useOrientation();
  const prefersReducedMotion = useReducedMotion();
  const isTouch = useTouch();
  const performanceProfile = usePerformanceProfile();

  // Combine motion preference with performance capability for animations
  // E.g., if a user prefers reduced motion OR their device is very slow, we shouldn't animate.
  const shouldAnimate = !prefersReducedMotion && performanceProfile !== 'low';

  return {
    // Viewport
    width,
    height,
    
    // Breakpoints
    ...breakpoints,
    
    // Orientation
    isLandscape,
    isPortrait,
    
    // Device Capabilities & Preferences
    isTouch,
    prefersReducedMotion,
    performanceProfile,
    shouldAnimate
  };
}
