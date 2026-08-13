import { Helmet } from 'react-helmet-async';
import SEO from '../components/common/SEO';
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useCursor } from '../context/CursorContext';
import TeamModal from '../components/about/TeamModal';
import PremiumLogo3D from '../components/about/PremiumLogo3D';
import { useLanguage } from '../i18n';
import GsapButton from '../components/common/GsapButton';
import GsapScrollReveal from '../components/common/GsapScrollReveal';
import { GradientShimmer } from '@/components/ui/gradient-shimmer';

// Import images for Vite production build
import praiseImg from '../assets/praise.png';
import robinsonImg from '../assets/robinson.png';
import reshmaImg from '../assets/reshma.jpeg';
import vineethImg from '../assets/vineeth.png';


const teamData = [
  {
    id: 1,
    name: 'Praise',
    role: 'Creative Director',
    shortDesc: 'Visionary behind Havilah’s cinematic language.',
    fullBio: 'Praise has spent over a decade shaping the visual narratives of independent films and luxury brands. His approach blends rigorous strategic thinking with an uncompromising aesthetic vision.',
    image: praiseImg,
    skills: ['Cinematography', 'Art Direction', 'Brand Strategy'],
    socials: [{ platform: 'LinkedIn', url: '#' }, { platform: 'Instagram', url: '#' }]
  },
  {
    id: 2,
    name: 'Vineeth',
    role: 'Lead Cinematographer',
    shortDesc: 'Technical expert and problem solver.',
    fullBio: 'Vineeth anchors the technical execution of our most ambitious projects, bridging the gap between grand ideas and flawless delivery.',
    image: vineethImg,
    skills: ['Technical Execution'],
    socials: [{ platform: 'LinkedIn', url: '#' }]
  },

  {
    id: 3,
    name: 'Reshma',
    role: 'Team Member',
    shortDesc: 'Dedicated creative professional.',
    fullBio: 'Reshma brings a unique perspective and deep dedication to the creative process at Havilah.',
    image: reshmaImg,
    skills: ['Creative Strategy'],
    socials: [{ platform: 'LinkedIn', url: '#' }]
  },
  {
    id: 4,
    name: 'Robinson J',
    role: 'Team Member',
    shortDesc: 'Master of light, shadow, and motion.',
    fullBio: 'With a background in architecture and fine art photography, Robinson brings a uniquely structured yet emotional eye to every frame he captures for Havilah.',
    image: robinsonImg,
    skills: ['Lighting', 'Camera Operation', 'Color Science'],
    socials: [{ platform: 'Vimeo', url: '#' }, { platform: 'Instagram', url: '#' }]
  }

];

