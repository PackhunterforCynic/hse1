import React from 'react';
import { Form, useActionData, useNavigation, redirect } from 'react-router';
import { z } from 'zod';
import { login } from '../../lib/auth.server';
import { createUserSession, getAdminId } from '../../lib/session.server';

// Server-side loader to redirect if already logged in
export async function loader({ request }) {
  const adminId = await getAdminId(request);
  if (adminId) {
    return redirect('/admin');
  }
  return null;
}

// Zod schema for validation
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  remember: z.string().optional(),
});

// Server-side action
export async function action({ request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const remember = formData.get("remember");

  // Validate request
  const result = loginSchema.safeParse({ email, password, remember });
  
  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
      values: { email },
    };
  }

  // Attempt login
  const admin = await login({ email, password });

  if (!admin) {
    return {
      errors: { form: "Invalid email or password" },
      values: { email },
    };
  }

  // Create session
  return createUserSession({
    request,
    adminId: admin.id,
    remember: remember === "on",
    redirectTo: "/admin",
  });
}

export default function Login() {
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="min-h-screen bg-[#070707] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background aesthetics */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 pointer-events-none mix-blend-overlay" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(250px,50vw,500px)] aspect-square bg-[#D4AF37]/5 blur-[60px] sm:blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-display uppercase tracking-wider text-white mb-2">Havilah Studio</h1>
          <p className="text-white/50 font-mono text-xs tracking-widest uppercase">Admin Secure Login</p>
        </div>

        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 shadow-2xl">
          <Form method="post" className="flex flex-col gap-6">
            
            {actionData?.errors?.form && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                {actionData.errors.form}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono tracking-widest uppercase text-white/70 ml-1">Email</label>
              <input 
                type="email" 
                name="email"
                defaultValue={actionData?.values?.email || ''}
                className={`w-full bg-white/5 border ${actionData?.errors?.email ? 'border-red-500/50' : 'border-white/10 focus:border-[#D4AF37]/50'} rounded-xl px-4 py-3 outline-none transition-all duration-300 font-sans text-white`}
                placeholder="admin@havilah.studio"
                required
              />
              {actionData?.errors?.email && <span className="text-[10px] font-mono text-red-400 ml-1">{actionData.errors.email[0]}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono tracking-widest uppercase text-white/70 ml-1">Password</label>
              <input 
                type="password" 
                name="password"
                className={`w-full bg-white/5 border ${actionData?.errors?.password ? 'border-red-500/50' : 'border-white/10 focus:border-[#D4AF37]/50'} rounded-xl px-4 py-3 outline-none transition-all duration-300 font-sans text-white`}
                placeholder="••••••••"
                required
              />
              {actionData?.errors?.password && <span className="text-[10px] font-mono text-red-400 ml-1">{actionData.errors.password[0]}</span>}
            </div>

            <div className="flex items-center gap-2 ml-1">
              <input type="checkbox" name="remember" id="remember" className="accent-[#D4AF37]" />
              <label htmlFor="remember" className="text-xs font-sans text-white/50 cursor-pointer">Remember me for 30 days</label>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="mt-4 w-full bg-[#D4AF37] hover:bg-[#CFA65B] text-black font-semibold uppercase tracking-widest text-sm py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Authenticating...' : 'Sign In'}
            </button>

          </Form>
        </div>
        
        <p className="text-center text-white/20 text-[10px] font-mono uppercase mt-8">
          Authorized personnel only. All access is logged.
        </p>
      </div>
    </div>
  );
}
