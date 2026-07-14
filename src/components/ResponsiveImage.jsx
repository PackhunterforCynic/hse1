import React, { useState } from 'react';

/**
 * ResponsiveImage Component
 * Automatically generates a `<picture>` element with AVIF and WebP sources.
 *
 * @param {string} src - The base path of the image (e.g. "/images/hero/waffle.jpg" or "/images/hero/waffle.webp")
 * @param {string} alt - Alt text for the image
 * @param {string} className - Additional CSS classes
 * @param {boolean} priority - If true, image will load eagerly with high fetch priority
 * @param {string} sizes - Optional sizes attribute. Defaults to "100vw"
 */
export const ResponsiveImage = ({ 
  src, 
  alt = '', 
  className = '', 
  priority = false,
  sizes = '100vw',
  ...props 
}) => {
  const [error, setError] = useState(false);

  // If the image fails to load, show a fallback
  if (error) {
    return (
      <img
        src="/images/fallback.svg"
        alt="Fallback image"
        className={`object-cover ${className}`}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'low'}
        decoding={priority ? 'sync' : 'async'}
        {...props}
      />
    );
  }

  // Derive the base path by stripping any known extension
  const basePath = src.replace(/\.(jpg|jpeg|png|webp)$/i, '');
  
  // Define generated widths (must match CONFIG in optimize-images.js)
  const widths = [400, 800, 1200, 1600];

  const generateSrcSet = (format) => {
    return widths.map(w => `${basePath}-${w}.${format} ${w}w`).join(', ');
  };

  const isExternal = src.startsWith('http') || src.startsWith('data:') || src.startsWith('blob:');

  if (isExternal) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'low'}
        decoding={priority ? 'sync' : 'async'}
        onError={() => setError(true)}
        {...props}
      />
    );
  }

  return (
    <picture>
      <source
        type="image/avif"
        srcSet={generateSrcSet('avif')}
        sizes={sizes}
      />
      <source
        type="image/webp"
        srcSet={generateSrcSet('webp')}
        sizes={sizes}
      />
      <img
        src={src}
        alt={alt}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'low'}
        decoding={priority ? 'sync' : 'async'}
        onError={() => setError(true)}
        {...props}
      />
    </picture>
  );
};

export default ResponsiveImage;
