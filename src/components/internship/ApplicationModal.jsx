import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCursor } from '../../context/CursorContext';
import { useInternshipForm } from '../../hooks/useInternshipForm';
import { internshipSchema } from '../../lib/validation';

import StepPersonal from './StepPersonal';
import StepEducation from './StepEducation';
import StepSkills from './StepSkills';
import StepPortfolio from './StepPortfolio';
import StepReview from './StepReview';
import SuccessAnimation from './SuccessAnimation';

export default function ApplicationModal({ isOpen, onClose, selectedRole }) {
  const { updateCursor, resetCursor } = useCursor();
  const { currentStep, nextStep, prevStep, formData, updateFormData, files, updateFiles, resetForm, setStep } = useInternshipForm();
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

  // Pre-fill role when opened
  useEffect(() => {
    if (isOpen && selectedRole) {
      updateFormData({ role: selectedRole });
    }
  }, [isOpen, selectedRole]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      resetForm();
      setErrors({});
      setSubmitStatus(null);
    }, 500);
  };

  const validateStep = () => {
    try {
      if (currentStep === 1) {
        internshipSchema.pick({ name: true, email: true, phone: true }).parse(formData);
      } else if (currentStep === 2) {
        internshipSchema.pick({ institution: true, fieldOfStudy: true }).parse(formData);
      } else if (currentStep === 3) {
        internshipSchema.pick({ role: true, skills: true }).parse(formData);
      } else if (currentStep === 4) {
        if (!files.resume) {
          setErrors({ resume: "Resume/CV is required (PDF format)" });
          return false;
        }
        internshipSchema.pick({ portfolioLink: true }).parse(formData);
      }
      setErrors({});
      return true;
    } catch (error) {
      const formattedErrors = {};
      error.errors.forEach(err => {
        formattedErrors[err.path[0]] = err.message;
      });
      setErrors(formattedErrors);
      return false;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      nextStep();
    }
  };

  const getBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]); // get base64 part
    reader.onerror = error => reject(error);
  });

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const payload = { ...formData };
      
      if (files.resume) {
        payload.resume = {
          name: files.resume.name,
          content: await getBase64(files.resume)
        };
      }
      
      if (files.portfolio) {
        payload.portfolio = {
          name: files.portfolio.name,
          content: await getBase64(files.portfolio)
        };
      }

      const response = await fetch('/api/internship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to submit application.');
      }

      setSubmitStatus('success');
      nextStep(); // Move to success step (Step 6)
    } catch (err) {
      setErrors({ submit: err.message || 'An unexpected error occurred.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 md:left-1/2 md:-translate-x-1/2 w-full md:w-[600px] h-[90vh] md:h-[80vh] md:bottom-auto md:top-1/2 md:-translate-y-1/2 bg-white/5 backdrop-blur-md md:rounded-3xl rounded-t-3xl border border-white/10 z-[101] flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-white/10 shrink-0">
              <span className="font-mono text-xs tracking-widest uppercase text-white/50">
                {currentStep < 6 ? `Step ${currentStep} of 5` : 'Application Complete'}
              </span>
              <button 
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-white/10 transition-colors cursor-none"
                onMouseEnter={() => updateCursor({ active: true })}
                onMouseLeave={resetCursor}
              >
                <X size={20} />
              </button>
            </div>

            {/* Progress Bar */}
            {currentStep < 6 && (
              <div className="w-full h-1 bg-white/5 shrink-0">
                <motion.div 
                  className="h-full bg-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStep / 5) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8" data-lenis-prevent="true">
              {submitStatus === 'success' ? (
                <SuccessAnimation onClose={handleClose} />
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {currentStep === 1 && <StepPersonal formData={formData} updateFormData={updateFormData} errors={errors} />}
                    {currentStep === 2 && <StepEducation formData={formData} updateFormData={updateFormData} errors={errors} />}
                    {currentStep === 3 && <StepSkills formData={formData} updateFormData={updateFormData} errors={errors} />}
                    {currentStep === 4 && <StepPortfolio formData={formData} updateFormData={updateFormData} files={files} updateFiles={updateFiles} errors={errors} />}
                    {currentStep === 5 && <StepReview formData={formData} files={files} />}
                    
                    {errors.submit && (
                      <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
                        {errors.submit}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>

            {/* Footer / Navigation */}
            {currentStep < 6 && (
              <div className="p-4 md:p-6 border-t border-white/10 flex justify-between items-center shrink-0 bg-white/5 backdrop-blur-md z-10">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1 || isSubmitting}
                  className={`flex items-center gap-2 text-[10px] md:text-xs font-mono tracking-widest uppercase transition-colors cursor-none ${currentStep === 1 ? 'text-transparent pointer-events-none' : 'text-white/50 hover:text-white'}`}
                  onMouseEnter={() => updateCursor({ active: true })}
                  onMouseLeave={resetCursor}
                >
                  <ArrowLeft size={16} /> <span className="hidden sm:inline">Back</span>
                </button>

                {currentStep < 5 ? (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-xs font-mono tracking-widest uppercase hover:bg-white/10 hover:border-white/30 transition-all cursor-none"
                    onMouseEnter={() => updateCursor({ active: true })}
                    onMouseLeave={resetCursor}
                  >
                    Continue <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-8 py-3 bg-accent text-bg rounded-full text-xs font-mono font-medium tracking-widest uppercase hover:bg-white transition-all cursor-none disabled:opacity-50"
                    onMouseEnter={() => !isSubmitting && updateCursor({ active: true })}
                    onMouseLeave={resetCursor}
                  >
                    {isSubmitting ? (
                      <svg className="animate-spin h-4 w-4 text-bg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : 'Submit'}
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
