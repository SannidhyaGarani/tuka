import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Sparkles, Gem, ShieldCheck, Heart, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../Firebase';
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

const whyChooseFeatures = [
  {
    icon: <Sparkles className="w-4 h-4" strokeWidth={1.5} />,
    title: "Pure Handloom",
    description: "Directly sourced from traditional weavers across India."
  },
  {
    icon: <Gem className="w-4 h-4" strokeWidth={1.5} />,
    title: "Heirloom Quality",
    description: "Hand-finished with precision to survive generations."
  },
  {
    icon: <ShieldCheck className="w-4 h-4" strokeWidth={1.5} />,
    title: "Authentic Materials",
    description: "100% genuine silks, linens, and metallic fibers."
  },
  {
    icon: <Heart className="w-4 h-4" strokeWidth={1.5} />,
    title: "Fair Trade Pride",
    description: "Guaranteed fair wages and ethical community trade."
  },
  {
    icon: <Award className="w-4 h-4" strokeWidth={1.5} />,
    title: "Premier Trust",
    description: "Rated 4.9★ by over 10k+ luxury fashion lovers."
  }
];

const Hero = () => {
  const videoRef   = useRef(null);
  const sectionRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [heroSettings, setHeroSettings] = useState(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const contentY   = useTransform(scrollYProgress, [0, 1], [0, 60]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "homepage"), (snap) => {
      if (snap.exists()) {
        setHeroSettings(snap.data());
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => { videoRef.current?.play().catch(() => {}); }, [heroSettings]);

  const bgImg = heroSettings?.heroBgImage || '/img/b (1).jpeg';
  const videoUrl = heroSettings?.heroVideoUrl || 'https://res.cloudinary.com/ewqgfmrg/video/upload/v1784458209/tuka2_vrapwj.mp4';

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
          style={{ backgroundImage: `url('${bgImg}')`, opacity: loaded ? 0 : 1 }}
        />
        <video
          ref={videoRef}
          src={videoUrl}
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
        className="absolute inset-x-0 bottom-0 z-10 h-[55%]"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 100%)' }}
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
        <div className="max-w-[1440px] mx-auto w-full px-6 lg:px-16 pt-24 lg:pt-32 pb-24 lg:pb-32">

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
            Authentic handloom sarees in Cotton, Khadi, Linen, Silk & exquisite tailored blouses directly from master weaver looms.
          </motion.p>

          {/* CTAs */}
         
          {/* Compact Category Quick Explore Pills */}
         
        </div>
      </motion.div>

      {/* ── SCROLL CUE ──── */}
      <motion.button
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        className="absolute z-30 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/40 hover:text-[#b13896] transition-colors duration-300"
        style={{ bottom: 145 }}
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

      {/* ── BRAND PROMISE CARDS BAR ──── */}
      <div className="absolute bottom-0 inset-x-0 z-30">
        <motion.div
          className="max-w-[1440px] mx-auto px-4 lg:px-10 pb-3 lg:pb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Desktop grid */}
          <div className="hidden lg:grid lg:grid-cols-5 gap-3">
            {whyChooseFeatures.map((feature, i) => (
              <div
                key={i}
                className="group flex flex-col items-center text-center px-3.5 py-3 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#b13896]/40 hover:shadow-[0_8px_25px_rgba(177,56,150,0.2)] relative border"
                style={{
                  background: 'rgba(16,10,14,0.65)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  borderColor: 'rgba(255,255,255,0.08)',
                }}
              >
                {/* Icon Container */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-all duration-300 relative shrink-0"
                  style={{
                    background: 'rgba(177, 56, 150, 0.15)',
                    border: '1px solid rgba(177, 56, 150, 0.3)',
                    boxShadow: 'inset 0 0 8px rgba(177, 56, 150, 0.1)'
                  }}
                >
                  <span className="transition-colors duration-300 group-hover:text-white" style={{ color: '#f3c7ea' }}>
                    {feature.icon}
                  </span>
                </div>

                <h3
                  className="text-[11px] tracking-[0.14em] font-extrabold uppercase mb-1 transition-colors duration-300 text-white group-hover:text-[#f3c7ea]"
                  style={{ fontFamily: SANS }}
                >
                  {feature.title}
                </h3>
                
                <p
                  className="text-[10.5px] leading-tight font-light text-white/70 group-hover:text-white/90 transition-colors duration-300"
                  style={{ fontFamily: SANS }}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Mobile slider */}
          <div
            className="lg:hidden overflow-hidden rounded-xl"
            style={{
              background: 'rgba(22,17,20,0.7)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <Swiper
              spaceBetween={0}
              slidesPerView={1}
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              modules={[Autoplay]}
              className="w-full"
            >
              {whyChooseFeatures.map((feature, i) => (
                <SwiperSlide key={i}>
                  <div className="flex items-center justify-center gap-3 px-4 py-3 text-center">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background: 'rgba(177, 56, 150, 0.2)',
                        border: '1px solid rgba(177, 56, 150, 0.35)',
                      }}
                    >
                      <span style={{ color: '#f3c7ea' }}>{feature.icon}</span>
                    </div>
                    <div className="text-left">
                      <h3
                        className="text-[11px] tracking-[0.12em] font-bold uppercase text-white"
                        style={{ fontFamily: SANS }}
                      >
                        {feature.title}
                      </h3>
                      <p
                        className="text-[10px] text-white/70 font-light"
                        style={{ fontFamily: SANS }}
                      >
                        {feature.description}
                      </p>
                    </div>
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
