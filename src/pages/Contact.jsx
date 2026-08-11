import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ChevronDown, Instagram, Send, Clock, MessageCircle, Globe, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import Breadcrumb from '../components/Breadcrumb';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    const textMsg = `Hello Tuka Team,\n\nName: ${formData.name}\nEmail: ${formData.email}\nInquiry Type: ${formData.subject}\nMessage: ${formData.message}`;
    const whatsappUrl = `https://wa.me/916265998887?text=${encodeURIComponent(textMsg)}`;
    
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setTimeout(() => setSubmitted(false), 3000);
  };

  const fadeUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 1, ease: [0.19, 1, 0.22, 1] }
  };

  const breadcrumbLinks = [
    { name: 'Home', href: '/?ref=contact#hero' },
    { name: 'Contact', href: '/contact?ref=breadcrumb#reach-us', active: true }
  ];

  return (
    <div className="min-h-screen bg-[#FDFAF5] font-sans text-[#161114] overflow-hidden">
      
      {/* Premium Breadcrumb */}
      <Breadcrumb 
        title="Get in Touch"
        subtitle="We'd love to hear from you. Reach out for weave inquiries, custom tailoring, or order support."
        bgImage="https://images.unsplash.com/photo-1594913785162-e6785311bc51?auto=format&fit=crop&q=80&w=1600"
        links={breadcrumbLinks}
      />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 py-16 md:py-24">
        
        {/* Contact Info Grid - Luxury Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 md:mb-24">
          {[
            { 
              icon: Mail, 
              label: "Email ", 
              value: "hello@tuka.in",
              sub: "Response within 2 hours"
            },
            { 
              icon: Phone, 
              label: "Call or WhatsApp", 
              value: "+91 62659 98887",
              sub: "Mon-Sat, 9:30am - 8:30pm IST"
            },
            { 
              icon: MapPin, 
              label: "Studio Location", 
              value: "Bengal Weaving Hub, India",
              sub: "Handcrafted in the heart of Bengal"
            }
          ].map((item, i) => (
            <motion.div 
              key={i}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.1 }}
              className="bg-white rounded-[32px] p-8 border border-[#e5d5df]/40 hover:border-[#b13896]/50 hover:shadow-2xl transition-all duration-500 group text-center"
            >
              <div className="w-14 h-14 rounded-full bg-[#F8F4EF] flex items-center justify-center mb-6 mx-auto group-hover:bg-[#b13896] group-hover:text-white transition-all duration-500 text-[#b13896]">
                <item.icon size={22} strokeWidth={1.5} />
              </div>
              <p className="text-[12px] tracking-[0.3em] font-bold uppercase text-[#b13896] mb-2">{item.label}</p>
              <p className="text-xl md:text-2xl font-serif text-[#161114] mb-2">{item.value}</p>
              <p className="text-[13px] text-[#4a3f44] font-light">{item.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Form + Sidebar Split */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Contact Form - Simple & Premium */}
          <motion.div 
            {...fadeUp}
            className="lg:col-span-7"
          >
            <div className="bg-white rounded-[36px] p-8 md:p-12 border border-[#e5d5df]/40 shadow-sm relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle size={18} className="text-[#25D366]" />
                  <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#25D366]">Direct WhatsApp </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-serif text-[#161114] mb-3">Send a Message</h2>
                <p className="text-[14px] text-[#4a3f44] mb-8 font-light leading-relaxed">
                  Fill in your details below. Your message will format instantly and open in WhatsApp for immediate response.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#161114]">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-[#F8F4EF]/60 border border-[#e5d5df]/60 rounded-2xl px-4 py-3 text.sm text-[#161114] outline-none focus:border-[#b13896] focus:bg-white transition-all" 
                        placeholder="e.g. Ananya Sharma" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#161114]">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-[#F8F4EF]/60 border border-[#e5d5df]/60 rounded-2xl px-4 py-3 text-sm text-[#161114] outline-none focus:border-[#b13896] focus:bg-white transition-all" 
                        placeholder="ananya@example.com" 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#161114]">Inquiry Category</label>
                    <div className="relative">
                      <select 
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        className="w-full bg-[#F8F4EF]/60 border border-[#e5d5df]/60 rounded-2xl px-4 py-3 text-sm text-[#161114] outline-none focus:border-[#b13896] focus:bg-white transition-all appearance-none cursor-pointer"
                      >
                        <option>Saree Inquiry & Weave Consultation</option>
                        <option>Custom Blouse Tailoring</option>
                        <option>Order Tracking & Support</option>
                        <option>Boutique & Bulk Orders</option>
                        <option>General Inquiry</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4a3f44] pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#161114]">Your Message</label>
                    <textarea 
                      rows="4" 
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full bg-[#F8F4EF]/60 border border-[#e5d5df]/60 rounded-2xl p-4 text-sm text-[#161114] outline-none focus:border-[#b13896] focus:bg-white transition-all resize-none" 
                      placeholder="Specify saree motifs, color preferences, or order ID..."
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full py-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-lg shadow-[#25D366]/30 flex items-center justify-center gap-3 cursor-pointer"
                  >
                    <MessageCircle size={18} />
                    {submitted ? 'Opening WhatsApp…' : 'Send via WhatsApp (+91 62659 98887)'}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>

          {/* Sidebar - Concierge & Support */}
          <motion.div 
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.2 }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Direct WhatsApp Chat Box */}
            <div className="bg-[#161114] rounded-[36px] p-8 text-white relative overflow-hidden">
               <div className="w-12 h-12 rounded-2xl bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center text-[#25D366] mb-6">
                 <MessageCircle size={24} />
               </div>
               <h3 className="text-2xl font-serif mb-2">Direct Studio Concierge</h3>
               <p className="text-[13.5px] text-white/70 mb-6 font-light leading-relaxed">
                 Need urgent blouse measurements guidance or real fabric video clips? Tap below to chat directly with our studio master weavers.
               </p>
               <a 
                 href="https://wa.me/916265998887?text=Hello%20Tuka,%20I%20need%20assistance%20with%20a%20saree%20order."
                 target="_blank"
                 rel="noopener noreferrer"
                 className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-white text-[#161114] font-bold text-xs uppercase tracking-widest hover:bg-[#25D366] hover:text-white transition-all cursor-pointer"
               >
                 Chat on +91 62659 98887
                 <Send size={14} />
               </a>
            </div>

            {/* Concierge Hours */}
            <div className="bg-white rounded-[32px] p-8 border border-[#e5d5df]/40 space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <Clock size={18} className="text-[#b13896]" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#161114]">Studio Hours</h3>
              </div>
              <div className="space-y-3 font-sans text-xs">
                {[
                  { day: 'Mon — Sat', time: '09:30 AM — 08:30 PM IST' },
                  { day: 'Sunday', time: '11:00 AM — 06:00 PM IST' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-slate-600">
                    <span>{item.day}</span>
                    <span className="font-semibold text-slate-900">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;