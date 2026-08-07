import { useState } from 'react';

export function useInternshipForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    institution: '',
    fieldOfStudy: '',
    role: '',
    skills: '',
    portfolioLink: '',
    company: '' // honeypot
  });
  const [files, setFiles] = useState({
    resume: null,
    portfolio: null
  });

  const updateFormData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const updateFiles = (newFiles) => {
    setFiles(prev => ({ ...prev, ...newFiles }));
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 6));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const setStep = (step) => setCurrentStep(step);

  const resetForm = () => {
    setCurrentStep(1);
    setFormData({
      name: '', email: '', phone: '',
      institution: '', fieldOfStudy: '',
      role: '', skills: '', portfolioLink: '', company: ''
    });
    setFiles({ resume: null, portfolio: null });
  };

  return {
    currentStep,
    nextStep,
    prevStep,
    setStep,
    formData,
    updateFormData,
    files,
    updateFiles,
    resetForm
  };
}
