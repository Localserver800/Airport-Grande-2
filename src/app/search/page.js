"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, ArrowRight, Calendar, Users, Home, Wifi, 
  AirVent, Tv, ShowerHead, Utensils, WashingMachine, 
  Shield, CheckCircle, Loader2, Menu, X 
} from "lucide-react";
import { supabase } from "../../lib/supabase";

const ALL_ROOMS = [
  { id: "apt-1", name: "Apartment 1", type: "Apartment", price: 1200, label: "Apartment 1 – 2 Bedroom", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=2070" },
  { id: "apt-2", name: "Apartment 2", type: "Apartment", price: 1200, label: "Apartment 2 – 2 Bedroom", image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=2071" },
  { id: "apt-3", name: "Apartment 3", type: "Apartment", price: 1200, label: "Apartment 3 – 2 Bedroom", image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=2070" },
  { id: "apt-4", name: "Apartment 4", type: "Apartment", price: 1200, label: "Apartment 4 – 2 Bedroom", image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=2074" },
  { id: "apt-5", name: "Apartment 5", type: "Apartment", price: 1200, label: "Apartment 5 – 2 Bedroom", image: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&q=80&w=2073" },
  { id: "apt-6", name: "Apartment 6", type: "Apartment", price: 1200, label: "Apartment 6 – 2 Bedroom", image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&q=80&w=2070" },
  { id: "apt-7", name: "Apartment 7", type: "Apartment", price: 1200, label: "Apartment 7 – 2 Bedroom", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=2070" },
  { id: "apt-8", name: "Apartment 8", type: "Apartment", price: 1200, label: "Apartment 8 – 2 Bedroom", image: "https://images.unsplash.com/photo-1499916156339-fe1825b2444d?auto=format&fit=crop&q=80&w=2070" },
  { id: "room-1", name: "Room 1", type: "Room", price: 600, label: "Room 1 – Standard", image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=2074" },
  { id: "room-2", name: "Room 2", type: "Room", price: 600, label: "Room 2 – Standard", image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=2074" },
  { id: "room-3", name: "Room 3", type: "Room", price: 600, label: "Room 3 – Standard", image: "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&q=80&w=2074" },
  { id: "room-4", name: "Room 4", type: "Room", price: 600, label: "Room 4 – Standard", image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=2070" },
  { id: "room-5", name: "Room 5", type: "Room", price: 600, label: "Room 5 – Standard", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=2070" },
  { id: "room-6", name: "Room 6", type: "Room", price: 600, label: "Room 6 – Standard", image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=2070" }
];

function SearchResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [availableRooms, setAvailableRooms] = useState([]);
  
  const arrival = searchParams.get("arrival");
  const departure = searchParams.get("departure");
  const guests = searchParams.get("guests") || "1 Guest";

  useEffect(() => {
    async function checkAvailability() {
      if (!arrival || !departure) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Step 1: Get all bookings that overlap with requested dates
        const { data: bookings, error } = await supabase
          .from('bookings')
          .select('room_id')
          .lte('check_in', departure)
          .gte('check_out', arrival)
          .not('status', 'eq', 'cancelled');

        if (error) throw error;

        // Step 2: Extract booked room IDs
        const bookedRoomIds = bookings.map(b => b.room_id);

        // Step 3: Filter ALL_ROOMS to find available ones
        const available = ALL_ROOMS.filter(room => !bookedRoomIds.includes(room.id));
        
        setAvailableRooms(available);
      } catch (err) {
        console.error("Availability check failed:", err);
      } finally {
        setLoading(false);
      }
    }

    checkAvailability();
  }, [arrival, departure]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

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
              <Link href="/gallery" className="text-gray-900 hover:text-amber-600 transition-colors">Gallery</Link>
              <Link href="/contact" className="text-gray-900 hover:text-amber-600 transition-colors">Contact</Link>
              <Link href="/login" className="text-gray-900 hover:text-amber-600 transition-colors">Sign In</Link>
              <Link href="/booking" className="bg-gradient-to-br from-amber-600 to-amber-800 text-white px-7 py-3.5 rounded-full font-semibold text-sm tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all ml-2">
                BOOK NOW
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
              <Link href="/gallery" className="py-3.5 border-b border-gray-100 text-gray-800 hover:text-amber-600">Gallery</Link>
              <Link href="/contact" className="py-3.5 border-b border-gray-100 text-gray-800 hover:text-amber-600">Contact</Link>
              <Link href="/login" className="py-3.5 border-b border-gray-100 text-gray-800 hover:text-amber-600">Sign In</Link>
              <Link href="/booking" className="mt-5 block w-full text-center bg-gradient-to-br from-amber-600 to-amber-800 text-white py-4 rounded-full font-semibold text-base tracking-wide shadow-lg">
                BOOK NOW
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
        {/* Search Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 mb-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap items-center gap-6 text-gray-700">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-600" />
              <span className="font-semibold">{formatDate(arrival)}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300 hidden md:block" />
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-600" />
              <span className="font-semibold">{formatDate(departure)}</span>
            </div>
            <div className="h-4 w-px bg-gray-200 hidden md:block"></div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-600" />
              <span className="font-semibold">{guests}</span>
            </div>
          </div>
          <Link href="/" className="text-amber-600 font-bold hover:underline flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Edit Search
          </Link>
        </div>

        {/* Results Section */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 font-serif">
            {loading ? "Checking availability..." : `${availableRooms.length} Available Options`}
          </h1>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-amber-600 animate-spin mb-4" />
              <p className="text-gray-500 font-medium">Scanning our calendar for empty units...</p>
            </div>
          ) : (
            <>
              {availableRooms.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {availableRooms.map((room) => (
                    <div key={room.id} className="group bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                      <div className="relative h-64 overflow-hidden">
                        <img src={room.image} alt={room.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-amber-700 text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">
                          GHS {room.price} / night
                        </div>
                      </div>
                      <div className="p-8">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-xl font-bold text-gray-900">{room.name}</h4>
                            <p className="text-gray-500 text-sm">{room.type === 'Apartment' ? '2 Queen Beds • Up to 5 Guests' : '1 Queen Bed • 1–2 Guests'}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-emerald-600 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> Available
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-8">
                          {room.type === 'Apartment' && <span className="text-xs bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5"><Utensils className="w-3.5 h-3.5 text-amber-600" /> Kitchen</span>}
                          <span className="text-xs bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5"><Wifi className="w-3.5 h-3.5 text-amber-600" /> Wi-Fi</span>
                          <span className="text-xs bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5"><AirVent className="w-3.5 h-3.5 text-amber-600" /> AC</span>
                          <span className="text-xs bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5"><Tv className="w-3.5 h-3.5 text-amber-600" /> TV</span>
                        </div>

                        <Link 
                          href={`/booking?checkin=${arrival}&checkout=${departure}&guests=${guests}&roomId=${room.id}&roomLabel=${encodeURIComponent(room.label)}`} 
                          className="block w-full text-center bg-gradient-to-br from-amber-600 to-amber-800 text-white font-bold py-4 rounded-full hover:shadow-lg transition-all"
                        >
                          Select This Room
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 max-w-2xl mx-auto">
                  <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Calendar className="w-10 h-10 text-amber-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 font-serif">No units available for these dates</h3>
                  <p className="text-gray-600 mb-8">We are fully booked for the selected period. Try adjusting your dates or contact us directly for long-stay options.</p>
                  <Link href="/" className="inline-block bg-amber-600 text-white font-bold px-10 py-4 rounded-full hover:bg-amber-700 transition-all">
                    Change Dates
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-12 text-center">
        <p className="text-gray-400">© 2026 Airport Grande Luxury Lodge & Apartments. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center text-amber-600 font-semibold italic">Loading your search results...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
