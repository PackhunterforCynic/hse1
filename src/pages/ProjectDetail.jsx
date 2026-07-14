import { useParams, Link, Navigate, useLoaderData } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { projects as allProjects } from '../data/projects';
import PageLoader from '../components/common/PageLoader';
import ProjectStory from '../components/project/ProjectStory';
import ProjectGallery from '../components/project/ProjectGallery';

export async function clientLoader({ params, request }) {
  const projectMeta = allProjects.find(p => p.id === params.id);
  if (!projectMeta) {
    throw new Response("Not Found", { status: 404 });
  }
  
  const url = new URL(request.url);
  const response = await fetch(`${url.origin}/content/${projectMeta.slug}/gallery.json`);
  if (!response.ok) {
    throw new Response("Failed to load project data", { status: response.status });
  }
  
  const projectData = await response.json();
  return { projectMeta, projectData };
}


export default function ProjectDetail() {
  const { id } = useParams();
  const { projectMeta, projectData } = useLoaderData();
  const [isMuted, setIsMuted] = useState(true);

  if (!projectMeta || !projectData) return <Navigate to="/projects" />;

  const currentIndex = allProjects.findIndex(p => p.id === id);
  const nextProject = allProjects[(currentIndex + 1) % allProjects.length];

  // Determine featured images
  const allImages = projectData.media?.filter(m => m.type === 'image') || [];
  const featuredImageUrls = projectData.featured || [];
  let featuredImages = featuredImageUrls.length > 0 
    ? allImages.filter(img => featuredImageUrls.includes(img.src))
    : allImages.slice(0, 6);
  featuredImages = featuredImages.slice(0, 8); // Max 8 images for preview

  return (
    <div className="w-full min-h-screen bg-bg">
      <Helmet>
        <title>Havilah | {projectMeta.title}</title>
      </Helmet>

      {/* Hero */}
      <section className="relative w-full aspect-video md:aspect-auto md:h-[100dvh] overflow-hidden mt-16 md:mt-0">
        <motion.div 
          className="absolute inset-0 w-full h-full origin-center"
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 3.5, ease: 'easeOut' }}
        >
          {projectData.heroVideo ? (
            <video 
              src={projectData.heroVideo} 
              autoPlay 
              loop 
              muted={isMuted} 
              playsInline 
              className="absolute inset-0 w-full h-full object-contain md:object-cover bg-black"
            />
          ) : (
            <img 
              src={projectData.heroImage || projectMeta.cover} 
              alt={projectMeta.title}
              fetchPriority="high"
              className="absolute inset-0 w-full h-full object-contain md:object-cover bg-black"
            />
          )}
        </motion.div>
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-4 text-center">
          <h1 className="text-6xl md:text-[8vw] font-display uppercase tracking-tighter text-white mb-2 md:mb-4 flex flex-wrap justify-center gap-x-[2vw]">
            {projectMeta.title.split(' ').map((word, i) => (
              <span key={i} className="overflow-hidden inline-block pb-4 md:pb-8 -mb-4 md:-mb-8">
                <motion.span 
                  className="block origin-bottom-left"
                  initial={{ y: '120%', rotateZ: 5, opacity: 0 }}
                  animate={{ y: '0%', rotateZ: 0, opacity: 1 }}
                  transition={{ duration: 1.8, delay: 0.2 + (i * 0.1), ease: [0.16, 1, 0.3, 1] }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p 
            className="text-accent font-mono uppercase text-sm md:text-base"
            initial={{ opacity: 0, filter: 'blur(10px)', letterSpacing: '0.8em', y: 10 }}
            animate={{ opacity: 1, filter: 'blur(0px)', letterSpacing: '0.3em', y: 0 }}
            transition={{ duration: 1.5, delay: 1.0, ease: 'easeOut' }}
          >
            {projectMeta.category}
          </motion.p>
        </div>
        
        {projectData.heroVideo && (
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="absolute bottom-8 right-4 md:right-8 z-20 p-4 bg-black/40 md:hover:bg-black/80 backdrop-blur-md rounded-full text-white transition-all cursor-pointer border border-white/10"
          >
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>
        )}
      </section>

      {/* Project Overview */}
      <section className="py-24 px-4 md:px-12 max-w-7xl mx-auto w-full flex flex-col xl:flex-row gap-12">
        <div className="w-full xl:w-2/3">
          <h2 className="text-sm font-mono tracking-widest text-accent uppercase mb-4">Project Overview</h2>
          <p className="text-2xl md:text-4xl font-light font-serif italic text-text/90 leading-relaxed">
            {projectData.story}
          </p>
        </div>
        <div className="w-full xl:w-1/3 flex flex-col gap-8">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-mono tracking-widest text-text/40 uppercase mb-1">Client</p>
              <p className="text-sm uppercase tracking-wider">{projectData.credits?.client || 'Internal'}</p>
            </div>
            <div>
              <p className="text-[10px] font-mono tracking-widest text-text/40 uppercase mb-1">Category</p>
              <p className="text-sm uppercase tracking-wider">{projectMeta.category}</p>
            </div>
          </div>
          <div className="pt-6 border-t border-white/10">
            <p className="text-[10px] font-mono tracking-widest text-text/40 uppercase mb-3">Deliverables</p>
            <ul className="flex flex-wrap gap-2">
              {projectData.deliverables?.map((item, i) => (
                <li key={i} className="text-xs uppercase tracking-widest border border-white/20 px-3 py-1 rounded-full text-text/80">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Story Narrative */}
      <ProjectStory story={projectData.story} narrative={projectData.narrative} />

      {/* Cinematic Gallery */}
      <ProjectGallery images={allImages} title={projectMeta.title} />

      {/* Next Project Navigation */}
      {nextProject && (
        <Link 
          to={`/projects/${nextProject.id}`} 
          className="block w-full py-32 md:py-48 text-center bg-black hover:bg-white group transition-colors duration-700 relative overflow-hidden mt-24" 
        >
          <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-10 transition-opacity duration-700">
             {nextProject.cover && <img src={nextProject.cover} className="w-full h-full object-cover filter grayscale" alt="" />}
          </div>
          <div className="relative z-10">
            <p className="text-sm font-mono tracking-[0.3em] uppercase text-text/50 group-hover:text-black/50 mb-6 transition-colors duration-700">Up Next</p>
            <h2 className="text-5xl md:text-[8vw] font-display uppercase tracking-tighter group-hover:text-black transition-colors duration-700">{nextProject.title}</h2>
          </div>
        </Link>
      )}
    </div>
  );
}
