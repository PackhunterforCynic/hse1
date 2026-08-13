import { useRef, useState, useEffect } from 'react';

export default function GalleryVideoItem({ item, originalIdx, openLightbox, nextItem, isActive, nextItemData }) {
  const videoRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [showUpNext, setShowUpNext] = useState(false);

  useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    } else if (!isActive && videoRef.current) {
      videoRef.current.pause();
      setShowUpNext(false);
      setProgress(0);
    }
  }, [isActive]);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const { currentTime, duration } = videoRef.current;
    setProgress((currentTime / duration) * 100);
    
    if (duration > 0 && duration - currentTime <= 3) {
      setShowUpNext(true);
    } else {
      setShowUpNext(false);
    }
  };

  const handleEnded = () => {
    if (nextItem) nextItem();
  };

  return (
    <>
      <video 
        ref={videoRef}
        src={item.url} 
        muted 
        playsInline 
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        className={`w-full h-full object-cover filter transition-all duration-700 md:group-hover:scale-105 pointer-events-none ${isActive ? 'grayscale-0' : 'grayscale-0 md:grayscale md:group-hover:grayscale-0'}`}
      />
      {isActive && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-20">
          <div className="h-full bg-accent transition-all duration-300 ease-linear" style={{ width: `${progress}%` }} />
        </div>
      )}
      {showUpNext && nextItemData && (
        <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 bg-black/80 backdrop-blur-md p-2 rounded-lg border border-white/10 flex items-center gap-3 shadow-2xl z-30 pointer-events-none transition-all duration-500 opacity-100">
          <div className="w-16 h-10 md:w-20 md:h-12 rounded overflow-hidden">
            {nextItemData.type === 'video' ? (
              <video src={nextItemData.url} className="w-full h-full object-cover" />
            ) : (
              <img src={nextItemData.url} className="w-full h-full object-cover" />
            )}
          </div>
          <div className="pr-2">
            <p className="text-[10px] md:text-xs text-white/50 uppercase tracking-wider font-mono">Up Next</p>
          </div>
        </div>
      )}
    </>
  );
}
