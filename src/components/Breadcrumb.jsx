import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles, Award, ShieldCheck, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

const MAGENTA = '#b13896';
const DARK = '#161114';

const Breadcrumb = ({ 
  title, 
  subtitle, 
  bgImage = "https://images.unsplash.com/photo-1610030470298-40e1eaccf77d?auto=format&fit=crop&q=80&w=1600", 
  links = [],
  badgeText = "HOUSE OF TUKA • HANDLOOM WEAVES",
  stats = [
    { icon: Award, label: "100% Handloom" },
    { icon: ShieldCheck, label: "GI Certified" },
    { icon: Truck, label: "Express Shipping" },
  ]
}) => {
  return (
    <div className="relative w-full min-h-[280px] md:min-h-[340px] overflow-hidden flex items-center justify-center bg-[#161114]">
      {/* Background Image with Slow Zoom & Ambient Overlay */}
      <motion.div 
        initial={{ scale: 1.12, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.8, ease: [0.19, 1, 0.22, 1] }}
        className="absolute inset-0"
      >
        <img 
          src={bgImage} 
          alt={title} 
          className="w-full h-full object-cover object-center"
        />
        {/* Layered Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#161114] via-[#161114]/75 to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#161114]/80 via-transparent to-[#161114]/80" />
        <div 
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 40%, ${MAGENTA} 0%, transparent 60%)`,
            filter: 'blur(50px)'
          }}
        />
      </motion.div>

      {/* Compact Hero Content Box */}
      <div className="relative z-10 max-w-[1440px] w-full mx-auto px-6 lg:px-12 pt-20 md:pt-24 pb-8 md:pb-10 text-center text-white flex flex-col items-center">
        
        {/* Top Glassmorphic Badge Pill */}
        {badgeText && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-[10px] font-bold tracking-[0.2em] text-[#f4cfeb] uppercase mb-3 shadow-lg"
          >
            <Sparkles size={11} className="text-[#f4cfeb] animate-pulse" />
            <span>{badgeText}</span>
          </motion.div>
        )}

        {/* Compact Breadcrumb Navigation */}
        {links && links.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] font-bold tracking-[0.18em] uppercase mb-3"
          >
            {links.map((link, index) => (
              <React.Fragment key={index}>
                {index > 0 && <ChevronRight size={11} className="text-white/30" />}
                {link.active ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-white border border-white/20 backdrop-blur-sm">
                    {link.name}
                  </span>
                ) : (
                  <Link 
                    to={link.href} 
                    className="px-2.5 py-0.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300"
                  >
                    {link.name}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </motion.div>
        )}

        {/* Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-light leading-tight tracking-tight px-4 max-w-3xl"
        >
          {title}
        </motion.h1>
        
        {/* Subtitle */}
        {subtitle && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8 }}
            className="text-xs sm:text-sm md:text-base font-serif italic max-w-xl mx-auto text-white/75 font-light mt-2 leading-relaxed"
          >
            "{subtitle}"
          </motion.p>
        )}

        {/* Compact Craft Stats Pills */}
        {stats && stats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="mt-5 flex flex-wrap justify-center gap-2 md:gap-4"
          >
            {stats.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx} 
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[10px] font-semibold text-white/70 tracking-wider"
                >
                  <Icon size={11} style={{ color: MAGENTA }} />
                  <span>{item.label}</span>
                </div>
              );
            })}
          </motion.div>
        )}

      </div>

      {/* Decorative Compact Arc */}
      <div className="absolute bottom-0 left-0 w-full h-10 bg-[#FDFAF5] rounded-t-[50%] md:rounded-t-[100%] scale-x-125 translate-y-5" />
    </div>
  );
};

export default Breadcrumb;
