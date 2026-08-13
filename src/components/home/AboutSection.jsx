import { useRef, memo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router';
import { useLanguage } from '../../i18n';
import GsapScrollReveal from '../common/GsapScrollReveal';
import { useCursor } from '../../context/CursorContext';
import { GradientShimmer } from '@/components/ui/gradient-shimmer';

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const wordVariants = {
  hidden: { y: '110%', rotateZ: 2, opacity: 0 },
  visible: { y: '0%', rotateZ: 0, opacity: 1, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
};

const AboutSection = memo(function AboutSection() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const { updateCursor, resetCursor } = useCursor();

  // Track scroll inside this section to drive the golden progress laser beam
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 50%"]
  });
  
  const laserHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const values = [
    {
      num: "01",
      title: t('home.val1Title') || "One team, one throughline.",
      desc: t('home.val1Desc') || "Your film, your photos, your content, and your growth strategy are built by people who talk to each other daily — not four vendors who've never met.",
      tag: "Integrated Architecture",
      status: "SYNCED PRODUCTION ✦",
      icon: (
        <svg className="w-7 h-7 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      )
    },
    {
      num: "02",
      title: t('home.val2Title') || "Craft first, always.",
      desc: t('home.val2Desc') || "Growth without a story is noise. A beautiful film with no audience is a private screening. We build both, together.",
      tag: "Cinematic Impact",
      status: "STORYTELLING ENABLED ✦",
      icon: (
        <svg className="w-7 h-7 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>
      )
    },
    {
      num: "03",
      title: t('home.val3Title') || "Built to compound.",
      desc: t('home.val3Desc') || "Everything we make is designed to work more than once — a film becomes ad content, ad content becomes a case study, a case study becomes a growth asset.",
      tag: "Exponential Return",
      status: "COMPOUND GROWTH ✦",
      icon: (
        <svg className="w-7 h-7 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    }
  ];

  return (
    <section ref={containerRef} className="py-36 px-4 md:px-12 bg-primary text-white w-full overflow-hidden relative z-10 border-t border-white/5">
      
      {/* Cinematic Ambient Glows & Grid Accent */}
      <div className="absolute top-1/3 left-0 w-[clamp(300px,50vw,600px)] aspect-square bg-accent/5 rounded-full blur-[60px] sm:blur-[160px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-10 right-10 w-[clamp(250px,40vw,500px)] aspect-square bg-blue-500/5 rounded-full blur-[60px] sm:blur-[140px] pointer-events-none mix-blend-screen" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-16 md:gap-20 relative z-10">
        
        {/* Left Column: Sticky Cinematic Statement */}
        <motion.div 
          className="w-full md:w-5/12 md:sticky md:top-36 flex flex-col items-start" 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
        >
          {/* Animated Gold Tag */}
          <motion.div 
            variants={fadeUpVariant => ({ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } })} 
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-xs uppercase tracking-widest mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            The Havilah Distinction
          </motion.div>

          <div className="overflow-hidden mb-2">
            <h2 className="text-6xl md:text-8xl font-display uppercase tracking-tighter leading-none about-line">
              <motion.span variants={wordVariants} className="inline-block origin-top-left"><GradientShimmer gradient="sunrise" duration={2}>{t('home.why') || "Why"}</GradientShimmer></motion.span>
            </h2>
          </div>
          <div className="overflow-hidden mb-6">
            <h2 className="text-6xl md:text-8xl font-display uppercase tracking-tighter leading-none text-accent about-line font-serif italic font-normal">
              <motion.span variants={wordVariants} className="inline-block origin-top-left"><GradientShimmer gradient="tonic" duration={2.2}>{t('home.havilah') || "Havilah."}</GradientShimmer></motion.span>
            </h2>
          </div>
          
          <div className="mt-4 border-l-2 border-accent/50 pl-6">
            <GsapScrollReveal mode="fade" direction="up" className="text-xl md:text-2xl font-sans font-light text-white/90 leading-relaxed max-w-md">
              {t('home.aboutTagline') || "Film, content, and growth — built together."}
            </GsapScrollReveal>
            <p className="mt-4 text-sm font-mono uppercase tracking-widest text-white/40">
              [ DIRECTORS + STRATEGISTS ]
            </p>
          </div>

          {/* Abstract Cinematic Ornament */}
          <div className="mt-12 opacity-30 flex items-center gap-4 text-xs font-mono tracking-widest">
            <div className="w-12 h-[1px] bg-accent" />
            <span>EXCELLENCE IS INTENTIONAL</span>
            <div className="w-12 h-[1px] bg-accent" />
          </div>
        </motion.div>

        {/* Right Column: Animated Interactive Roadmap Engine */}
        <div className="w-full md:w-7/12 relative flex flex-col gap-12 md:gap-14">
          
          {/* Vertical Glowing Conduit (Visible on both Mobile and Desktop) */}
          <div className="absolute left-3 md:left-4 top-8 bottom-8 w-0.5 bg-white/10 block -translate-x-1/2">
            <motion.div 
              style={{ height: laserHeight }} 
              className="w-full bg-gradient-to-b from-accent via-[#FFDC8C] to-accent shadow-[0_0_20px_#CFA65B]"
            />
          </div>

          {values.map((item, idx) => (
            <div key={idx} className="relative group w-full pl-11 md:pl-14">
              
              {/* Glowing Timeline Node connecting to the Conduit on Mobile & Desktop */}
              <div className="absolute left-3 md:left-4 -translate-x-1/2 top-10 md:top-12 z-20 flex items-center justify-center">
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#0E1524] border-2 border-accent text-accent font-mono text-xs md:text-sm font-bold flex items-center justify-center shadow-[0_0_20px_rgba(207,166,91,0.6)] backdrop-blur-xl group-hover:scale-110 group-hover:bg-accent group-hover:text-[#080B13] transition-all duration-300"
                >
                  {item.num}
                </motion.div>
                {/* Ping Pulse ring on Node */}
                <span className="absolute inset-0 -m-1 rounded-full border border-accent/40 animate-ping opacity-30 pointer-events-none" />
              </div>

              {/* 3D Glass Interactive Value Card: Revelations from LEFT, RIGHT, DOWN */}
              <GsapScrollReveal 
                mode="card" 
                tiltStrength={14} 
                direction={idx === 0 ? 'fromLeft' : idx === 1 ? 'fromRight' : 'fromDown'} 
                delay={idx * 0.15}
              >
                <div 
                  onClick={() => navigate('/services')}
                  onMouseEnter={() => updateCursor({ active: true, text: "EXPLORE" })}
                  onMouseLeave={resetCursor}
                  className="flex flex-col gap-5 md:gap-6 p-6 md:p-11 rounded-3xl bg-white/[0.025] hover:bg-white/[0.05] border border-white/10 hover:border-accent/60 transition-all duration-500 shadow-2xl hover:shadow-[0_20px_50px_rgba(207,166,91,0.12)] backdrop-blur-md relative overflow-hidden group cursor-pointer"
                >
                  {/* Glowing Top Lip */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Subtle Background Radial Light on Hover (GPU optimized) */}
                  <div className="absolute -top-24 -right-24 w-60 h-60 bg-[radial-gradient(circle_at_center,rgba(207,166,91,0.15)_0,transparent_70%)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                  {/* Top Bar: Icon & Tag */}
                  <div className="flex items-center justify-between z-10">
                    <div className="flex items-center gap-4">
                      <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-accent group-hover:scale-110 group-hover:bg-accent/10 group-hover:border-accent/40 transition-all duration-500">
                        {item.icon}
                      </div>
                      <span className="text-xs font-mono tracking-widest text-accent/80 uppercase px-3.5 py-1.5 rounded-full bg-accent/5 border border-accent/20">
                        {item.tag}
                      </span>
                    </div>
                    {/* Mobile Number display */}
                    <span className="md:hidden text-sm font-mono text-accent font-bold">
                      {item.num}
                    </span>
                  </div>

                  {/* Core Value Title */}
                  <h3 className="text-2xl md:text-4xl font-heading font-semibold tracking-wide text-white group-hover:text-accent transition-colors duration-300 leading-snug z-10">
                    <GradientShimmer gradient="tonic" duration={1.8}>{item.title}</GradientShimmer>
                  </h3>
                  
                  {/* Detailed Explanation */}
                  <p className="text-white/70 font-sans font-light leading-relaxed text-base md:text-lg z-10">
                    {item.desc}
                  </p>

                  {/* Futuristic Bottom Status Tracker */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono tracking-wider text-white/40 group-hover:text-white/80 transition-colors duration-300 z-10">
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                      {item.status}
                    </span>
                    <span className="text-accent group-hover:translate-x-2 transition-transform duration-300 font-semibold underline-offset-4 group-hover:underline">
                      Explore Capability ↗
                    </span>
                  </div>

                </div>
              </GsapScrollReveal>
              
            </div>
          ))}

        </div>
      </div>
    </section>
  );
});

export default AboutSection;