export default function About() {
  const containerRef = useRef(null);
  const { updateCursor, resetCursor } = useCursor();
  const [selectedMember, setSelectedMember] = useState(null);
  const { t } = useLanguage();

  return (
    <div ref={containerRef} className="w-full min-h-screen bg-primary text-white pt-32 pb-24 px-4 md:px-12 overflow-hidden">
      <SEO 
        title="Havilah | Studio" 
        description="Learn about Havilah Studio's mission, our world-class team, and how we merge creative cinematic production with high-growth digital strategy."
        path="/about"
      />

      {/* 3D Hero Section */}
      <section className="relative w-full h-[100vh] -mt-32 mb-24 overflow-hidden cursor-none" onMouseEnter={() => updateCursor({ active: true, text: 'DRAG' })} onMouseLeave={resetCursor}>
        <div className="absolute inset-0 z-0">
          <PremiumLogo3D />
        </div>
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/40 text-[10px] font-mono uppercase tracking-[0.3em] animate-pulse pointer-events-none">
          Scroll to explore
        </div>
      </section>

      {/* Studio Intro Text */}
      <div className="max-w-4xl mx-auto flex flex-col mb-40 text-center md:text-left relative z-10 px-4">
        <GsapScrollReveal mode="text" className="text-6xl md:text-9xl font-display uppercase tracking-tighter mb-12 block text-center md:text-left">
          <GradientShimmer gradient="sunrise" duration={2.5}>{t('aboutPage.theStudio') || "The Studio"}</GradientShimmer>
        </GsapScrollReveal>
        <GsapScrollReveal mode="fade" direction="up" delay={0.2} className="text-2xl md:text-3xl font-serif italic font-light leading-relaxed text-white/90 mb-8 text-center md:text-left">
          {t('aboutPage.p1') || "We sit at the intersection of story and system. One side of us is behind the camera — building films, photography, and content that make a brand feel real."}
        </GsapScrollReveal>
        <GsapScrollReveal mode="fade" direction="up" delay={0.3} className="text-xl md:text-2xl font-serif font-light leading-relaxed text-white/80 mb-6 text-center md:text-left">
          {t('aboutPage.p2') || "The other side is behind the numbers — running the growth strategy that makes sure the right people actually see it."}
        </GsapScrollReveal>
        <GsapScrollReveal mode="fade" direction="up" delay={0.4} className="text-lg font-mono tracking-wide text-white/60 text-center md:text-left">
          {t('aboutPage.p3') || "Most studios do one or the other. We do both, under one roof, so your story and your growth strategy are never working against each other."}
        </GsapScrollReveal>
      </div>

      {/* Meet the Team - Studio Hierarchy */}
      <div className="max-w-7xl mx-auto border-t border-white/5 pt-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <GsapScrollReveal mode="text" className="text-5xl md:text-7xl font-heading uppercase tracking-tighter block">
            <GradientShimmer gradient="tonic" duration={2.2}>{t('aboutPage.meetTheTeam') || "Meet the Team"}</GradientShimmer>
          </GsapScrollReveal>
          <div className="hidden md:flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#EFE6D2]/5 border border-[#EFE6D2]/20 text-xs font-mono tracking-widest uppercase text-[#EFE6D2]">
            <span className="w-2 h-2 rounded-full bg-[#EFE6D2] animate-ping" />
            Executive Studio Hierarchy Tree
          </div>
        </div>

        {/* ========================================================
            DESKTOP TREE STRUCTURE (VISIBLE ONLY IN WINDOW VIEW)
            ======================================================== */}
        <div className="hidden md:block w-full">
          {/* TREE LEVEL 1: STUDIO ROOT / CREATIVE DIRECTOR */}
          <div className="flex justify-center">
            <div className="w-full max-w-[440px]">
              <GsapScrollReveal
                mode="card"
                tiltStrength={8}
                className="group cursor-none flex flex-col p-7 rounded-3xl bg-gradient-to-b from-[#181510] to-[#0A0A0A] border-2 border-[#EFE6D2]/40 hover:border-[#EFE6D2] transition-all duration-700 shadow-[0_15px_50px_rgba(239,230,210,0.15)] relative overflow-hidden"
                onClick={() => setSelectedMember(teamData[0])}
                onMouseEnter={() => updateCursor({ active: true, text: 'DIRECTOR' })}
                onMouseLeave={resetCursor}
              >
                <div className="absolute top-5 right-5 bg-[#EFE6D2] text-[#000000] text-[9px] font-mono uppercase font-black px-3 py-1 rounded-full tracking-widest shadow-md z-10">
                  Studio Root
                </div>
                <div className="w-full aspect-[4/5] overflow-hidden rounded-2xl mb-6 relative shadow-2xl">
                  <img
                    data-src={teamData[0].image}
                    alt={teamData[0].name}
                    className="lazyload w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-70 group-hover:opacity-30 transition-opacity duration-500" />
                </div>
                <h3 className="text-3xl font-heading uppercase tracking-wider text-[#EFE6D2] group-hover:text-white transition-colors">{teamData[0].name}</h3>
                <p className="text-xs font-mono tracking-[0.25em] text-[#CFA65B] uppercase mt-2 mb-4 font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#CFA65B] animate-pulse" /> {teamData[0].role}
                </p>
                <p className="text-sm font-sans font-light text-white/80 mb-6 flex-grow leading-relaxed">{teamData[0].shortDesc}</p>
                <GsapButton variant="primary" className="w-full justify-center text-[11px] tracking-[0.2em] py-3.5 mt-auto" onClick={() => setSelectedMember(teamData[0])}>
                  Inspect Creative Dossier ↗
                </GsapButton>
              </GsapScrollReveal>
            </div>
          </div>

          {/* TREE ARCHITECTURAL CONNECTORS & BRANCHING TRICK */}
          <div className="flex flex-col items-center my-2 relative pointer-events-none">
            {/* Main vertical trunk from studio head */}
            <div className="w-[2px] h-16 bg-gradient-to-b from-[#EFE6D2] via-[#CFA65B] to-[#B39A64] shadow-[0_0_12px_rgba(239,230,210,0.5)]" />
            
            {/* Glowing gold node diamond */}
            <div className="w-4 h-4 rotate-45 bg-[#EFE6D2] border border-black shadow-[0_0_20px_#EFE6D2] z-10 -my-[8px]" />
            
            {/* Horizontal spanning beam connecting all 3 branch members */}
            <div className="w-[66.666%] h-[2px] bg-gradient-to-r from-[#B39A64]/30 via-[#EFE6D2] to-[#B39A64]/30 my-[6px]" />
            
            {/* Three dropper lines feeding into each branch card below */}
            <div className="grid grid-cols-3 w-full">
              <div className="flex flex-col items-center">
                <div className="w-[2px] h-14 bg-gradient-to-b from-[#B39A64] to-white/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#B39A64] -mt-1 shadow-[0_0_8px_#B39A64]" />
              </div>
              <div className="flex flex-col items-center">
                <div className="w-[2px] h-14 bg-gradient-to-b from-[#EFE6D2] to-white/30" />
                <div className="w-3 h-3 rounded-full bg-[#EFE6D2] -mt-1 shadow-[0_0_12px_#EFE6D2]" />
              </div>
              <div className="flex flex-col items-center">
                <div className="w-[2px] h-14 bg-gradient-to-b from-[#B39A64] to-white/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#B39A64] -mt-1 shadow-[0_0_8px_#B39A64]" />
              </div>
            </div>
          </div>

          {/* TREE LEVEL 2: CREATIVE BRANCHES (VINEETH, RESHMA, ROBINSON J) */}
          <div className="grid grid-cols-3 gap-8 pt-4">
            {teamData.slice(1).map((member, idx) => (
              <GsapScrollReveal
                mode="card"
                tiltStrength={6}
                delay={idx * 0.15}
                key={member.id}
                className="group cursor-none flex flex-col p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#CFA65B]/60 hover:bg-white/[0.04] transition-all duration-500 shadow-xl backdrop-blur-md relative"
                onClick={() => setSelectedMember(member)}
                onMouseEnter={() => updateCursor({ active: true, text: 'PROFILE' })}
                onMouseLeave={resetCursor}
              >
                {/* Branch connector contact pad on card top */}
                <div className="absolute -top-[3px] left-1/2 -translate-x-1/2 w-10 h-[3px] rounded-full bg-white/20 group-hover:bg-[#CFA65B] group-hover:shadow-[0_0_15px_#CFA65B] transition-all duration-300" />
                
                <div className="w-full aspect-[4/5] overflow-hidden rounded-xl mb-6 relative shadow-md">
                  <img
                    data-src={member.image}
                    alt={member.name}
                    className="lazyload w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-108 transition-all duration-700 ease-out"
                  />
                  <div className="absolute inset-0 border border-transparent group-hover:border-[#CFA65B]/30 transition-colors duration-500 rounded-xl pointer-events-none" />
                </div>
                <h3 className="text-2xl font-heading uppercase tracking-wide group-hover:text-[#EFE6D2] transition-colors">{member.name}</h3>
                <p className="text-xs font-mono tracking-widest text-[#CFA65B] uppercase mt-2 mb-4 font-semibold">{member.role}</p>
                <p className="text-sm font-sans font-light text-white/70 mb-6 flex-grow">{member.shortDesc}</p>
                <GsapButton variant="outline" className="w-full justify-center text-[10px] tracking-[0.2em] py-3 mt-auto" onClick={() => setSelectedMember(member)}>
                  View Profile ↗
                </GsapButton>
              </GsapScrollReveal>
            ))}
          </div>
        </div>

        {/* ========================================================
            MOBILE STACKED GRID (VISIBLE ONLY ON PHONES/NARROW VIEWS)
            ======================================================== */}
        <div className="grid md:hidden grid-cols-1 gap-8">
          {teamData.map((member, idx) => (
            <GsapScrollReveal
              mode="card"
              tiltStrength={6}
              delay={idx * 0.15}
              key={member.id}
              className="group cursor-none flex flex-col p-6 rounded-2xl bg-white/[0.02] border border-white/10 transition-all duration-500 shadow-xl backdrop-blur-md"
              onClick={() => setSelectedMember(member)}
              onMouseEnter={() => updateCursor({ active: true, text: 'PROFILE' })}
              onMouseLeave={resetCursor}
            >
              <div className="w-full aspect-[4/5] overflow-hidden rounded-xl mb-6 relative shadow-md">
                <img
                  data-src={member.image}
                  alt={member.name}
                  className="lazyload w-full h-full object-cover filter grayscale-0 transition-all duration-700 ease-out"
                />
              </div>
              <h3 className="text-2xl font-heading uppercase tracking-wide">{member.name}</h3>
              <p className="text-xs font-mono tracking-widest text-[#CFA65B] uppercase mt-2 mb-4 font-semibold">{member.role}</p>
              <p className="text-sm font-sans font-light text-white/70 mb-6 flex-grow">{member.shortDesc}</p>
              <GsapButton variant="outline" className="w-full justify-center text-[10px] tracking-[0.2em] py-3 mt-auto" onClick={() => setSelectedMember(member)}>
                View Profile ↗
              </GsapButton>
            </GsapScrollReveal>
          ))}
        </div>
      </div>

      {/* Team Modal */}
      <TeamModal
        isOpen={!!selectedMember}
        member={selectedMember}
        onClose={() => {
          setSelectedMember(null);
          resetCursor();
        }}
      />
    </div>
  );
}
