import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router';
import { projects } from '../../data/projects';
import { useState, useEffect } from 'react';

export default function FeaturedProjects() {
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

  return (
    <section ref={containerRef} className="py-24 md:py-32 px-4 md:px-8 xl:px-12 bg-bg relative z-10 max-w-[1920px] mx-auto">
      <div className="flex flex-col items-center text-center justify-center mb-16 md:mb-24 gap-8">
        <div className="overflow-hidden w-full flex justify-center">
          <h2 className="text-6xl md:text-[8vw] font-display uppercase tracking-tighter mb-4 flex flex-col items-center leading-none w-full">
            <motion.span style={{ x: featuredX, opacity: headerOpacity }}>
              Featured
            </motion.span>
            <motion.span
              className="text-accent italic font-serif text-5xl md:text-[6vw] lowercase tracking-normal"
              style={{ x: worksX, opacity: headerOpacity }}
            >
              Works
            </motion.span>
          </h2>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-10%" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        >
          <Link to="/projects" className="group flex items-center justify-center gap-4 text-sm font-mono tracking-widest uppercase text-text/70 hover:text-white transition-colors">
            <span>View All Cases</span>
            <div className="w-12 h-[1px] bg-white/30 group-hover:bg-white group-hover:w-24 transition-all duration-500 ease-out" />
          </Link>
        </motion.div>
      </div>

      <div className="flex flex-col gap-12 md:gap-32">
        {featured.map((project, index) => {
          const isEven = index % 2 === 0;
            
            return (
              <motion.div 
                key={project.id}
                className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-6 md:gap-16 items-center sticky md:relative bg-bg pb-8 md:pb-0 border-t border-white/5 md:border-none pt-4 md:pt-0 rounded-t-2xl md:rounded-none`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px" }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  top: isMobile ? `calc(5rem + ${index * 0.5}rem)` : 'auto',
                  zIndex: index
                }}
              >
                {/* Image Container with Parallax */}
                <Link to={`/projects/${project.id}`} className="w-full md:w-[60%] md:h-[80vh] relative overflow-hidden rounded-2xl group block">
                  <motion.div 
                    className="w-full h-full md:absolute md:inset-0 md:h-[120%]"
                    style={{ y: isMobile ? 0 : yOffset }}
                  >
                    <img 
                      src={project.cover}
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-auto md:h-full object-cover filter brightness-[0.8] group-hover:brightness-100 group-hover:scale-105 transition-all duration-1000 ease-out"
                    />
                  </motion.div>
                  {/* Subtle overlay for better text readability on mobile */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:opacity-0 pointer-events-none" />
                </Link>

                {/* Content */}
                <div className={`w-full md:w-[40%] flex flex-col ${isEven ? 'md:items-start md:text-left' : 'md:items-end md:text-right'} items-start text-left z-10`}>
                  <div className="overflow-hidden mb-4">
                    <span className="block text-xs font-mono tracking-[0.3em] uppercase text-accent">
                      {project.category}
                    </span>
                  </div>
                  
                  <Link to={`/projects/${project.id}`} className="group block overflow-hidden mb-6">
                    <h3 className="text-4xl md:text-6xl font-heading uppercase tracking-wider transition-colors group-hover:text-accent">
                      {project.title}
                    </h3>
                  </Link>

                  <p className="text-text/60 font-sans font-light max-w-sm mb-8 leading-relaxed">
                    {project.story?.substring(0, 120)}...
                  </p>

                  <Link 
                    to={`/projects/${project.id}`}
                    className="relative inline-flex items-center gap-4 text-xs font-mono tracking-widest uppercase group/btn overflow-hidden"
                  >
                    <span className="relative z-10 transition-colors group-hover/btn:text-bg">Explore Project</span>
                    <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center relative z-10 group-hover/btn:border-transparent transition-colors">
                      <div className="w-1 h-1 bg-white rounded-full group-hover/btn:scale-0 transition-transform" />
                    </div>
                    <div className="absolute top-1/2 right-4 -translate-y-1/2 w-8 h-8 bg-white rounded-full scale-0 group-hover/btn:scale-[4] transition-transform duration-500 ease-out z-0 origin-center" />
                  </Link>
                </div>
              </motion.div>
            );
          })
        }
      </div>
    </section>
  );
}
