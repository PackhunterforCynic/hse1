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
import { LanguageProvider } from '../src/i18n';
import Preloader from '../src/components/Preloader';
import MainLayout from '../src/layouts/MainLayout';
import { initCacheEngine } from '../src/lib/cacheEngine';
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

    // Run Lenis synchronized with GSAP native requestAnimationFrame loop
    const updateLenis = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateLenis);
    
    // Restore sensible lag smoothing (adjusts smoothly if frame drops occur, maxing step at 33ms after a 500ms stutter)
    gsap.ticker.lagSmoothing(500, 33);
    
    return () => {
      resizeObserver.disconnect();
      clearTimeout(resizeTimer);
      gsap.ticker.remove(updateLenis);
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
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="alternate icon" href="/icon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="google-site-verification" content="nCCuFORTrwEqEaOxVVE49x0IJMf5ISz52eAXWYXEIiI" />
        <meta name="google-site-verification" content="ZCpkRcE0jbIKfvvhgdw8zNbSD-_fxY_K809gEl9U-E4" />
        
        <title>Havilah | Media & Growth</title>
        <meta name="description" content="Havilah Studio is a premier creative media agency specializing in cinematic ad video production, commercial photography, digital media strategy, brand films, and state-of-the-art visual storytelling." />
        <meta name="keywords" content="photography, digital media, ad video, commercial video production, brand storytelling, creative media agency, cinematic films, digital experiences, Havilah, growth branding, content creation, video advertising, commercial photography, brand films, studio media, visual production, corporate video, social media ads, film agency, portrait photography, editorial shoots, drone cinematography" />
        <meta name="author" content="Havilah Pro" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href="https://havilahpro.com/" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://havilahpro.com/" />
        <meta property="og:title" content="Havilah | Photography, Digital Media & Ad Video Production" />
        <meta property="og:description" content="We craft award-winning ad videos, commercial photography, and high-performance digital media that elevate brands and captivate audiences." />
        <meta property="og:image" content="/icon.svg" />
        <meta property="og:site_name" content="Havilah Studio" />
        <meta property="og:locale" content="en_US" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://havilahpro.com/" />
        <meta name="twitter:title" content="Havilah | Photography, Digital Media & Ad Video Production" />
        <meta name="twitter:description" content="Specializing in cinematic ad videos, commercial photography, and high-impact digital media strategy." />
        <meta name="twitter:image" content="/icon.svg" />
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Hanken+Grotesk:ital,wght@0,300..700;1,300..700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js" async></script>
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

  useEffect(() => {
    initCacheEngine();
  }, []);

  return (
    <HelmetProvider>
      <LanguageProvider>
        <PreloaderProvider>
          <CursorProvider>
            <AIProvider>
              <LenisSetup pathname={location.pathname} />
              <Preloader />
              {location.pathname.startsWith('/admin') ? (
                <Outlet />
              ) : (
                <MainLayout />
              )}
            </AIProvider>
          </CursorProvider>
        </PreloaderProvider>
      </LanguageProvider>
    </HelmetProvider>
  );
}
