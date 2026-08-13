import React, { useState } from 'react';
import { Form, useActionData, useNavigation, Link } from 'react-router';
import { z } from 'zod';
import { db } from '../lib/db.server';
import { Star, ArrowLeft, CheckCircle } from 'lucide-react';
import SEO from '../components/common/SEO';

const testimonialSchema = z.object({
  clientName: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Mobile number is required"),
  company: z.string().optional(),
  designation: z.string().optional(),
  profilePhoto: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  rating: z.coerce.number().min(1).max(5),
  review: z.string().min(10, "Review must be at least 10 characters long"),
});

export async function action({ request }) {
  const formData = await request.formData();
  const rawData = Object.fromEntries(formData);
  const result = testimonialSchema.safeParse(rawData);

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  await db.testimonial.create({
    data: {
      clientName: result.data.clientName,
      email: result.data.email,
      phone: result.data.phone,
      company: result.data.company,
      designation: result.data.designation,
      profilePhoto: result.data.profilePhoto || null,
      rating: result.data.rating,
      review: result.data.review,
      approved: false,
      featured: false,
    }
  });

  return { success: true };
}

export default function SubmitTestimonial() {
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== "idle";
  const [rating, setRating] = useState(5);

  if (actionData?.success) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4">
        <SEO title="Thank You | Havilah" path="/submit-testimonial" />
        <div className="max-w-md w-full bg-[#0a0a0a] border border-white/5 p-8 rounded-2xl flex flex-col items-center text-center">
          <CheckCircle className="text-[#D4AF37] w-16 h-16 mb-6" />
          <h2 className="text-2xl font-display uppercase tracking-widest text-white mb-4">Review Submitted</h2>
          <p className="text-white/60 font-sans text-sm mb-8">
            Thank you for sharing your experience! Your review has been submitted securely and is pending verification.
          </p>
          <Link to="/" className="px-8 py-3 bg-[#D4AF37] hover:bg-[#CFA65B] text-black font-semibold uppercase tracking-widest text-xs rounded-xl transition-colors">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] py-24 px-4">
      <SEO title="Submit a Review | Havilah" path="/submit-testimonial" />
      
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-mono uppercase mb-12">
          <ArrowLeft size={14} /> Back to Home
        </Link>
        
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-light font-serif italic text-white mb-4">Share your experience.</h1>
          <p className="text-white/50 font-sans">Your feedback drives our creative pursuit. Please fill out the form below to submit a review.</p>
        </div>

        <Form method="post" className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 md:p-10 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono uppercase text-white/50 tracking-widest">Overall Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star 
                    size={32} 
                    className={star <= rating ? "fill-[#D4AF37] text-[#D4AF37]" : "text-white/10"} 
                  />
                </button>
              ))}
            </div>
            <input type="hidden" name="rating" value={rating} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-mono uppercase text-white/50 tracking-widest">Full Name *</label>
              <input type="text" name="clientName" required className="bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm focus:border-[#D4AF37]/50 focus:bg-white/10 transition-colors outline-none" />
              {actionData?.errors?.clientName && <span className="text-red-500 text-xs mt-1">{actionData.errors.clientName[0]}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-mono uppercase text-white/50 tracking-widest">Company (Optional)</label>
              <input type="text" name="company" className="bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm focus:border-[#D4AF37]/50 focus:bg-white/10 transition-colors outline-none" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-mono uppercase text-white/50 tracking-widest">Email Address * <span className="lowercase normal-case text-white/30 ml-2">(for verification only)</span></label>
              <input type="email" name="email" required className="bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm focus:border-[#D4AF37]/50 focus:bg-white/10 transition-colors outline-none" />
              {actionData?.errors?.email && <span className="text-red-500 text-xs mt-1">{actionData.errors.email[0]}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-mono uppercase text-white/50 tracking-widest">Mobile Number * <span className="lowercase normal-case text-white/30 ml-2">(for verification only)</span></label>
              <input type="tel" name="phone" required className="bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm focus:border-[#D4AF37]/50 focus:bg-white/10 transition-colors outline-none" />
              {actionData?.errors?.phone && <span className="text-red-500 text-xs mt-1">{actionData.errors.phone[0]}</span>}
            </div>

            <div className="flex flex-col gap-1 md:col-span-1">
              <label className="text-[10px] font-mono uppercase text-white/50 tracking-widest">Designation (Optional)</label>
              <input type="text" name="designation" placeholder="e.g. Creative Director" className="bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm focus:border-[#D4AF37]/50 focus:bg-white/10 transition-colors outline-none" />
            </div>

            <div className="flex flex-col gap-1 md:col-span-1">
              <label className="text-[10px] font-mono uppercase text-white/50 tracking-widest">Profile Photo URL (Optional)</label>
              <input type="url" name="profilePhoto" placeholder="https://example.com/photo.jpg" className="bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm focus:border-[#D4AF37]/50 focus:bg-white/10 transition-colors outline-none" />
              {actionData?.errors?.profilePhoto && <span className="text-red-500 text-xs mt-1">{actionData.errors.profilePhoto[0]}</span>}
            </div>

            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-[10px] font-mono uppercase text-white/50 tracking-widest">Your Review *</label>
              <textarea name="review" required rows={5} className="bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm focus:border-[#D4AF37]/50 focus:bg-white/10 transition-colors outline-none resize-none"></textarea>
              {actionData?.errors?.review && <span className="text-red-500 text-xs mt-1">{actionData.errors.review[0]}</span>}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="mt-6 w-full py-4 bg-[#D4AF37] hover:bg-[#CFA65B] text-black font-semibold uppercase tracking-widest text-sm rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting Review...' : 'Submit Review'}
          </button>
        </Form>
      </div>
    </div>
  );
}
