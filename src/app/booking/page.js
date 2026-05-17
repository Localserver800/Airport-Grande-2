"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { ArrowLeft, ArrowRight, LayoutDashboard, LogOut, Check, Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabase";

// Mock pricing for demonstration (Price per night in GHS)
const ROOM_PRICES = {
  "Apartment": 1200,
  "Room": 600
};

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Auth State (Optional now, just for auto-filling)
  const [user, setUser] = useState(null);

  // Form & UI State
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ text: "", type: "" });
  const [summary, setSummary] = useState({ nights: 0, total: 0, text: "" });

  const [formData, setFormData] = useState({
    roomId: "",
    roomLabel: "",
    checkIn: "",
    checkOut: "",
    numGuests: "",
    name: "",
    email: "",
    phone: "",
    specialRequests: "",
  });

  // 1. Pre-fill Logic (URL Params & Optional Logged-in User)
  useEffect(() => {
    const fetchUserDataAndParams = async () => {
      let initialData = { ...formData };

      // Pull ALL URL Params (from Homepage)
      const urlCheckIn = searchParams.get("checkin");
      const urlCheckOut = searchParams.get("checkout");
      const urlGuests = searchParams.get("guests");
      const urlType = searchParams.get("type"); // Keeping this just in case!

      // Apply the data so it auto-fills the form!
      if (urlCheckIn) initialData.checkIn = urlCheckIn;
      if (urlCheckOut) initialData.checkOut = urlCheckOut;
      if (urlGuests) initialData.numGuests = urlGuests;
      
      if (urlType === "Apartment") {
        initialData.roomId = "apt-1";
        initialData.roomLabel = "Apartment 1 – 2 Bedroom";
      } else if (urlType === "Room") {
        initialData.roomId = "room-1";
        initialData.roomLabel = "Room 1 – Standard";
      }

      // Check Auth just to be helpful and auto-fill user details
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        initialData.email = session.user.email;
        initialData.name = session.user.user_metadata?.full_name || "";
        initialData.phone = session.user.user_metadata?.phone || "";
      }

      setFormData(initialData);
    };

    fetchUserDataAndParams();
  }, [searchParams]);

  // 2. Dynamic Summary Calculator
  useEffect(() => {
    if (formData.checkIn && formData.checkOut && formData.roomId && formData.numGuests) {
      const start = new Date(formData.checkIn);
      const end = new Date(formData.checkOut);
      const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      
      if (nights > 0) {
        const isApartment = formData.roomLabel.includes("Apartment");
        const pricePerNight = isApartment ? ROOM_PRICES["Apartment"] : ROOM_PRICES["Room"];
        const total = nights * pricePerNight;

        setSummary({
          nights,
          total,
          text: `${formData.roomLabel} · ${nights} night${nights > 1 ? 's' : ''} · ${formData.numGuests} guest${formData.numGuests > 1 ? 's' : ''} · Total: GHS ${total}`
        });
      } else {
        setSummary({ nights: 0, total: 0, text: "" });
      }
    } else {
      setSummary({ nights: 0, total: 0, text: "" });
    }
  }, [formData]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    let newLabel = formData.roomLabel;
    
    if (id === "roomId") {
      newLabel = e.target.options[e.target.selectedIndex].text;
    }
    
    setFormData((prev) => ({ ...prev, [id]: value, roomLabel: newLabel }));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // Validation Steps
  const validateStep1 = () => {
    if (!formData.roomId || !formData.checkIn || !formData.checkOut || !formData.numGuests) {
      alert("Please fill in all room and date details.");
      return false;
    }
    if (formData.checkOut <= formData.checkIn) {
      alert("Check-out date must be after check-in date.");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please fill in your name, email, and phone.");
      return false;
    }
    return true;
  };

  // 3. The Guest Checkout Booking Flow
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg({ text: "", type: "" });

    try {
      // Step A: Check Availability
      const { data: existingBookings, error: checkError } = await supabase
        .from('bookings')
        .select('*')
        .eq('room_id', formData.roomId)
        .lte('check_in', formData.checkOut)
        .gte('check_out', formData.checkIn)
        .not('status', 'eq', 'cancelled');

      if (checkError) throw checkError;

      if (existingBookings.length > 0) {
        setStatusMsg({ text: "Sorry, this room is already booked for these dates.", type: "error" });
        setLoading(false);
        return;
      }

      // Step B: Trigger Paystack (Using the typed-in email!)
      if (typeof window !== 'undefined' && window.PaystackPop) {
        const handler = window.PaystackPop.setup({
          key: 'pk_test_241a5877501d961c82643193a90d669714c25bb4', 
          email: formData.email, 
          amount: 50, 
          currency: 'GHS',
          
          // Use a standard function here so Paystack's old validator accepts it
          callback: function(response) {
            // Wrap our modern async logic inside
            const processBooking = async () => {
              try {
                const res = await fetch('/api/book', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    checkIn: formData.checkIn,
                    checkOut: formData.checkOut,
                    roomId: formData.roomId,
                    roomLabel: formData.roomLabel,
                    specialRequests: formData.specialRequests,
                    paymentRef: response.reference 
                  })
                });

                const data = await res.json();

                if (data.success) {
                  setStatusMsg({ text: "Payment successful! Booking confirmed and email sent.", type: "success" });
                  // If logged in, go to dashboard. If guest, go home.
                  setTimeout(() => router.push(user ? '/client-dashboard' : '/'), 4000);
                } else {
                  throw new Error(data.message);
                }
                
              } catch (err) {
                console.error("Database save error:", err);
                setStatusMsg({ text: "Payment succeeded, but failed to save. Please contact us with your reference.", type: "error" });
                setLoading(false);
              }
            };

            // Run it!
            processBooking();
          },
          
          // Standard function here too, just to be completely safe
          onClose: function() {
            setStatusMsg({ text: "Payment cancelled. Your room has not been booked.", type: "error" });
            setLoading(false);
          }
        });

        handler.openIframe();
      } else {
        setStatusMsg({ text: "Payment provider not loaded. Please refresh the page.", type: "error" });
        setLoading(false);
      }

    } catch (err) {
      console.error("System error:", err);
      setStatusMsg({ text: "An error occurred. Please try again.", type: "error" });
      setLoading(false);
    }
  };

  const stepIndicator = (num, title) => {
    const isCompleted = step > num;
    const isActive = step === num;
    let containerClass = "flex items-center gap-2 transition-colors ";
    let circleClass = "w-6 h-6 rounded-full flex items-center justify-center ";
    
    if (isCompleted || isActive) {
      containerClass += isActive ? "text-amber-600 font-semibold" : "text-green-600 font-semibold";
      circleClass += isActive ? "bg-amber-100" : "bg-green-100";
    } else {
      containerClass += "text-gray-400";
      circleClass += "bg-gray-100";
    }

    return (
      <div className={containerClass}>
        <span className={circleClass}>
          {isCompleted ? <Check className="w-3 h-3" /> : num}
        </span>
        <span className="hidden sm:inline">{title}</span>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Script src="https://js.paystack.co/v1/inline.js" strategy="lazyOnload" />

      {/* NAVBAR */}
      <nav className="bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-20">
          <Link href="/" className="text-2xl font-bold text-amber-700 font-serif">Airport Grande</Link>
          <div className="flex items-center gap-5">
            {user ? (
              <>
                <Link href="/client-dashboard" className="text-sm text-gray-600 hover:text-amber-600 flex items-center gap-2 transition-colors">
                  <LayoutDashboard className="w-4 h-4" /> <span className="hidden sm:inline">My Dashboard</span>
                </Link>
                <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1.5 transition-colors">
                  <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Sign Out</span>
                </button>
              </>
            ) : (
              <Link href="/" className="text-sm text-gray-600 hover:text-amber-600 flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to Home
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-4 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 font-serif">Book Your Stay</h1>
          <p className="text-gray-500 mt-3">Fill in your details below. Availability is checked in real time.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          <div className="flex items-center justify-between mb-10 text-xs md:text-sm font-medium">
            {stepIndicator(1, "Rooms & Dates")}
            <div className="h-px bg-gray-100 flex-1 mx-2 sm:mx-4"></div>
            {stepIndicator(2, "Your Details")}
            <div className="h-px bg-gray-100 flex-1 mx-2 sm:mx-4"></div>
            {stepIndicator(3, "Confirmation")}
          </div>

          <form onSubmit={handleBookingSubmit} className="space-y-8">
            
            {/* STEP 1: ROOMS AND DATES */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-xl font-bold text-gray-900 mb-4 font-serif">Choose Room & Dates</h2>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Room / Apartment *</label>
                  <select id="roomId" value={formData.roomId} onChange={handleChange} required className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-amber-500 text-base bg-white text-gray-900 font-medium">
                    <option value="">-- Select a room --</option>
                    <optgroup label="2-Bedroom Apartments">
                      <option value="apt-1">Apartment 1 – 2 Bedroom</option>
                      <option value="apt-2">Apartment 2 – 2 Bedroom</option>
                      <option value="apt-3">Apartment 3 – 2 Bedroom</option>
                      <option value="apt-4">Apartment 4 – 2 Bedroom</option>
                      <option value="apt-5">Apartment 5 – 2 Bedroom</option>
                      <option value="apt-6">Apartment 6 – 2 Bedroom</option>
                      <option value="apt-7">Apartment 7 – 2 Bedroom</option>
                      <option value="apt-8">Apartment 8 – 2 Bedroom</option>
                    </optgroup>
                    <optgroup label="Standard Rooms">
                      <option value="room-1">Room 1 – Standard</option>
                      <option value="room-2">Room 2 – Standard</option>
                      <option value="room-3">Room 3 – Standard</option>
                      <option value="room-4">Room 4 – Standard</option>
                      <option value="room-5">Room 5 – Standard</option>
                      <option value="room-6">Room 6 – Standard</option>
                    </optgroup>
                  </select>
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Check-In Date *</label>
                    <input type="date" id="checkIn" value={formData.checkIn} onChange={handleChange} required min={new Date().toISOString().split('T')[0]} className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-amber-500 text-base bg-white text-gray-900 font-medium" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Check-Out Date *</label>
                    <input type="date" id="checkOut" value={formData.checkOut} onChange={handleChange} required min={formData.checkIn || new Date().toISOString().split('T')[0]} className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-amber-500 text-base bg-white text-gray-900 font-medium" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Guests *</label>
                  <select id="numGuests" value={formData.numGuests} onChange={handleChange} required className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-amber-500 text-base bg-white text-gray-900 font-medium">
                    <option value="">-- Select guests --</option>
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="5">5+ Guests (contact us)</option>
                  </select>
                </div>
                <button type="button" onClick={() => validateStep1() && setStep(2)} className="w-full bg-gradient-to-br from-amber-600 to-amber-800 text-white font-semibold py-5 rounded-2xl text-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-3">
                  <span>Continue to Details</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* STEP 2: DETAILS */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-xl font-bold text-gray-900 mb-4 font-serif">Your Details</h2>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                    <input type="text" id="name" value={formData.name} onChange={handleChange} required placeholder="e.g. Kwame Mensah" className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-amber-500 text-base bg-white text-gray-900 font-medium" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                    <input type="tel" id="phone" value={formData.phone} onChange={handleChange} required placeholder="+233 XX XXX XXXX" className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-amber-500 text-base bg-white text-gray-900 font-medium" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                  <input type="email" id="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-amber-500 text-base bg-white text-gray-900 font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Special Requests <span className="font-normal text-gray-400">(optional)</span></label>
                  <textarea id="specialRequests" value={formData.specialRequests} onChange={handleChange} rows="3" placeholder="Early check-in, dietary needs..." className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-amber-500 text-base resize-none bg-white text-gray-900 font-medium"></textarea>
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 bg-gray-100 text-gray-700 font-semibold py-5 rounded-2xl text-lg transition-all hover:bg-gray-200">Back</button>
                  <button type="button" onClick={() => validateStep2() && setStep(3)} className="flex-[2] bg-gradient-to-br from-amber-600 to-amber-800 text-white font-semibold py-5 rounded-2xl text-lg transition-all hover:scale-[1.02]">Review Booking</button>
                </div>
              </div>
            )}

            {/* STEP 3: CONFIRM & PAY */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-xl font-bold text-gray-900 mb-4 font-serif">Confirm Your Reservation</h2>
                
                <div className="bg-amber-50 rounded-2xl p-6 space-y-4 border border-amber-100">
                  <div className="flex justify-between border-b border-amber-200/50 pb-2">
                    <span className="text-sm text-amber-800/60 uppercase font-semibold">Room</span>
                    <span className="font-bold text-amber-900">{formData.roomLabel}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-b border-amber-200/50 pb-2">
                    <div>
                      <span className="text-xs text-amber-800/60 uppercase font-semibold block">Check-In</span>
                      <span className="font-bold text-amber-900">{formData.checkIn}</span>
                    </div>
                    <div>
                      <span className="text-xs text-amber-800/60 uppercase font-semibold block">Check-Out</span>
                      <span className="font-bold text-amber-900">{formData.checkOut}</span>
                    </div>
                  </div>
                  <div className="flex justify-between border-b border-amber-200/50 pb-2">
                    <span className="text-xs text-amber-800/60 uppercase font-semibold block">Guest</span>
                    <span className="font-bold text-amber-900">{formData.name}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-sm text-amber-800/60 uppercase font-bold">Total Cost</span>
                    <span className="font-black text-xl text-amber-900">GHS {summary.total}</span>
                  </div>
                </div>

                {statusMsg.text && (
                  <div className={`rounded-2xl px-6 py-4 text-base font-medium ${statusMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {statusMsg.text}
                  </div>
                )}

                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep(2)} disabled={loading} className="flex-1 bg-gray-100 text-gray-700 font-semibold py-5 rounded-2xl text-lg transition-all hover:bg-gray-200 disabled:opacity-50">Back</button>
                  <button type="submit" disabled={loading} className="flex-[2] bg-gradient-to-br from-amber-600 to-amber-800 text-white font-semibold py-5 rounded-2xl text-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:scale-100">
                    {loading ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                    ) : (
                      <><Check className="w-5 h-5" /> PAY & CONFIRM</>
                    )}
                  </button>
                </div>
                <p className="text-center text-xs text-gray-400">Secure payment powered by Paystack. By booking you agree to our cancellation policy.</p>
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center text-amber-600 font-semibold">Initializing booking system...</div>}>
      <BookingContent />
    </Suspense>
  );
}