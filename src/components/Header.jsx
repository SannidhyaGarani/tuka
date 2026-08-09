import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Search, Menu, X, ShoppingBag, Heart, User,
  ChevronDown, ChevronLeft, ChevronRight, ArrowRight,
} from 'lucide-react';
import { useAuth } from './useAuth';
import { useStore } from '../hooks/useStore';

/* ─── Design Tokens ──────────────────────────────────── */
const MAGENTA = '#b13896';
const DARK = '#161114';
const LIGHT_BG = '#FBF9FA';
const NAV_SANS = "'Plus Jakarta Sans', 'Inter', sans-serif";
const NAV_SERIF = "'Playfair Display', Georgia, serif";

const LuxuryHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isTransparentRoute =
    location.pathname === '/' ||
    location.pathname === '/shop' ||
    location.pathname === '/cart' ||
    location.pathname === '/wishlist' ||
    location.pathname === '/account' ||
    location.pathname === '/about' ||
    location.pathname.startsWith('/product/');

  const [scrolled, setScrolled] = useState(!isTransparentRoute || window.scrollY > 40);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaMenu, setMegaMenu] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const { user } = useAuth();
  const { cartCount, wishlistCount } = useStore();

  useEffect(() => {
    if (!isTransparentRoute) { setScrolled(true); return; }
    setScrolled(window.scrollY > 40);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname, isTransparentRoute]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen || searchOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen, searchOpen]);

  /* ─ Nav Data ──────────────────────────────────────── */
  const navLinks = [
    {
      name: 'Handloom Saree', href: '/shop?cat=handloom-saree#products',
      megaMenu: {
        sections: [
          { title: 'Cotton Saree', icon: '🪷', items: ['Mul Cotton', 'Dhaniakhali', 'Begampuri', 'Hand paint', 'Applic', 'Ikkat cotton', 'Baluchari', 'Boutique Cotton'] },
          { title: 'Khadi Saree', icon: '✿', items: ['Plain Khadi', 'Khadi Applic', 'Dongri Khadi', 'Baluchari Khadi', 'Assam Khadi'] },
          { title: 'Silk Saree', icon: '✧', items: ['Tussar', 'Bishnupuri Pure Silk', 'Ikkat silk', 'Baluchari Silk', 'Matka'] },
          { title: 'Linen Saree', icon: '◈', items: ['Tissue Linen', 'Plain Linen', 'Linen Jamdani'] },
        ],
        image: 'https://images.unsplash.com/photo-1610030470298-40e1eaccf77d?auto=format&fit=crop&q=80&w=800',
        tagline: 'TERRITORY OF WEAVES',
        heading: 'Bengal Handloom Heritage',
      },
    },
    {
      name: 'Designer Blouse', href: '/shop?cat=designer-blouse#products',
      megaMenu: {
        sections: [
          { title: 'Cotton Blouse', icon: '◇', items: ['Plain Cotton', 'Printed Cotton', 'Cotton Khadi'] },
          { title: 'Silk Blouse', icon: '❂', items: ['Pure Silk', 'Tussar Silk', 'Matka Silk'] },
        ],
        image: 'https://images.unsplash.com/photo-1583390389001-8c9ac72a65f4?auto=format&fit=crop&q=80&w=800',
        tagline: 'HANDCRAFTED ACCENTS',
        heading: 'Tailored Blouses',
      },
    },
    { name: 'Saree & Blouse', href: '/shop?cat=saree-blouse#products' },
    { name: 'Boutique Collection', href: '/shop?cat=boutique#products' },
    { name: 'Our Story', href: '/about?ref=header#story' },
    { name: 'Contact us', href: '/contact?ref=header#reach-us' },
  ];

  /* ─── Derived header style ────────────────────────── */
  const headerBg = scrolled ? '#ffffff' : 'transparent';
  const headerBorder = scrolled ? 'rgba(0,0,0,0.04)' : 'transparent';
  const textColor = scrolled ? DARK : '#ffffff';

  // Custom filter to make the logo #b13896 when scrolled, else white
  // White: brightness(0) invert(1)
  // #b13896 approx filter: filter: invert(34%) sepia(52%) saturate(2461%) hue-rotate(289deg) brightness(88%) contrast(90%);
  const logoFilter = scrolled
    ? 'none'
    : 'brightness(0) invert(1)';

  return (
    <>
      {/* ── Main Header ───────────────────────────────── */}
      <header
        className="w-full fixed z-50 transition-all duration-500"
        style={{
          top: 0,
          left: 0,
          right: 0,
          background: headerBg,
          borderBottom: `1px solid ${headerBorder}`,
          boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.03)' : 'none',
        }}
      >
        <div
          className="max-w-[1440px] mx-auto px-5 lg:px-12 flex items-center justify-between"
          style={{ height: scrolled ? '64px' : '80px', transition: 'height 0.4s ease' }}
        >
          {/* ── Left cluster: Menu & Search ── */}
          <div className="flex items-center gap-3 md:gap-5 flex-1">
            <button
              onClick={() => setMobileOpen(true)}
              className="flex items-center gap-2 p-1.5 transition-colors group"
              style={{ color: textColor }}
              aria-label="Open Menu"
            >
              <Menu size={20} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
              <span
                className="text-[12px] font-semibold uppercase tracking-[0.2em]"
                style={{ fontFamily: NAV_SANS }}
              >
                Menu
              </span>
            </button>

            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 p-1.5 transition-colors group"
              style={{ color: textColor }}
              aria-label="Search"
            >
              <Search size={18} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* ── Center: Logo ─────────────────────────── */}
          <div className="flex-1 flex justify-center">
            <Link to="/?ref=header#hero" className="block transition-transform duration-500 hover:scale-105">
              <img
                src={scrolled ? '/img/logo.svg' : '/img/Tuka-Logo.svg'}
                alt="Tuka"
                className="object-contain"
                style={{
                  height: scrolled ? '50px' : '44px',
                  transition: 'all 0.4s ease',
                  filter: logoFilter,
                }}
              />
            </Link>
          </div>

          {/* ── Right cluster: Contact Us, Profile, Cart ── */}
          <div className="flex items-center justify-end gap-3 md:gap-5 flex-1">
            <Link
              to="/contact?ref=header#reach-us"
              className="hidden sm:inline-flex text-[12px] font-semibold uppercase tracking-[0.2em] transition-colors hover:text-[#b13896]"
              style={{ color: textColor, fontFamily: NAV_SANS }}
            >
              Contact Us
            </Link>

            <Link
              to={user ? '/account?tab=overview#profile' : '/login?redirect=account#auth'}
              className="p-1.5 flex items-center transition-colors duration-300 group"
              style={{ color: textColor }}
              aria-label="User Account"
            >
              <User size={20} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
            </Link>

            <Link
              to="/cart?step=view#cart-summary"
              className="relative p-1.5 flex items-center transition-colors duration-300 group"
              style={{ color: textColor }}
              aria-label="Cart"
            >
              <ShoppingBag
                size={20}
                strokeWidth={1.5}
                className="group-hover:scale-110 transition-transform"
                style={{ color: cartCount > 0 ? MAGENTA : 'inherit' }}
              />
              {cartCount > 0 && <BadgeDot count={cartCount} />}
            </Link>
          </div>
        </div>
      </header>

      {/* ── Fullscreen Search Overlay ─────────────────── */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
            style={{ background: 'rgba(26,16,64,0.96)', backdropFilter: 'blur(20px)' }}
          >
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute top-7 right-8 p-2 text-white/50 hover:text-white transition-colors"
            >
              <X size={26} strokeWidth={1.2} />
            </button>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-2xl px-6"
            >
              <p
                className="text-center text-[12px] tracking-[0.4em] uppercase mb-8 font-medium"
                style={{ color: MAGENTA }}
              >
                Search our collections
              </p>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchVal.trim()) {
                    navigate(`/shop?q=${encodeURIComponent(searchVal.trim())}#products`);
                    setSearchOpen(false);
                  }
                }}
                className="relative flex items-center border-b border-white/20 focus-within:border-[#b13896] transition-colors duration-300 pb-2"
              >
                <Search size={18} strokeWidth={1.2} className="absolute left-0 text-white/30" />
                <input
                  autoFocus
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="Search sarees, khadi, designer blouses…"
                  className="w-full bg-transparent pl-8 pr-4 py-4 text-white text-lg font-light placeholder-white/25 outline-none"
                  style={{ fontFamily: NAV_SANS }}
                />
                {searchVal && (
                  <button type="button" onClick={() => setSearchVal('')} className="absolute right-0 text-white/30 hover:text-white transition-colors">
                    <X size={16} />
                  </button>
                )}
              </form>
              <div className="mt-10 flex flex-wrap gap-3 justify-center">
                {['Silk Sarees', 'Cotton Saree', 'Khadi', 'Linen Jamdani', 'Designer Blouse'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setSearchVal(tag);
                      navigate(`/shop?q=${encodeURIComponent(tag)}#products`);
                      setSearchOpen(false);
                    }}
                    className="px-5 py-2 border border-white/15 text-white/60 hover:border-[#b13896] hover:text-[#b13896] hover:bg-[#b13896]/10 transition-all duration-300 text-[11px] font-bold tracking-widest uppercase rounded-full cursor-pointer"
                    style={{ fontFamily: NAV_SANS }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile Drawer ─────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[90]"
              style={{ background: 'rgba(26,16,64,0.6)', backdropFilter: 'blur(4px)' }}
            />

            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="fixed left-0 top-0 bottom-0 z-[100] w-[88vw] max-w-sm flex flex-col overflow-hidden"
              style={{ background: DARK }}
            >
              {/* Drawer header */}
              <div
                className="flex items-center justify-between px-6 py-5"
                style={{ borderBottom: `1px solid ${MAGENTA}20` }}
              >
                <img src="/img/Tuka-Logo.svg" alt="Tuka" className="h-9" style={{ filter: 'invert(1)' }} />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-full transition-colors"
                  style={{ border: `1px solid ${MAGENTA}30`, color: 'rgba(255,255,255,0.7)' }}
                >
                  <X size={18} strokeWidth={1.5} />
                </button>
              </div>

              {/* Nav items */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {navLinks.map((link) => (
                  <div key={link.name} style={{ borderBottom: `1px solid rgba(177,56,150,0.08)` }}>
                    <div
                      className="flex justify-between items-center py-5 cursor-pointer"
                      onClick={() => {
                        if (link.megaMenu) {
                          setMobileExpanded(mobileExpanded === link.name ? null : link.name);
                        } else {
                          setMobileOpen(false);
                        }
                      }}
                    >
                      {link.megaMenu ? (
                        <span className="text-xl font-light text-white" style={{ fontFamily: NAV_SANS }}>
                          {link.name}
                        </span>
                      ) : (
                        <Link
                          to={link.href}
                          onClick={() => setMobileOpen(false)}
                          className="text-xl font-light text-white"
                          style={{ fontFamily: NAV_SANS }}
                        >
                          {link.name}
                        </Link>
                      )}
                      {link.megaMenu && (
                        <ChevronDown
                          size={18}
                          strokeWidth={1.5}
                          style={{
                            color: MAGENTA,
                            transform: mobileExpanded === link.name ? 'rotate(180deg)' : 'rotate(0)',
                            transition: 'transform 0.3s ease',
                          }}
                        />
                      )}
                    </div>

                    <AnimatePresence>
                      {mobileExpanded === link.name && link.megaMenu && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div
                            className="mb-5 rounded-lg p-5 space-y-6"
                            style={{ background: 'rgba(177, 56, 150,0.06)' }}
                          >
                            {link.megaMenu.sections.map((section, idx) => (
                              <div key={idx} className="space-y-3">
                                <p className="text-[9px] tracking-[0.28em] uppercase font-bold" style={{ color: MAGENTA }}>
                                  {section.icon} {section.title}
                                </p>
                                <ul className="space-y-2 pl-3">
                                  {section.items.map((item, i) => (
                                    <li key={i}>
                                      <Link
                                        to={`${link.href.split('#')[0]}&item=${item.toLowerCase().replace(/ /g, '-')}#products`}
                                        onClick={() => setMobileOpen(false)}
                                        className="text-sm text-white/55 hover:text-white transition-colors"
                                        style={{ fontFamily: NAV_SANS }}
                                      >
                                        {item}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Drawer footer */}
              <div
                className="px-8 py-6"
                style={{ borderTop: `1px solid ${MAGENTA}15`, background: `${MAGENTA}08` }}
              >
                <div className="flex justify-around items-center">
                  {[
                    { to: '/wishlist?view=saved#wishlist-items', icon: <Heart size={20} strokeWidth={1.5} />, label: 'Wishlist' },
                    { to: '/account?tab=overview#profile', icon: <User size={20} strokeWidth={1.5} />, label: 'Profile' },
                    { to: '/cart?step=view#cart-summary', icon: <ShoppingBag size={20} strokeWidth={1.5} />, label: 'Cart' },
                  ].map(({ to, icon, label }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setMobileOpen(false)}
                      className="flex flex-col items-center gap-2 transition-colors group"
                      style={{ color: 'rgba(255,255,255,0.5)' }}
                    >
                      <span className="group-hover:text-[#b13896] transition-colors">{icon}</span>
                      <span className="text-[9px] tracking-[0.22em] font-bold uppercase group-hover:text-[#b13896] transition-colors">
                        {label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

/* ─── Badge Dot ──────────────────────────────────────── */
const MAGENTA_LOCAL = '#b13896';
const BadgeDot = ({ count }) => (
  <span
    className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white shadow-sm"
    style={{ background: MAGENTA_LOCAL }}
  >
    {count}
  </span>
);

/* ─── Header Icon Button ─────────────────────────────── */
const HdrIconBtn = ({ children, onClick, label, scrolled }) => (
  <button
    onClick={onClick}
    aria-label={label}
    className="group p-2.5 rounded-full transition-all duration-300"
    style={{
      background: scrolled ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.1)',
      color: scrolled ? DARK : 'rgba(255,255,255,0.9)',
    }}
  >
    <span className="group-hover:text-[#b13896] transition-colors block">{children}</span>
  </button>
);

/* ─── Mega Menu Panel ────────────────────────────────── */
const MegaMenuPanel = ({ link }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 8 }}
    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    className="absolute top-full left-0 w-full z-[100]"
    style={{
      background: '#ffffff',
      borderTop: '1px solid rgba(0,0,0,0.04)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
    }}
  >
    <div className="max-w-[1440px] mx-auto flex h-[420px]">
      {/* Links */}
      <div className="flex-1 py-10 px-12 overflow-y-auto">
        <div
          className={`grid gap-x-12 gap-y-8 ${link.megaMenu.sections.length <= 2 ? 'grid-cols-2' : 'grid-cols-4'
            }`}
        >
          {link.megaMenu.sections.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xl opacity-70">{section.icon}</span>
                <h4
                  className="text-[12px] tracking-[0.25em] font-bold uppercase"
                  style={{ color: DARK }}
                >
                  {section.title}
                </h4>
              </div>
              <ul className="space-y-3 pl-9">
                {section.items.map((item, i) => (
                  <li key={i}>
                    <Link
                      to={`${link.href.split('#')[0]}&item=${item.toLowerCase().replace(/ /g, '-')}#products`}
                      className="text-[14px] text-gray-500 hover:text-[#b13896] hover:translate-x-1 transition-all duration-200 block"
                      style={{ fontFamily: NAV_SANS }}
                    >
                      {item}
                    </Link>
                  </li>
                ))}
                <li className="pt-2">
                  <Link
                    to={`${link.href.split('#')[0]}&category=${section.title.toLowerCase().replace(/ /g, '-')}#products`}
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest transition-colors"
                    style={{ color: MAGENTA_LOCAL }}
                  >
                    Shop all <ArrowRight size={11} strokeWidth={2.5} />
                  </Link>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Promo image */}
      <div
        className="w-[380px] relative overflow-hidden flex-shrink-0 group"
      >
        <img
          src={link.megaMenu.image}
          alt={link.name}
          className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-110"
        />
        <div
          className="absolute inset-0 flex flex-col justify-end p-10"
          style={{ background: 'linear-gradient(to top, rgba(22,17,20,0.85) 0%, rgba(22,17,20,0.2) 50%, transparent 100%)' }}
        >
          <span className="text-[10px] tracking-[0.45em] font-bold uppercase mb-3" style={{ color: MAGENTA_LOCAL }}>
            {link.megaMenu.tagline}
          </span>
          <h3
            className="text-3xl font-light text-white mb-6 leading-snug italic"
            style={{ fontFamily: NAV_SERIF }}
          >
            {link.megaMenu.heading}
          </h3>
          <Link
            to={link.href}
            className="inline-flex items-center justify-center text-[11px] font-bold tracking-[0.25em] uppercase px-8 py-4 transition-all duration-500 hover:tracking-[0.3em] w-fit rounded-sm"
            style={{ background: MAGENTA_LOCAL, color: '#fff' }}
          >
            Explore
          </Link>
        </div>
      </div>
    </div>
  </motion.div>
);

export default LuxuryHeader;
