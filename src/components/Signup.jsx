import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./useAuth";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Sparkles, AlertCircle, ShieldCheck, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const SERIF = "'Playfair Display', 'Cormorant Garamond', Georgia, serif";
const SANS = "'Plus Jakarta Sans', 'Inter', sans-serif";
const MAGENTA = '#b13896';

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup(email, password, displayName);
      navigate("/");
    } catch (err) {
      setError(err.message || "We couldn't create your account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex selection:bg-[#b13896] selection:text-white bg-[#161114]">

      {/* Left Panel — Pure Luxury Brand Visual (No Images) */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden items-center justify-center p-12 bg-[#161114] border-r border-white/10">
        
        {/* Ambient Radial Glowing Spotlight */}
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 40% 30%, ${MAGENTA} 0%, transparent 65%)`,
            filter: 'blur(50px)'
          }}
        />
        <div className="absolute top-0 inset-x-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(177,56,150,0.5), transparent)' }} />
        <div className="absolute bottom-0 inset-x-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }} />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-lg"
        >
          {/* 100% Bright White Tuka Logo */}
          <Link to="/" className="inline-block mb-10 group">
            <img 
              src="/img/Tuka-Logo.svg" 
              alt="Tuka" 
              className="h-11 brightness-0 invert transition-transform group-hover:scale-105 duration-300" 
            />
          </Link>

         

          <h2
            className="text-4xl xl:text-5xl font-light text-white mb-6 leading-[1.15] tracking-tight"
            style={{ fontFamily: SERIF }}
          >
            Create Your<br />
            <span className="font-semibold text-[#f4cfeb]">Handloom Account</span>
          </h2>

          <p className="text-white/60 text-sm max-w-md leading-relaxed mb-10 font-sans font-light">
            Become a member to save favorite drapes in your wishlist, enjoy fast checkout, and receive exclusive access to award weaver drops.
          </p>

          <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-8 font-sans">
            {[
              { title: 'Wishlist Sync', desc: 'Save your dream drapes anywhere' },
              { title: 'Express Checkout', desc: 'Pre-saved shipping addresses' },
              { title: 'Order Tracking', desc: 'Real-time dispatch updates' },
              { title: 'Member Previews', desc: 'Early notifications on festive drops' },
            ].map((feat, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                  <ShieldCheck size={14} className="text-[#f4cfeb]" />
                  <span>{feat.title}</span>
                </div>
                <p className="text-[11px] text-white/40">{feat.desc}</p>
              </div>
            ))}
          </div>

        </motion.div>
      </div>

      {/* Right Panel — Signup Form */}
      <div className="flex-1 flex flex-col justify-between bg-[#FDFBF9] px-6 sm:px-12 py-8 sm:py-12 relative min-h-screen">
        
        {/* Top Control Bar with Back to Home Button */}
        <div className="w-full flex items-center justify-between z-20">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-[#b13896] transition-all duration-300 shadow-md group cursor-pointer"
            style={{ fontFamily: SANS }}
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>

          {/* Mobile White Logo (on dark badge) */}
          <Link to="/" className="lg:hidden p-2 rounded-xl bg-[#161114]">
            <img src="/img/Tuka-Logo.svg" alt="Tuka" className="h-7 brightness-0 invert" />
          </Link>
        </div>

        {/* Center Form Box */}
        <div className="w-full max-w-[420px] mx-auto my-auto py-8 relative z-10 font-sans">
          
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Header */}
            <div className="mb-8">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#b13896] block mb-2 font-sans">
                JOIN THE LEGACY
              </span>
              <h1
                className="text-3xl sm:text-4xl font-light text-[#161114] mb-2"
                style={{ fontFamily: SERIF }}
              >
                Create Account
              </h1>
              <p className="text-xs text-slate-500 font-sans font-normal">
                Fill in your details below to register.
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-xs font-sans"
              >
                <AlertCircle size={16} className="shrink-0 text-red-500" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 font-sans">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-900 ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#b13896] transition-colors" size={18} />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:border-[#b13896] outline-none transition-all text-xs text-slate-900 placeholder:text-slate-400 shadow-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-900 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#b13896] transition-colors" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:border-[#b13896] outline-none transition-all text-xs text-slate-900 placeholder:text-slate-400 shadow-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-900 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#b13896] transition-colors" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3.5 bg-white border border-slate-200 rounded-xl focus:border-[#b13896] outline-none transition-all text-xs text-slate-900 placeholder:text-slate-400 shadow-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#b13896] transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-2.5 px-1 py-1">
                <ShieldCheck size={16} className="text-[#b13896] shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-600 leading-tight">
                  By registering, you agree to our <Link to="/terms-and-conditions" className="text-[#b13896] font-bold hover:underline">Terms</Link> and <Link to="/privacy-policy" className="text-[#b13896] font-bold hover:underline">Privacy Policy</Link>.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl text-white font-bold text-xs tracking-[0.25em] uppercase transition-all duration-300 flex items-center justify-center gap-3 bg-[#161114] hover:bg-[#b13896] shadow-lg cursor-pointer font-sans"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-[10px] tracking-widest uppercase font-bold text-slate-400">or</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Sign In Link */}
            <p className="text-center text-xs text-slate-600 font-sans">
              Already have an account?{" "}
              <Link to="/login" className="text-[#b13896] font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </motion.div>

        </div>

        {/* Footer info */}
        <div className="w-full text-center text-[11px] text-slate-400 font-sans z-10">
          © {new Date().getFullYear()} House of Tuka. Authentic Bengal Handlooms.
        </div>

      </div>
    </div>
  );
};

export default Signup;
