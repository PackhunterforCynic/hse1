import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ChevronLeft, ChevronRight, Heart, Star, Eye, 
  Sparkles, Maximize2, Filter, TrendingUp, Bookmark, Award, Check, Film
} from 'lucide-react';

export default function ProjectGallery({ images = [], title = "Project Architecture" }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'iconic' | 'popular' | 'favorites'
  const [galleryState, setGalleryState] = useState([]);

  // Initialize interactive stats for images with persistent localStorage integration
  useEffect(() => {
    if (!images || images.length === 0) return;
    
    const storageKey = `havilah_gallery_${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    let savedState = null;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) savedState = JSON.parse(saved);
    } catch {}

    const initialized = images.map((img, idx) => {
      const savedItem = savedState?.find(item => item.id === `frame_${idx}`) || {};
      // Designate every 3rd image, index 0, or specific high-performing shots as "Most Iconic"
      const isIconic = idx === 0 || idx === 2 || (idx % 3 === 0 && idx < 10) || img.isIconic;
      
      // Generate realistic high-end baseline metrics for cinema presentation
      const defaultViews = 1420 + (idx * 387) + ((idx * 83) % 419);
      const defaultLikes = 112 + (idx * 43) + ((idx * 27) % 89);

      return {
        ...img,
        id: `frame_${idx}`,
        index: idx,
        isIconic,
        views: savedItem.views !== undefined ? savedItem.views : defaultViews,
        likes: savedItem.likes !== undefined ? savedItem.likes : defaultLikes,
        likedByUser: !!savedItem.likedByUser,
        favoritedByUser: !!savedItem.favoritedByUser,
        tag: isIconic ? '✦ MOST ICONIC' : (idx % 2 === 0 ? '60FPS RAW LOG' : '4K ANAMORPHIC')
      };
    });

    setGalleryState(initialized);
  }, [images, title]);

  // Sync back to local storage on interaction
  const syncStorage = (updatedList) => {
    try {
      const storageKey = `havilah_gallery_${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
      localStorage.setItem(storageKey, JSON.stringify(updatedList.map(item => ({
        id: item.id,
        views: item.views,
        likes: item.likes,
        likedByUser: item.likedByUser,
        favoritedByUser: item.favoritedByUser
      }))));
    } catch {}
  };

  // Handler: Toggle Like
  const handleLike = (e, index) => {
    e.stopPropagation();
    setGalleryState(prev => {
      const updated = prev.map((item, idx) => {
        if (idx === index) {
          const nextLiked = !item.likedByUser;
          return {
            ...item,
            likedByUser: nextLiked,
            likes: item.likes + (nextLiked ? 1 : -1)
          };
        }
        return item;
      });
      syncStorage(updated);
      return updated;
    });
  };

  // Handler: Toggle Favorite / Bookmark
  const handleFavorite = (e, index) => {
    e.stopPropagation();
    setGalleryState(prev => {
      const updated = prev.map((item, idx) => {
        if (idx === index) {
          return { ...item, favoritedByUser: !item.favoritedByUser };
        }
        return item;
      });
      syncStorage(updated);
      return updated;
    });
  };

  // Handler: Open Lightbox and Increment View Counter
  const openLightbox = (index) => {
    setSelectedImageIndex(index);
    setGalleryState(prev => {
      const updated = prev.map((item, idx) => {
        if (idx === index) {
          return { ...item, views: item.views + 1 };
        }
        return item;
      });
      syncStorage(updated);
      return updated;
    });
  };

  const closeLightbox = () => setSelectedImageIndex(null);
  
  const nextImage = (e) => {
    if (e) e.stopPropagation();
    setSelectedImageIndex(prev => (prev === galleryState.length - 1 ? 0 : prev + 1));
  };
  
  const prevImage = (e) => {
    if (e) e.stopPropagation();
    setSelectedImageIndex(prev => (prev === 0 ? galleryState.length - 1 : prev - 1));
  };

  // Aggregated totals & filtered views (MUST be called before any early return to abide by Rules of Hooks)
  const totals = useMemo(() => {
    const views = galleryState.reduce((acc, curr) => acc + curr.views, 0);
    const likes = galleryState.reduce((acc, curr) => acc + curr.likes, 0);
    const favs = galleryState.filter(i => i.favoritedByUser).length;
    const iconic = galleryState.filter(i => i.isIconic).length;
    return { views, likes, favs, iconic };
  }, [galleryState]);

  const filteredImages = useMemo(() => {
    if (activeFilter === 'iconic') {
      return galleryState.filter(item => item.isIconic);
    } else if (activeFilter === 'popular') {
      return [...galleryState].sort((a, b) => b.likes - a.likes);
    } else if (activeFilter === 'favorites') {
      return galleryState.filter(item => item.favoritedByUser);
    }
    return galleryState;
  }, [galleryState, activeFilter]);

  const activeLightboxImage = selectedImageIndex !== null ? galleryState[selectedImageIndex] : null;

  if (!images || images.length === 0 || galleryState.length === 0) return null;

  return (
    <>
      <section className="py-28 px-4 sm:px-8 md:px-12 max-w-[1920px] mx-auto w-full bg-[#060606] relative overflow-hidden">
        
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-[#EFE6D2]/5 blur-[120px] pointer-events-none" />

        {/* SECTION HEADER & STUDIO STATS BAR */}
        <div className="max-w-7xl mx-auto mb-16 space-y-8">
          <div className="text-center space-y-3">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-widest text-[#EFE6D2]">
              <Sparkles className="w-3.5 h-3.5 text-[#EFE6D2] animate-pulse" /> Interactive Studio Vault
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display uppercase tracking-tighter text-white font-bold">
              Cinematic Frame Gallery
            </h2>
            <p className="text-sm text-white/50 font-serif italic max-w-xl mx-auto">
              Curate your personal moodboard. Explore individual frame telemetrics, discover most iconic compositions, and bookmark visual milestones.
            </p>
          </div>

          {/* TELEMETRY TOTALS BAR */}
          <div className="p-4 sm:p-6 rounded-3xl bg-[#0A0A0A] border border-white/10 backdrop-blur-xl shadow-2xl flex items-center justify-between gap-4 flex-wrap max-w-4xl mx-auto">
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2 font-mono">
                <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#EFE6D2]">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-white/40 uppercase block">Total Views</span>
                  <span className="text-sm font-bold text-white">{(totals.views / 1000).toFixed(1)}K</span>
                </div>
              </div>

              <div className="w-px h-8 bg-white/10 hidden sm:block" />

              <div className="flex items-center gap-2 font-mono">
                <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                  <Heart className="w-4 h-4 fill-rose-400" />
                </div>
                <div>
                  <span className="text-[10px] text-white/40 uppercase block">Studio Likes</span>
                  <span className="text-sm font-bold text-rose-300">{totals.likes}</span>
                </div>
              </div>

              <div className="w-px h-8 bg-white/10 hidden sm:block" />

              <div className="flex items-center gap-2 font-mono">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Award className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <span className="text-[10px] text-white/40 uppercase block">Iconic Frames</span>
                  <span className="text-sm font-bold text-amber-300">{totals.iconic}</span>
                </div>
              </div>
            </div>

            {/* FILTER SWITCHER */}
            <div className="flex items-center gap-1 p-1 bg-black/80 rounded-2xl border border-white/10 overflow-x-auto">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  activeFilter === 'all' 
                    ? 'bg-[#EFE6D2] text-black font-bold shadow-[0_0_20px_rgba(239,230,210,0.25)]' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                All ({galleryState.length})
              </button>

              <button
                onClick={() => setActiveFilter('iconic')}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                  activeFilter === 'iconic' 
                    ? 'bg-gradient-to-r from-amber-400 to-amber-200 text-black font-extrabold shadow-[0_0_25px_rgba(251,191,36,0.3)]' 
                    : 'text-amber-300/80 hover:text-amber-300 hover:bg-amber-500/10'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Most Iconic</span>
              </button>

              <button
                onClick={() => setActiveFilter('popular')}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                  activeFilter === 'popular' 
                    ? 'bg-rose-500 text-white font-bold shadow-[0_0_25px_rgba(244,63,94,0.35)]' 
                    : 'text-rose-300/80 hover:text-rose-300 hover:bg-rose-500/10'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Most Liked</span>
              </button>

              <button
                onClick={() => setActiveFilter('favorites')}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                  activeFilter === 'favorites' 
                    ? 'bg-amber-400 text-black font-bold shadow-[0_0_25px_rgba(251,191,36,0.3)]' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${activeFilter === 'favorites' ? 'fill-black' : ''}`} />
                <span>Favs ({totals.favs})</span>
              </button>
            </div>
          </div>
        </div>

        {/* MASONRY GALLERY LAYOUT */}
        {filteredImages.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-16 rounded-3xl bg-white/[0.02] border border-white/10 max-w-xl mx-auto text-center space-y-4">
            <Star className="w-10 h-10 text-[#EFE6D2]/50 mx-auto animate-bounce" />
            <h4 className="text-lg font-display uppercase tracking-widest text-white">No Bookmarked Frames Yet</h4>
            <p className="text-xs font-mono text-white/50 max-w-sm mx-auto leading-relaxed">
              Tap the golden star icon on any cinematic still to curate your customized studio favorites list.
            </p>
            <button onClick={() => setActiveFilter('all')} className="px-5 py-2.5 rounded-xl bg-[#EFE6D2] hover:bg-white text-black text-xs font-mono uppercase font-bold tracking-wider transition-colors cursor-pointer">
              Explore All Frames
            </button>
          </motion.div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 md:gap-8 space-y-6 md:space-y-8 max-w-[1700px] mx-auto">
            {filteredImages.map((img) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.5 }}
                onClick={() => openLightbox(img.index)}
                className="relative overflow-hidden rounded-2xl bg-black/80 border border-white/10 hover:border-white/30 transition-all duration-500 group cursor-pointer break-inside-avoid shadow-2xl"
              >
                {/* Media */}
                {img.type === 'video' ? (
                  <video 
                    src={img.src}
                    poster={img.poster}
                    className="w-full h-auto object-cover filter brightness-[0.88] group-hover:brightness-100 group-hover:scale-[1.04] transition-all duration-[1.5s] ease-out block"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : img.type === 'youtube' ? (
                  <div className="relative w-full h-auto">
                    <img 
                      src={img.poster || `https://img.youtube.com/vi/${img.videoId}/maxresdefault.jpg`}
                      alt={`${title} - Frame ${img.index + 1}`}
                      loading="lazy"
                      className="w-full h-auto object-cover filter brightness-[0.88] group-hover:brightness-100 group-hover:scale-[1.04] transition-all duration-[1.5s] ease-out block"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                       <div className="w-14 h-14 bg-rose-600/90 rounded-full flex items-center justify-center text-white backdrop-blur-md shadow-[0_0_30px_rgba(225,29,72,0.6)] border border-white/20">
                          <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                       </div>
                    </div>
                  </div>
                ) : (
                  <img 
                    src={img.src}
                    alt={`${title} - Frame ${img.index + 1}`}
                    loading="lazy"
                    className="w-full h-auto object-cover filter brightness-[0.88] group-hover:brightness-100 group-hover:scale-[1.04] transition-all duration-[1.5s] ease-out block"
                  />
                )}

                {/* Permanent & Hover Interactive Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/40 opacity-90 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-between p-4 sm:p-5 pointer-events-none">
                  
                  {/* Top Bar: Iconic Badge & Actions */}
                  <div className="flex items-start justify-between gap-2 pointer-events-auto">
                    <div>
                      {img.isIconic ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/90 to-amber-300 text-black text-[10px] font-mono font-extrabold uppercase tracking-wider shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                          <Sparkles className="w-3 h-3 text-black fill-black animate-pulse" />
                          MOST ICONIC
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white/70 text-[10px] font-mono tracking-widest uppercase">
                          <Film className="w-3 h-3 text-[#EFE6D2]" /> {img.tag}
                        </span>
                      )}
                    </div>

                    {/* Interactive Buttons (Like & Fav) */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleLike(e, img.index)}
                        className={`p-2.5 rounded-xl backdrop-blur-xl border transition-all duration-300 flex items-center gap-1.5 shadow-lg cursor-pointer ${
                          img.likedByUser
                            ? 'bg-rose-500/20 border-rose-500 text-rose-400 scale-105 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                            : 'bg-black/60 border-white/20 hover:border-rose-400 hover:text-rose-300 text-white/80'
                        }`}
                        title={img.likedByUser ? "Liked" : "Like this cinematic frame"}
                      >
                        <Heart className={`w-4 h-4 transition-transform duration-300 ${img.likedByUser ? 'fill-rose-400 scale-110' : ''}`} />
                        <span className="text-xs font-mono font-bold">{img.likes}</span>
                      </button>

                      <button
                        onClick={(e) => handleFavorite(e, img.index)}
                        className={`p-2.5 rounded-xl backdrop-blur-xl border transition-all duration-300 shadow-lg cursor-pointer ${
                          img.favoritedByUser
                            ? 'bg-amber-400/20 border-amber-400 text-amber-300 scale-105 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                            : 'bg-black/60 border-white/20 hover:border-amber-400 hover:text-amber-300 text-white/80'
                        }`}
                        title={img.favoritedByUser ? "Remove bookmark" : "Bookmark this frame"}
                      >
                        <Star className={`w-4 h-4 transition-transform duration-300 ${img.favoritedByUser ? 'fill-amber-400 scale-110' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Bottom Bar: Telemetry Stats & Maximize */}
                  <div className="flex items-end justify-between gap-2 pointer-events-auto pt-4 border-t border-white/10 opacity-80 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0">
                    <div className="flex items-center gap-2 text-xs font-mono text-white/80">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/15 text-[11px]">
                        <Eye className="w-3.5 h-3.5 text-[#EFE6D2]" />
                        <span>{img.views.toLocaleString()} views</span>
                      </span>
                    </div>

                    <div className="w-8 h-8 rounded-xl bg-[#EFE6D2] text-black flex items-center justify-center font-bold opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 shadow-lg">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>

                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* LIGHTBOX VAULT MODAL */}
      <AnimatePresence>
        {selectedImageIndex !== null && activeLightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4 md:p-8"
            onClick={closeLightbox}
          >
            {/* Top Bar inside Lightbox */}
            <div className="w-full max-w-7xl flex items-center justify-between gap-4 mb-4 text-white z-50 px-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3">
                {activeLightboxImage.isIconic ? (
                  <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-200 text-black font-mono font-extrabold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(251,191,36,0.4)]">
                    ✦ MOST ICONIC FRAME
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-white/10 text-[#EFE6D2] font-mono text-xs uppercase tracking-wider border border-white/15">
                    {activeLightboxImage.tag}
                  </span>
                )}
                <span className="text-xs font-mono text-white/50 hidden sm:inline">Frame {activeLightboxImage.index + 1} of {galleryState.length}</span>
              </div>

              <button 
                className="p-3.5 rounded-2xl bg-white/10 hover:bg-rose-500 hover:text-white border border-white/20 text-white transition-all duration-300 cursor-pointer shadow-lg"
                onClick={closeLightbox}
                title="Close Lightbox"
              >
                <X size={20} />
              </button>
            </div>

            {/* Main Lightbox Canvas */}
            <div className="relative flex-1 w-full max-w-6xl flex items-center justify-center overflow-hidden my-auto" onClick={(e) => e.stopPropagation()}>
              <button 
                className="absolute left-2 md:-left-4 p-4 rounded-2xl bg-white/10 hover:bg-[#EFE6D2] hover:text-black text-white border border-white/20 transition-all duration-300 z-50 cursor-pointer shadow-2xl"
                onClick={prevImage}
              >
                <ChevronLeft size={28} />
              </button>

              {activeLightboxImage.type === 'video' ? (
                <motion.video 
                  key={`vid-${selectedImageIndex}`}
                  src={activeLightboxImage.src}
                  poster={activeLightboxImage.poster}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-[0_0_70px_rgba(0,0,0,0.9)] border border-white/15"
                  autoPlay
                  controls
                  playsInline
                />
              ) : activeLightboxImage.type === 'youtube' ? (
                <motion.iframe
                  key={`yt-${selectedImageIndex}`}
                  src={`https://www.youtube.com/embed/${activeLightboxImage.videoId}?autoplay=1&rel=0`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="w-full max-w-5xl aspect-video rounded-2xl shadow-[0_0_70px_rgba(0,0,0,0.9)] border border-white/15 bg-black"
                />
              ) : (
                <motion.img 
                  key={`img-${selectedImageIndex}`}
                  src={activeLightboxImage.src}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-[0_0_70px_rgba(0,0,0,0.9)] border border-white/15"
                />
              )}

              <button 
                className="absolute right-2 md:-right-4 p-4 rounded-2xl bg-white/10 hover:bg-[#EFE6D2] hover:text-black text-white border border-white/20 transition-all duration-300 z-50 cursor-pointer shadow-2xl"
                onClick={nextImage}
              >
                <ChevronRight size={28} />
              </button>
            </div>

            {/* Bottom Interactive Action Console inside Lightbox */}
            <div className="w-full max-w-2xl mt-4 p-4 rounded-2xl bg-black/90 border border-white/20 backdrop-blur-xl shadow-2xl flex items-center justify-between gap-4 z-50 px-6" onClick={(e) => e.stopPropagation()}>
              
              <div className="flex items-center gap-2 font-mono text-xs text-white/80">
                <Eye className="w-4 h-4 text-[#EFE6D2]" />
                <span>{activeLightboxImage.views.toLocaleString()} active viewings</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => handleLike(e, activeLightboxImage.index)}
                  className={`px-4 py-2.5 rounded-xl border transition-all flex items-center gap-2 text-xs font-mono uppercase font-bold cursor-pointer ${
                    activeLightboxImage.likedByUser
                      ? 'bg-rose-500 text-white border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.4)]'
                      : 'bg-white/10 hover:bg-rose-500/20 text-white border-white/20 hover:border-rose-400'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${activeLightboxImage.likedByUser ? 'fill-white' : ''}`} />
                  <span>Like ({activeLightboxImage.likes})</span>
                </button>

                <button
                  onClick={(e) => handleFavorite(e, activeLightboxImage.index)}
                  className={`px-4 py-2.5 rounded-xl border transition-all flex items-center gap-2 text-xs font-mono uppercase font-bold cursor-pointer ${
                    activeLightboxImage.favoritedByUser
                      ? 'bg-amber-400 text-black border-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.4)]'
                      : 'bg-white/10 hover:bg-amber-400/20 text-white border-white/20 hover:border-amber-400'
                  }`}
                >
                  <Star className={`w-4 h-4 ${activeLightboxImage.favoritedByUser ? 'fill-black' : ''}`} />
                  <span>{activeLightboxImage.favoritedByUser ? 'Bookmarked' : 'Favorite'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
