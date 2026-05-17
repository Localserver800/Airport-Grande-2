"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, ArrowLeft, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Apple, User, Phone } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg({ text: "", type: "" });

    try {
      // Supabase Sign Up with Metadata
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            phone: formData.phone,
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Note: If you have "Confirm Email" turned on in Supabase, they need to check their inbox.
        // We will assume it's set to auto-confirm for a seamless flow right now.
        setStatusMsg({ text: "Account created successfully! Redirecting...", type: "success" });
        setTimeout(() => router.push('/client-dashboard'), 1500);
      }
    } catch (err) {
      setStatusMsg({ 
        text: err.message || "Could not create account. Please try again later.", 
        type: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) setStatusMsg({ text: `Failed to connect to ${provider}`, type: "error" });
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      
      {/* NAVBAR */}
      <nav className="bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-20">
          <Link href="/" className="text-2xl font-bold text-amber-700 font-serif">Airport Grande</Link>
          <Link href="/" className="text-sm text-gray-600 hover:text-amber-600 flex items-center gap-2 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-4 max-w-md mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-50 mb-5">
            <UserPlus className="w-7 h-7 text-amber-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 font-serif">Create Account</h1>
          <p className="text-gray-500 mt-3">Join us for faster bookings and exclusive perks.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10">

          <form onSubmit={handleSignUp} className="space-y-5">
            
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input 
                  type="text" 
                  id="name"
                  required 
                  placeholder="Kwame Mensah"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-amber-500 text-base bg-white text-gray-900 font-medium"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input 
                  type="tel" 
                  id="phone"
                  placeholder="+233 XX XXX XXXX"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-amber-500 text-base bg-white text-gray-900 font-medium"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input 
                  type="email" 
                  id="email"
                  required 
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-amber-500 text-base bg-white text-gray-900 font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Create Password *</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="password"
                  required 
                  minLength="6"
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-12 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-amber-500 text-base bg-white text-gray-900"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Status Message */}
            {statusMsg.text && (
              <div className={`rounded-2xl px-5 py-4 text-sm font-medium ${statusMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {statusMsg.text}
              </div>
            )}

            {/* Submit */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-br from-amber-600 to-amber-800 text-white font-semibold py-4 rounded-full text-base transition-all hover:scale-[1.02] flex items-center justify-center gap-3 mt-4 disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Creating Account...</>
              ) : (
                <><span>CREATE ACCOUNT</span> <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          {/* OR Separator */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-400">Or sign up with</span></div>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => handleOAuthLogin('google')} className="flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
              <span className="text-sm font-semibold text-gray-600">Google</span>
            </button>
            <button onClick={() => handleOAuthLogin('apple')} className="flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors">
              <Apple className="w-5 h-5 text-black" />
              <span className="text-sm font-semibold text-gray-600">Apple</span>
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            Already have an account?{" "}
            <Link href="/login" className="text-amber-600 font-semibold hover:underline">Sign In</Link>
          </p>

        </div>
      </main>
    </div>
  );
}