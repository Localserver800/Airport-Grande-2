"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import { 
  LayoutDashboard, Building2, CalendarCheck, Globe, 
  Bell, LogOut, CheckCircle, Clock, Trash2, Menu, X, PlusCircle, Calendar as CalendarIcon 
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    available: 14,
    booked: 0,
    occupied: 0,
    pending: 0
  });

  // New Room Form State
  const [newRoom, setNewRoom] = useState({ name: "", type: "", status: "available" });

  // --- THE SECURITY CHECK ---
  useEffect(() => {
    const checkAdminAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/admin/login");
        return;
      }

      // Your actual admin email from environment variables
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "airportgrande@gmail.com"; 

      if (session.user.email !== adminEmail) {
        alert("Unauthorized access. Admin privileges required.");
        router.push("/");
        return;
      }

      setIsAuthorized(true);
    };

    checkAdminAccess();
  }, [router]);

  useEffect(() => {
    if (isAuthorized) {
      fetchData();

      // SUPABASE REALTIME MAGIC: Listen for new bookings instantly!
      const channel = supabase.channel('custom-all-channel')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bookings' }, (payload) => {
          const newBooking = payload.new;
          setNotifications(prev => [newBooking, ...prev]);
          fetchData(); // Refresh data silently
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isAuthorized]);

  const fetchData = async () => {
    try {
      const [roomsRes, bookingsRes] = await Promise.all([
        supabase.from("rooms").select("*").order("name"),
        supabase.from("bookings").select("*").order("created_at", { ascending: false })
      ]);
      
      const roomsData = roomsRes.data || [];
      const bookingsData = bookingsRes.data || [];
      
      setRooms(roomsData);
      setBookings(bookingsData);

      // Calculate live numbers based on 14 total units
      const totalBooked = bookingsData.length;
      const totalRooms = 14;

      setStats({
        available: Math.max(0, totalRooms - totalBooked),
        booked: totalBooked,
        occupied: roomsData.filter(r => r.status === 'occupied').length,
        pending: roomsData.filter(r => r.status === 'pending').length,
      });

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- ROOM MANAGEMENT ---
  const updateRoomStatus = async (id, newStatus) => {
    await supabase.from("rooms").update({ status: newStatus }).eq("id", id);
    fetchData();
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    const id = newRoom.name.toLowerCase().replace(/\s+/g, '-');
    await supabase.from("rooms").insert([{ id, name: newRoom.name, type: newRoom.type, status: newRoom.status }]);
    setNewRoom({ name: "", type: "", status: "available" });
    fetchData();
    alert("Room created successfully!");
  };

  // --- BOOKING MANAGEMENT ---
  const updateBookingStatus = async (id, newStatus) => {
    await supabase.from("bookings").update({ status: newStatus }).eq("id", id);
    fetchData();
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("Delete this booking permanently?")) return;
    await supabase.from("bookings").delete().eq("id", id);
    fetchData();
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-xl font-semibold text-amber-600 animate-pulse">Verifying Admin Credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col md:flex-row">
      
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* TOP NAVBAR */}
      <nav className="bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm fixed top-0 left-0 right-0 z-40 h-16 flex items-center px-4 justify-between md:ml-64">
        <div className="flex items-center gap-3 md:hidden">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-600">
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-xl font-bold text-amber-700 font-serif">Airport Grande</span>
        </div>
        <div className="hidden md:block">
          <span className="text-sm text-gray-500 font-medium">Management Portal</span>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="relative p-2 rounded-xl hover:bg-amber-50 text-gray-600 transition-colors">
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <>
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center z-10">{notifications.length}</span>
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-400 opacity-50 animate-ping"></span>
              </>
            )}
          </button>
          <Link href="/" className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1.5 transition-colors">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Exit</span>
          </Link>
        </div>
      </nav>

      {/* NOTIFICATION PANEL */}
      {isNotifOpen && (
        <div className="fixed top-16 right-0 w-80 h-[calc(100vh-64px)] bg-white border-l border-gray-100 shadow-2xl z-50 overflow-y-auto transform transition-transform">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white">
            <h3 className="font-bold text-gray-900">Live Alerts</h3>
            <button onClick={() => setNotifications([])} className="text-xs text-red-500 hover:underline">Clear</button>
          </div>
          <div className="p-2">
            {notifications.length === 0 ? (
              <p className="text-center text-gray-400 text-sm mt-10">No new notifications</p>
            ) : (
              notifications.map((n, i) => (
                <div key={i} className="p-3 mb-2 bg-amber-50/50 rounded-xl border border-amber-100/50">
                  <p className="text-sm font-semibold text-gray-900">New Booking!</p>
                  <p className="text-xs text-gray-600">{n.guest_name} booked {n.room_name}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{n.check_in} → {n.check_out}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className={`w-64 bg-white border-r border-gray-100 shadow-xl md:shadow-none fixed h-full z-50 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-5 h-16 flex items-center border-b border-gray-100">
          <span className="text-xl font-bold text-amber-700 font-serif">Airport Grande</span>
          <span className="ml-2 text-[10px] font-bold bg-gray-900 text-white px-2 py-0.5 rounded-md">ADMIN</span>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100vh-64px)]">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 px-3">Management</p>
          <nav className="space-y-1">
            <button onClick={() => {setActiveTab('overview'); setIsSidebarOpen(false);}} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${activeTab === 'overview' ? 'bg-amber-50 text-amber-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
              <LayoutDashboard className="w-4 h-4" /> Overview
            </button>
            <button onClick={() => {setActiveTab('rooms'); setIsSidebarOpen(false);}} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${activeTab === 'rooms' ? 'bg-amber-50 text-amber-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
              <Building2 className="w-4 h-4" /> Rooms
            </button>
            <button onClick={() => {setActiveTab('bookings'); setIsSidebarOpen(false);}} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${activeTab === 'bookings' ? 'bg-amber-50 text-amber-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
              <CalendarCheck className="w-4 h-4" /> All Bookings
            </button>
            <Link href="/admin/calendar" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-100 transition-colors">
              <CalendarIcon className="w-4 h-4" /> Calendar View
            </Link>
          </nav>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 px-3 mt-8">Site</p>
          <nav className="space-y-1">
            <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              <Globe className="w-4 h-4" /> View Website
            </Link>
          </nav>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 md:ml-64 pt-20 p-6 max-w-6xl w-full">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-amber-600">Loading Dashboard...</div>
        ) : (
          <>
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 font-serif">Dashboard Overview</h1>
                  <p className="text-gray-500 mt-1">Live status of your property.</p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-3"><div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center"><CheckCircle className="w-4 h-4 text-green-600" /></div><span className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Available</span></div>
                    <p className="text-4xl font-bold text-gray-900">{stats.available}</p>
                  </div>
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-3"><div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center"><CalendarCheck className="w-4 h-4 text-blue-600" /></div><span className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Booked</span></div>
                    <p className="text-4xl font-bold text-gray-900">{stats.booked}</p>
                  </div>
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-3"><div className="w-9 h-9 rounded-xl bg-pink-50 flex items-center justify-center"><Building2 className="w-4 h-4 text-pink-600" /></div><span className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Occupied</span></div>
                    <p className="text-4xl font-bold text-gray-900">{stats.occupied}</p>
                  </div>
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-3"><div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center"><Clock className="w-4 h-4 text-amber-600" /></div><span className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Pending</span></div>
                    <p className="text-4xl font-bold text-gray-900">{stats.pending}</p>
                  </div>
                </div>
              </div>
            )}

            {/* ROOMS TAB */}
            {activeTab === 'rooms' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 font-serif">Room Management</h1>
                    <p className="text-gray-500 mt-1">Manage physical room status.</p>
                  </div>
                </div>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rooms.map(room => (
                    <div key={room.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-xs text-gray-400 font-mono uppercase">{room.id}</p>
                          <h3 className="text-lg font-bold text-gray-900">{room.name}</h3>
                          <p className="text-sm text-gray-500">{room.type}</p>
                        </div>
                      </div>
                      <select 
                        value={room.status} 
                        onChange={(e) => updateRoomStatus(room.id, e.target.value)}
                        className={`w-full text-sm font-semibold px-3 py-2 rounded-xl border-none outline-none ring-1 ring-gray-200 focus:ring-amber-500 ${room.status === 'available' ? 'bg-green-50 text-green-700' : room.status === 'pending' ? 'bg-amber-50 text-amber-700' : room.status === 'booked' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'}`}
                      >
                        <option value="available">Available</option>
                        <option value="pending">Pending Cleaning</option>
                        <option value="booked">Booked</option>
                        <option value="occupied">Occupied</option>
                      </select>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7 max-w-xl mt-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2"><PlusCircle className="w-5 h-5 text-amber-600"/> Create New Room</h2>
                  <form onSubmit={handleCreateRoom} className="space-y-4">
                    <input type="text" placeholder="Room Name (e.g. Room 10)" required value={newRoom.name} onChange={e => setNewRoom({...newRoom, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 outline-none text-sm" />
                    <select required value={newRoom.type} onChange={e => setNewRoom({...newRoom, type: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 outline-none text-sm">
                      <option value="">-- Select Type --</option>
                      <option value="Standard Room">Standard Room</option>
                      <option value="2-Bedroom Apartment">2-Bedroom Apartment</option>
                    </select>
                    <button type="submit" className="w-full bg-gray-900 text-white font-semibold py-3 rounded-xl hover:bg-gray-800 transition-colors">Add Room</button>
                  </form>
                </div>
              </div>
            )}

            {/* BOOKINGS TAB */}
            {activeTab === 'bookings' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 font-serif">All Bookings</h1>
                  <p className="text-gray-500 mt-1">Manage guest reservations.</p>
                </div>
                
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          <th className="px-5 py-4 font-semibold text-gray-500 uppercase">Guest</th>
                          <th className="px-5 py-4 font-semibold text-gray-500 uppercase">Room</th>
                          <th className="px-5 py-4 font-semibold text-gray-500 uppercase">Dates</th>
                          <th className="px-5 py-4 font-semibold text-gray-500 uppercase">Status</th>
                          <th className="px-5 py-4 font-semibold text-gray-500 uppercase text-right">Delete</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {bookings.length === 0 ? (
                          <tr><td colSpan="5" className="px-5 py-8 text-center text-gray-400">No bookings found.</td></tr>
                        ) : (
                          bookings.map(b => (
                            <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-5 py-4">
                                <p className="font-semibold text-gray-900">{b.guest_name}</p>
                                <p className="text-xs text-gray-500">{b.guest_email}</p>
                                <p className="text-xs text-gray-500">{b.guest_phone}</p>
                              </td>
                              <td className="px-5 py-4 text-gray-700">{b.room_name}</td>
                              <td className="px-5 py-4 text-gray-600">
                                {b.check_in} <br/> <span className="text-xs text-gray-400">to</span> {b.check_out}
                              </td>
                              <td className="px-5 py-4">
                                {b.status === 'confirmed' ? (
                                  <button 
                                    onClick={() => updateBookingStatus(b.id, 'checked_in')}
                                    className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 text-xs font-bold transition-colors shadow-sm"
                                  >
                                    Check In
                                  </button>
                                ) : b.status === 'checked_in' ? (
                                  <button 
                                    onClick={() => updateBookingStatus(b.id, 'checked_out')}
                                    className="bg-amber-600 text-white px-4 py-2 rounded-xl hover:bg-amber-700 text-xs font-bold transition-colors shadow-sm"
                                  >
                                    Check Out
                                  </button>
                                ) : b.status === 'pending' ? (
                                  <button 
                                    onClick={() => updateBookingStatus(b.id, 'confirmed')}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 text-xs font-bold transition-colors shadow-sm"
                                  >
                                    Approve
                                  </button>
                                ) : (
                                  <span className="text-gray-400 text-xs font-bold uppercase tracking-wider italic">
                                    {b.status.replace('_', ' ')}
                                  </span>
                                )}
                              </td>
                              <td className="px-5 py-4 text-right">
                                <button onClick={() => deleteBooking(b.id)} className="text-gray-400 hover:text-red-500 transition-colors p-2">
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}