import { useState } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { projects } from '../data/projects';

const CATEGORIES = ['All', 'Weddings', 'Corporate', 'Events', 'Portraits', 'Real Estate', 'Lifestyle', 'Documentary', 'Cultural'];

export default function Photography() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="w-full min-h-screen pt-32 pb-24 px-4 md:px-8 xl:px-12 max-w-[1920px] mx-auto bg-bg text-text">
      <Helmet>
        <title>Havilah | Photography Portfolio</title>
        <meta name="description" content="Explore our premium photography portfolio." />
      </Helmet>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8"
      >
        <div>
          <h1 className="text-5xl md:text-8xl font-display uppercase tracking-tighter mb-6">Photography</h1>
          <p className="text-xl font-serif italic text-text/70 max-w-2xl">
            A curated selection of our premium photography collections, capturing raw emotion and architectural scale.
          </p>
        </div>
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 md:max-w-md md:justify-end">
          {CATEGORIES.map(category => {
            const isActive = activeCategory === category;
            // Only show category if it has projects or is 'All'
            const hasProjects = category === 'All' || projects.some(p => p.category.toLowerCase() === category.toLowerCase());
            
            if (!hasProjects) return null;
            
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-widest transition-all duration-300 ${
                  isActive 
                    ? 'bg-accent text-bg border-accent' 
                    : 'bg-transparent text-text/60 border border-text/20 hover:text-text hover:border-text/50'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </motion.div>

      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
        <AnimatePresence>
          {filteredProjects.map((project, index) => (
            <motion.div
              layout
              key={project.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <Link to={`/photography/${project.id}`} className="group block relative overflow-hidden rounded-2xl aspect-[3/4] bg-surface">
                <img 
                  src={project.cover} 
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-full object-cover filter brightness-[0.7] group-hover:brightness-[0.9] group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-accent font-mono text-[10px] tracking-[0.2em] uppercase mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {project.category}
                  </p>
                  <h2 className="text-2xl md:text-3xl font-display uppercase tracking-widest text-white leading-tight">
                    {project.title}
                  </h2>
                  <div className="h-[1px] w-0 bg-accent mt-4 group-hover:w-12 transition-all duration-500 delay-200" />
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      
      {filteredProjects.length === 0 && (
        <div className="py-24 text-center">
          <p className="text-text/50 font-mono tracking-widest uppercase">No collections found in this category.</p>
        </div>
      )}
    </div>
  );
}
