import { z } from 'zod';

// Strict regex patterns for enterprise contact validation
const phoneRegex = /^[\+]?[0-9\s\-()]{10,14}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]{2,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required").min(3, "Name must be at least 3 characters").max(50, "Name must be less than 50 characters"),
  email: z.string().min(1, "Email is required").regex(emailRegex, "Please enter a valid email address (e.g., name@domain.com)"),
  phone: z.string().min(1, "Phone number is required").regex(phoneRegex, "Please enter a valid number"),
  service: z.string().optional(),
  subService: z.string().optional(),
  message: z.string().min(1, "Message is required").min(10, "Message must be at least 10 characters").max(2000, "Message must be less than 2000 characters"),
  company: z.string().optional() // Honeypot field
}).superRefine((data, ctx) => {
  if (data.service === 'Film Production' && (!data.subService || data.subService.trim() === '')) {
    ctx.addIssue({
      path: ['subService'],
      message: 'Please select a filmmaking category',
      code: z.ZodIssueCode.custom,
    });
  }
});

export const internshipSchema = z.object({
  // Step 1: Personal
  name: z.string().min(2, "Name is required"),
  email: z.string().min(1, "Email is required").regex(emailRegex, "Please enter a valid email address"),
  phone: z.string().min(1, "Phone number is required").regex(phoneRegex, "Phone must contain only digits, +, or hyphens (min 7 numbers)"),
  // Step 2: Education
  institution: z.string().min(2, "Institution is required"),
  fieldOfStudy: z.string().min(2, "Field of study is required"),
  // Step 3: Role
  role: z.string().min(1, "Role is required"),
  // Step 4: Skills
  skills: z.string().min(2, "Please list your key skills/software"),
  // Step 5: Portfolio/Links (Files are handled via FormData, so we just validate optional link)
  portfolioLink: z.string().url("Please enter a valid URL").optional().or(z.literal('')),
  company: z.string().optional() // Honeypot
});
