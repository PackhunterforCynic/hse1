import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import SEO from '../components/common/SEO';
import { motion, useScroll, useTransform } from 'framer-motion';

import Hero from '../components/internship/Hero';
import StudioCulture from '../components/internship/StudioCulture';
import Benefits from '../components/internship/Benefits';
import ProgramGrid from '../components/internship/ProgramGrid';
import AICareerAssistant from '../components/internship/AICareerAssistant';
import FAQ from '../components/internship/FAQ';
import ApplicationModal from '../components/internship/ApplicationModal';

export default function Internship() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  const handleApplyClick = (role = null) => {
    setSelectedRole(role);
    setModalOpen(true);
  };

  return (
    <div className="w-full min-h-screen bg-primary relative overflow-x-hidden">
      <SEO 
        title="Havilah | Apprenticeship" 
        description="Join the Havilah Studio apprenticeship program. Learn commercial photography, video production, and digital strategy hands-on."
        path="/internship"
      />

      {/* Parallax Background */}
      <motion.div 
        style={{ y: yBg }} 
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px] mix-blend-screen" />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col">
        <Hero onApply={() => handleApplyClick()} />
        <StudioCulture />
        <Benefits />
        <ProgramGrid onApply={handleApplyClick} />
        <AICareerAssistant />
        <FAQ />
      </div>

      <ApplicationModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        selectedRole={selectedRole}
      />
    </div>
  );
}
