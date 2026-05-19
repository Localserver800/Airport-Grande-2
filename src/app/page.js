"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Menu, X, ArrowRight, Zap, ChevronDown, Wifi, Car, Shield, Utensils } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showFloatingCta, setShowFloatingCta] = useState(false);
  
  // Scroll Logic for Floating Button
  useEffect(() => {
    const handleScroll = () => setShowFloatingCta(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      
      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/85 backdrop-blur-md border-b border-white/40">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0">
              <Link href="/">
                <span className="text-2xl md:text-3xl font-bold text-amber-700 tracking-tight font-serif">Airport Grande</span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-x-7 text-sm font-medium">
              <Link href="/" className="text-amber-600 font-semibold transition-colors">Home</Link>
              <Link href="/rooms" className="text-gray-900 hover:text-amber-600 transition-colors">Rooms</Link>
              <Link href="/gallery" className="text-gray-900 hover:text-amber-600 transition-colors">Gallery</Link>
              <Link href="/contact" className="text-gray-900 hover:text-amber-600 transition-colors">Contact</Link>
              <Link href="/login" className="text-gray-900 hover:text-amber-600 transition-colors">Sign In</Link>
              <Link href="/booking" className="bg-gradient-to-br from-amber-600 to-amber-800 text-white px-7 py-3.5 rounded-full font-semibold text-sm tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all ml-2">
                CHECK AVAILABILITY
              </Link>
            </div>

            {/* Mobile Nav Toggle */}
            <div className="md:hidden flex items-center gap-3">
              <Link href="/booking" className="hidden md:block bg-gradient-to-br from-amber-600 to-amber-800 text-white px-4 py-2.5 rounded-full font-semibold text-xs tracking-wide shadow-md transition-all">
                Check Availability
              </Link>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-800 hover:text-amber-600 p-1.5">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-2xl">
            <div className="px-6 pt-5 pb-8 flex flex-col gap-1 text-base font-medium">
              <Link href="/" className="py-3.5 border-b border-gray-100 text-amber-600">Home</Link>
              <Link href="/rooms" className="py-3.5 border-b border-gray-100 text-gray-800 hover:text-amber-600">Rooms</Link>
              <Link href="/gallery" className="py-3.5 border-b border-gray-100 text-gray-800 hover:text-amber-600">Gallery</Link>
              <Link href="/login" className="py-3.5 border-b border-gray-100 text-gray-800 hover:text-amber-600">Sign In</Link>
              <Link href="/booking" className="mt-5 block w-full text-center bg-gradient-to-br from-amber-600 to-amber-800 text-white py-4 rounded-full font-semibold text-base tracking-wide shadow-lg">
                CHECK AVAILABILITY NOW
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* FLOATING CTA */}
      <Link href="/booking" className={`${showFloatingCta ? 'flex' : 'hidden'} md:flex items-center gap-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-8 py-4 rounded-full font-semibold shadow-2xl transition-all fixed bottom-6 right-6 z-40 text-base hover:scale-105`}>
        <span>Check Availability</span>
        <ArrowRight className="w-5 h-5" />
      </Link>

      {/* HERO SECTION */}
      <section className="relative h-screen min-h-[640px] flex items-center pt-20">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=2070" alt="Airport Grande" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/90 text-amber-700 px-5 py-2 rounded-full text-sm font-semibold mb-6 animate-pulse">
              <Zap className="w-4 h-4" />
              2 APARTMENTS AVAILABLE NOW
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-white mb-6 font-serif">
              Your Home Away From Home<br/>at Airport Grande
            </h1>
            <p className="text-lg sm:text-xl text-white/90 mb-10">
              Fully furnished serviced apartments & rooms in Airport Residential Area, Accra.<br/>
              <span className="font-semibold text-amber-300">Just 10 minutes from Kotoka International Airport.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/booking" className="bg-gradient-to-br from-amber-600 to-amber-800 flex-1 sm:flex-none text-center text-white text-base sm:text-lg font-semibold px-10 py-6 rounded-full shadow-xl hover:scale-[1.03] transition-all">
                CHECK AVAILABILITY
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white animate-bounce">
          <ChevronDown className="w-9 h-9" />
        </div>
      </section>

      {/* AMENITIES */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 font-serif">Home-Like Comfort</h2>
            <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need for a restful and productive stay.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Cards */}
            {[
              { icon: Wifi, title: "Free High-Speed Wi-Fi", desc: "Strong & reliable throughout" },
              { icon: Car, title: "Free Parking", desc: "On-site secure parking" },
              { icon: Shield, title: "24-Hour Security", desc: "Plus backup generator" },
              { icon: Utensils, title: "Breakfast Service", desc: "In-room delivery available" }
            ].map((amenity, idx) => (
              <div key={idx} className="bg-white border border-gray-100 p-10 rounded-3xl text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <amenity.icon className="w-10 h-10 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold !text-gray-900 font-serif mb-2">{amenity.title}</h3>
                <p className="text-gray-800 font-bold">{amenity.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-12 text-center">
        <p className="text-gray-400">© 2026 Airport Grande Luxury Lodge & Apartments. All Rights Reserved.</p>
      </footer>
    </div>
  );
}