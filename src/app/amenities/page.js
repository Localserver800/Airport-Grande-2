"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Menu, X, Sparkles, ChevronDown, Wifi, Car, Dumbbell, 
  Utensils, Shirt, Shield, TreePine, Coffee, Check, ArrowRight 
} from "lucide-react";

export default function AmenitiesPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const amenitiesList = [
    {
      icon: Wifi,
      title: "Free High-Speed Wi-Fi",
      desc: "Strong and reliable connection throughout the entire property — perfect for work or streaming."
    },
    {
      icon: Car,
      title: "Free Private Parking",
      desc: "Secure on-site parking with 24-hour surveillance. No need to worry about your vehicle."
    },
    {
      icon: Dumbbell,
      title: "Fitness Centre",
      desc: "Well-equipped gym with cardio machines, weights, and yoga space. Stay active during your stay."
    },
    {
      icon: Utensils,
      title: "Daily Breakfast Service",
      desc: "Fresh continental or local Ghanaian breakfast delivered to your room between 6:00 AM – 10:00 AM."
    },
    {
      icon: Shirt,
      title: "Laundry Service",
      desc: "Professional laundry service included twice per week for all guests."
    },
    {
      icon: Sparkles,
      title: "Regular Housekeeping",
      desc: "Full apartment/room cleaning three times per week. Fresh linens and towels provided."
    },
    {
      icon: Shield,
      title: "24-Hour Security & Backup",
      desc: "Gated property with professional security team and full power backup for uninterrupted comfort."
    },
    {
      icon: TreePine,
      title: "Terrace & Garden",
      desc: "Peaceful outdoor spaces to relax, unwind, or enjoy fresh air in a quiet residential setting."
    },
    {
      icon: Coffee,
      title: "In-Room Comforts",
      desc: "Air conditioning, satellite TV, large fridge, coffee/tea making facilities, work desk, and en-suite bathrooms."
    }
  ];

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
              <Link href="/" className="text-gray-900 hover:text-amber-600 transition-colors">Home</Link>
              <Link href="/rooms" className="text-gray-900 hover:text-amber-600 transition-colors">Rooms</Link>
              <Link href="/amenities" className="text-amber-600 font-semibold transition-colors">Amenities</Link>
              <Link href="/gallery" className="text-gray-900 hover:text-amber-600 transition-colors">Gallery</Link>
              <Link href="/contact" className="text-gray-900 hover:text-amber-600 transition-colors">Contact</Link>
              <Link href="/login" className="text-gray-900 hover:text-amber-600 transition-colors">Sign In</Link>
              <Link href="/booking" className="bg-gradient-to-br from-amber-600 to-amber-800 text-white px-7 py-3.5 rounded-full font-semibold text-sm tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all ml-2">
                CHECK AVAILABILITY
              </Link>
            </div>

            {/* Mobile Nav Toggle */}
            <div className="md:hidden flex items-center gap-3">
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
              <Link href="/" className="py-3.5 border-b border-gray-100 text-gray-800 hover:text-amber-600">Home</Link>
              <Link href="/rooms" className="py-3.5 border-b border-gray-100 text-gray-800 hover:text-amber-600">Rooms</Link>
              <Link href="/amenities" className="py-3.5 border-b border-gray-100 text-amber-600">Amenities</Link>
              <Link href="/gallery" className="py-3.5 border-b border-gray-100 text-gray-800 hover:text-amber-600">Gallery</Link>
              <Link href="/contact" className="py-3.5 border-b border-gray-100 text-gray-800 hover:text-amber-600">Contact</Link>
              <Link href="/login" className="py-3.5 border-b border-gray-100 text-gray-800 hover:text-amber-600">Sign In</Link>
              <Link href="/booking" className="mt-5 block w-full text-center bg-gradient-to-br from-amber-600 to-amber-800 text-white py-4 rounded-full font-semibold text-base tracking-wide shadow-lg">
                CHECK AVAILABILITY NOW
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="relative h-screen min-h-[640px] flex items-center pt-20">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=2070" 
               alt="Fitness centre and garden at Airport Grande"
               className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/90 text-amber-700 px-5 py-2 rounded-full text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              EVERYTHING YOU NEED FOR A COMFORTABLE STAY
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-white mb-6 font-serif">
              Home-Like Comfort<br/>with Premium Amenities
            </h1>
            <p className="text-lg sm:text-xl text-white/90">
              From daily breakfast delivered to your door to 24-hour security and a fully equipped fitness centre — we take care of every detail so you can relax.
            </p>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white animate-bounce">
          <ChevronDown className="w-9 h-9" />
        </div>
      </section>

      {/* AMENITIES GRID */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 font-serif">What We Offer</h2>
            <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              All amenities are included in your stay — no hidden fees. Designed for both short-term business travelers and long-stay guests.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {amenitiesList.map((amenity, idx) => (
              <div key={idx} className="bg-white border border-gray-100 p-10 rounded-3xl text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <amenity.icon className="w-10 h-10 text-amber-600" />
                </div>
                <h3 className="text-2xl font-semibold mb-3 font-serif">{amenity.title}</h3>
                <p className="text-base leading-relaxed text-gray-600">{amenity.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IN-ROOM AMENITIES */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 font-serif">In Every Room & Apartment</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            <ul className="space-y-6 text-base text-gray-700">
              <li className="flex gap-4"><Check className="w-6 h-6 text-amber-600 mt-0.5 flex-shrink-0" /> Individually controlled air conditioning</li>
              <li className="flex gap-4"><Check className="w-6 h-6 text-amber-600 mt-0.5 flex-shrink-0" /> Satellite / Smart TV with international channels</li>
              <li className="flex gap-4"><Check className="w-6 h-6 text-amber-600 mt-0.5 flex-shrink-0" /> Private en-suite bathroom with hot shower</li>
              <li className="flex gap-4"><Check className="w-6 h-6 text-amber-600 mt-0.5 flex-shrink-0" /> Large refrigerator & coffee/tea station</li>
              <li className="flex gap-4"><Check className="w-6 h-6 text-amber-600 mt-0.5 flex-shrink-0" /> Work desk and comfortable seating</li>
            </ul>
            <ul className="space-y-6 text-base text-gray-700">
              <li className="flex gap-4"><Check className="w-6 h-6 text-amber-600 mt-0.5 flex-shrink-0" /> High-quality bedding and towels</li>
              <li className="flex gap-4"><Check className="w-6 h-6 text-amber-600 mt-0.5 flex-shrink-0" /> Hairdryer and basic toiletries</li>
              <li className="flex gap-4"><Check className="w-6 h-6 text-amber-600 mt-0.5 flex-shrink-0" /> Iron & ironing board (on request)</li>
              <li className="flex gap-4"><Check className="w-6 h-6 text-amber-600 mt-0.5 flex-shrink-0" /> 24-hour reception & concierge support</li>
              <li className="flex gap-4"><Check className="w-6 h-6 text-amber-600 mt-0.5 flex-shrink-0" /> Shared kitchenette access (limited)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-28 bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-none mb-8 font-serif">
            Ready for a Comfortable Stay in Accra?
          </h2>
          <p className="text-base sm:text-lg text-gray-300 mb-12 max-w-lg mx-auto">
            All these amenities are included whether you stay for one night or several months.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/booking" className="bg-gradient-to-br from-amber-600 to-amber-800 text-white text-base sm:text-lg font-semibold px-16 py-8 rounded-full inline-flex items-center justify-center gap-4 hover:scale-105 transition-all">
              BROWSE ROOMS & APARTMENTS
              <ArrowRight className="w-6 h-6" />
            </Link>
            <Link href="/contact" className="border-2 border-white/70 hover:border-white text-white text-base sm:text-lg font-semibold px-16 py-8 rounded-full transition-all flex items-center justify-center">
              Speak with Our Team
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-10">
            <div>
              <span className="text-3xl font-bold text-amber-500 tracking-tight font-serif">Airport Grande</span>
              <p className="text-gray-400 mt-2 text-base">Luxury serviced apartments & rooms in Accra.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-6 text-base">Explore</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link href="/rooms" className="hover:text-white transition-colors">Rooms & Floor Plans</Link></li>
                <li><Link href="/amenities" className="hover:text-white transition-colors">Amenities</Link></li>
                <li><Link href="/gallery" className="hover:text-white transition-colors">Gallery</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-6 text-base">Residents & Applicants</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link href="/gallery" className="hover:text-white transition-colors">Photo Gallery</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Map & Location</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Guest Portal</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Long-Stay Enquiry</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-6 text-base">Contact</h4>
              <p className="text-sm text-gray-400">+233 20 135 1116<br/>info@airportgrande.com</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-16 pt-8 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center">
            <p>© 2026 Airport Grande Luxury Lodge & Apartments. All Rights Reserved.</p>
            <div className="flex gap-6 mt-6 md:mt-0">
              <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
