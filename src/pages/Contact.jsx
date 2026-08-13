import { Helmet } from 'react-helmet-async';
import SEO from '../components/common/SEO';
import { useForm } from 'react-hook-form';
import { useCursor } from '../context/CursorContext';
import { useLanguage } from '../i18n';
import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import GsapButton from '../components/common/GsapButton';
import GsapScrollReveal from '../components/common/GsapScrollReveal';

import { contactSchema } from '../lib/validation.js';

// Custom Zod resolver to avoid needing @hookform/resolvers
const customZodResolver = async (data) => {
  const result = contactSchema.safeParse(data);
  if (result.success) {
    return { values: result.data, errors: {} };
  }
  return {
    values: {},
    errors: result.error.errors.reduce((acc, currentError) => {
      acc[currentError.path[0]] = {
        type: currentError.code,
        message: currentError.message,
      };
      return acc;
    }, {})
  };
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.5
    }
  }
};

const fadeUpVariant = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }
};

const socialLinks = [
  {
    platform: 'Instagram',
    url: 'https://www.instagram.com/thepraiseayodeji',
    handle: '@thepraiseayodeji',
    theme: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/70 group-hover:text-white transition-colors duration-500">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
      </svg>
    )
  },
  {
    platform: 'YouTube',
    url: 'https://www.youtube.com/@hsedigitals',
    handle: '@hsedigitals',
    theme: 'bg-[#FF0000]',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/70 group-hover:text-white transition-colors duration-500">
        <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
        <path d="m10 15 5-3-5-3z"/>
      </svg>
    )
  },
  {
    platform: 'WhatsApp',
    url: 'https://wa.me/917204042538?text=Hi%20Havilah!%20I%20would%20like%20to%20discuss%20a%20project%20with%20you.',
    handle: 'Chat with us',
    theme: 'bg-[#25D366]',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/70 group-hover:text-white transition-colors duration-500">
        <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.061-.3-.15-1.265-.462-2.406-1.474-.889-.788-1.488-1.761-1.663-2.062-.175-.3-.018-.461.131-.611.135-.133.3-.347.451-.52.146-.174.196-.3.296-.496.1-.197.05-.37-.025-.52-.075-.149-.672-1.62-.922-2.216-.24-.585-.49-.505-.67-.514-.175-.01-.376-.01-.575-.01-.2 0-.523.074-.798.371-.274.296-1.049 1.02-1.049 2.489 0 1.47 1.074 2.888 1.222 3.087.15.197 2.105 3.197 5.094 4.475.713.305 1.267.488 1.7.625.716.227 1.365.194 1.879.117.576-.085 1.767-.718 2.016-1.413.25-.694.25-1.288.175-1.412-.074-.124-.274-.197-.574-.347z"/>
        <path d="M12 21.996c-1.574 0-3.118-.4-4.472-1.157l-4.972 1.303 1.32-4.823A9.914 9.914 0 012.004 12C2.004 6.485 6.489 2 12 2s9.996 4.485 9.996 10-4.481 9.996-9.996 9.996z"/>
      </svg>
    )
  }
];

