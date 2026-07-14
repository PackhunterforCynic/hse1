import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProjectGallery({ images, title }) {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!images || images.length === 0) return null;

  const openLightbox = (index) => setSelectedImage(index);
  const closeLightbox = () => setSelectedImage(null);
  
  const nextImage = (e) => {
    e.stopPropagation();
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  
  const prevImage = (e) => {
    e.stopPropagation();
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <>
      <section className="py-24 px-4 md:px-12 max-w-[1920px] mx-auto w-full">
        <h2 className="text-sm font-mono tracking-widest text-accent uppercase mb-16 text-center">Cinematic Gallery</h2>
        
        {/* Masonry Layout */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 md:gap-8 space-y-6 md:space-y-8">
          {images.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, delay: (idx % 3) * 0.15 }}
              className="relative overflow-hidden rounded-xl bg-surface cursor-pointer break-inside-avoid group"
              onClick={() => openLightbox(idx)}
            >
              <img 
                src={img.src}
                alt={`${title} - Gallery ${idx + 1}`}
                loading="lazy"
                className="w-full h-auto object-cover filter brightness-[0.85] group-hover:brightness-100 group-hover:scale-[1.03] transition-all duration-[1.5s]"
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-12"
            onClick={closeLightbox}
          >
            <button 
              className="absolute top-6 right-6 p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
              onClick={closeLightbox}
            >
              <X size={24} />
            </button>

            <button 
              className="absolute left-4 md:left-12 p-4 rounded-full bg-white/5 hover:bg-white/20 text-white transition-colors z-50"
              onClick={prevImage}
            >
              <ChevronLeft size={32} />
            </button>

            <motion.img 
              key={selectedImage}
              src={images[selectedImage].src}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            <button 
              className="absolute right-4 md:right-12 p-4 rounded-full bg-white/5 hover:bg-white/20 text-white transition-colors z-50"
              onClick={nextImage}
            >
              <ChevronRight size={32} />
            </button>
            
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 font-mono text-xs">
              {selectedImage + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
