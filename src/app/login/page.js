"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn, ArrowLeft, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Apple } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ text: "", type: "" });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg({ text: "", type: "" });

    try {
      // Supabase Email/Password Login
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;

      if (data.user) {
        setStatusMsg({ text: "Login successful! Redirecting...", type: "success" });
        setTimeout(() => router.push('/client-dashboard'), 1200);
      }
    } catch (err) {
      setStatusMsg({ 
        text: err.message === "Invalid login credentials" 
          ? "Incorrect email or password." 
          : "Could not connect. Please try again later.", 
        type: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider) => {
    // Supabase handles Google/Apple logins automatically if configured in the dashboard
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
            <LogIn className="w-7 h-7 text-amber-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 font-serif">Welcome Back</h1>
          <p className="text-gray-500 mt-3">Sign in to manage your bookings.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10">

          <form onSubmit={handleLogin} className="space-y-5">
            
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input 
                  type="email" 
                  required 
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-amber-500 text-base bg-white text-gray-900 font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-700">Password *</label>
                <Link href="#" className="text-xs text-amber-600 hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            {/* Remember me */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500" />
              <span className="text-sm text-gray-600">Remember me on this device</span>
            </label>

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
              className="w-full bg-gradient-to-br from-amber-600 to-amber-800 text-white font-semibold py-4 rounded-full text-base transition-all hover:scale-[1.02] flex items-center justify-center gap-3 mt-2 disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Signing in...</>
              ) : (
                <><span>SIGN IN</span> <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          {/* OR Separator */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-400">Or sign in with</span></div>
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
            Don't have an account?{" "}
            <Link href="/signup" className="text-amber-600 font-semibold hover:underline">Create one</Link>
          </p>

        </div>

        {/* Admin note */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Are you staff? <Link href="/admin/login" className="text-amber-600 hover:underline">Admin portal →</Link>
        </p>
      </main>
    </div>
  );
}