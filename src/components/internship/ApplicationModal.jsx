import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import StepPersonal from './StepPersonal';
import StepEducation from './StepEducation';
import StepPortfolio from './StepPortfolio';
import StepSkills from './StepSkills';
import StepReview from './StepReview';
import SuccessAnimation from './SuccessAnimation';
import GsapButton from '../common/GsapButton';

const STEPS = [
  { id: 'personal', title: 'Personal', component: StepPersonal },
  { id: 'education', title: 'Education', component: StepEducation },
  { id: 'portfolio', title: 'Portfolio', component: StepPortfolio },
  { id: 'skills', title: 'Skills', component: StepSkills },
  { id: 'review', title: 'Review', component: StepReview }
];

export default function ApplicationModal({ isOpen, onClose, selectedRole }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    institution: '',
    fieldOfStudy: '',
    graduationYear: '',
    portfolioLink: '',
    linkedinUrl: '',
    skills: [],
    whyHavilah: '',
    role: selectedRole || ''
  });

  const [files, setFiles] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (selectedRole) {
        setFormData(prev => ({ ...prev, role: selectedRole }));
      }
    } else {
      document.body.style.overflow = 'auto';
      // Reset after close animation
      setTimeout(() => {
        setCurrentStep(0);
        setIsSuccess(false);
        setErrors({});
      }, 500);
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen, selectedRole]);

  const updateFormData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
    setErrors({});
  };

  const updateFiles = (newFiles) => {
    setFiles(prev => ({ ...prev, ...newFiles }));
    setErrors({});
  };

  const validateStep = (stepIndex) => {
    const newErrors = {};
    if (stepIndex === 0) {
      if (!formData.name.trim()) newErrors.name = "Name is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Invalid email format";
      if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    }
    if (stepIndex === 1) {
      if (!formData.institution || !formData.institution.trim()) newErrors.institution = "Institution is required";
      if (!formData.fieldOfStudy || !formData.fieldOfStudy.trim()) newErrors.fieldOfStudy = "Field of Study is required";
    }
    if (stepIndex === 2) {
      // Portfolio URL is optional now as per schema
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    setErrors({});
  };

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve({ name: file.name, content: reader.result });
    reader.onerror = error => reject(error);
  });

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      let resumeData = null;
      let portfolioData = null;
      
      if (files.resume) {
        resumeData = await fileToBase64(files.resume);
      }
      if (files.portfolio) {
        portfolioData = await fileToBase64(files.portfolio);
      }

      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        institution: formData.institution || 'Not Specified',
        fieldOfStudy: formData.fieldOfStudy || 'Not Specified',
        role: formData.role || 'General',
        skills: Array.isArray(formData.skills) && formData.skills.length > 0 ? formData.skills.join(', ') : (formData.skills || 'Not Specified'),
        portfolioLink: formData.portfolioLink || '',
        company: '', // honeypot
        resume: resumeData,
        portfolio: portfolioData
      };

      const response = await fetch('/api/internship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      
      if (!response.ok) {
        if (result.details && result.details._errors) {
          throw new Error(result.details._errors.join(', '));
        } else if (result.details) {
          // Flatten zod errors
          const errorMsgs = [];
          for (const key in result.details) {
            if (result.details[key]._errors) {
              errorMsgs.push(`${key}: ${result.details[key]._errors.join(', ')}`);
            }
          }
          throw new Error(errorMsgs.length > 0 ? errorMsgs.join(' | ') : 'Validation Error');
        }
        throw new Error(result.error || 'Failed to submit application');
      }

      setIsSuccess(true);
    } catch (error) {
      console.error('Submission error:', error);
      setErrors({ submit: error.message || 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const CurrentComponent = STEPS[currentStep].component;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 overflow-y-auto overscroll-contain">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-3xl bg-[#0a0a0a] border border-white/10 rounded-2xl md:rounded-[2rem] shadow-2xl flex flex-col my-auto z-10"
          >
            {/* Close Button */}
            {!isSuccess && (
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 md:top-6 md:right-6 p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/70 hover:text-white transition-colors z-20"
              >
                <X size={20} />
              </button>
            )}

            {isSuccess ? (
              <SuccessAnimation onClose={onClose} />
            ) : (
              <div className="flex flex-col h-full overflow-hidden rounded-2xl md:rounded-[2rem]">
                {/* Header & Progress */}
                <div className="p-6 md:p-10 pb-6 border-b border-white/5 shrink-0">
                  <div className="flex items-center gap-2 mb-6">
                    {STEPS.map((step, idx) => (
                      <div key={step.id} className="flex-1 flex flex-col gap-2">
                        <div className={`h-1 rounded-full transition-colors duration-500 ${idx <= currentStep ? 'bg-[#D4AF37]' : 'bg-white/10'}`} />
                        <span className={`text-[10px] uppercase font-mono tracking-wider transition-colors duration-500 hidden md:block ${idx <= currentStep ? 'text-[#D4AF37]' : 'text-white/30'}`}>
                          {step.title}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {selectedRole && currentStep === 0 && (
                    <div className="inline-block px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-mono tracking-widest uppercase rounded-full mb-4">
                      Applying for: {selectedRole}
                    </div>
                  )}
                </div>

                {/* Form Content */}
                <div className="p-6 md:p-10 overflow-y-auto custom-scrollbar flex-grow">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CurrentComponent 
                        formData={formData} 
                        updateFormData={updateFormData} 
                        files={files}
                        updateFiles={updateFiles}
                        errors={errors} 
                      />
                      {errors.submit && (
                        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-sm font-sans text-center">
                          {errors.submit}
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Footer Controls */}
                <div className="p-6 md:p-10 pt-6 border-t border-white/5 bg-[#050505] flex items-center justify-between shrink-0">
                  <button 
                    onClick={handleBack}
                    className={`text-xs font-mono tracking-widest uppercase text-white/50 hover:text-white transition-colors px-4 py-2 ${currentStep === 0 ? 'opacity-0 pointer-events-none' : ''}`}
                  >
                    ← Back
                  </button>
                  
                  {currentStep < STEPS.length - 1 ? (
                    <GsapButton onClick={handleNext} variant="primary" className="py-2.5 px-8 text-xs tracking-widest">
                      Next Step →
                    </GsapButton>
                  ) : (
                    <GsapButton 
                      onClick={handleSubmit} 
                      variant="primary" 
                      className="py-2.5 px-8 text-xs tracking-widest bg-white text-black hover:bg-gray-200"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </GsapButton>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
