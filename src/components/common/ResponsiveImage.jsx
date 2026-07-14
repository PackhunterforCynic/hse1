import { useState } from 'react';
import imageManifest from '../../data/imageManifest.json';

export default function ResponsiveImage({ 
  src, 
  alt = "", 
  className = "", 
  draggable = true, 
  priority = false 
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Lookup metadata using the src as the key (e.g. "/images/hero.jpg")
  const meta = imageManifest[src];

  // If no metadata exists (e.g., an external URL, or script hasn't run yet), 
  // gracefully fallback to a standard img tag.
  if (!meta) {
    return (
      <img 
        src={src} 
        alt={alt}
        className={className}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "low"}
        decoding="async"
        draggable={draggable}
      />
    );
  }

  // Construct the srcset string using the exact widths that were successfully generated
  // CRITICAL: We must encodeURI to prevent spaces in folder names (like 'srusti pratik') from breaking the srcset parser.
  const webpSrcSet = meta.widths.map(w => `${encodeURI(meta.dir)}/${encodeURI(meta.baseName)}-${w}.webp ${w}w`).join(', ');
  
  // Use progressive JPEG fallback
  const fallbackSrc = `${encodeURI(meta.dir)}/${encodeURI(meta.baseName)}-fallback.jpg`;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Tiny Blur Placeholder (Only visible until main image loads) */}
      {!isLoaded && meta.placeholder && (
        <img 
          src={meta.placeholder} 
          alt="" 
          className={`absolute inset-0 w-full h-full filter blur-md scale-105 ${className.includes('object-contain') ? 'object-contain' : 'object-cover'}`}
          aria-hidden="true"
        />
      )}

      {/* Production Multi-Format Picture Element */}
      <picture>
        {webpSrcSet && (
          <source 
            type="image/webp" 
            srcSet={webpSrcSet} 
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
        )}
        <img 
          src={fallbackSrc} 
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "low"}
          decoding="async"
          draggable={draggable}
          onLoad={() => setIsLoaded(true)}
          className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        />
      </picture>
    </div>
  );
}
