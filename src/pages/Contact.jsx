import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useCursor } from '../context/CursorContext';
import { motion } from 'framer-motion';
import { useState, useRef } from 'react';

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

export default function Contact() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: customZodResolver,
    mode: 'onTouched' // Validates on blur
  });
  const { updateCursor, resetCursor } = useCursor();
  
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [errorMessage, setErrorMessage] = useState('');

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
    <div className="w-full min-h-screen bg-bg flex flex-col lg:flex-row">
      <Helmet>
        <title>Havilah | Contact</title>
      </Helmet>

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
          <motion.h2 variants={fadeUpVariant} className="text-6xl lg:text-8xl font-display uppercase tracking-tighter mb-4">Let's Talk.</motion.h2>
          <motion.p variants={fadeUpVariant} className="text-sm font-mono tracking-[0.2em] uppercase text-accent">We are ready to build something unforgettable.</motion.p>
        </div>
      </motion.div>

      {/* Right: Form */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="w-full lg:w-1/2 min-h-screen bg-surface pt-32 pb-24 px-6 md:px-16 flex flex-col justify-center relative z-10"
      >
        <motion.h1 variants={fadeUpVariant} className="text-5xl font-display uppercase tracking-tighter mb-12 block md:hidden">Let's Talk.</motion.h1>
        
        {submitStatus === 'success' ? (
          <motion.div variants={fadeUpVariant} ref={successRef} className="w-full max-w-xl mx-auto flex flex-col gap-4 text-center py-12">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h3 className="text-3xl font-display uppercase tracking-tighter">Thank you!</h3>
            <p className="text-lg text-text/70">We've received your enquiry.</p>
            <p className="text-lg text-text/70">Our team will contact you shortly.</p>
            <button 
              onClick={() => setSubmitStatus(null)}
              className="mt-8 px-8 py-3 border border-white/20 rounded-full font-mono text-sm tracking-widest uppercase md:hover:bg-white/5 transition-colors cursor-none w-max mx-auto"
              onMouseEnter={() => updateCursor({ active: true })} 
              onMouseLeave={resetCursor}
            >
              Send Another
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-xl mx-auto flex flex-col gap-8">
            {submitStatus === 'error' && (
              <motion.div variants={fadeUpVariant} className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg text-sm">
                {errorMessage}
              </motion.div>
            )}

            {/* Honeypot Field */}
            <input type="text" {...register('company')} autoComplete="off" style={{ display: 'none' }} tabIndex="-1" />

            <motion.div variants={fadeUpVariant} className="flex flex-col gap-2 w-full">
              <label className="text-xs font-mono tracking-widest uppercase text-text/70 ml-1">Name *</label>
              <input {...register('name')} className={`w-full bg-white/5 border ${errors.name ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-accent/50'} rounded-xl px-4 py-3 outline-none transition-all duration-300 font-sans text-base cursor-none focus:bg-white/10`} disabled={isSubmitting} onMouseEnter={() => updateCursor({ active: true })} onMouseLeave={resetCursor} />
              {errors.name && <span className="text-[10px] font-mono text-red-400 ml-1 mt-1">{errors.name.message}</span>}
            </motion.div>
            
            <div className="flex flex-col md:flex-row gap-8">
              <motion.div variants={fadeUpVariant} className="flex flex-col gap-2 w-full">
                <label className="text-xs font-mono tracking-widest uppercase text-text/70 ml-1">Email *</label>
                <input type="email" {...register('email')} className={`w-full bg-white/5 border ${errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-accent/50'} rounded-xl px-4 py-3 outline-none transition-all duration-300 font-sans text-base cursor-none focus:bg-white/10`} disabled={isSubmitting} onMouseEnter={() => updateCursor({ active: true })} onMouseLeave={resetCursor} />
                {errors.email && <span className="text-[10px] font-mono text-red-400 ml-1 mt-1">{errors.email.message}</span>}
              </motion.div>
              <motion.div variants={fadeUpVariant} className="flex flex-col gap-2 w-full">
                <label className="text-xs font-mono tracking-widest uppercase text-text/70 ml-1">Phone *</label>
                <input type="tel" {...register('phone')} className={`w-full bg-white/5 border ${errors.phone ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-accent/50'} rounded-xl px-4 py-3 outline-none transition-all duration-300 font-sans text-base cursor-none focus:bg-white/10`} disabled={isSubmitting} onMouseEnter={() => updateCursor({ active: true })} onMouseLeave={resetCursor} />
                {errors.phone && <span className="text-[10px] font-mono text-red-400 ml-1 mt-1">{errors.phone.message}</span>}
              </motion.div>
            </div>

           <motion.div variants={fadeUpVariant} className="flex flex-col gap-2 w-full">
              <label className="text-xs font-mono tracking-widest uppercase text-text/70 ml-1">Service</label>
              <select
                {...register('service')}
                className="w-full bg-white/5 border border-white/10 focus:border-accent/50 rounded-xl px-4 py-3 outline-none transition-all duration-300 font-sans text-base cursor-none focus:bg-white/10 text-white/90 appearance-none"
                disabled={isSubmitting}
                onMouseEnter={() => updateCursor({ active: true })}
                onMouseLeave={resetCursor}
              >
                <option className="bg-surface text-white">Film Production</option>
                <option className="bg-surface text-white">Brand Identity</option>
                <option className="bg-surface text-white">Social Media Marketing</option>
                <option className="bg-surface text-white">Event Videography</option>
                <option className="bg-surface text-white">Photography</option>
                <option className="bg-surface text-white">Cinematography</option>
                <option className="bg-surface text-white">Live Broadcast</option>
                <option className="bg-surface text-white">Podcast Setup</option>
                <option className="bg-surface text-white">Wedding Planning</option>
                <option className="bg-surface text-white">Corporate Services</option>
                <option className="bg-surface text-white">IT Firm Solutions</option>
                <option className="bg-surface text-white">Creative Direction</option>
                <option className="bg-surface text-white">Other</option>
              </select>
            </motion.div>

            <motion.div variants={fadeUpVariant} className="flex flex-col gap-2 w-full">
              <label className="text-xs font-mono tracking-widest uppercase text-text/70 ml-1">Message *</label>
              <textarea {...register('message')} rows="4" className={`w-full bg-white/5 border ${errors.message ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-accent/50'} rounded-xl px-4 py-3 outline-none transition-all duration-300 font-sans text-base resize-none cursor-none focus:bg-white/10`} disabled={isSubmitting} onMouseEnter={() => updateCursor({ active: true })} onMouseLeave={resetCursor}></textarea>
              {errors.message && <span className="text-[10px] font-mono text-red-400 ml-1 mt-1">{errors.message.message}</span>}
            </motion.div>

            <motion.button variants={fadeUpVariant} type="submit" disabled={isSubmitting} className="mt-10 px-12 py-5 bg-text text-bg rounded-full font-mono tracking-widest uppercase text-sm font-medium md:hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-500 cursor-none w-max flex items-center gap-3" onMouseEnter={() => !isSubmitting && updateCursor({ active: true })} onMouseLeave={resetCursor}>
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-bg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Sending...
                </>
              ) : 'Submit Inquiry'}
            </motion.button>
          </form>
        )}

        <motion.div variants={fadeUpVariant} className="mt-24 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-8 w-full max-w-xl mx-auto border-t border-white/10 pt-8">
          <div>
            <p className="text-xs font-mono tracking-widest uppercase text-text/50 mb-2">Location</p>
            <p className="font-sans text-lg">Havilah,<br/>Kothanur, Bangalore 560077, India </p>
          </div>
          <div className="flex flex-wrap gap-6 mt-4 sm:mt-0">
            <a href="#" className="text-sm font-mono tracking-widest uppercase text-text/50 md:hover:text-accent transition-colors cursor-none" onMouseEnter={() => updateCursor({ active: true })} onMouseLeave={resetCursor}>Instagram</a>
            <a href="#" className="text-sm font-mono tracking-widest uppercase text-text/50 md:hover:text-accent transition-colors cursor-none" onMouseEnter={() => updateCursor({ active: true })} onMouseLeave={resetCursor}>LinkedIn</a>
            <a href="#" className="text-sm font-mono tracking-widest uppercase text-text/50 md:hover:text-accent transition-colors cursor-none" onMouseEnter={() => updateCursor({ active: true })} onMouseLeave={resetCursor}>YouTube</a>
            <a href="#" className="text-sm font-mono tracking-widest uppercase text-text/50 md:hover:text-accent transition-colors cursor-none" onMouseEnter={() => updateCursor({ active: true })} onMouseLeave={resetCursor}>WhatsApp</a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
