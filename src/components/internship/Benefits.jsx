import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, memo, useCallback } from 'react';
import GsapScrollReveal from '../common/GsapScrollReveal';
import { useCursor } from '../../context/CursorContext';
import ResponsiveImage from '../common/ResponsiveImage';

const roadmapSteps = [
  {
    phase: "01",
    cardAlign: "right",
    tag: "PHASE 01",
    subtitle: "MENTORSHIP & INDUSTRY INSIGHT",
    titlePrefix: "Direct guidance from",
    titleHighlight: "industry veterans.",
    desc: "Work alongside directors, cinematographers, and brand strategists who practice what they preach. No generic online courses—just real-world architectural coaching from day one.",
    btnText: "Explore Phase One →",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200&auto=format&fit=crop",
    imageCaption: "Studio Lighting & Directing Rigs",
    icon: (
      <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  {
    phase: "02",
    cardAlign: "left",
    tag: "PHASE 02",
    subtitle: "REAL-WORLD DELIVERABLES",
    titlePrefix: "Zero coffee runs.",
    titleHighlight: "Pure production.",
    desc: "You won't be treated as \"just another intern\". Contribute directly to commercial film shoots, studio projects, ad films, and branding campaigns. Build a reel. Not just a resume.",
    btnText: "Explore Phase Two →",
    image: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=1200&auto=format&fit=crop",
    imageCaption: "Active Cinema Camera Rig on Set",
    icon: (
      <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    phase: "03",
    cardAlign: "right",
    tag: "PHASE 03",
    subtitle: "STUDIO GEAR & TECH ACCESS",
    titlePrefix: "Unrestricted professional",
    titleHighlight: "toolkits.",
    desc: "Gain full access to industry-standard gear: high-end RED Cinema cameras, professional audio, lighting kits, post-production suites, and calibrated 4K post-production finishing studio.",
    btnText: "Explore Phase Three →",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop",
    imageCaption: "Professional Prime Cine Lenses",
    icon: (
      <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
  {
    phase: "04",
    cardAlign: "left",
    tag: "PHASE 04",
    subtitle: "CREATIVE FREEDOM & PITCHING",
    titlePrefix: "Your voice shapes",
    titleHighlight: "studio direction.",
    desc: "We value original voices over safe ideas. Pitch your own concept, experiment with visual storytelling, or ideate independently—and watch your vision get highlighted and realized.",
    btnText: "Explore Phase Four →",
    image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1200&auto=format&fit=crop",
    imageCaption: "Studio Storyboard & Direction Wall",
    icon: (
      <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    )
  },
  {
    phase: "05",
    cardAlign: "right",
    tag: "PHASE 05",
    subtitle: "GROWTH, NETWORK & OPPORTUNITIES",
    titlePrefix: "More than an internship.",
    titleHighlight: "It's your launchpad.",
    desc: "Build real exposure, professional credibility, and lasting industry connections that open doors long after your internship ends.",
    btnText: "Explore Phase Five →",
    image: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1200&auto=format&fit=crop",
    imageCaption: "Cinematic Takeoff & Career Ascension",
    icon: (
      <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    )
  }
];

const Benefits = memo(function Benefits() {
  const containerRef = useRef(null);
  const { updateCursor, resetCursor } = useCursor();
  
  // Track scroll inside this roadmap to animate timeline golden laser
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 75%", "end 45%"]
  });
  
  const laserHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const scrollToRoles = useCallback(() => {
    const el = document.getElementById('open-opportunities');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <section ref={containerRef} className="w-full py-40 bg-[#080B13] text-white px-4 md:px-12 relative z-10 overflow-hidden border-t border-white/5">
      
      {/* Deep Atmosphere & Gold Spotlight Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[700px] bg-gradient-to-b from-accent/10 via-accent/5 to-transparent rounded-full blur-[160px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-1/4 right-0 w-[700px] h-[700px] bg-accent/5 rounded-full blur-[180px] pointer-events-none mix-blend-screen" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Top Section Header */}
        <div className="text-center mb-32 flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-surface/80 border border-accent/40 text-accent font-mono text-xs uppercase tracking-widest mb-8 shadow-[0_0_25px_rgba(207,166,91,0.2)] backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
            THE HAVILAH EXPERIENCE
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="text-6xl md:text-8xl lg:text-9xl font-display uppercase tracking-tight mb-6"
          >
            WHY <span className="text-accent font-serif italic font-normal">HAVILAH?</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="text-white/70 font-sans font-light max-w-2xl text-base md:text-xl leading-relaxed"
          >
            A structured cinematic journey designed to transform ambitious talents into industry-shaping production powerhouses.
          </motion.p>
        </div>

        {/* Roadmap Interactive 5-Phase Timeline Container */}
        <div className="relative w-full py-10">
          
          {/* Central Track / Spine (Desktop Central, Mobile Left-offset) */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-white/10 -translate-x-1/2">
            {/* Animated Gold Beam flowing down */}
            <motion.div 
              style={{ height: laserHeight }} 
              className="w-full bg-gradient-to-b from-accent via-[#FFDC8C] to-accent shadow-[0_0_20px_#CFA65B]"
            />
            {/* Top Ignition Light dot */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-accent shadow-[0_0_15px_#CFA65B]" />
          </div>

          {/* Roadmap Phases Grid */}
          <div className="flex flex-col gap-24 md:gap-40 relative z-10">
            {roadmapSteps.map((step, idx) => {
              const isRight = step.cardAlign === 'right';

              return (
                <div 
                  key={step.phase} 
                  className={`flex flex-col md:flex-row items-center justify-between w-full relative group ${
                    isRight ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  
                  {/* Glowing Node Marker on Timeline Spine */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center">
                    <motion.div 
                      initial={{ scale: 0.5, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      className="w-14 h-14 rounded-full bg-[#0E1524] border-2 border-accent text-white font-mono text-sm md:text-base font-bold flex items-center justify-center shadow-[0_0_25px_rgba(207,166,91,0.6)] backdrop-blur-xl group-hover:scale-110 group-hover:bg-accent group-hover:text-[#080B13] transition-all duration-500 cursor-pointer"
                      onClick={scrollToRoles}
                      onMouseEnter={() => updateCursor({ active: true, text: "PHASE " + step.phase })}
                      onMouseLeave={resetCursor}
                    >
                      {step.phase}
                    </motion.div>
                    {/* Outer pulsating ring */}
                    <span className="absolute inset-0 -m-1.5 rounded-full border border-accent/40 animate-ping opacity-40 pointer-events-none" />
                    <span className="absolute inset-0 -m-3 rounded-full border border-accent/20 pointer-events-none" />
                  </div>

                  {/* Side A: Cinematic Accompanying Visual Photography (Opposite side of Card) */}
                  <div className={`w-full md:w-5/12 ${isRight ? 'md:pr-12' : 'md:pl-12'} pl-14 md:pl-0 mb-8 md:mb-0`}>
                    <GsapScrollReveal mode="image" className="w-full">
                      <div 
                        onMouseEnter={() => updateCursor({ active: true, text: "VISUALIZE" })}
                        onMouseLeave={resetCursor}
                        onClick={scrollToRoles}
                        className="relative rounded-3xl overflow-hidden bg-surface/50 border border-white/10 group-hover:border-accent/50 transition-all duration-700 shadow-2xl aspect-[16/10] cursor-pointer"
                      >
                        <ResponsiveImage 
                          src={step.image} 
                          alt={step.imageCaption}
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="w-full h-full object-cover filter brightness-[0.85] contrast-110 group-hover:scale-105 transition-transform duration-1000 ease-out" 
                        />
                        {/* Cinematic Ambient Dark Vignette & Gold Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#080B13] via-[#080B13]/30 to-transparent opacity-70 group-hover:opacity-40 transition-opacity duration-700" />
                        <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none mix-blend-overlay" />
                        
                        {/* Caption Tag inside image */}
                        <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between pointer-events-none">
                          <span className="text-xs font-mono tracking-wider uppercase text-white/70 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                            ✦ {step.imageCaption}
                          </span>
                        </div>
                      </div>
                    </GsapScrollReveal>
                  </div>

                  {/* Side B: Interactive 3D Phase Card */}
                  <div className={`w-full md:w-5/12 ${isRight ? 'md:pl-12' : 'md:pr-12'} pl-14 md:pl-0`}>
                    <GsapScrollReveal 
                      mode="card" 
                      tiltStrength={15} 
                      direction={idx % 3 === 0 ? 'fromLeft' : idx % 3 === 1 ? 'fromRight' : 'fromDown'} 
                      delay={idx * 0.15}
                    >
                      <div 
                        onMouseEnter={() => updateCursor({ active: true, text: "APPLY" })}
                        onMouseLeave={resetCursor}
                        onClick={scrollToRoles}
                        className="p-8 md:p-11 rounded-3xl bg-[#0E1524]/60 hover:bg-[#111A2E]/80 border border-white/10 hover:border-accent/70 transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:shadow-[0_25px_60px_rgba(207,166,91,0.15)] backdrop-blur-md relative overflow-hidden flex flex-col justify-between h-full group/card cursor-pointer"
                      >
                        {/* Glowing Golden Top Lip */}
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
                        
                        {/* Background subtle radial warm glow (GPU Optimized) */}
                        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-[radial-gradient(circle_at_center,rgba(207,166,91,0.15)_0,transparent_70%)] rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none" />

                        {/* Top Bar: Icon & Phase Tag Badge */}
                        <div className="flex items-center justify-between mb-8">
                          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-accent group-hover/card:scale-110 group-hover/card:bg-accent/10 group-hover/card:border-accent/50 transition-all duration-500">
                            {step.icon}
                          </div>
                          <span className="text-xs font-mono tracking-widest uppercase text-accent font-semibold px-4 py-1.5 rounded-full bg-accent/10 border border-accent/30 shadow-[0_0_12px_rgba(207,166,91,0.2)]">
                            {step.tag}
                          </span>
                        </div>

                        {/* Subtitle / Discipline Category */}
                        <p className="text-[11px] md:text-xs font-mono tracking-widest uppercase text-white/50 mb-3">
                          {step.subtitle}
                        </p>

                        {/* Large Two-Tone Title */}
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-heading font-semibold leading-[1.2] text-white mb-5">
                          {step.titlePrefix}{" "}
                          <span className="text-accent block sm:inline font-serif italic font-normal">
                            {step.titleHighlight}
                          </span>
                        </h3>

                        {/* Detailed Description */}
                        <p className="text-white/70 font-sans font-light text-sm md:text-base leading-relaxed mb-8">
                          {step.desc}
                        </p>

                        {/* Bottom Interactive Action Trigger */}
                        <div className="pt-6 border-t border-white/10 flex items-center justify-between font-mono text-xs md:text-sm uppercase tracking-widest text-accent/80 group-hover/card:text-accent font-semibold">
                          <span className="flex items-center gap-2">
                            <span>{step.btnText}</span>
                          </span>
                          <span className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent group-hover/card:bg-accent group-hover/card:text-[#080B13] group-hover/card:translate-x-2 transition-all duration-500">
                            →
                          </span>
                        </div>
                      </div>
                    </GsapScrollReveal>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Climax & Studio Oath */}
        <div className="mt-40 text-center flex flex-col items-center justify-center">
          {/* Diamond Star */}
          <div className="mb-6">
            <svg className="w-10 h-10 text-accent animate-pulse" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
            </svg>
          </div>
          
          {/* LEARN. CREATE. LEAD. */}
          <h2 className="text-4xl md:text-7xl font-display uppercase tracking-wider text-white mb-4">
            LEARN. CREATE. <span className="text-accent font-serif italic font-normal">LEAD.</span>
          </h2>
          
          <p className="text-base md:text-xl font-mono tracking-[0.3em] uppercase text-white/50 mt-2">
            THIS IS HAVILAH.
          </p>

          <div className="mt-12 w-24 h-0.5 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
        </div>

      </div>
    </section>
  );
});

export default Benefits;
