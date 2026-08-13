import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/layout/Footer';
import PageTransition from '../components/common/PageTransition';

// Defer non-critical UI components to unblock LCP rendering
const Cursor = lazy(() => import('../components/Cursor'));
const FilmEffects = lazy(() => import('../components/layout/FilmEffects'));
const FloatingSocials = lazy(() => import('../components/layout/FloatingSocials'));
const AIAssistant = lazy(() => import('../components/AIAssistant'));

export default function MainLayout() {
  return (
    <>
      <Suspense fallback={null}>
        <Cursor />
        <FilmEffects />
      </Suspense>
      
      <Navbar />
      
      <Suspense fallback={null}>
        <FloatingSocials />
        <AIAssistant />
      </Suspense>
      
      <main className="w-full min-h-screen">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      
      <Footer />
    </>
  );
}
