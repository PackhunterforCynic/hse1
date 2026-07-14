import { useParams, Link, Navigate, useLoaderData } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { projects as allProjects } from '../data/projects';
import PageLoader from '../components/common/PageLoader';
import Lightbox from '../components/gallery/Lightbox';
import ResponsiveImage from '../components/common/ResponsiveImage';

// Modular Editorial Layouts
const EditorialImage = ({ src, onClick, alt, className = "" }) => (
  <div 
    className={`overflow-hidden cursor-zoom-in relative group rounded-[4px] shadow-2xl bg-[#0a0a0a] ${className}`}
    onClick={onClick}
  >
    <ResponsiveImage 
      src={src}
      className="w-full h-full object-contain md:object-cover transition-transform duration-[2s] group-hover:scale-[1.03]"
      alt={alt}
    />
    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
  </div>
);

// Layout A: Large Hero -> Portrait Pair
const LayoutA = ({ items, getGlobalIndex }) => (
  <div className="flex flex-col gap-8 md:gap-16 w-full max-w-[1400px] mx-auto">
    {items[0] && (
      <EditorialImage 
        src={items[0]} 
        onClick={() => getGlobalIndex(items[0])} 
        className="w-full aspect-[16/9] md:aspect-[21/9]"
      />
    )}
    {(items[1] || items[2]) && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 w-full max-w-5xl mx-auto">
        {items[1] && <EditorialImage src={items[1]} onClick={() => getGlobalIndex(items[1])} className="w-full aspect-[3/4]" />}
        {items[2] && <EditorialImage src={items[2]} onClick={() => getGlobalIndex(items[2])} className="w-full aspect-[3/4] mt-0 md:mt-24" />}
      </div>
    )}
  </div>
);

// Layout B: Portrait -> Landscape Hero -> Portrait
const LayoutB = ({ items, getGlobalIndex }) => (
  <div className="flex flex-col gap-8 md:gap-16 w-full max-w-[1400px] mx-auto">
    {items[0] && (
      <div className="w-full max-w-md mx-auto md:ml-0">
        <EditorialImage src={items[0]} onClick={() => getGlobalIndex(items[0])} className="w-full aspect-[4/5]" />
      </div>
    )}
    {items[1] && (
      <EditorialImage src={items[1]} onClick={() => getGlobalIndex(items[1])} className="w-full aspect-[16/9]" />
    )}
    {items[2] && (
      <div className="w-full max-w-md mx-auto md:mr-0">
        <EditorialImage src={items[2]} onClick={() => getGlobalIndex(items[2])} className="w-full aspect-[4/5]" />
      </div>
    )}
  </div>
);

// Layout C: Large Feature -> Quote -> Three Supporting
const LayoutC = ({ items, getGlobalIndex, quote = "Every fleeting moment carries a timeless narrative." }) => (
  <div className="flex flex-col gap-12 md:gap-24 w-full max-w-[1600px] mx-auto">
    {items[0] && (
      <EditorialImage src={items[0]} onClick={() => getGlobalIndex(items[0])} className="w-full aspect-[4/3] md:aspect-[16/9]" />
    )}
    <div className="py-8 md:py-16 px-4 text-center max-w-4xl mx-auto">
      <p className="text-2xl md:text-5xl font-serif italic text-text/80 leading-snug">"{quote}"</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-[1200px] mx-auto w-full">
      {items[1] && <EditorialImage src={items[1]} onClick={() => getGlobalIndex(items[1])} className="w-full aspect-square md:aspect-[4/5] mt-0 md:mt-12" />}
      {items[2] && <EditorialImage src={items[2]} onClick={() => getGlobalIndex(items[2])} className="w-full aspect-square md:aspect-[4/5]" />}
      {items[3] && <EditorialImage src={items[3]} onClick={() => getGlobalIndex(items[3])} className="w-full aspect-square md:aspect-[4/5] mt-0 md:mt-24" />}
    </div>
  </div>
);

// Layout D: Two Landscapes -> Large Portrait
const LayoutD = ({ items, getGlobalIndex }) => (
  <div className="flex flex-col md:flex-row gap-8 md:gap-12 w-full max-w-[1400px] mx-auto items-center">
    <div className="w-full md:w-1/2 flex flex-col gap-8 md:gap-12">
      {items[0] && <EditorialImage src={items[0]} onClick={() => getGlobalIndex(items[0])} className="w-full aspect-[3/2]" />}
      {items[1] && <EditorialImage src={items[1]} onClick={() => getGlobalIndex(items[1])} className="w-full aspect-[3/2]" />}
    </div>
    <div className="w-full md:w-1/2">
      {items[2] && <EditorialImage src={items[2]} onClick={() => getGlobalIndex(items[2])} className="w-full aspect-[3/4] md:aspect-[4/5]" />}
    </div>
  </div>
);

