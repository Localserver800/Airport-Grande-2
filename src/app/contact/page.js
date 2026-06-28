"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Menu, X, Phone, MapPin, Mail, Map, Clock, ArrowRight, Loader2 
} from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function ContactPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ text: "", type: "" });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    stayType: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg({ text: "", type: "" });

    try {
      // Send the message directly to your Supabase database!
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone || "Not provided",
            stay_type: formData.stayType || "General Enquiry",
            message: formData.message
          }
        ]);

      if (error) throw error;

      setStatusMsg({ text: "Thank you! Your message has been sent successfully. We will get back to you shortly.", type: "success" });
      setFormData({ name: "", email: "", phone: "", stayType: "", message: "" }); // Clear form

    } catch (err) {
      console.error("Message error:", err);
      setStatusMsg({ text: "Failed to send message. Please try calling us instead.", type: "error" });
    } finally {
      setLoading(false);
    }
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
              <Link href="/amenities" className="text-gray-900 hover:text-amber-600 transition-colors">Amenities</Link>
              <Link href="/gallery" className="text-gray-900 hover:text-amber-600 transition-colors">Gallery</Link>
              <Link href="/contact" className="text-amber-600 font-semibold transition-colors">Contact</Link>
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
              <Link href="/amenities" className="py-3.5 border-b border-gray-100 text-gray-800 hover:text-amber-600">Amenities</Link>
              <Link href="/gallery" className="py-3.5 border-b border-gray-100 text-gray-800 hover:text-amber-600">Gallery</Link>
              <Link href="/contact" className="py-3.5 border-b border-gray-100 text-amber-600">Contact</Link>
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
          <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=2070" 
               alt="Airport Grande Luxury Lodge entrance in Accra"
               className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/90 text-amber-700 px-5 py-2 rounded-full text-sm font-semibold mb-6">
              <Phone className="w-4 h-4" />
              +233 20 135 1116 • 24/7 Reception
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-white mb-6 font-serif">
              Let's Make Your Stay Perfect
            </h1>
            <p className="text-lg sm:text-xl text-white/90">
              Whether you're planning a short business trip or a long stay in Accra, our team is ready to assist you.
            </p>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-12 gap-16">

          {/* CONTACT FORM */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl shadow-xl p-10 md:p-14 transition-transform duration-300 hover:-translate-y-1">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 font-serif">Send Us a Message</h2>
              <p className="text-base text-gray-600 mb-10">We'll get back to you within a few hours during business hours.</p>

              <form onSubmit={handleContactSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input type="text" id="name" value={formData.name} onChange={handleChange} required className="w-full px-6 py-4 rounded-2xl border border-gray-300 focus:outline-none focus:border-amber-600 text-base bg-white text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input type="email" id="email" value={formData.email} onChange={handleChange} required className="w-full px-6 py-4 rounded-2xl border border-gray-300 focus:outline-none focus:border-amber-600 text-base bg-white text-gray-900" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input type="tel" id="phone" value={formData.phone} onChange={handleChange} className="w-full px-6 py-4 rounded-2xl border border-gray-300 focus:outline-none focus:border-amber-600 text-base bg-white text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stay Type</label>
                    <select id="stayType" value={formData.stayType} onChange={handleChange} className="w-full px-6 py-4 rounded-2xl border border-gray-300 focus:outline-none focus:border-amber-600 text-base bg-white text-gray-900">
                      <option value="">Select one...</option>
                      <option value="short">Short Stay (1-14 nights)</option>
                      <option value="long">Long Stay (15+ nights)</option>
                      <option value="monthly">Monthly / Extended Stay</option>
                      <option value="tour">Just a Tour / Viewing</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                  <textarea id="message" value={formData.message} onChange={handleChange} rows="6" required className="w-full px-6 py-4 rounded-3xl border border-gray-300 focus:outline-none focus:border-amber-600 text-base resize-y bg-white text-gray-900"></textarea>
                </div>

                {statusMsg.text && (
                  <div className={`rounded-2xl px-6 py-4 text-base font-medium ${statusMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {statusMsg.text}
                  </div>
                )}

                <button type="submit" disabled={loading} className="w-full bg-gradient-to-br from-amber-600 to-amber-800 text-white font-semibold py-6 rounded-full text-base sm:text-lg hover:scale-[1.02] transition-all flex justify-center items-center gap-3 disabled:opacity-70 disabled:hover:scale-100">
                  {loading ? <><Loader2 className="w-6 h-6 animate-spin"/> SENDING...</> : "SEND MESSAGE"}
                </button>
              </form>
            </div>
          </div>

          {/* CONTACT INFO + MAP */}
          <div className="lg:col-span-5 space-y-10">

            {/* Contact Details */}
            <div className="bg-white rounded-3xl p-10 shadow-xl transition-transform duration-300 hover:-translate-y-1">
              <h3 className="text-2xl font-semibold mb-8 font-serif">Get In Touch</h3>
              
              <div className="space-y-8">
                <div className="flex gap-5">
                  <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Our Location</p>
                    <p className="text-base text-gray-600">
                      137 Aviation Road,<br/>
                      Airport Residential Area<br/>
                      (Near Bawaleshi / East Legon), Accra, Ghana
                    </p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Call or WhatsApp</p>
                    <a href="tel:+233201351116" className="text-2xl font-semibold text-amber-700 hover:text-amber-600 transition">+233 20 135 1116</a>
                    <p className="text-sm text-gray-500 mt-1">24-hour reception</p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Email Us</p>
                    <a href="mailto:info@airportgrande.com" className="text-base text-gray-600 hover:text-amber-700 transition">info@airportgrande.com</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl transition-transform duration-300 hover:-translate-y-1">
              <div className="p-6 border-b">
                <h4 className="font-semibold flex items-center gap-2">
                  <Map className="w-5 h-5 text-amber-600" />
                  Find Us on the Map
                </h4>
              </div>
              <div className="aspect-video w-full">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15882.880509650426!2d-0.1869644!3d5.608889!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9ca7e8e50b9b%3A0xc30b0f51f3b0142!2sAirport%20Residential%20Area%2C%20Accra%2C%20Ghana!5e0!3m2!1sen!2sus!4v1698765432109!5m2!1sen!2sus"
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade">
                </iframe>
              </div>
              <div className="p-6 text-xs text-gray-500 bg-gray-50">
                137 Aviation Road, Airport Residential Area, Accra • 10 minutes from Kotoka International Airport (KIA)
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-amber-50 rounded-3xl p-8">
              <div className="flex items-start gap-4">
                <Clock className="w-8 h-8 text-amber-600 mt-1" />
                <div>
                  <p className="font-semibold text-amber-900">24-Hour Reception</p>
                  <p className="text-amber-800/80 text-base">We’re always here to welcome you — day or night.</p>
                  <p className="mt-4 text-sm text-amber-700">Backup generator • Secure gated compound • Friendly staff</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* FINAL CTA */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 font-serif">Ready to Book Your Stay?</h2>
          <p className="text-base sm:text-lg text-gray-300 mb-10">Our team will respond to your enquiry within a few hours.</p>
          <Link href="/rooms" className="inline-flex items-center gap-4 bg-white text-gray-900 font-semibold px-12 py-6 rounded-full hover:bg-amber-50 hover:scale-105 transition-all text-base">
            BROWSE AVAILABLE ROOMS
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-16 border-t border-gray-800">
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