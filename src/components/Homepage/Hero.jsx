import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

const MAGENTA = '#b13896';
const DARK    = '#161114';
const SANS    = "'Plus Jakarta Sans', 'Inter', sans-serif";
const SERIF   = "'Playfair Display', Georgia, serif";

const usps = [
  '🪷 Handloom Sarees',
  '✿ Ethnic Kurtis',
  '🌸 Bridal Collections',
  '✦ Premium Fabrics',
];

const Hero = () => {
  const videoRef   = useRef(null);
  const sectionRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const contentY   = useTransform(scrollYProgress, [0, 1], [0, 60]);

  useEffect(() => { videoRef.current?.play().catch(() => {}); }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ height: '100svh', minHeight: 640 }}
    >
      {/* ── VIDEO / IMAGE BG ──── */}
      <motion.div className="absolute inset-0 z-0 origin-center" style={{ scale: videoScale }}>
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{ backgroundImage: "url('/img/b (1).jpeg')", opacity: loaded ? 0 : 1 }}
        />
        <video
          ref={videoRef}
          src="https://res.cloudinary.com/ewqgfmrg/video/upload/v1784458209/tuka2_vrapwj.mp4"
          autoPlay muted loop playsInline
          onCanPlay={() => setLoaded(true)}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
          style={{ opacity: loaded ? 1 : 0 }}
        />
      </motion.div>

      {/* ── OVERLAYS ──── */}
      {/* Rich magenta-tinted overlay */}
      <div className="absolute inset-0 z-10" style={{ background: 'rgba(22,17,20,0.5)' }} />
      {/* Left gradient for text legibility */}
      <div
        className="absolute inset-0 z-10"
        style={{ background: 'linear-gradient(110deg, rgba(16,10,14,0.85) 0%, rgba(16,10,14,0.4) 50%, transparent 85%)' }}
      />
      {/* Bottom fade for USP bar */}
      <div
        className="absolute inset-x-0 bottom-0 z-10 h-[50%]"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)' }}
      />
      {/* Top fade */}
      <div
        className="absolute inset-x-0 top-0 z-10 h-32"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%)' }}
      />

      {/* ── CONTENT ──── */}
      <motion.div
        className="absolute inset-0 z-20 flex flex-col justify-center"
        style={{ y: contentY }}
      >
        <div className="max-w-[1440px] mx-auto w-full px-6 lg:px-16 pt-24 lg:pt-32 pb-16">

          {/* Eyebrow badge */}
          <motion.div
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full mb-4"
            style={{
              background: 'rgba(177,56,150,0.15)',
              border: '1px solid rgba(177,56,150,0.35)',
              backdropFilter: 'blur(10px)',
            }}
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0" style={{ background: MAGENTA }} />
            <span
              className="text-[10px] sm:text-[11px] tracking-[0.3em] uppercase font-bold"
              style={{ color: '#f3c7ea', fontFamily: SANS }}
            >
              Handwoven with patience and pride
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="text-white mb-4 font-light max-w-3xl"
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(2.4rem, 5vw, 4.2rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.01em',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            The Heritage of{' '}
            <em
              className="italic font-normal block sm:inline"
              style={{ color: MAGENTA, textShadow: '0 0 25px rgba(177,56,150,0.5)' }}
            >
              Bengal Handloom
            </em>
          </motion.h1>

          {/* Sub-copy */}
          <motion.p
            className="mb-6 max-w-lg text-white/85 font-light leading-relaxed text-sm sm:text-base"
            style={{ fontFamily: SANS }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            Authentic handloom sarees in Cotton, Khadi, Linen, Silk & exquisite tailored blouses directly from master artisan looms.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex items-center gap-3.5 flex-wrap mb-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.36, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              to="/shop?cat=all#products"
              className="group relative inline-flex items-center justify-center overflow-hidden text-white rounded-full transition-all duration-500 hover:shadow-[0_0_30px_rgba(177,56,150,0.6)] active:scale-95"
              style={{
                background: MAGENTA,
                padding: '13px 30px',
                fontSize: '10px',
                letterSpacing: '0.24em',
                fontWeight: 700,
                textTransform: 'uppercase',
                fontFamily: SANS,
              }}
            >
              <span className="relative z-10 transition-transform duration-500 group-hover:scale-105">Shop Collection</span>
              <span
                className="absolute left-[-100%] top-0 h-full w-full transition-transform duration-700 group-hover:translate-x-[200%]"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }}
              />
            </Link>

            <Link
              to="/shop?cat=new-arrivals#products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white/95 hover:text-white transition-all duration-300 hover:bg-white/15"
              style={{
                border: '1px solid rgba(255,255,255,0.25)',
                backdropFilter: 'blur(10px)',
                fontSize: '10px',
                letterSpacing: '0.22em',
                fontWeight: 600,
                textTransform: 'uppercase',
                fontFamily: SANS,
              }}
            >
              <span>New Arrivals</span>
            </Link>
          </motion.div>

          {/* Compact Category Quick Explore Pills */}
          <motion.div
            className="flex flex-wrap items-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.48 }}
          >
            <span className="text-[10px] tracking-[0.2em] text-white/45 uppercase font-medium mr-1" style={{ fontFamily: SANS }}>
              Quick Explore:
            </span>
            {['Cotton', 'Khadi', 'Silk', 'Linen', 'Blouse'].map((cat) => (
              <Link
                key={cat}
                to={`/shop?cat=${cat.toLowerCase().replace(/ /g, '-')}&source=hero#products`}
                className="px-3.5 py-1 rounded-full text-[10px] tracking-wider font-semibold transition-all duration-300"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  color: 'rgba(255,255,255,0.85)',
                  backdropFilter: 'blur(8px)',
                  fontFamily: SANS,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = MAGENTA;
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.background = `${MAGENTA}90`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.85)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                }}
              >
                {cat}
              </Link>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* ── SCROLL CUE ──── */}
      <motion.button
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        className="absolute z-30 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/40 hover:text-[#b13896] transition-colors duration-300"
        style={{ bottom: 85 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.6 }}
      >
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 1.9, ease: 'easeInOut' }}
        >
          <ChevronDown size={18} strokeWidth={1.2} />
        </motion.div>
      </motion.button>

      {/* ── USP BAR ──── */}
      <div className="absolute bottom-0 inset-x-0 z-30">
        <motion.div
          className="max-w-[1440px] mx-auto px-4 lg:px-10 pb-3 lg:pb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Desktop grid */}
          <div
            className="hidden lg:grid lg:grid-cols-4 divide-x"
            style={{
              background: 'rgba(16,10,14,0.55)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              divideColor: 'rgba(255,255,255,0.06)'
            }}
          >
            {usps.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-center gap-3 px-5 py-3.5 transition-colors duration-300 hover:bg-white/[0.03]"
              >
                <p className="text-xs tracking-[0.2em] font-bold uppercase text-white/90" style={{ fontFamily: SANS }}>
                  {typeof item === 'string' ? item : item.title}
                </p>
              </div>
            ))}
          </div>

          {/* Mobile slider */}
          <div
            className="lg:hidden overflow-hidden rounded-md"
            style={{
              background: 'rgba(22,17,20,0.6)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <Swiper
              spaceBetween={0}
              slidesPerView={1}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              modules={[Autoplay]}
              className="w-full"
            >
              {usps.map((item, i) => (
                <SwiperSlide key={i}>
                  <div className="flex items-center justify-center gap-3 px-5 py-3.5 text-center">
                    <p className="text-xs tracking-[0.2em] font-bold uppercase text-white/90" style={{ fontFamily: SANS }}>
                      {typeof item === 'string' ? item : item.title}
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
