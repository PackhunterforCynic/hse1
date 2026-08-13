import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/layout/Footer';
import PageTransition from '../components/common/PageTransition';

import Cursor from '../components/Cursor';
import FilmEffects from '../components/layout/FilmEffects';
import FloatingSocials from '../components/layout/FloatingSocials';
import AIAssistant from '../components/AIAssistant';

export default function MainLayout() {
  return (
    <>
      <Cursor />
      <FilmEffects />
      
      <Navbar />
      
      <FloatingSocials />
      <AIAssistant />
      
      <main className="w-full min-h-screen">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      
      <Footer />
    </>
  );
}