// Auto-magically chunk images into Layouts
const EditorialStory = ({ images, openLightbox }) => {
  const chunks = [];
  let i = 0;
  const layoutTypes = ['A', 'B', 'D', 'C'];
  let layoutIdx = 0;

  while (i < images.length) {
    const layout = layoutTypes[layoutIdx % layoutTypes.length];
    
    let itemsNeeded = 3;
    if (layout === 'C') itemsNeeded = 4;

    const chunkItems = images.slice(i, i + itemsNeeded);
    chunks.push({ layout, items: chunkItems });
    i += itemsNeeded;
    layoutIdx++;
  }

  return (
    <div className="flex flex-col gap-24 md:gap-48 w-full py-12 md:py-24 px-4 md:px-8 xl:px-12">
      {chunks.map((chunk, idx) => {
        const props = { items: chunk.items, getGlobalIndex: (src) => openLightbox(images.indexOf(src)) };
        switch(chunk.layout) {
          case 'A': return <LayoutA key={idx} {...props} />;
          case 'B': return <LayoutB key={idx} {...props} />;
          case 'C': return <LayoutC key={idx} {...props} />;
          case 'D': return <LayoutD key={idx} {...props} />;
          default: return <LayoutA key={idx} {...props} />;
        }
      })}
    </div>
  );
};


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

  const data = await response.json();
  
  if (!data.chapters) {
    const images = data.media?.filter(m => m.type === 'image').map(m => m.src) || [];
    data.chapters = [{ title: "The Story", description: data.story || "", images }];
    data.year = new Date().getFullYear().toString();
    data.location = "Unknown";
  }

  return { projectMeta, projectData: data };
}


