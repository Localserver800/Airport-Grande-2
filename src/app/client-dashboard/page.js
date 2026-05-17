"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, LogOut, CalendarX, Building2, BedDouble, Calendar, X } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function ClientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const fetchUserAndBookings = async () => {
      // 1. Check Authentication
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }
      
      setUser(session.user);

      // 2. Fetch Bookings for this specific user
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .eq("guest_email", session.user.email)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setBookings(data || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndBookings();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  // --- STATS CALCULATION ---
  const stats = {
    total: bookings.length,
    upcoming: bookings.filter(b => ['confirmed', 'pending'].includes(b.status)).length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
  };

  // --- FILTER LOGIC ---
  const filteredBookings = activeFilter === "all" 
    ? bookings 
    : bookings.filter(b => b.status === activeFilter);

  // --- STATUS UI MAP ---
  const statusConfig = {
    confirmed: { label: 'Confirmed', bg: 'bg-green-100', text: 'text-green-800' },
    pending:   { label: 'Pending', bg: 'bg-amber-100', text: 'text-amber-800' },
    completed: { label: 'Completed', bg: 'bg-indigo-100', text: 'text-indigo-800' },
    cancelled: { label: 'Cancelled', bg: 'bg-red-100', text: 'text-red-800' },
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-amber-600 font-semibold">Loading your dashboard...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans pb-20">
      {/* NAVBAR */}
      <nav className="bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm fixed top-0 w-full z-40">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-20">
          <Link href="/" className="text-2xl font-bold text-amber-700 font-serif">Airport Grande</Link>
          <div className="flex items-center gap-5">
            <Link href="/booking" className="hidden sm:flex items-center gap-2 bg-gradient-to-br from-amber-600 to-amber-800 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all hover:scale-[1.02]">
              <Plus className="w-4 h-4" /> New Booking
            </Link>
            <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1.5 transition-colors">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-32 px-4 max-w-5xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-sm font-medium text-amber-600 mb-1">Welcome back,</p>
            <h1 className="text-4xl font-bold text-gray-900 font-serif">{user?.user_metadata?.full_name || "Guest"}</h1>
            <p className="text-gray-500 mt-1">Here are all your bookings at Airport Grande.</p>
          </div>
          <Link href="/booking" className="sm:hidden bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center gap-2 text-white font-semibold px-6 py-3 rounded-full text-sm">
            <Plus className="w-4 h-4" /> New Booking
          </Link>
        </div>

        {/* STATS STRIP */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Total Stays</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1">Upcoming</p>
            <p className="text-3xl font-bold text-gray-900">{stats.upcoming}</p>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">Confirmed</p>
            <p className="text-3xl font-bold text-gray-900">{stats.confirmed}</p>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-1">Completed</p>
            <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
          </div>
        </div>

        {/* FILTER TABS */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 custom-scrollbar">
          {['all', 'confirmed', 'pending', 'completed', 'cancelled'].map((filter) => (
            <button 
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${activeFilter === filter ? 'bg-amber-600 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:border-amber-400'}`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)} {filter === 'all' && 'Bookings'}
            </button>
          ))}
        </div>

        {/* BOOKINGS LIST */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 border-dashed">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-50 mb-5">
                <CalendarX className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 font-serif">No bookings found</h3>
              <p className="text-gray-500 mb-6">You don't have any bookings in this category yet.</p>
              <Link href="/booking" className="bg-gradient-to-br from-amber-600 to-amber-800 inline-flex items-center gap-2 text-white font-semibold px-8 py-4 rounded-full text-base transition-all hover:scale-[1.02] shadow-lg">
                Make a Booking
              </Link>
            </div>
          ) : (
            filteredBookings.map((b) => {
              const status = statusConfig[b.status] || statusConfig.pending;
              const isApt = b.room_name?.toLowerCase().includes('apartment');
              
              return (
                <div key={b.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row sm:items-center gap-5 transition-transform hover:-translate-y-1 hover:shadow-md duration-300">
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center">
                    {isApt ? <Building2 className="w-7 h-7 text-amber-600" /> : <BedDouble className="w-7 h-7 text-amber-600" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start gap-2 mb-1">
                      <h3 className="text-lg font-bold text-gray-900">{b.room_name}</h3>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${status.bg} ${status.text}`}>
                        {status.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-3">
                      <span className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        <Calendar className="w-4 h-4 text-amber-500" />
                        <span className="font-medium text-gray-900">{b.check_in}</span> 
                        <span className="text-gray-400">to</span> 
                        <span className="font-medium text-gray-900">{b.check_out}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-start sm:items-end gap-3 flex-shrink-0">
                    <p className="text-xs text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded-md">Ref: {b.payment_ref || b.id.substring(0,8)}</p>
                    <button 
                      onClick={() => setSelectedBooking(b)}
                      className="text-sm font-semibold text-amber-700 hover:text-amber-900 px-4 py-2 rounded-xl border border-amber-200 hover:border-amber-400 hover:bg-amber-50 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* DETAILS MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setSelectedBooking(null)} className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500">
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-6 font-serif">Booking Details</h3>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Room</span>
                <span className="font-bold text-gray-900">{selectedBooking.room_name}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Check-In</span>
                <span className="font-bold text-gray-900">{selectedBooking.check_in}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Check-Out</span>
                <span className="font-bold text-gray-900">{selectedBooking.check_out}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Status</span>
                <span className={`font-bold ${statusConfig[selectedBooking.status]?.text || 'text-gray-900'}`}>
                  {statusConfig[selectedBooking.status]?.label}
                </span>
              </div>
              <div className="py-3">
                <span className="text-gray-500 font-medium block mb-2">Special Requests:</span>
                <div className="bg-gray-50 p-4 rounded-2xl text-gray-700 italic border border-gray-100">
                  {selectedBooking.special_requests || "No special requests provided."}
                </div>
              </div>
            </div>

            <button onClick={() => setSelectedBooking(null)} className="mt-8 w-full bg-gray-900 text-white font-semibold py-4 rounded-full transition-all hover:bg-gray-800">
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}