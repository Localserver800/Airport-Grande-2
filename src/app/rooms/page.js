"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Menu, X, Home, Calendar, ChevronDown, CheckCircle, 
  Wifi, AirVent, Tv, ShowerHead, Utensils, WashingMachine, 
  Shield, MapPin, ArrowRight 
} from "lucide-react";

export default function RoomsPage() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Search State
  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");
  const [guests, setGuests] = useState("1 Guest");

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (!arrival || !departure) {
      alert("Please select both your arrival and departure dates!");
      return;
    }
    router.push(`/search?arrival=${arrival}&departure=${departure}&guests=${guests}`);
  };

  const scrollToForm = (e) => {
    if (e) e.preventDefault();
    document.getElementById('quick-availability')?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <div className="smooth-scroll bg-gray-50 min-h-screen font-sans">
      
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
              <Link href="/rooms" className="text-amber-600 font-semibold transition-colors border-b-2 border-amber-600">Rooms</Link>
              <Link href="/amenities" className="text-gray-900 hover:text-amber-600 transition-colors">Amenities</Link>
              <Link href="/gallery" className="text-gray-900 hover:text-amber-600 transition-colors">Gallery</Link>
              <Link href="/contact" className="text-gray-900 hover:text-amber-600 transition-colors">Contact</Link>
              <button 
                onClick={scrollToForm}
                className="bg-gradient-to-br from-amber-600 to-amber-800 text-white px-7 py-3.5 rounded-full font-semibold text-sm tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all ml-2"
              >
                CHECK AVAILABILITY
              </button>
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
              <Link href="/rooms" className="py-3.5 border-b border-gray-100 text-amber-600">Rooms</Link>
              <Link href="/amenities" className="py-3.5 border-b border-gray-100 text-gray-800 hover:text-amber-600">Amenities</Link>
              <Link href="/gallery" className="py-3.5 border-b border-gray-100 text-gray-800 hover:text-amber-600">Gallery</Link>
              <Link href="/contact" className="py-3.5 border-b border-gray-100 text-gray-800 hover:text-amber-600">Contact</Link>
              <Link href="/login" className="py-3.5 border-b border-gray-100 text-gray-800 hover:text-amber-600">Sign In</Link>
              <button 
                onClick={scrollToForm}
                className="mt-5 block w-full text-center bg-gradient-to-br from-amber-600 to-amber-800 text-white py-4 rounded-full font-semibold text-base tracking-wide shadow-lg"
              >
                CHECK AVAILABILITY NOW
              </button>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="relative h-screen min-h-[640px] flex items-center pt-20">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=2070" 
               alt="Luxury 2-Bedroom Apartment at Airport Grande, Accra"
               className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/90 text-amber-700 px-5 py-2 rounded-full text-sm font-semibold mb-6 animate-pulse">
              <Home className="w-4 h-4" />
              2 APARTMENTS + 3 ROOMS AVAILABLE NOW
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-white mb-6 font-serif">
              Rooms & Apartments<br/>That Feel Like Home
            </h1>
            <p className="text-lg sm:text-xl text-white/90 mb-10">
              6 fully serviced Standard Rooms + 8 spacious 2-Bedroom Apartments in the heart of Airport Residential Area.<br/>
              <span className="font-semibold text-amber-300">Just 10 minutes from Kotoka International Airport.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#room-listings" 
                 className="bg-gradient-to-br from-amber-600 to-amber-800 flex-1 sm:flex-none text-center text-white text-base sm:text-lg font-semibold px-10 py-6 rounded-full shadow-xl hover:scale-[1.03] transition-all">
                BROWSE ALL UNITS
              </a>
              <Link href="/contact" 
                 className="flex-1 sm:flex-none border-2 border-white/80 hover:border-white text-white text-base sm:text-lg font-semibold px-10 py-6 rounded-full transition-all text-center">
                GET A CUSTOM QUOTE
              </Link>
            </div>

            <p className="text-white/70 text-sm mt-8 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Short stay • Long stay • Flexible monthly rates available
            </p>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white animate-bounce">
          <ChevronDown className="w-9 h-9" />
        </div>
      </section>

      {/* QUICK AVAILABILITY CHECKER */}
      <section id="quick-availability" className="bg-white py-12 border-b">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-gray-50 rounded-3xl p-8 md:p-10 shadow-inner">
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 font-serif">Check Real-Time Availability</h2>
              <p className="text-gray-600 mt-3 text-base">Instant quotes for short or long stays</p>
            </div>
            
            <form className="grid md:grid-cols-4 gap-6" onSubmit={handleSearch}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Arrival</label>
                <input 
                  type="date" 
                  value={arrival} 
                  onChange={(e) => setArrival(e.target.value)} 
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-amber-500 text-base bg-white text-gray-900 font-medium" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Departure</label>
                <input 
                  type="date" 
                  value={departure}
                  onChange={(e) => setDeparture(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-amber-500 text-base bg-white text-gray-900 font-medium" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
                <select 
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-amber-500 text-base bg-white text-gray-900 font-medium"
                >
                  <option>1 Guest</option>
                  <option>2 Guests</option>
                  <option>3 Guests</option>
                  <option>4 Guests</option>
                  <option>5+ Guests</option>
                </select>
              </div>
              <div className="flex items-end">
                <button type="submit"
                        className="w-full bg-gradient-to-br from-amber-600 to-amber-800 text-white font-semibold py-4 rounded-full text-base sm:text-lg hover:shadow-xl transition-all">
                  SEE AVAILABLE UNITS
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ROOM LISTINGS */}
      <section id="room-listings" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 font-serif">Our Accommodations</h2>
              <p className="text-base sm:text-lg text-gray-600 mt-3">6 Standard Rooms • 8 Two-Bedroom Apartments • Fully furnished & serviced</p>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="px-4 py-2 bg-amber-100 text-amber-700 rounded-full font-medium flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                5 UNITS AVAILABLE TODAY
              </span>
            </div>
          </div>

          {/* Standard Rooms */}
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <h3 className="text-2xl font-semibold font-serif text-gray-900">Standard Rooms (6 units)</h3>
              <span className="text-xs font-medium px-3 py-1 bg-amber-100 text-amber-700 rounded-full">Perfect for solo travelers & short business stays</span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="group bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                  <div className="relative h-64 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=2074" alt="Standard Room Interior" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-amber-700 text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">From $95 / night</div>
                  </div>
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-xl font-bold text-gray-900">Standard Room</h4>
                        <p className="text-gray-500 text-sm">1 Queen Bed • 1–2 Guests • 35 m²</p>
                      </div>
                      <div className="text-right">
                        <span className="text-emerald-600 text-sm font-bold uppercase tracking-wider">Available</span>
                      </div>
                    </div>
                    <p className="text-base text-gray-600 mb-6 leading-relaxed">Quiet, secure, and fully equipped with everything you need for a restful stay minutes from the airport.</p>
                    <div className="flex flex-wrap gap-2 mb-8">
                      <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5"><Wifi className="w-3.5 h-3.5 text-amber-600" /> Wi-Fi</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5"><AirVent className="w-3.5 h-3.5 text-amber-600" /> AC</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5"><Tv className="w-3.5 h-3.5 text-amber-600" /> Satellite TV</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5"><ShowerHead className="w-3.5 h-3.5 text-amber-600" /> En-suite</span>
                    </div>
                    <Link href="/booking?type=Room" className="block w-full text-center border-2 border-amber-600 text-amber-700 font-bold py-4 rounded-full hover:bg-amber-50 transition-all duration-300">Book This Room</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2-Bedroom Apartments */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <h3 className="text-2xl font-semibold font-serif text-gray-900">2-Bedroom Serviced Apartments (8 units)</h3>
              <span className="text-xs font-medium px-3 py-1 bg-amber-100 text-amber-700 rounded-full">Ideal for families, long stays & business teams</span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="group bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                  <div className="relative h-64 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=2070" alt="2-Bedroom Apartment Interior" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-amber-700 text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">From $195 / night</div>
                  </div>
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-xl font-bold text-gray-900">2-Bedroom Apartment</h4>
                        <p className="text-gray-500 text-sm">2 Queen Beds • Up to 5 Guests • 90 m²</p>
                      </div>
                      <div className="text-right">
                        <span className="text-emerald-600 text-sm font-bold uppercase tracking-wider">Available</span>
                      </div>
                    </div>
                    <p className="text-base text-gray-600 mb-6 leading-relaxed">Spacious open-plan layout with modern kitchen, living area, and private bedrooms. Long-stay discounts available.</p>
                    <div className="flex flex-wrap gap-2 mb-8">
                      <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5"><Utensils className="w-3.5 h-3.5 text-amber-600" /> Full Kitchen</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5"><Wifi className="w-3.5 h-3.5 text-amber-600" /> Wi-Fi</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5"><WashingMachine className="w-3.5 h-3.5 text-amber-600" /> Laundry</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5"><Tv className="w-3.5 h-3.5 text-amber-600" /> Smart TV</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5"><AirVent className="w-3.5 h-3.5 text-amber-600" /> AC</span>
                    </div>
                    <Link href="/booking?type=Apartment" className="block w-full text-center border-2 border-amber-600 text-amber-700 font-bold py-4 rounded-full hover:bg-amber-50 transition-all duration-300">Reserve Apartment</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING & LONG STAY */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 font-serif">Transparent Pricing</h2>
            <p className="text-base sm:text-lg text-gray-600 mt-3 max-w-md mx-auto">Rates include daily breakfast, Wi-Fi, cleaning, and secure parking. Long-stay discounts up to 30%.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Standard Room</h3>
              <div className="text-5xl font-bold text-amber-700 mb-1 font-serif">$95</div>
              <p className="text-sm text-gray-400 mb-6 uppercase font-semibold tracking-wider">per night (short stay)</p>
              <div className="h-px bg-gray-100 w-full mb-6"></div>
              <p className="text-base text-gray-600">or <span className="font-bold text-gray-900">$1,800 / month</span> (long stay)</p>
            </div>
            <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-2">2-Bedroom Apartment</h3>
              <div className="text-5xl font-bold text-amber-700 mb-1 font-serif">$195</div>
              <p className="text-sm text-gray-400 mb-6 uppercase font-semibold tracking-wider">per night (short stay)</p>
              <div className="h-px bg-gray-100 w-full mb-6"></div>
              <p className="text-base text-gray-600">or <span className="font-bold text-gray-900">$2,200 / month</span> (long stay)</p>
            </div>
          </div>
          <p className="text-center text-sm text-gray-400 mt-10">*Prices are indicative and subject to availability and season. Contact us for exact quotes.</p>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16 text-gray-900 font-serif">Why Guests Love Airport Grande</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-amber-600" />
              </div>
              <h4 className="text-xl font-bold mb-3 text-gray-900">24-Hour Security & Power</h4>
              <p className="text-base text-gray-600 leading-relaxed">Gated property with professional security and full power backup for uninterrupted comfort.</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Utensils className="w-10 h-10 text-amber-600" />
              </div>
              <h4 className="text-xl font-bold mb-3 text-gray-900">Daily Breakfast Service</h4>
              <p className="text-base text-gray-600 leading-relaxed">Fresh continental or local Ghanaian breakfast delivered right to your door every morning.</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-10 h-10 text-amber-600" />
              </div>
              <h4 className="text-xl font-bold mb-3 text-gray-900">Prime Location</h4>
              <p className="text-base text-gray-600 leading-relaxed">Just 10 minutes from Kotoka Airport in the prestigious Airport Residential Area.</p>
            </div>
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
