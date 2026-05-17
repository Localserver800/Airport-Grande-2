"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, LayoutDashboard, BedDouble, LogOut } from "lucide-react";
import { supabase } from "../../../lib/supabase";

export default function AdminCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all active bookings from Supabase
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("id, guest_name, room_name, check_in, check_out, status")
          .not("status", "eq", "cancelled");

        if (error) throw error;
        setBookings(data || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // --- CALENDAR MATH ---
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday, 1 = Monday...

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // --- HELPER: Format Date to YYYY-MM-DD for comparison ---
  const formatDateString = (y, m, d) => {
    return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center font-semibold text-amber-600">Loading Calendar...</div>;

  return (
    <div className="bg-gray-50 min-h-screen font-sans flex">
      
      {/* SIDEBAR (Matches your Admin Portal style) */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-gray-100">
          <span className="text-2xl font-bold text-amber-700 font-serif">Airport<br/>Grande</span>
          <span className="ml-3 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded-md tracking-wider">ADMIN</span>
        </div>
        <div className="p-4 flex-1">
          <p className="text-xs font-bold text-gray-400 mb-4 px-2 tracking-wider">MANAGEMENT</p>
          <nav className="space-y-1">
            <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 rounded-xl hover:bg-amber-50 hover:text-amber-700 transition-colors">
              <LayoutDashboard className="w-4 h-4" /> Overview
            </Link>
            <Link href="/admin/calendar" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium bg-amber-50 text-amber-700 rounded-xl transition-colors">
              <CalendarIcon className="w-4 h-4" /> Calendar View
            </Link>
          </nav>
        </div>
        <div className="p-4 border-t border-gray-100">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-100 transition-colors">
            <LogOut className="w-4 h-4" /> Exit to Website
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-auto">
        {/* HEADER */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <h1 className="text-xl font-medium text-gray-600">Management Portal</h1>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 font-serif mb-2">Booking Calendar</h2>
            <p className="text-gray-500">View and manage all room reservations across the property.</p>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
            
            {/* CALENDAR CONTROLS */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
              <h3 className="text-2xl font-bold text-gray-900 font-serif">
                {monthNames[month]} {year}
              </h3>
              <div className="flex gap-2">
                <button onClick={handlePrevMonth} className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 hover:text-amber-600 transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                  Today
                </button>
                <button onClick={handleNextMonth} className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 hover:text-amber-600 transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* CALENDAR GRID */}
            <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider border-r border-gray-100 last:border-0">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 bg-white">
              {/* Blank squares for days before the 1st of the month */}
              {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                <div key={`blank-${index}`} className="min-h-[120px] border-r border-b border-gray-100 bg-gray-50/50 p-2"></div>
              ))}

              {/* Actual Days of the Month */}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const dayNumber = index + 1;
                const dateStr = formatDateString(year, month, dayNumber);
                
                // Find all bookings that overlap with this specific date
                const daysBookings = bookings.filter(b => {
                  return dateStr >= b.check_in && dateStr < b.check_out; 
                  // Note: We use < check_out because checkout day means the room is free in the afternoon
                });

                const isToday = dateStr === new Date().toISOString().split('T')[0];

                return (
                  <div key={dayNumber} className="min-h-[120px] border-r border-b border-gray-100 p-2 hover:bg-gray-50 transition-colors group relative">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium mb-1 ${isToday ? 'bg-amber-600 text-white' : 'text-gray-700 group-hover:text-amber-600'}`}>
                      {dayNumber}
                    </span>

                    <div className="space-y-1 mt-1">
                      {daysBookings.map(booking => {
                        const isApt = booking.room_name?.toLowerCase().includes('apartment');
                        const statusColor = booking.status === 'confirmed' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-amber-100 text-amber-800 border-amber-200';
                        
                        return (
                          <div key={booking.id} className={`text-[10px] sm:text-xs p-1.5 rounded-lg border leading-tight truncate ${statusColor} cursor-pointer hover:brightness-95 transition-all`} title={`${booking.guest_name} - ${booking.room_name}`}>
                            <div className="font-bold truncate">{booking.room_name}</div>
                            <div className="truncate opacity-80">{booking.guest_name}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}