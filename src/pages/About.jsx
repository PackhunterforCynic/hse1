import { Helmet } from 'react-helmet-async';
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useCursor } from '../context/CursorContext';
import TeamModal from '../components/about/TeamModal';

// Import images for Vite production build
import praiseImg from '../assets/praise.png';
import robinsonImg from '../assets/robinson.png';
import reshmaImg from '../assets/reshma.jpeg';
// import sanjanaImg from '../assets/sanjana.jpeg';
import vineethImg from '../assets/vineeth.png';

const teamData = [
  {
    id: 1,
    name: 'Praise',
    role: 'Creative Director',
    shortDesc: 'Visionary behind Havilah’s cinematic language.',
    fullBio: 'Sarah has spent over a decade shaping the visual narratives of independent films and luxury brands. Her approach blends rigorous strategic thinking with an uncompromising aesthetic vision.',
    image: praiseImg,
    skills: ['Cinematography', 'Art Direction', 'Brand Strategy'],
    socials: [{ platform: 'LinkedIn', url: '#' }, { platform: 'Instagram', url: '#' }]
  },
  {
    id: 2,
    name: 'Robinson J',
    role: 'Lead Cinematographer & Web Devloper',
    shortDesc: 'Master of light, shadow, and motion.',
    fullBio: 'With a background in architecture and fine art photography, Marcus brings a uniquely structured yet emotional eye to every frame he captures for Havilah.',
    image: robinsonImg,
    skills: ['Lighting', 'Camera Operation', 'Color Science'],
    socials: [{ platform: 'Vimeo', url: '#' }, { platform: 'Instagram', url: '#' }]
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
    name: 'Sanjana',
    role: 'Team Member',
    shortDesc: 'Innovative thinker and visual storyteller.',
    fullBio: 'Sanjana approaches every project with a blend of critical analysis and artistic intuition, ensuring every brand narrative hits the mark.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000&auto=format&fit=crop',
    skills: ['Visual Storytelling'],
    socials: [{ platform: 'LinkedIn', url: '#' }]
  },
  {
    id: 5,
    name: 'Vineeth',
    role: 'Team Member',
    shortDesc: 'Technical expert and problem solver.',
    fullBio: 'Vineeth anchors the technical execution of our most ambitious projects, bridging the gap between grand ideas and flawless delivery.',
    image: vineethImg,
    skills: ['Technical Execution'],
    socials: [{ platform: 'LinkedIn', url: '#' }]
  }
];

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const fadeUpVariant = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }
};

export default function About() {
  const containerRef = useRef(null);
  const { updateCursor, resetCursor } = useCursor();
  const [selectedMember, setSelectedMember] = useState(null);

  return (
    <div ref={containerRef} className="w-full min-h-screen bg-bg text-text pt-32 pb-24 px-4 md:px-12">
      <Helmet>
        <title>Havilah | Studio</title>
      </Helmet>
      
      {/* Studio Intro */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 md:gap-32 mb-40"
      >
        <div className="w-full md:w-1/2">
          <motion.h1 variants={fadeUpVariant} className="text-6xl md:text-9xl font-display uppercase tracking-tighter mb-12">The Studio </motion.h1>
          <motion.p variants={fadeUpVariant} className="text-2xl md:text-3xl font-serif italic font-light leading-relaxed text-text/90 mb-8">
           We sit at the intersection of story and system. One side of us is behind the camera — building films, photography, and content that make a brand feel real.
          </motion.p>
          <motion.p variants={fadeUpVariant} className="text-xl md:text-2xl font-serif font-light leading-relaxed text-text/80 mb-6">
            The other side is behind the numbers — running the growth strategy that makes sure the right people actually see it.
          </motion.p>
          <motion.p variants={fadeUpVariant} className="text-lg font-mono tracking-wide text-text/60">
            Most studios do one or the other. We do both, under one roof, so your story and your growth strategy are never working against each other.
          </motion.p>
        </div>

        <motion.div variants={fadeUpVariant} className="w-full md:w-1/2">
          <div className="w-full aspect-[3/4] overflow-hidden rounded-sm cursor-none" onMouseEnter={() => updateCursor({ active: true, text: 'VIEW' })} onMouseLeave={resetCursor}>
            <img 
              src={praiseImg} 
              alt="Studio" 
              loading="lazy"
              className="w-full h-full object-cover filter grayscale-0 md:grayscale md:hover:grayscale-0 transition-all duration-1000"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Meet the Team */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
        className="max-w-7xl mx-auto border-t border-white/5 pt-32"
      >
        <motion.h2 variants={fadeUpVariant} className="text-5xl md:text-7xl font-heading uppercase tracking-tighter mb-16">Meet the Team</motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamData.map((member) => (
            <motion.div 
              variants={fadeUpVariant}
              key={member.id}
              className="group cursor-none flex flex-col"
              onClick={() => setSelectedMember(member)}
              onMouseEnter={() => updateCursor({ active: true, text: 'PROFILE' })}
              onMouseLeave={resetCursor}
            >
              <div className="w-full aspect-[4/5] overflow-hidden rounded-sm mb-6 relative">
                <img 
                  src={member.image} 
                  alt={member.name}
                  loading="lazy"
                  className="w-full h-full object-cover filter grayscale-0 md:grayscale md:group-hover:grayscale-0 md:group-hover:scale-105 transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 border border-transparent md:group-hover:border-white/20 transition-colors duration-500 rounded-sm pointer-events-none" />
              </div>
              <h3 className="text-2xl font-heading uppercase tracking-wide md:group-hover:text-accent transition-colors">{member.name}</h3>
              <p className="text-xs font-mono tracking-widest text-text/50 uppercase mt-2 mb-4">{member.role}</p>
              <p className="text-sm font-sans font-light text-text/70">{member.shortDesc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

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
