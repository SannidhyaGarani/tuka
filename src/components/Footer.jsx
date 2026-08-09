import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, Mail, ArrowRight, MapPin, Phone } from 'lucide-react';

const DARK = '#161114';
const MAGENTA = '#b13896';
const IVORY = '#FBF9FA';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const sections = [
    {
      title: "SHOP",
      links: [
        { name: "Sarees", href: "/shop?cat=sarees#products" },
        { name: "Kurtis", href: "/shop?cat=kurtis#products" },
        { name: "Dress Material", href: "/shop?cat=dress-material#products" },
        { name: "Stoles & Dupattas", href: "/shop?cat=stoles#products" },
        { name: "Bags", href: "/shop?cat=bags#products" },
      ]
    },
    {
      title: "COLLECTIONS",
      links: [
        { name: "Handloom Sarees", href: "/shop?cat=handloom-saree#products" },
        { name: "Designer Blouses", href: "/shop?cat=designer-blouse#products" },
        { name: "Khadi Sarees", href: "/shop?cat=plain-khadi#products" },
        { name: "Silk Sarees", href: "/shop?cat=silk#products" },
        { name: "Linen Jamdani", href: "/shop?cat=linen-jamdani#products" },
      ]
    },
    {
      title: "HELP",
      links: [
        { name: "Contact Us", href: "/contact?ref=footer#reach-us" },
        { name: "Shipping & Delivery", href: "/shipping-policy?ref=footer#shipping" },
        { name: "Returns & Exchanges", href: "/return-policy?ref=footer#returns" },
        { name: "FAQs", href: "/faqs?ref=footer#faqs" },
        { name: "Size Guide", href: "/size-guide?ref=footer#size-chart" },
      ]
    },
    {
      title: "COMPANY",
      links: [
        { name: "Our Story", href: "/about?ref=footer#our-story" },
        { name: "New Arrivals", href: "/shop?cat=new-arrivals#products" },
        { name: "Exclusive Offers", href: "/shop?cat=offers#products" },
        { name: "Privacy Policy", href: "/privacy-policy?ref=footer#privacy" },
        { name: "Terms of Service", href: "/terms-and-conditions?ref=footer#terms" },
      ]
    }
  ];

  return (
    <footer className="w-full relative pt-16 pb-12 overflow-hidden" style={{ backgroundColor: IVORY, borderTop: '1px solid rgba(26,16,64,0.08)' }}>

      {/* ── Newsletter Section ───────────────────────── */}
      <div style={{ background: DARK }} className="py-14">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="text-center lg:text-left">
            <p className="text-xs tracking-[0.4em] uppercase font-bold mb-2" style={{ color: MAGENTA }}>
              ✦ Stay in the loop
            </p>
            <h3 className="text-2xl lg:text-3xl font-light text-white mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              New Arrivals. Exclusive Deals.
            </h3>
            <p className="text-[14px] text-white/55 font-light">
              Get curated picks, festive offers & style tips straight to your inbox.
            </p>
          </div>
          <form className="w-full lg:w-auto flex flex-col sm:flex-row gap-0 max-w-md">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 bg-white/8 border border-white/15 px-6 py-4 text-white text-sm placeholder:text-white/35 focus:outline-none focus:border-[#b13896] transition-colors rounded-l-sm"
              style={{ background: 'rgba(255,255,255,0.07)' }}
            />
            <button
              className="px-8 py-4 text-[13px] tracking-[0.2em] font-bold uppercase transition-all hover:opacity-90 rounded-r-sm flex items-center gap-2"
              style={{ background: MAGENTA, color: '#fff' }}
            >
              Subscribe <ArrowRight size={14} />
            </button>
          </form>
        </div>
      </div>

      {/* ── Main Footer Section ───────────────────────── */}
      <div style={{ background: IVORY }} className="pt-20 pb-10 px-4 sm:px-8 lg:px-16">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-10 mb-16">

            {/* Brand Column */}
            <div className="lg:col-span-3 space-y-7">
              <div className="space-y-5">
                <Link to="/" className="inline-block">
                  <img src="/img/Tuka-Logo.svg" alt="Tuka" className="h-12 lg:h-14 object-contain" style={{ filter: 'brightness(0)' }} />
                </Link>
                <p className="text-[#3D3460] text-[15px] lg:text-[16px] leading-relaxed max-w-xs font-light">
                  Celebrate tradition, worn everyday. Tuka brings you the finest ethnic fashion — from handloom sarees to artisan jewellery.
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-3 text-[#3D3460]/70 text-[14px]">
                  <Phone size={15} style={{ color: MAGENTA }} />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-3 text-[#3D3460]/70 text-[14px]">
                  <Mail size={15} style={{ color: MAGENTA }} />
                  <span>hello@tuka.in</span>
                </div>
                <div className="flex items-start gap-3 text-[#3D3460]/70 text-[14px]">
                  <MapPin size={15} style={{ color: MAGENTA, marginTop: 2 }} />
                  <span>Mumbai, Maharashtra, India</span>
                </div>
              </div>

              {/* Social Icons */}
              <div className="flex items-center gap-5 pt-2">
                {[
                  { icon: <Instagram size={20} />, href: 'https://instagram.com/tuka_official?utm_source=tuka_website&utm_medium=footer#instagram', label: 'Instagram' },
                  { icon: <Facebook size={20} />, href: 'https://facebook.com/tukaofficial?utm_source=tuka_website&utm_medium=footer#facebook', label: 'Facebook' },
                  { icon: <Youtube size={22} />, href: 'https://youtube.com/@tukaofficial?utm_source=tuka_website&utm_medium=footer#youtube', label: 'YouTube' },
                ].map(({ icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                    style={{ background: 'rgba(26,16,64,0.08)', color: DARK }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = MAGENTA; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(26,16,64,0.08)'; e.currentTarget.style.color = DARK; }}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            <div className="lg:col-span-9 grid grid-cols-2 md:grid-cols-4 gap-10">
              {sections.map((section) => (
                <div key={section.title} className="space-y-6">
                  <h4
                    className="text-[12px] tracking-[0.28em] font-bold uppercase pb-2 border-b"
                    style={{ color: DARK, borderColor: `${MAGENTA}30` }}
                  >
                    {section.title}
                  </h4>
                  <ul className="space-y-4">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <Link
                          to={link.href}
                          className="text-[14px] lg:text-[15px] text-[#3D3460]/70 hover:text-[#b13896] transition-colors font-light"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Badges */}
          <div
            className="flex flex-wrap justify-center gap-6 py-8 mb-8 rounded-xl"
            style={{ background: `${DARK}08`, border: `1px solid ${DARK}0c` }}
          >
            {[
              '🔒 Secure Payments',
              '🚚 Free Shipping Pan India',
              '↩ Easy 30-Day Returns',
              '✨ 100% Authentic Products',
              '⭐ 4.9 Rated by 10k+ Customers',
            ].map((badge) => (
              <span
                key={badge}
                className="text-[13px] font-medium tracking-wide"
                style={{ color: DARK }}
              >
                {badge}
              </span>
            ))}
          </div>

          {/* Bottom Copyright */}
          <div className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderColor: `${DARK}12` }}>
            <p className="text-[13px] text-[#3D3460]/55">
              © {currentYear} Tuka. All Rights Reserved. Made with ♥ in India.
            </p>
            <div className="flex gap-5">
              {[
                { name: 'Privacy Policy', href: '/privacy-policy?ref=footer-bottom#privacy' },
                { name: 'Terms', href: '/terms-and-conditions?ref=footer-bottom#terms' },
                { name: 'Sitemap', href: '/sitemap?ref=footer-bottom#sitemap' },
              ].map((l) => (
                <Link key={l.name} to={l.href} className="text-[13px] text-[#3D3460]/45 hover:text-[#b13896] transition-colors">
                  {l.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
