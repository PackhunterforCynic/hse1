import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Play } from 'lucide-react';
import ResponsiveImage from '../ResponsiveImage';
import Lightbox from './Lightbox';

export default function MasonryGallery({ gallery }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!gallery || gallery.length === 0) return null;

  const openLightbox = (index) => {
    setActiveIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <section className="w-full py-12 md:py-24 px-4 md:px-8 xl:px-12 mx-auto max-w-[1920px]">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 md:gap-6 space-y-4 md:space-y-6">
          {gallery.map((media, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "100px" }}
              transition={{ duration: 0.6, delay: (index % 5) * 0.1 }}
              className="relative overflow-hidden rounded-xl bg-surface break-inside-avoid group cursor-pointer"
              onClick={() => openLightbox(index)}
            >
              {media.type === 'video' ? (
                <div className="relative w-full h-auto aspect-video">
                  {/* Using a poster or just muted video without autoplay to save performance */}
                  <video 
                    src={media.url} 
                    className="w-full h-full object-cover"
                    preload="metadata"
                    muted 
                    playsInline
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                    <div className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white">
                      <Play size={24} fill="currentColor" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-auto">
                  <ResponsiveImage 
                    src={media.url} 
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-black/40 backdrop-blur-md rounded-full text-white">
                    <Maximize2 size={16} />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {lightboxOpen && (
          <Lightbox 
            gallery={gallery} 
            initialIndex={activeIndex} 
            onClose={() => setLightboxOpen(false)} 
          />
        )}
      </AnimatePresence>
    </>
  );
}
