import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";
import { HelmetProvider } from 'react-helmet-async';
import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import { AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

import { PreloaderProvider } from '../src/context/PreloaderContext';
import { CursorProvider } from '../src/context/CursorContext';
import { AIProvider } from '../src/context/AIProvider';
import Preloader from '../src/components/Preloader';
import MainLayout from '../src/layouts/MainLayout';
import '../src/App.css';
import '../src/index.css';

function LenisSetup({ pathname }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
      autoResize: false, // Disable default resize observer to prevent layout thrashing
    });

    let resizeTimer;
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        requestAnimationFrame(() => {
          lenis.resize();
        });
      }, 150);
    });
    
    resizeObserver.observe(document.documentElement);

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Run Lenis strictly on GSAP's ticker for ultra-smooth 60fps
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    // Disable GSAP lag smoothing to prevent jank when frames drop
    gsap.ticker.lagSmoothing(0);
    
    return () => {
      resizeObserver.disconnect();
      clearTimeout(resizeTimer);
      gsap.ticker.remove(lenis.raf);
      lenis.destroy();
    };
  }, []);

  // Reset scroll on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" type="image/png" href="/src/assets/icon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="google-site-verification" content="nCCuFORTrwEqEaOxVVE49x0IJMf5ISz52eAXWYXEIiI" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Hanken+Grotesk:ital,wght@0,300..700;1,300..700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <HelmetProvider>
      <PreloaderProvider>
        <CursorProvider>
          <AIProvider>
            <LenisSetup pathname={location.pathname} />
            <Preloader />
            <MainLayout>
              <AnimatePresence mode="wait">
                <Outlet key={location.pathname} />
              </AnimatePresence>
            </MainLayout>
          </AIProvider>
        </CursorProvider>
      </PreloaderProvider>
    </HelmetProvider>
  );
}