export default function Contact() {
  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: customZodResolver,
    mode: 'onTouched' // Validates on blur
  });
  const { updateCursor, resetCursor } = useCursor();
  const { t } = useLanguage();

  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [errorMessage, setErrorMessage] = useState('');
  const selectedService = watch('service');

  const successRef = useRef(null);

  const onSubmit = async (data) => {
    setErrorMessage('');
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error('Validation failed. Please check your inputs.');
        } else if (response.status === 429) {
          throw new Error('Too many requests. Please try again later.');
        } else {
          throw new Error('Unable to contact the server. Please try again later.');
        }
      }

      setSubmitStatus('success');
      reset(); // Clear the form

      // Scroll to success message
      setTimeout(() => {
        successRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);

    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error.message || 'An unexpected error occurred.');
    }
  };

  return (
    <div className="w-full min-h-screen bg-primary flex flex-col lg:flex-row">
      <SEO 
        title="Havilah | Contact" 
        description="Get in touch with Havilah Studio to discuss your next big project in Photography, Film, or Digital Media Strategy."
        path="/contact"
      />

      {/* Left: Video */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="w-full lg:w-1/2 h-[50vh] lg:h-screen relative overflow-hidden hidden md:block"
      >
        <video
          src="/videos/Srusti Pratik/Haldi Pratik Srusti.mp4"
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover filter grayscale"
        />
        <div className="absolute inset-0 bg-black/60 mix-blend-multiply" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
          <motion.h2 variants={fadeUpVariant} className="text-6xl lg:text-8xl font-display uppercase tracking-tighter mb-4">{t('contact.title') || "Let's Talk."}</motion.h2>
          <motion.p variants={fadeUpVariant} className="text-sm font-mono tracking-[0.2em] uppercase text-accent">{t('contact.subtitle') || "We are ready to build something unforgettable."}</motion.p>
        </div>
      </motion.div>

      {/* Right: Form */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="w-full lg:w-1/2 min-h-screen bg-white/5 backdrop-blur-md pt-32 pb-24 px-6 md:px-16 flex flex-col justify-center relative z-10 overflow-hidden"
      >
        <motion.h1 variants={fadeUpVariant} className="text-5xl font-display uppercase tracking-tighter mb-12 block md:hidden">{t('contact.title') || "Let's Talk."}</motion.h1>

        {submitStatus === 'success' ? (
          <motion.div variants={fadeUpVariant} ref={successRef} className="w-full max-w-xl mx-auto flex flex-col items-center gap-4 text-center pt-12 pb-32 relative">
            <div className="relative mb-16 w-full max-w-lg mx-auto flex items-center justify-center min-h-[300px]">
              {/* Light Ray from top */}
              <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-32 h-64 bg-accent/20 blur-[50px] mix-blend-screen pointer-events-none" />
              
              {/* Concentric Rings */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none"
              >
                <svg viewBox="0 0 200 200" className="w-64 h-64 text-accent">
                  <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 8" />
                  <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  <circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" strokeWidth="0.2" />
                </svg>
              </motion.div>

              {/* Floating Accents */}
              {/* Paper Airplane */}
              <motion.div
                initial={{ opacity: 0, x: -80, y: 80, scale: 0.5 }}
                animate={{ opacity: [0, 1, 0], x: [0, 120, 200], y: [0, -60, -120], scale: [0.8, 1, 1.2] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-12 right-12 lg:right-0 w-16 h-16 text-accent drop-shadow-[0_0_12px_rgba(255,215,0,0.6)]"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  {/* Left wing (shaded) */}
                  <polygon points="22,2 2,9 11,13" opacity="0.8" />
                  {/* Right wing */}
                  <polygon points="22,2 15,22 11,13" />
                  {/* Fold / shadow */}
                  <polygon points="11,13 15,22 13,16" opacity="0.6" fill="#A67B27" />
                </svg>
              </motion.div>

              {/* Paper Airplane Trail (Dashed Line) */}
              <motion.svg 
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: [0, 1, 1], opacity: [0, 0.5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-16 right-16 lg:right-4 w-40 h-40 text-accent pointer-events-none" 
                viewBox="0 0 100 100" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1" 
                strokeDasharray="4 4"
              >
                <path d="M10 90 Q 40 60 90 10" />
              </motion.svg>

              {/* Leaves / Vines Left */}
              <motion.div
                initial={{ opacity: 0, rotate: 15, originX: 0, originY: 1 }}
                animate={{ opacity: 0.8, rotate: [15, -5, 15] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-4 left-4 lg:-left-8 w-24 h-24 text-accent drop-shadow-[0_0_10px_rgba(255,215,0,0.2)]"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22C12 12 4 10 2 2"></path>
                  <path d="M12 16c-3-1-5-4-5-6 2-1 5 1 5 6z"></path>
                  <path d="M8 8c-3-1-5-4-5-6 2-1 5 1 5 6z"></path>
                </svg>
              </motion.div>

              {/* Leaves / Vines Right */}
              <motion.div
                initial={{ opacity: 0, rotate: -15, originX: 1, originY: 1 }}
                animate={{ opacity: 0.8, rotate: [-15, 5, -15] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-8 right-4 lg:-right-4 w-24 h-24 text-accent drop-shadow-[0_0_10px_rgba(255,215,0,0.2)]"
                style={{ transform: "scaleX(-1)" }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22C12 12 4 10 2 2"></path>
                  <path d="M12 16c-3-1-5-4-5-6 2-1 5 1 5 6z"></path>
                  <path d="M8 8c-3-1-5-4-5-6 2-1 5 1 5 6z"></path>
                </svg>
              </motion.div>

              {/* Sparkles */}
              {[...Array(12)].map((_, i) => (
                <motion.svg
                  key={i}
                  initial={{ scale: 0, opacity: 0, rotate: 0 }}
                  animate={{ 
                    scale: [0, 1.5, 0], 
                    opacity: [0, 1, 0],
                    rotate: 180,
                    y: [0, -30]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3, ease: 'easeOut' }}
                  style={{
                    position: 'absolute',
                    top: `${10 + Math.random() * 80}%`,
                    left: `${5 + Math.random() * 90}%`,
                  }}
                  className="w-5 h-5 text-accent pointer-events-none drop-shadow-[0_0_8px_rgba(255,215,0,1)]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0l2.5 9.5L24 12l-9.5 2.5L12 24l-2.5-9.5L0 12l9.5-2.5z" />
                </motion.svg>
              ))}

              {/* Central Glowing Envelope */}
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                className="relative z-10 w-36 h-36 rounded-full border border-accent/40 flex items-center justify-center bg-primary/60 backdrop-blur-md drop-shadow-[0_0_20px_rgba(255,215,0,0.3)]"
              >
                <svg 
                  className="w-20 h-20 text-accent drop-shadow-[0_0_12px_rgba(255,215,0,0.6)] overflow-visible" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5"
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  {/* Paper sticking out (Animated) */}
                  <motion.path 
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.8, type: 'spring' }}
                    d="M6 7v-3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v3" 
                  />
                  {/* Checkmark inside paper (Animated) */}
                  <motion.path 
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1.4 }}
                    d="M9 4l2 2 4-4" 
                  />
                  
                  {/* Envelope Body (Animated Drawing) */}
                  <motion.path 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: 'easeInOut' }}
                    d="M4 7h16v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" 
                  />
                  <motion.path 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: 'easeInOut' }}
                    d="M4 7l8 6 8-6" 
                  />
                </svg>
                
                {/* Inner glowing ring */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.1, opacity: [0, 0.5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeOut', delay: 1 }}
                  className="absolute inset-0 rounded-full border border-accent/60 pointer-events-none"
                />
              </motion.div>
            </div>

            <motion.h3 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-4xl md:text-5xl font-display uppercase tracking-tight mb-2 text-accent drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]"
            >
              Message Sent!
            </motion.h3>
            <p className="text-lg text-white/70 mb-1">Thank you for reaching out.</p>
            <p className="text-lg text-white/70 mb-4">We'll get back to you shortly.</p>
            <svg className="w-4 h-4 text-accent/50 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>

            <button
              onClick={() => setSubmitStatus(null)}
              className="px-8 py-3 border border-white/20 rounded-full font-mono text-sm tracking-widest uppercase hover:bg-white/5 transition-colors cursor-none w-max mx-auto"
              onMouseEnter={() => updateCursor({ active: true })}
              onMouseLeave={resetCursor}
            >
              Send Another
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off" className="w-full max-w-xl mx-auto flex flex-col gap-8">
            {submitStatus === 'error' && (
              <motion.div variants={fadeUpVariant} className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg text-sm">
                {errorMessage}
              </motion.div>
            )}

            {/* Honeypot Field */}
            <input type="text" {...register('company')} autoComplete="off" style={{ display: 'none' }} tabIndex="-1" />

            <motion.div variants={fadeUpVariant} className="flex flex-col gap-2 w-full">
              <label className="text-xs font-mono tracking-widest uppercase text-white/70 ml-1">{t('contact.nameLabel')} *</label>
              <input {...register('name')} autoComplete="off" className={`w-full bg-white/5 border ${errors.name ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-accent/50'} rounded-xl px-4 py-3 outline-none transition-all duration-300 font-sans text-base cursor-none focus:bg-white/10`} disabled={isSubmitting} onMouseEnter={() => updateCursor({ active: true })} onMouseLeave={resetCursor} />
              {errors.name && <span className="text-[10px] font-mono text-red-400 ml-1 mt-1">{errors.name.message}</span>}
            </motion.div>

            <div className="flex flex-col md:flex-row gap-8">
              <motion.div variants={fadeUpVariant} className="flex flex-col gap-2 w-full">
                <label className="text-xs font-mono tracking-widest uppercase text-white/70 ml-1">{t('contact.emailLabel')} *</label>
                <input type="email" {...register('email')} autoComplete="off" className={`w-full bg-white/5 border ${errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-accent/50'} rounded-xl px-4 py-3 outline-none transition-all duration-300 font-sans text-base cursor-none focus:bg-white/10`} disabled={isSubmitting} onMouseEnter={() => updateCursor({ active: true })} onMouseLeave={resetCursor} />
                {errors.email && <span className="text-[10px] font-mono text-red-400 ml-1 mt-1">{errors.email.message}</span>}
              </motion.div>
              <motion.div variants={fadeUpVariant} className="flex flex-col gap-2 w-full">
                <label className="text-xs font-mono tracking-widest uppercase text-white/70 ml-1">{t('contact.phoneLabel')} *</label>
                <input type="tel" {...register('phone')} onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9+\-().\s]/g, ''); }} autoComplete="off" className={`w-full bg-white/5 border ${errors.phone ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-accent/50'} rounded-xl px-4 py-3 outline-none transition-all duration-300 font-sans text-base cursor-none focus:bg-white/10`} disabled={isSubmitting} onMouseEnter={() => updateCursor({ active: true })} onMouseLeave={resetCursor} />
                {errors.phone && <span className="text-[10px] font-mono text-red-400 ml-1 mt-1">{errors.phone.message}</span>}
              </motion.div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 w-full">
              <motion.div variants={fadeUpVariant} className="flex flex-col gap-2 flex-1 relative">
                <label className="text-xs font-mono tracking-widest uppercase text-white/70 ml-1">{t('contact.serviceLabel')}</label>
                <div className="relative w-full">
                  <select
                    {...register('service')}
                    className="w-full bg-white/5 border border-white/10 focus:border-accent/50 rounded-xl px-4 py-3 outline-none transition-all duration-300 font-sans text-base cursor-none focus:bg-white/10 text-white/90 appearance-none"
                    disabled={isSubmitting}
                    onMouseEnter={() => updateCursor({ active: true })}
                    onMouseLeave={resetCursor}
                  >
                    <option value="Photography" className="bg-[#0C1220] text-[#F8F5F0] py-2">Photography</option>
                    <option value="Film Production" className="bg-[#0C1220] text-[#F8F5F0] py-2">Film Production</option>                    
                    <option value="Social Media Marketing" className="bg-[#0C1220] text-[#F8F5F0] py-2">Social Media Marketing</option>
                    <option value="Event Videography" className="bg-[#0C1220] text-[#F8F5F0] py-2">Event Videography</option>                   
                    <option value="Live Broadcast" className="bg-[#0C1220] text-[#F8F5F0] py-2">Live Broadcast</option>
                    <option value=" Web Design and Development" className="bg-[#0C1220] text-[#F8F5F0] py-2"> Web Design and Development</option>                
                    <option value="Other" className="bg-[#0C1220] text-[#F8F5F0] py-2">Other</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-accent/70">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </motion.div>

              {selectedService === 'Film Production' && (
                <motion.div variants={fadeUpVariant} className="flex flex-col gap-2 flex-1">
                  <label className="text-xs font-mono tracking-widest uppercase text-white/70 ml-1">Filmmaking Category *</label>
                  <div className="relative">
                    <select
                      {...register('subService')}
                      className={`w-full bg-white/5 border ${errors.subService ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-accent/50'} rounded-xl px-4 py-3 outline-none transition-all duration-300 font-sans text-base appearance-none cursor-none focus:bg-white/10`}
                      disabled={isSubmitting}
                      onMouseEnter={() => updateCursor({ active: true })}
                      onMouseLeave={resetCursor}
                    >
                      <option value="" className="bg-[#0C1220] text-[#F8F5F0] py-2">Select Category...</option>
                      <option value="REAL ESTATE" className="bg-[#0C1220] text-[#F8F5F0] py-2">REAL ESTATE</option>
                      <option value="EDUCATION" className="bg-[#0C1220] text-[#F8F5F0] py-2">EDUCATION</option>
                      <option value="CORPORATE" className="bg-[#0C1220] text-[#F8F5F0] py-2">CORPORATE</option>
                      <option value="WEDDINGS" className="bg-[#0C1220] text-[#F8F5F0] py-2">WEDDINGS</option>
                      <option value="DOCUMENTARY" className="bg-[#0C1220] text-[#F8F5F0] py-2">DOCUMENTARY</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-accent/70">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {errors.subService && <span className="text-[10px] font-mono text-red-400 ml-1 mt-1">{errors.subService.message}</span>}
                </motion.div>
              )}
            </div>

            <motion.div variants={fadeUpVariant} className="flex flex-col gap-2 w-full">
              <label className="text-xs font-mono tracking-widest uppercase text-white/70 ml-1">{t('contact.messageLabel')} *</label>
              <textarea {...register('message')} rows="4" className={`w-full bg-white/5 border ${errors.message ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-accent/50'} rounded-xl px-4 py-3 outline-none transition-all duration-300 font-sans text-base resize-none cursor-none focus:bg-white/10`} disabled={isSubmitting} onMouseEnter={() => updateCursor({ active: true })} onMouseLeave={resetCursor}></textarea>
              {errors.message && <span className="text-[10px] font-mono text-red-400 ml-1 mt-1">{errors.message.message}</span>}
            </motion.div>

            <div className="mt-8" onMouseEnter={() => !isSubmitting && updateCursor({ active: true })} onMouseLeave={resetCursor}>
              <GsapButton variant="primary" strength={50} onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="px-14 py-5 text-sm font-semibold tracking-widest w-full sm:w-max justify-center">
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-[#080808] inline mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    {t('contact.submitting') || "Sending..."}
                  </>
                ) : (t('contact.submitButton') || 'Submit Inquiry') + ' →'}
              </GsapButton>
            </div>
          </form>
        )}

        <motion.div variants={fadeUpVariant} className="mt-24 flex flex-col sm:flex-row justify-between items-start gap-16 sm:gap-8 w-full max-w-xl mx-auto border-t border-white/10 pt-12">
          <div className="w-full sm:w-auto">
            <p className="text-xs font-mono tracking-widest uppercase text-white/50 mb-4">Location</p>
            <p className="font-sans text-lg text-white/80 leading-relaxed">Havilah,<br />Kothanur, Bangalore<br />560077, India </p>
          </div>
          
          <div className="grid grid-cols-1 gap-4 w-full sm:w-[320px]">
            <p className="text-xs font-mono tracking-widest uppercase text-white/50 mb-2 sm:text-right hidden sm:block">Socials</p>
            {socialLinks.map((social) => (
              <a 
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className="group relative flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/5 overflow-hidden cursor-none transition-all duration-500 hover:-translate-y-1"
                onMouseEnter={() => updateCursor({ active: true, text: 'VISIT' })} 
                onMouseLeave={resetCursor}
              >
                {/* Hover Background Layer */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${social.theme} z-0`}></div>
                
                {/* Icon Container */}
                <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-xl bg-primary border border-white/5 group-hover:bg-black/20 group-hover:border-transparent transition-all duration-500 shrink-0">
                  {social.icon}
                </div>

                {/* Text Content */}
                <div className="relative z-10 flex flex-col items-start flex-1">
                  <span className="text-lg font-heading uppercase tracking-wide text-white/90 group-hover:text-white transition-colors duration-500">
                    {social.platform}
                  </span>
                  <span className="text-xs font-mono text-white/50 group-hover:text-white/90 transition-colors duration-500">
                    {social.handle}
                  </span>
                </div>

                {/* Arrow */}
                <div className="relative z-10 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 group-hover:bg-white/20 transition-all duration-500 overflow-hidden shrink-0">
                  <svg className="w-3.5 h-3.5 text-white/50 transform group-hover:translate-x-8 group-hover:-translate-y-8 transition-transform duration-500 absolute" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17L17 7M17 7H7M17 7v10"></path></svg>
                  <svg className="w-3.5 h-3.5 text-white transform -translate-x-8 translate-y-8 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500 absolute" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17L17 7M17 7H7M17 7v10"></path></svg>
                </div>
              </a>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
