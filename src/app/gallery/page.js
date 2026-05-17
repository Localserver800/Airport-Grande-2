"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, Maximize2 } from "lucide-react";

// --- YOUR GALLERY DATA ---
const GALLERY_IMAGES = [
  { id: 1, src: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2070", category: "Facilities", title: "Property Exterior", subtitle: "Modern & Welcoming" },
  { id: 2, src: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=2070", category: "Apartments", title: "2-Bedroom Apartment", subtitle: "Open-Plan Living Area" },
  { id: 3, src: "https://images.unsplash.com/photo-1556911220-e15224bbaf39?auto=format&fit=crop&q=80&w=2070", category: "Apartments", title: "Kitchen", subtitle: "Fully Equipped" },
  { id: 4, src: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=2074", category: "Rooms", title: "Bedroom", subtitle: "Restful & Spacious" },
  { id: 5, src: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=2070", category: "Rooms", title: "Bathroom", subtitle: "Clean & Modern" },
  { id: 6, src: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=2070", category: "Facilities", title: "Outdoor Space", subtitle: "Terrace & Garden" },
  { id: 7, src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=2070", category: "Apartments", title: "Dining Area", subtitle: "Perfect for Families" },
  { id: 8, src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=2070", category: "Facilities", title: "Fitness Centre", subtitle: "Stay Active" },
  { id: 9, src: "https://images.unsplash.com/photo-1540555700478-4be289fbecee?auto=format&fit=crop&q=80&w=2070", category: "Facilities", title: "Swimming Pool Area", subtitle: "Relax & Unwind" },
];

const CATEGORIES = ["All", "Apartments", "Rooms", "Facilities"];

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const filteredImages = activeFilter === "All" 
    ? GALLERY_IMAGES 
    : GALLERY_IMAGES.filter(img => img.category === activeFilter);

  return (
    <div className="font-sans bg-gray-50 scroll-smooth">
      
      {/* NAVBAR */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/85 backdrop-blur-xl border-b border-white/40">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          <Link href="/">
            <span className="text-2xl md:text-3xl font-bold text-amber-700 tracking-tight font-serif">Airport Grande</span>
          </Link>

          <div className="hidden md:flex items-center gap-x-7 text-sm font-medium">
            <Link href="/" className="text-gray-900 hover:text-amber-600 transition-colors">Home</Link>
            <Link href="/rooms" className="text-gray-900 hover:text-amber-600 transition-colors">Rooms</Link>
            <Link href="/gallery" className="text-amber-600 font-semibold">Gallery</Link>
            <Link href="/login" className="text-gray-900 hover:text-amber-600 transition-colors">Sign In</Link>
            <Link href="/booking" className="bg-gradient-to-br from-amber-600 to-amber-800 text-white px-7 py-3.5 rounded-3xl font-semibold shadow-lg hover:scale-105 transition-transform ml-2">
              CHECK AVAILABILITY
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-3">
            <Link href="/booking" className="bg-gradient-to-br from-amber-600 to-amber-800 text-white px-4 py-2.5 rounded-2xl font-semibold text-xs shadow-md">
              Check Availability
            </Link>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-800 p-1.5">
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-2xl px-6 pt-5 pb-8 flex flex-col gap-1 text-base font-medium">
            <Link href="/" className="py-3.5 border-b border-gray-100 text-gray-800">Home</Link>
            <Link href="/rooms" className="py-3.5 border-b border-gray-100 text-gray-800">Rooms</Link>
            <Link href="/gallery" className="py-3.5 border-b border-gray-100 text-amber-600">Gallery</Link>
            <Link href="/login" className="py-3.5 border-b border-gray-100 text-gray-800">Sign In</Link>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="relative h-screen min-h-[640px] flex items-center pt-20">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=2070" 
            alt="Beautiful exterior and garden at Airport Grande"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/25"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-white mb-6 font-serif">
              Live the Look
            </h1>
            <p className="text-lg sm:text-xl text-white/90">
              Step inside our fully furnished serviced apartments and rooms in the peaceful Airport Residential Area, Accra.
            </p>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white animate-bounce">
          <ChevronDown className="w-9 h-9" />
        </div>
      </section>

      {/* GALLERY GRID */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* FILTER BUTTONS */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeFilter === category 
                    ? "bg-amber-700 text-white shadow-md scale-105" 
                    : "bg-gray-50 text-gray-600 border border-gray-200 hover:border-amber-600 hover:text-amber-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredImages.map((image) => (
              <div 
                key={image.id} 
                className="group rounded-3xl overflow-hidden shadow-xl cursor-pointer relative"
                onClick={() => setSelectedImage(image)}
              >
                <img 
                  src={image.src} 
                  alt={image.title} 
                  className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                  <div className="text-white w-full">
                    <p className="text-sm font-medium text-amber-400 mb-1">{image.title}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-2xl font-semibold font-serif">{image.subtitle}</p>
                      <Maximize2 className="w-5 h-5 text-white/80" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FULLSCREEN LIGHTBOX */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-gray-900/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center">
            <button 
              className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full backdrop-blur-md transition-all font-semibold"
              onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
            >
              Close
            </button>
            <img 
              src={selectedImage.src} 
              alt={selectedImage.title} 
              className="max-h-[80vh] max-w-full rounded-lg shadow-2xl object-contain"
            />
            <div className="text-center mt-6">
              <p className="text-white font-serif text-2xl mb-1">{selectedImage.subtitle}</p>
              <p className="text-amber-500 text-sm font-semibold uppercase tracking-widest">{selectedImage.title}</p>
            </div>
          </div>
        </div>
      )}

      {/* FINAL CTA */}
      <section className="py-28 bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-none mb-8 font-serif">
            Experience Airport Grande Yourself
          </h2>
          <p className="text-base sm:text-lg text-gray-300 mb-12">
            These photos show only a glimpse. Come and see the warmth and comfort in person.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/booking" className="bg-gradient-to-br from-amber-600 to-amber-800 text-white text-base sm:text-lg font-semibold px-16 py-6 rounded-3xl hover:scale-105 transition-transform shadow-lg">
              BROWSE AVAILABLE UNITS
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-10">
            <div>
              <span className="text-3xl font-bold text-amber-300 tracking-tight font-serif">Airport Grande</span>
              <p className="text-gray-400 mt-2 text-base">Luxury serviced apartments & rooms in Accra.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-6 text-base">Explore</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link href="/rooms" className="hover:text-white transition-colors">Rooms & Floor Plans</Link></li>
                <li><Link href="/gallery" className="hover:text-white transition-colors">Gallery</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-6 text-base">Contact</h4>
              <p className="text-sm text-gray-400">+233 20 135 1116<br/>airportgrande@gmail.com</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-16 pt-8 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center">
            <p>© 2026 Airport Grande Luxury Lodge & Apartments. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}