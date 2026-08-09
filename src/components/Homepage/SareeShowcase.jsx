import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Award, Leaf, Feather, Sparkles, ArrowRight, Heart, Compass, Palette, Scissors } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeader from './SectionHeader';

const MAGENTA = '#b13896';
const DARK = '#161114';
const LIGHT_BG = '#FDFBF9';
const SANS = "'Plus Jakarta Sans', 'Inter', sans-serif";
const SERIF = "'Playfair Display', Georgia, serif";

const sareeData = [
  {
    id: 'dhaniakhali',
    title: 'Dhaniakhali Saree',
    subtitle: 'The Firm & Crisp Heritage of Hooghly',
    origin: 'Hooghly District, West Bengal',
    giTag: 'GI Certified Origin',
    image: 'img/d.jpeg',
    tagline: 'DENSE WEAVE & SIGNATURE KANCHHA BORDER',
    story: `Born in the quiet, green villages of Dhaniakhali in Hooghly district, the Dhaniakhali saree is world-renowned for its firm thread count, exceptional body, and distinctive contrast borders known as "Kanchha border". Meticulously handwoven on traditional wooden pit looms with 100s count combed cotton yarn, these sarees feature delicate striped pallus and a structured drape that naturally softens with every wash. Perfect for humid Indian climates, it stands as an enduring symbol of Bengali strength, grace, and everyday luxury.`,
    quote: `"Each thread in a Dhaniakhali saree is beat tightly with the reed, giving it a crisp, regal silhouette that holds shape all day."`,
    features: [
      {
        icon: <Award size={18} strokeWidth={1.5} />,
        title: 'GI Certified Authenticity',
        desc: 'Protected Geographical Indication guaranteeing authentic origin from Hooghly master weavers.'
      },
      {
        icon: <ShieldCheck size={18} strokeWidth={1.5} />,
        title: '100s Count Fine Cotton',
        desc: 'Superior high-density yarn alignment ensuring structure, opacity, and long-lasting durability.'
      },
      {
        icon: <Leaf size={18} strokeWidth={1.5} />,
        title: '100% Eco-Sustainable',
        desc: 'Natural yarn dyed with plant-based, non-toxic, skin-friendly colors free of harsh chemicals.'
      },
      {
        icon: <Feather size={18} strokeWidth={1.5} />,
        title: 'All-Day Crisp Comfort',
        desc: 'Highly breathable natural weave that stays cool in summer and provides timeless elegance.'
      }
    ],
    accentColor: '#b13896',
    catLink: '/shop?cat=dhaniakhali#products'
  },
  {
    id: 'begumpuri',
    title: 'Begumpuri Saree',
    subtitle: 'The Lightweight Artistry of Begampur',
    origin: 'Begampur, Hooghly, West Bengal',
    giTag: 'Artisanal Handloom Craft',
    image: 'img/b.jpeg',
    tagline: 'FEATHERLIGHT TEXTURE & FISH-SCALE MOTIFS',
    story: `Hailing from the historic handloom cluster of Begampur, the Begumpuri saree is celebrated for its ethereal lightness, translucent body, and artistic "Macha chokh" (fish-scale) serrated borders. Woven using loosely twisted cotton yarns by hereditary master weavers, Begumpuri sarees represent a harmonious blend of rustic Bengali heritage and modern minimalist aesthetics. The shuttle glides effortlessly back and forth, creating an airy, cloud-like drape prized by textile connoisseurs across India and beyond.`,
    quote: `"Woven with loosely twisted yarns, Begumpuri sarees feel like a gentle breeze against your skin, blending comfort with subtle charm."`,
    features: [
      {
        icon: <Feather size={18} strokeWidth={1.5} />,
        title: 'Featherlight Weightless Drape',
        desc: 'Ultra-soft loose twist cotton offering an effortless, cloud-like feel for warm weather.'
      },
      {
        icon: <Sparkles size={18} strokeWidth={1.5} />,
        title: 'Macha Chokh Motif Borders',
        desc: 'Signature serrated geometric fish-scale motifs hand-wrought with wooden shuttles.'
      },
      {
        icon: <Award size={18} strokeWidth={1.5} />,
        title: 'Hereditary Artisan Heritage',
        desc: 'Preserving 300+ years of uncompromised family weaving tradition in rural Bengal.'
      },
      {
        icon: <Leaf size={18} strokeWidth={1.5} />,
        title: 'Zero Synthetic Additives',
        desc: 'Crafted entirely with pure organic yarn for maximum skin breathability and eco-purity.'
      }
    ],
    accentColor: '#9d027a',
    catLink: '/shop?cat=begumpuri#products'
  },
  {
    id: 'shantipuri',
    title: 'Shantipuri Saree',
    subtitle: 'The Royal Fine-Weave Legacy of Nadia',
    origin: 'Shantipur, Nadia District, West Bengal',
    giTag: 'GI Tagged Royal Heritage',
    image: 'img/s.jpeg',
    tagline: 'GOSSAMER WEAVE & JACQUARD ROYAL MOTIFS',
    story: `Tracing its royal lineage to the 15th century under the patronage of the Kings of Nadia, Shantipur is the celebrated cradle of fine Bengal handloom weaving. Famous for its micro-fine 120s count combed cotton, gossamer-thin translucency, and intricate dobby border motifs like "Bhomra" (bumblebee) and "Taj", a Shantipuri saree exudes understated royalty. Each masterpiece takes 5 to 8 days of painstaking loomwork, flowing around the body like liquid silk with an unmatched opulent drape.`,
    quote: `"Patronized by 15th-century Bengali royalty, Shantipuri handlooms combine royal majesty with micro-fine combed yarns."`,
    features: [
      {
        icon: <Award size={18} strokeWidth={1.5} />,
        title: 'Royal 120s Fine Combed Yarns',
        desc: 'Gossamer micro-fine thread count delivering a silky smooth sheen and luxurious fluid drape.'
      },
      {
        icon: <Sparkles size={18} strokeWidth={1.5} />,
        title: 'Bhomra & Taj Dobby Motifs',
        desc: 'Intricate jacquard borders inspired by royal palace gardens and classical architecture.'
      },
      {
        icon: <ShieldCheck size={18} strokeWidth={1.5} />,
        title: 'GI Certified Heritage',
        desc: 'Official protection certifying centuries of royal textile craft in Nadia district.'
      },
      {
        icon: <Leaf size={18} strokeWidth={1.5} />,
        title: 'Direct Fair-Trade Impact',
        desc: 'Empowering traditional weaving families with fair living wages and ethical dignity.'
      }
    ],
    accentColor: '#b13896',
    catLink: '/shop?cat=shantipuri#products'
  },
  {
    id: 'hindshree',
    title: 'Hindshree Signature Collection',
    subtitle: 'Unbound Creativity & Artisan Innovation',
    origin: 'Artisan Clusters, West Bengal',
    giTag: 'Signature Artisanal Craft',
    image: 'img/h.jpeg',
    tagline: 'FREEHAND ARTWORK & APPLIQUÉ NEEDLEWORK',
    story: `Hindshree is a tribute to Bengal’s rich handloom ecosystem—where ancient pit looms meet contemporary artistic experimentation. From delicate hand-painted motifs and hand-stitched appliqué art to raw, textured khadi and tissue linen glows, Hindshree celebrates the unlimited creative capacity of Bengal's master weavers and painters.`,
    quote: `"Where every thread is an artist's brushstroke, blending centuries-old weaving tradition with contemporary artistic flair."`,
    features: [
      {
        icon: <Feather size={18} strokeWidth={1.5} />,
        title: '100% Hand-Spun Yarns',
        desc: 'Natural cotton, hand-spun khadi, and pure European flax linen yarn purity.'
      },
      {
        icon: <Palette size={18} strokeWidth={1.5} />,
        title: 'Freehand Organic Painting',
        desc: 'Freehand motif artwork crafted with organic plant-based natural dyes by master artisans.'
      },
      {
        icon: <Scissors size={18} strokeWidth={1.5} />,
        title: 'Hand Appliqué Stitched',
        desc: 'Intricate geometric fabric cutout stitching celebrating age-old Bengali needlecraft.'
      },
      {
        icon: <Sparkles size={18} strokeWidth={1.5} />,
        title: 'Metallic Tissue Linen Glow',
        desc: 'Fine Zari metallic threads interlaced into pure flax linen for a subtle golden shimmer.'
      }
    ],
    accentColor: '#b13896',
    catLink: '/shop?cat=hindshree#products'
  }
];

