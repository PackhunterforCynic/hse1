import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { projects } from '../data/projects';

export default function Projects() {
  return (
    <div className="w-full min-h-screen pt-32 pb-24 px-4 md:px-8 xl:px-12 max-w-[1920px] mx-auto">
      <Helmet>
        <title>Havilah | Projects</title>
        <meta name="description" content="Explore our portfolio of cinematic storytelling." />
      </Helmet>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-16 md:mb-24"
      >
        <h1 className="text-5xl md:text-8xl font-display uppercase tracking-tighter mb-6">Our Work</h1>
        <p className="text-xl font-serif italic text-text/70 max-w-2xl">
          A curated selection of our finest cinematic storytelling and brand experiences.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, delay: (index % 2) * 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link to={`/projects/${project.id}`} className="group block relative overflow-hidden rounded-2xl aspect-[4/3] bg-surface">
              <img 
                src={project.cover} 
                alt={project.title}
                loading="lazy"
                className="w-full h-full object-cover filter brightness-[0.8] group-hover:brightness-100 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <p className="text-accent font-mono text-sm tracking-widest uppercase mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  {project.category}
                </p>
                <h2 className="text-3xl md:text-4xl font-heading uppercase tracking-wider text-white">
                  {project.title}
                </h2>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
