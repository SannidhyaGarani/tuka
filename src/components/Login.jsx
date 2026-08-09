import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./useAuth";
import { Mail, Lock, ArrowRight, Eye, EyeOff, AlertCircle, Gem } from "lucide-react";
import { motion } from "framer-motion";

const SERIF = "'Cormorant Garamond', Georgia, serif";
const GOLD = '#b13896';
const CRIMSON = '#b13896';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex selection:bg-[#b13896] selection:text-white">

      {/* Left Panel — Brand Visual */}
      <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden items-end" style={{ background: '#161114' }}>
        <img
          src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1200"
          alt="Luxury Jewelry"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,7,5,0.95) 0%, rgba(10,7,5,0.3) 50%, rgba(10,7,5,0.6) 100%)' }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 p-14 pb-16 w-full"
        >
          <Link to="/" className="inline-block mb-12">
            <img src="/img/Tuka-Logo.svg" alt="Tuka" className="h-10" style={{ filter: 'invert(1)' }} />
          </Link>

          <h2
            className="text-5xl xl:text-6xl font-light text-white mb-6 leading-[1.1]"
            style={{ fontFamily: SERIF }}
          >
            Welcome to the<br />
            <em className="not-italic font-semibold" style={{ color: GOLD }}>House of Tuka</em>
          </h2>

          <p className="text-white/45 text-[15px] max-w-md leading-relaxed mb-10" style={{ fontFamily: SERIF }}>
            Where every handloom saree tells a story of timeless craftsmanship, woven by master artisans across Bengal.
          </p>

          <div className="flex items-center gap-8">
            {['Handcrafted', 'Certified', 'Worldwide'].map((tag, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full" style={{ background: GOLD }} />
                <span className="text-[14px] tracking-[0.25em] uppercase font-bold text-white/40">{tag}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center bg-[#FDFAF5] px-6 sm:px-12 py-12 relative">
        {/* Subtle decorative element */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#b13896]/[0.03] rounded-full blur-[100px] pointer-events-none" />

        {/* Mobile logo */}
        <Link to="/" className="lg:hidden mb-10">
          <img src="/img/Tuka-Logo.svg" alt="Tuka" className="h-9" style={{ filter: 'brightness(0)' }} />
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[420px] relative z-10"
        >
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-[1px]" style={{ background: CRIMSON }} />
              <span className="text-[14px] tracking-[0.35em] font-bold uppercase" style={{ color: '#4a3f44' }}>Welcome Back</span>
            </div>
            <h1
              className="text-4xl md:text-5xl font-light text-[#161114] mb-3"
              style={{ fontFamily: SERIF }}
            >
              Sign <span className="italic" style={{ color: CRIMSON }}>In</span>
            </h1>
            <p className="text-[14px] text-[#4a3f44]" style={{ fontFamily: SERIF }}>
              Access your account and curated collections.
            </p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-[13px]"
            >
              <AlertCircle size={16} />
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[14px] font-bold uppercase tracking-[0.2em] text-[#161114] ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4a3f44]/30 group-focus-within:text-[#b13896] transition-colors" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-4 bg-white border border-[#e5d5df]/50 rounded-xl focus:border-[#b13896] outline-none transition-all text-[14px] text-[#161114] placeholder:text-[#4a3f44]/30"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[14px] font-bold uppercase tracking-[0.2em] text-[#161114]">Password</label>
                <button type="button" className="text-[14px] font-bold text-[#b13896]/60 hover:text-[#b13896] transition-colors uppercase tracking-wider">Forgot?</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4a3f44]/30 group-focus-within:text-[#b13896] transition-colors" size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-white border border-[#e5d5df]/50 rounded-xl focus:border-[#b13896] outline-none transition-all text-[14px] text-[#161114] placeholder:text-[#4a3f44]/30"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4a3f44]/40 hover:text-[#b13896] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full py-4 rounded-xl text-white font-bold text-[14px] tracking-[0.3em] uppercase transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 mt-3 shadow-lg"
              style={{ background: '#161114' }}
              onMouseEnter={(e) => e.currentTarget.style.background = CRIMSON}
              onMouseLeave={(e) => e.currentTarget.style.background = '#161114'}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} strokeWidth={2} className="group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-[#e5d5df]/40" />
            <span className="text-[14px] tracking-[0.2em] uppercase font-bold text-[#4a3f44]/40">or</span>
            <div className="flex-1 h-px bg-[#e5d5df]/40" />
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-[13px] text-[#4a3f44]" style={{ fontFamily: SERIF }}>
            New to Tuka?{" "}
            <Link to="/signup" className="text-[#b13896] font-semibold hover:text-[#161114] transition-colors border-b border-[#b13896]/20 hover:border-[#161114] pb-px">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
