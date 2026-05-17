"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, ArrowLeft, ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "../../../lib/supabase";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ text: "", type: "" });

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg({ text: "", type: "" });

    try {
      // SUPABASE AUTH MAGIC: Verify email and password directly
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;

      if (data.user) {
        setStatusMsg({ text: "Access granted. Redirecting…", type: "success" });
        setTimeout(() => router.push('/admin'), 1200);
      }
    } catch (err) {
      setStatusMsg({ 
        text: err.message === "Invalid login credentials" 
          ? "Incorrect email or password." 
          : "Could not connect to authentication server.", 
        type: "error" 
      });
    } finally {
      setLoading(false);
    }
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
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gray-900 mb-5">
            <Shield className="w-7 h-7 text-amber-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 font-serif">Admin Portal</h1>
          <p className="text-gray-500 mt-3">Authorised staff access only.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10">
          {/* Admin badge */}
          <div className="flex items-start gap-3 bg-gray-50 rounded-2xl px-4 py-3 mb-7 border border-gray-200">
            <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-600">
              This portal is for <strong>Airport Grande management</strong> only. Guests should use the <Link href="/login" className="text-amber-600 hover:underline">guest login</Link>.
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Email *</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input 
                  type="email" 
                  required 
                  placeholder="admin@airportgrande.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-amber-500 text-base bg-white text-gray-900 font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password *</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  placeholder="Admin password"
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
              className="w-full bg-gradient-to-br from-gray-900 to-gray-700 text-white font-semibold py-4 rounded-2xl text-base transition-all hover:scale-[1.02] flex items-center justify-center gap-3 mt-2 disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Authenticating...</>
              ) : (
                <><span>ACCESS DASHBOARD</span> <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}