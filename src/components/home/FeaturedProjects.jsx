import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router';
import { projects } from '../../data/projects';
import { useLanguage } from '../../i18n';
import GsapButton from '../common/GsapButton';
import GsapScrollReveal from '../common/GsapScrollReveal';
import { CoverflowCarousel } from '@/components/ui/coverflow-carousel';
import { GradientShimmer } from '@/components/ui/gradient-shimmer';

export default function FeaturedProjects() {
  const { t } = useLanguage();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Grab the first 5 projects for the featured section
  const featured = projects.slice(0, 5);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const yOffset = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const featuredX = useTransform(scrollYProgress, [0, 0.25], ["-50vw", "0vw"]);
  const worksX = useTransform(scrollYProgress, [0, 0.25], ["50vw", "0vw"]);

  const carouselSlides = featured.map(p => ({
    src: p.cover || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop",
    alt: p.title,
    title: p.title,
    subtitle: p.category,
    meta: [
      { label: "Category", value: p.category || "Media Production" },
      { label: "Client", value: p.client || "Studio Original" },
      { label: "Status", value: "Completed 4K Production" }
    ]
  }));

  return (
    <section ref={containerRef} className="py-24 md:py-32 px-4 md:px-8 xl:px-12 bg-primary relative z-10 max-w-[1920px] mx-auto">
      <div className="flex flex-col items-center text-center justify-center mb-16 md:mb-24 gap-8">
        <div className="overflow-hidden w-full flex justify-center">
          <h2 className="text-6xl md:text-[8vw] font-display uppercase tracking-tighter mb-4 flex flex-col items-center leading-none w-full">
            <motion.span style={{ x: featuredX, opacity: headerOpacity, willChange: 'transform, opacity' }}>
              <GradientShimmer gradient="sunrise" duration={2}>{t('home.featured') || "Featured"}</GradientShimmer>
            </motion.span>
            <motion.span
              className="text-accent italic font-serif text-5xl md:text-[6vw] lowercase tracking-normal"
              style={{ x: worksX, opacity: headerOpacity, willChange: 'transform, opacity' }}
            >
              <GradientShimmer gradient="bubble" duration={2.5}>{t('home.works') || "Works"}</GradientShimmer>
            </motion.span>
          </h2>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-10%" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        >
          <Link to="/projects" className="group flex items-center justify-center gap-4 text-sm font-mono tracking-widest uppercase text-white/70 hover:text-white transition-colors">
            <span>{t('home.viewAllCases') || "View All Cases"}</span>
            <div className="w-12 h-[1px] bg-white/30 group-hover:bg-white group-hover:w-24 transition-all duration-500 ease-out" />
          </Link>
        </motion.div>
      </div>

      {/* Window / Desktop view: Cinematic 3D Coverflow Carousel */}
      <div className="hidden md:block w-full py-6">
        <CoverflowCarousel 
          slides={carouselSlides} 
          showCaption={true} 
          showNavigation={true} 
          showPagination={true}
          cardWidth="clamp(280px, 32vw, 440px)"
          rotate={48}
          depth={0.65}
          perspective={3.2}
          gap={0.06}
        />
        <div className="mt-8 flex justify-center">
          <GsapButton to="/projects" variant="primary" className="px-8 py-4">
            {t('home.exploreProject') || "Explore All Projects"} →
          </GsapButton>
        </div>
      </div>

      {/* Mobile view: Staggered vertical cards */}
      <div className="flex flex-col gap-12 md:hidden">
        {featured.map((project, index) => {
          const isEven = index % 2 === 0;
            
            return (
              <motion.div 
                key={project.id}
                className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-6 md:gap-16 items-center sticky md:relative bg-primary pb-8 md:pb-0 border-t border-white/5 md:border-none pt-4 md:pt-0 rounded-t-2xl md:rounded-none`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px" }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  top: isMobile ? `calc(5rem + ${index * 0.5}rem)` : 'auto',
                  zIndex: index
                }}
              >
                {/* GSAP Image Curtain Wipe + Parallax */}
                <GsapScrollReveal mode="image" className="w-full md:w-[60%] h-[40vh] md:h-[50vh] lg:h-[80vh] relative rounded-2xl shrink-0 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
                  <Link to={`/projects/${project.id}`} className="w-full h-full block group">
                    <motion.div 
                      className="w-full h-full md:absolute md:inset-0 md:h-[120%] will-change-transform"
                      style={{ y: isMobile ? 0 : yOffset }}
                    >
                      <img 
                        data-src={project.cover}
                        alt={project.title}
                        className="lazyload w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out will-change-transform"
                      />
                      <div className="absolute inset-0 bg-black opacity-20 group-hover:opacity-0 transition-opacity duration-1000 ease-out pointer-events-none" />
                    </motion.div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:opacity-0 pointer-events-none" />
                  </Link>
                </GsapScrollReveal>

                {/* Content */}
                <div className={`w-full md:w-[40%] flex flex-col ${isEven ? 'md:items-start md:text-left' : 'md:items-end md:text-right'} items-start text-left z-10`}>
                  <div className="overflow-hidden mb-4">
                    <span className="block text-xs font-mono tracking-[0.3em] uppercase text-accent">
                      {project.category}
                    </span>
                  </div>
                  
                  <Link to={`/projects/${project.id}`} className="group block overflow-hidden mb-6">
                    <h3 className="text-4xl md:text-6xl font-heading uppercase tracking-wider transition-colors group-hover:text-accent">
                      <GradientShimmer gradient="tonic" duration={1.8}>{project.title}</GradientShimmer>
                    </h3>
                  </Link>

                  <p className="text-white/60 font-sans font-light max-w-sm mb-8 leading-relaxed">
                    {project.story?.substring(0, 120)}...
                  </p>

                  <GsapButton to={`/projects/${project.id}`} variant="outline" className="mt-2">
                    {t('home.exploreProject') || "Explore Project"} →
                  </GsapButton>
                </div>
              </motion.div>
            );
          })
        }
      </div>
    </section>
  );
}
