import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PremiumPreloader = ({ onComplete }) => {
  const [loading, setLoading] = useState(true);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    // A non-linear, "sophisticated" counter that pauses at 99 for tension
    const interval = setInterval(() => {
      setCounter((prev) => {
        if (prev < 99) {
          const jump = Math.random() * 4;
          return Math.min(prev + jump, 99);
        }
        return prev;
      });
    }, 10);

    const timeout = setTimeout(() => {
      setCounter(100);
      setLoading(false);
      if (onComplete) setTimeout(onComplete, 300);
    }, 800);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onComplete]);

  // Luxury Ease: ultra-slow out, fast center, ultra-slow in
  const luxuryEase = [0.19, 1, 0.22, 1];

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            y: "-100%",
            transition: { duration: 1.5, ease: [0.77, 0, 0.175, 1] }
          }}
          className="fixed inset-0 z-[9999] bg-[#FDFAF5] flex flex-col items-center justify-center overflow-hidden selection:bg-none"
        >
          {/* Subtle Caustics */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.03, 0.08, 0.03],
              rotate: [0, 2, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#b13896_0%,transparent_60%)]"
          />

          {/* Thin Editorial Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2.5, ease: luxuryEase }}
            className="absolute inset-10 border border-[#b13896]/10 pointer-events-none rounded-[40px]"
          />

          {/* Central Brand Reveal */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Logo Masking Effect */}
            <div className="overflow-hidden mb-16">
              <motion.div
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.8, ease: luxuryEase }}
                className="px-8"
              >
                <img
                  src="/img/Tuka-Logo.svg"
                  alt="Tuka"
                  className="h-24 sm:h-32 w-auto object-contain brightness-0 opacity-100"
                />
              </motion.div>
            </div>

            {/* Letter Spacing Animation */}
            <motion.div
              initial={{ opacity: 0, letterSpacing: "0.2em", y: 20 }}
              animate={{ opacity: 1, letterSpacing: "1.2em", y: 0 }}
              transition={{ delay: 0.5, duration: 2.5, ease: luxuryEase }}
              className="flex flex-col items-center"
            >
              <span className="text-[14px] uppercase text-[#b13896] font-bold tracking-widest ml-[1.2em]">
                Authentic Bengal Handloom
              </span>
            </motion.div>
          </div>

          {/* The Hairstyle Loader */}
          <div className="absolute bottom-32 flex flex-col items-center space-y-10">
            {/* The Hairline Loader (0.5px height) */}
            <div className="w-56 h-[1px] bg-[#b13896]/10 relative overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 h-full bg-[#b13896]"
                initial={{ width: "0%" }}
                animate={{ width: `${counter}%` }}
                transition={{ ease: "linear" }}
              />

              <motion.div
                animate={{
                  left: `${counter}%`,
                  opacity: [0, 0.4, 0],
                  scale: [1, 1.5, 1]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute -top-1 -translate-x-1/2 w-4 h-4 bg-[#b13896]/10 rounded-full blur-[6px]"
              />
            </div>

            {/* Vertical Counter */}
            <div className="h-8 overflow-hidden text-[#b13896]">
              <motion.div
                animate={{ y: `-${counter}%` }}
                className="flex flex-col items-center font-serif italic text-base tabular-nums font-medium"
              >
                {Array.from({ length: 101 }).map((_, i) => (
                  <span key={i} className="h-8 flex items-center justify-center">{i}</span>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Minimalist Bengal Heritage Cities Metadata */}
          <div className="absolute top-20 left-1/2 -translate-x-1/2 flex items-center gap-12 sm:gap-20">
            <span className="text-[9px] tracking-[0.5em] uppercase text-[#b13896]/55 font-bold">Kolkata</span>
            <span className="text-[9px] tracking-[0.5em] uppercase text-[#b13896]/55 font-bold">Bishnupur</span>
            <span className="text-[9px] tracking-[0.5em] uppercase text-[#b13896]/55 font-bold">Dhaniakhali</span>
          </div>

          {/* Background Gradient Texture */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-multiply bg-gradient-to-b from-[#b13896]/10 to-transparent" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PremiumPreloader;
