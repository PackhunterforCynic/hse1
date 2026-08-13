import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import SEO from '../components/common/SEO';

export default function NotFound() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Redirect after 5 seconds
    const redirectTimer = setTimeout(() => {
      navigate('/');
    }, 5000);

    // Update countdown every second
    const intervalTimer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearTimeout(redirectTimer);
      clearInterval(intervalTimer);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <SEO title="404 Not Found | Havilah" path="/404" />
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(300px,50vw,600px)] aspect-square bg-[#D4AF37]/5 rounded-full blur-[60px] sm:blur-[120px] pointer-events-none" />

      <div className="max-w-xl w-full flex flex-col items-center text-center relative z-10">
        <img 
          src="/images/fallback.svg" 
          alt="404 Not Found" 
          className="w-48 h-48 md:w-64 md:h-64 mb-8 opacity-80 animate-pulse"
        />
        
        <h1 className="text-4xl md:text-5xl font-light font-serif italic text-white mb-4">
          Lost in the void.
        </h1>
        
        <p className="text-white/50 font-sans text-lg mb-2">
          The page you are looking for does not exist or has been moved.
        </p>
        
        <p className="text-[#D4AF37] font-mono text-xs uppercase tracking-widest mb-12">
          Redirecting to home in {countdown}s...
        </p>

        <Link 
          to="/" 
          className="px-8 py-3 border border-white/20 hover:border-[#D4AF37] text-white hover:text-[#D4AF37] font-mono text-xs uppercase tracking-widest rounded-full transition-all"
        >
          Return Home Now
        </Link>
      </div>
    </div>
  );
}
