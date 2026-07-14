import { Helmet } from 'react-helmet-async';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useCursor } from '../context/CursorContext';

const servicesData = [
  {
    title: "Film Production",
    desc: "Narrative and documentary filmmaking with an uncompromising cinematic vision. We build films that leave a lasting imprint on culture.",
    image: "/images/services/service1.png"
  },
  {
    title: "Commercials",
    desc: "High-end brand campaigns designed to captivate audiences, elevate identity, and define the premium tier of your market.",
    image: "/images/services/service2.png"
  },
  {
    title: "Aerial Cinematography",
    desc: "Sweeping drone visuals and complex rigging that provide a breathtaking, impossible perspective on scale and space.",
    image: "/images/services/service3.png" 
   },
  {
    title: "Video Editing",
    desc: "Meticulous post-production, pacing, and color science that crafts the final emotional resonance of the story.",
    image: "/images/services/service4.jpeg"
  },
  {
    title: "Photography",
    desc: "Editorial and brand photography with a sharp, distinctive visual language built for print, deck, and digital.",
    image: "/images/services/image.png"
  },
  {
    title: "Sound Design",
    desc: "Immersive audio mixing, Foley, and original orchestral scoring that gives a powerful heartbeat to the visuals.",
    image: "/images/services/service1.png"
  }
];

export default function Services() {
  const containerRef = useRef(null);
  const { updateCursor, resetCursor } = useCursor();

  return (
    <div ref={containerRef} className="w-full min-h-screen bg-[#080808] text-[#F8F5F0] pt-40 pb-32 overflow-hidden relative">
      <Helmet>
        <title>Havilah | Capabilities</title>
      </Helmet>

      {/* Ambient radial glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[800px] bg-[#C9A84C]/5 rounded-full blur-[150px] pointer-events-none -translate-y-1/2 z-0" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-[#C9A84C]/5 rounded-full blur-[150px] pointer-events-none translate-y-1/2 z-0" />
      
      {/* Film grain overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay z-0" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} 
      />

      <div className="max-w-[1920px] mx-auto px-6 md:px-12 xl:px-24 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mb-32 md:mb-48 max-w-5xl"
        >
          <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-serif text-[#F8F5F0] tracking-tighter mb-8 leading-[0.9]">Capabilities</h1>
          <p className="text-xl md:text-2xl text-[rgba(255,255,255,0.65)] font-sans font-light leading-relaxed max-w-2xl pl-2 md:pl-4 border-l-2 border-[#C9A84C]/40">
            We engineer premium visual experiences for luxury brands and cinematic storytellers.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-28 md:gap-y-32">
          {servicesData.map((service, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, delay: (idx % 3) * 0.15 }}
              className="group relative bg-[#121212]/80 rounded-[24px] md:rounded-[32px] p-6 md:p-8 lg:p-10 border border-[#C9A84C]/10 backdrop-blur-xl transition-all duration-500 hover:border-[#C9A84C]/30 hover:bg-[#121212] flex flex-col cursor-none mt-16 md:mt-24"
              onMouseEnter={() => updateCursor({ active: true, text: 'EXPLORE' })}
              onMouseLeave={resetCursor}
            >
              <div className="relative -mt-24 md:-mt-32 lg:-mt-40 mb-8 w-full aspect-[4/3] z-10 transition-transform duration-500 group-hover:-translate-y-3">
                 <div 
                   className="w-full h-full overflow-hidden border border-[#C9A84C]/20 shadow-[0_20px_40px_rgba(0,0,0,0.8)] relative transition-all duration-500 group-hover:shadow-[0_30px_60px_rgba(201,168,76,0.15)] group-hover:border-[#C9A84C]/50"
                   style={{ borderRadius: '0 48px 0 48px' }}
                 >
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]" 
                    />
                    {/* Soft gold gradient overlay revealed on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#C9A84C]/40 via-[#C9A84C]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay" />
                 </div>
              </div>

              <div className="relative z-20 flex-grow flex flex-col">
                <p className="text-[#C9A84C] font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] mb-4 md:mb-6">
                  Service {String(idx + 1).padStart(2, '0')}
                </p>
                <h3 className="text-3xl md:text-4xl font-serif text-[#F8F5F0] mb-4 group-hover:text-[#C9A84C] transition-colors duration-500 tracking-tight">
                  {service.title}
                </h3>
                <p className="text-[rgba(255,255,255,0.65)] font-sans font-light leading-relaxed text-sm md:text-base">
                  {service.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