export default function PhotographyDetail() {
  const { id } = useParams();
  const { projectMeta, projectData } = useLoaderData();
  
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Gather all images for lightbox navigation
  const allImgs = projectData.chapters.flatMap(c => c.images).map(src => ({ type: 'image', src }));
  if (projectData.bts && projectData.bts.length > 0) {
    allImgs.push(...projectData.bts.map(src => ({ type: 'image', src })));
  }
  const [lightboxImages, setLightboxImages] = useState(allImgs);

  if (!projectMeta || !projectData) return <Navigate to="/photography" />;

  const handleOpenLightbox = (globalImageSrc) => {
    const idx = lightboxImages.findIndex(img => img.src === globalImageSrc);
    if (idx !== -1) {
      setLightboxIndex(idx);
      setLightboxOpen(true);
    }
  };

  const currentIndex = allProjects.findIndex(p => p.id === id);
  const nextProject = allProjects[(currentIndex + 1) % allProjects.length];

  return (
    <div className="w-full min-h-screen bg-[#080808] text-white selection:bg-accent selection:text-black font-sans pb-32">
      <Helmet>
        <title>Havilah | {projectData.title || projectMeta.title}</title>
      </Helmet>

      {/* Cinematic Hero */}
      <section className="relative w-full h-[100dvh] overflow-hidden flex flex-col justify-end p-6 md:p-12 xl:p-24">
        <motion.div 
          className="absolute inset-0 z-0 origin-bottom"
          initial={{ scale: 1.1, filter: "brightness(0.5) blur(10px)" }}
          animate={{ scale: 1, filter: "brightness(0.6) blur(0px)" }}
          transition={{ duration: 2.5, ease: "easeOut" }}
        >
          <img 
            src={projectData.cover || projectMeta.cover} 
            alt={projectData.title || projectMeta.title}
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent z-10" />

        <div className="relative z-20 w-full flex flex-col md:flex-row md:items-end justify-between gap-12">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-5xl"
          >
            <p className="font-mono text-accent uppercase tracking-[0.3em] text-xs md:text-sm mb-6">{projectData.category || projectMeta.category}</p>
            <h1 className="text-5xl md:text-8xl lg:text-[9rem] font-display uppercase tracking-tighter leading-[0.85]">
              {projectData.title || projectMeta.title}
            </h1>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="hidden md:flex flex-col items-end gap-2 text-right"
          >
            <div className="flex items-center gap-6 text-sm font-mono tracking-widest uppercase text-white/50">
              {projectData.year && <span>{projectData.year}</span>}
              {projectData.location && (
                <>
                  <span className="w-1 h-1 bg-accent rounded-full" />
                  <span>{projectData.location}</span>
                </>
              )}
            </div>
            <div className="mt-8 animate-bounce">
              <ChevronDown className="text-accent" size={24} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Collection Information */}
      <section className="py-24 px-6 md:px-12 xl:px-24 max-w-[1920px] mx-auto border-b border-white/10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-32">
          <div className="lg:w-2/3">
            <h2 className="text-3xl md:text-5xl font-serif italic text-white/90 leading-relaxed font-light">
              {projectData.story || "A cinematic journey capturing raw emotion, timeless elegance, and fleeting moments preserved forever."}
            </h2>
          </div>
          <div className="lg:w-1/3 grid grid-cols-2 gap-y-12 gap-x-8">
            <div>
              <p className="text-[10px] font-mono tracking-[0.2em] text-white/40 uppercase mb-3">Client</p>
              <p className="text-sm md:text-base font-light tracking-wide">{projectData.client || "Havilah Studios"}</p>
            </div>
            <div>
              <p className="text-[10px] font-mono tracking-[0.2em] text-white/40 uppercase mb-3">Location</p>
              <p className="text-sm md:text-base font-light tracking-wide">{projectData.location || "Various"}</p>
            </div>
            <div>
              <p className="text-[10px] font-mono tracking-[0.2em] text-white/40 uppercase mb-3">Year</p>
              <p className="text-sm md:text-base font-light tracking-wide">{projectData.year || new Date().getFullYear()}</p>
            </div>
            {projectData.services?.length > 0 && (
              <div>
                <p className="text-[10px] font-mono tracking-[0.2em] text-white/40 uppercase mb-3">Services</p>
                <div className="flex flex-col gap-1">
                  {projectData.services.map((s, i) => (
                    <span key={i} className="text-sm md:text-base font-light tracking-wide">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Chapters */}
      <div className="w-full">
        {projectData.chapters?.map((chapter, index) => (
          <section key={index} className="pt-32 pb-16 border-b border-white/5 last:border-none">
            <div className="max-w-[1920px] mx-auto px-6 md:px-12 xl:px-24 mb-16 md:mb-24 text-center">
              <p className="text-accent font-mono text-[10px] tracking-[0.3em] uppercase mb-4">Chapter {String(index + 1).padStart(2, '0')}</p>
              <h2 className="text-4xl md:text-6xl font-display uppercase tracking-widest">{chapter.title}</h2>
              {chapter.description && (
                <p className="mt-8 text-lg font-serif italic text-white/60 max-w-2xl mx-auto">{chapter.description}</p>
              )}
            </div>
            <EditorialStory 
              images={chapter.images} 
              openLightbox={(src) => handleOpenLightbox(src)} 
            />
          </section>
        ))}
      </div>

      {/* Behind The Scenes (Optional) */}
      {projectData.bts?.length > 0 && (
        <section className="py-32 px-6 md:px-12 xl:px-24 bg-[#050505]">
          <div className="max-w-[1920px] mx-auto">
            <div className="mb-16 md:mb-24">
              <h2 className="text-3xl md:text-5xl font-display uppercase tracking-widest mb-6">Behind The Scenes</h2>
              <p className="text-lg font-serif italic text-white/60 max-w-xl">The craftsmanship, equipment, and dedicated team that brought this vision to life.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {projectData.bts.map((imgSrc, idx) => (
                <div 
                  key={idx} 
                  className="aspect-square overflow-hidden cursor-zoom-in group opacity-80 hover:opacity-100 transition-opacity"
                  onClick={() => handleOpenLightbox(imgSrc)}
                >
                  <img src={imgSrc} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="BTS" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Collections */}
      {nextProject && (
        <section className="mt-32 max-w-[1920px] mx-auto px-6 md:px-12 xl:px-24">
          <Link 
            to={`/photography/${nextProject.id}`} 
            className="group relative block w-full aspect-[21/9] md:aspect-[32/9] overflow-hidden bg-surface"
          >
            <img 
              src={nextProject.cover} 
              className="w-full h-full object-cover filter brightness-[0.5] group-hover:brightness-[0.7] group-hover:scale-[1.02] transition-all duration-[1.5s]" 
              alt={nextProject.title} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
            <div className="absolute inset-0 flex flex-col justify-end items-center text-center p-8 md:p-16">
              <p className="text-accent font-mono text-[10px] tracking-[0.3em] uppercase mb-6 flex items-center gap-4">
                <span>Next Collection</span>
                <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
              </p>
              <h2 className="text-4xl md:text-6xl lg:text-8xl font-display uppercase tracking-wider text-white">
                {nextProject.title}
              </h2>
            </div>
          </Link>
        </section>
      )}

      <Lightbox 
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        media={lightboxImages}
        currentIndex={lightboxIndex}
        onNext={() => setLightboxIndex((prev) => (prev + 1) % lightboxImages.length)}
        onPrev={() => setLightboxIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length)}
      />
    </div>
  );
}