const SareeShowcase = () => {
  return (
    <section className="py-10 lg:py-16 relative overflow-hidden" style={{ background: '#FFFFFF' }}>
      {/* Background subtle decoration */}
      <div className="absolute top-0 inset-x-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(177,56,150,0.2), transparent)' }} />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        
        {/* Standardized Unified Section Header */}
        <SectionHeader
          badgeText="BENGAL HANDLOOM LEGACY"
          badgeIcon={<Compass />}
          titlePrefix="Iconic Weaves of"
          highlightText="Bengal"
          description="Explore our curated trio of Bengal’s most treasured handloom traditions. Every saree tells a story of century-old looms, natural yarns, and master craftsmanship."
        />

        {/* Quick jump tabs */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-4 -mt-4 mb-10 flex-wrap">
          {sareeData.map((item, idx) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="px-5 py-2 rounded-full text-[11px] tracking-wider font-semibold transition-all duration-300 hover:bg-[#161114] hover:text-white hover:shadow-md"
              style={{
                background: LIGHT_BG,
                border: '1px solid rgba(0,0,0,0.08)',
                color: DARK,
                fontFamily: SANS
              }}
            >
              <span style={{ color: MAGENTA }} className="mr-1.5 font-bold">0{idx + 1}.</span>
              {item.title}
            </a>
          ))}
        </div>

        {/* Individual Saree Sections */}
        <div className="space-y-12 lg:space-y-16">
          {sareeData.map((item, index) => {
            const isEven = index % 2 === 0;

            return (
              <div
                key={item.id}
                id={item.id}
                className="scroll-mt-24 rounded-3xl p-6 sm:p-10 lg:p-14 relative overflow-hidden transition-all duration-500"
                style={{
                  background: isEven ? LIGHT_BG : '#FFFFFF',
                  border: '1px solid rgba(0,0,0,0.06)',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.02)'
                }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
                  
                  {/* Model Photo Container */}
                  <div className={`lg:col-span-6 relative ${isEven ? 'order-1' : 'order-1 lg:order-2'}`}>
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-[480px] sm:h-[580px] lg:h-[680px] object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      />

                      {/* Dark gradient overlay for text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                      {/* GI Tag Badge overlay top-left */}
                      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-full" style={{ background: 'rgba(22,17,20,0.75)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                        <ShieldCheck size={14} style={{ color: '#EAB308' }} />
                        <span className="text-[10px] tracking-widest text-white font-bold uppercase" style={{ fontFamily: SANS }}>
                          {item.giTag}
                        </span>
                      </div>

                      {/* Origin badge bottom-left */}
                      <div className="absolute bottom-5 left-5 right-5 z-10">
                        <span className="text-[10px] tracking-[0.25em] text-white/70 uppercase block mb-1 font-semibold" style={{ fontFamily: SANS }}>
                          ORIGIN & REGION
                        </span>
                        <p className="text-white text-lg font-medium tracking-wide" style={{ fontFamily: SERIF }}>
                          {item.origin}
                        </p>
                      </div>
                    </div>

                    {/* Decorative back-shadow glow */}
                    <div
                      className="absolute -inset-4 rounded-3xl -z-10 opacity-30 blur-2xl transition-opacity group-hover:opacity-50"
                      style={{ background: `radial-gradient(circle, ${MAGENTA} 0%, transparent 70%)` }}
                    />
                  </div>

                  {/* Story & Features Container */}
                  <div className={`lg:col-span-6 space-y-6 ${isEven ? 'order-2' : 'order-2 lg:order-1'}`}>
                    {/* Tagline & Title */}
                    <div>
                      <span className="text-[10px] tracking-[0.3em] font-bold uppercase block mb-2" style={{ color: MAGENTA, fontFamily: SANS }}>
                        {item.tagline}
                      </span>
                      <h3 className="text-3xl sm:text-4xl font-light text-gray-900 tracking-tight" style={{ fontFamily: SERIF }}>
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500 font-normal mt-1" style={{ fontFamily: SANS }}>
                        {item.subtitle}
                      </p>
                    </div>

                    {/* Story Narrative */}
                    <div className="space-y-3 border-l-2 pl-5" style={{ borderColor: `${MAGENTA}40` }}>
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-light" style={{ fontFamily: SANS }}>
                        {item.story}
                      </p>
                      <p className="text-xs italic text-gray-500 font-serif leading-relaxed" style={{ fontFamily: SERIF }}>
                        {item.quote}
                      </p>
                    </div>

                    {/* Features Grid */}
                    <div className="pt-3">
                      <h4 className="text-[11px] tracking-[0.25em] uppercase font-bold text-gray-900 mb-4" style={{ fontFamily: SANS }}>
                        Craftsmanship & Features
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {item.features.map((feat, fIdx) => (
                          <div
                            key={fIdx}
                            className="p-4 rounded-xl flex items-start gap-3.5 transition-colors duration-300 hover:bg-white"
                            style={{ background: isEven ? '#FFFFFF' : LIGHT_BG, border: '1px solid rgba(0,0,0,0.05)' }}
                          >
                            <div className="p-2 rounded-lg shrink-0" style={{ background: `${MAGENTA}12`, color: MAGENTA }}>
                              {feat.icon}
                            </div>
                            <div>
                              <h5 className="text-xs font-bold text-gray-900 mb-1" style={{ fontFamily: SANS }}>
                                {feat.title}
                              </h5>
                              <p className="text-[12px] text-gray-500 font-light leading-relaxed" style={{ fontFamily: SANS }}>
                                {feat.desc}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="pt-4 flex items-center gap-4 flex-wrap">
                      <Link
                        to={item.catLink}
                        className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full text-white font-semibold text-xs tracking-widest uppercase transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                        style={{ background: MAGENTA, fontFamily: SANS }}
                      >
                        <span>Explore {item.title} Collection</span>
                        <ArrowRight size={14} />
                      </Link>

                      <span className="text-xs text-gray-400 font-medium" style={{ fontFamily: SANS }}>
                        ✦ Handwoven in West Bengal
                      </span>
                    </div>

                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SareeShowcase;
