import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { db } from "../components/Firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../components/useAuth";
import { useStore } from '../hooks/useStore';
import { motion, AnimatePresence } from "framer-motion";
import { 
  Star, Shield, Truck, RotateCcw, Heart, ShoppingBag, 
  ArrowLeft, Share2, Gem, Sparkles, ArrowRight, Loader2, ChevronRight, Package, Clock
} from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const [quantity, setQuantity] = useState(1);
  const [cartLoading, setCartLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);

  const handleSizeSelect = (v) => {
    setSelectedSize(v);
    const params = new URLSearchParams(searchParams);
    if (v && v.size) {
      params.set('size', v.size);
    } else {
      params.delete('size');
      params.delete('variant');
    }
    setSearchParams(params, { replace: true });
  };

  const curatedProducts = [];

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setSelectedImageIndex(0);
      const urlSize = searchParams.get('size') || searchParams.get('variant');
      const curated = curatedProducts.find(p => String(p.id) === String(id));
      if (curated) {
        setProduct(curated);
        if (curated.sizeVariants && curated.sizeVariants.length > 0) {
          const match = urlSize ? curated.sizeVariants.find(v => v.size.toLowerCase() === urlSize.toLowerCase()) : null;
          setSelectedSize(match || curated.sizeVariants[0]);
        }
        setLoading(false);
        return;
      }
      try {
        const ref = doc(db, "products", id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = { id: snap.id, ...snap.data() };
          setProduct(data);
          if (data.sizeVariants && data.sizeVariants.length > 0) {
            const match = urlSize ? data.sizeVariants.find(v => v.size.toLowerCase() === urlSize.toLowerCase()) : null;
            const inStockVariant = data.sizeVariants.find(v => Number(v.stock || 0) > 0);
            setSelectedSize(match || inStockVariant || data.sizeVariants[0]);
          }
        }
      } catch (e) {
        console.error("Firebase error:", e);
      }
      setLoading(false);
    };
    load();
  }, [id, searchParams]);

  const { addToCart, addToWishlist, isInCart, isInWishlist } = useStore();

  const activePrice = selectedSize ? Number(selectedSize.price) : Number(product?.price || 0);
  const activeOriginalPrice = selectedSize ? Number(selectedSize.original_price) : Number(product?.original_price || 0);
  const activeStock = selectedSize ? Number(selectedSize.stock || 0) : Number(product?.stock || 0);

  const handleAddToCart = async () => {
    if (!product) return;
    setCartLoading(true);
    try {
      const productToCart = {
        ...product,
        // Create a size-specific compound cart item ID to allow different sizes of the same item
        id: selectedSize ? `${product.id}_${selectedSize.size}` : product.id,
        name: selectedSize ? `${product.name} (${selectedSize.size})` : product.name,
        price: activePrice,
        original_price: activeOriginalPrice,
        stock: activeStock,
        selectedSize: selectedSize ? selectedSize.size : null
      };
      await addToCart(productToCart, quantity);
    } finally {
      setCartLoading(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!product) return;
    setWishlistLoading(true);
    try {
      const productToWishlist = {
        ...product,
        price: activePrice,
        original_price: activeOriginalPrice,
        stock: activeStock
      };
      await addToWishlist(productToWishlist);
    } finally {
      setWishlistLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFAF5] flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-[1.5px] border-[#b13896] border-t-transparent rounded-full animate-spin" />
        <p className="text-[14px] uppercase tracking-[0.5em] text-[#b13896] font-bold">Loading</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FDFAF5] flex flex-col items-center justify-center gap-6 text-center p-6">
        <h2 className="font-serif text-3xl text-[#161114]/80 italic">Item not found.</h2>
        <button onClick={() => navigate('/shop')} className="text-[14px] tracking-[0.3em] uppercase text-[#b13896] border-b border-[#b13896] pb-1 hover:text-[#161114] hover:border-[#161114] transition-all font-bold cursor-pointer">Return to Shop</button>
      </div>
    );
  }

  const discountPercent = activeOriginalPrice > activePrice 
    ? Math.round(((activeOriginalPrice - activePrice) / activeOriginalPrice) * 100) 
    : 0;

  const currentCartItemId = selectedSize ? `${product.id}_${selectedSize.size}` : product.id;
  const itemInCart = isInCart(currentCartItemId);

  return (
    <div className="min-h-screen bg-[#FDFAF5] font-sans text-[#161114]">
      
      {/* Premium Dark Crimson Breadcrumb Banner */}
      <div 
        className="relative w-full h-[220px] sm:h-[300px] flex items-center justify-center overflow-hidden" 
        style={{ background: 'linear-gradient(135deg, #161114 0%, #301729 50%, #571c4c 100%)' }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(216,97,188,0.15)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-black/45" />

        <div className="relative z-10 text-center px-5 pt-20 md:pt-24 text-white">
          <div className="flex items-center justify-center gap-2.5 text-[9px] md:text-[14px] tracking-[0.3em] font-bold uppercase text-white/50 mb-4 sm:mb-6">
            <button onClick={() => navigate('/')} className="hover:text-[#d861bc] transition-colors cursor-pointer">Home</button>
            <ChevronRight size={10} className="text-white/20" />
            <button onClick={() => navigate('/shop')} className="hover:text-[#d861bc] transition-colors cursor-pointer">Shop</button>
            {product.category && (
              <>
                <ChevronRight size={10} className="text-white/20" />
                <button onClick={() => navigate(`/shop?category=${product.category}`)} className="hover:text-[#d861bc] transition-colors cursor-pointer">{product.category}</button>
              </>
            )}
            <ChevronRight size={10} className="text-white/20" />
            <span className="text-[#d861bc] font-semibold">{product.name}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif tracking-tight leading-tight max-w-[800px] mx-auto line-clamp-1 italic font-light">
            {product.name}
          </h1>

          <p className="text-[14px] tracking-[0.2em] uppercase font-bold text-white/30 mt-3 sm:mt-4">
            House of Tuka
          </p>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-12 bg-[#FDFAF5] rounded-t-[50%] md:rounded-t-[100%] scale-x-125 translate-y-6" />
      </div>

      {/* Main Product Section */}
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-8 pb-16">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
          
          {/* Left: Image Gallery */}
          <div className="w-full lg:w-[55%] lg:sticky lg:top-24 self-start">
            <div className="flex flex-col-reverse sm:flex-row gap-4">
              {/* Thumbnail Strip */}
              {product.images && product.images.length > 0 && (
                <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:max-h-[600px] scrollbar-hide">
                  {product.images.map((imgUrl, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImageIndex(i)}
                      className={`flex-shrink-0 w-16 h-20 sm:w-[72px] sm:h-[90px] rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                        selectedImageIndex === i 
                          ? 'border-[#b13896] opacity-100' 
                          : 'border-transparent opacity-50 hover:opacity-80'
                      }`}
                    >
                      <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Image */}
              <motion.div 
                className="flex-1 aspect-[3/4] rounded-2xl overflow-hidden bg-[#f7ebf2] relative group cursor-crosshair border border-[#e5d5df]/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <img
                  src={(product.images && product.images[selectedImageIndex]) || product.image || product.images?.[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                />
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {discountPercent > 0 && (
                    <span className="bg-[#b13896] text-white px-3 py-1.5 rounded-full text-[14px] font-bold tracking-wider">
                      -{discountPercent}%
                    </span>
                  )}
                  {activeStock <= 5 && activeStock > 0 && (
                    <span className="bg-[#161114] text-white px-3 py-1.5 rounded-full text-[14px] font-bold tracking-wider">
                      Few Left
                    </span>
                  )}
                </div>
                {/* Wishlist Button on Image */}
                <button
                  onClick={handleAddToWishlist}
                  disabled={wishlistLoading}
                  className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md cursor-pointer ${
                    isInWishlist(product.id) 
                      ? 'bg-[#b13896] text-white' 
                      : 'bg-white/80 text-[#161114] hover:bg-[#b13896] hover:text-white'
                  }`}
                >
                  {wishlistLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Heart size={16} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                  )}
                </button>
              </motion.div>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="w-full lg:w-[45%] py-2">
            <div className="space-y-6">

              {/* Category & Name */}
              <div>
                <p className="text-[14px] tracking-[0.3em] font-bold uppercase text-[#b13896] mb-3">
                  {product.category || 'Tuka Heritage'}
                </p>
                <h1 className="text-3xl md:text-4xl font-serif text-[#161114] leading-snug tracking-tight">
                  {product.name}
                </h1>
                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {product.tags.map((tag, idx) => (
                      <span key={idx} className="bg-[#b13896]/10 text-[#b13896] px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="#D4A853" stroke="#D4A853" className={i >= 4 ? 'opacity-30' : ''} />
                  ))}
                </div>
                <span className="text-[12px] text-[#4a3f44]">4.9 (42 reviews)</span>
              </div>

              {/* Price Block */}
              <div className="flex items-baseline gap-4">
                <span className="text-3xl font-serif text-[#161114]">
                  ₹{Number(activePrice).toLocaleString()}
                </span>
                {activeOriginalPrice > activePrice && (
                  <>
                    <span className="text-lg text-[#4a3f44]/50 line-through font-serif">
                      ₹{Number(activeOriginalPrice).toLocaleString()}
                    </span>
                    <span className="text-[14px] font-bold text-[#b13896] bg-[#b13896]/8 px-2.5 py-1 rounded-full">
                      Save {discountPercent}%
                    </span>
                  </>
                )}
              </div>

              <p className="text-[14px] text-[#4a3f44]">Inclusive of all taxes. Free shipping on orders above ₹999.</p>

              {/* Divider */}
              <div className="h-px bg-[#e5d5df]/40" />

              {/* Description */}
              <p className="text-[15px] text-[#161114]/70 leading-relaxed font-serif">
                {product.description || "An exceptional masterwork of pure Bengal loom design, meticulously hand-woven by national award weavers to represent the philosophy of authentic heritage and modern aesthetics."}
              </p>

              {/* Size Selection Grid */}
              {product.sizeVariants && product.sizeVariants.length > 0 && (
                <div className="space-y-3 pt-2">
                  <span className="text-[14px] uppercase tracking-[0.2em] font-bold text-[#4a3f44] block">Select Size / Fit</span>
                  <div className="flex flex-wrap gap-2.5">
                    {product.sizeVariants.map((v) => {
                      const isSelected = selectedSize?.size === v.size;
                      const isOutOfStock = Number(v.stock || 0) <= 0;
                      return (
                        <button
                          key={v.size}
                          onClick={() => !isOutOfStock && handleSizeSelect(v)}
                          disabled={isOutOfStock}
                          className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase transition-all tracking-wider border relative cursor-pointer ${
                            isSelected 
                              ? 'bg-[#b13896] text-white border-[#b13896] shadow-sm'
                              : isOutOfStock
                              ? 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed line-through'
                              : 'bg-white text-[#161114] border-[#e5d5df] hover:border-[#b13896] hover:text-[#b13896]'
                          }`}
                        >
                          {v.size}
                          {isOutOfStock && <span className="absolute -top-1 -right-1 text-[8px] bg-slate-400 text-white px-1 rounded scale-75">Sold</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity & Add to Cart */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-6">
                  <span className="text-[14px] uppercase tracking-[0.2em] font-bold text-[#4a3f44]">Qty</span>
                  <div className="flex items-center border border-[#e5d5df] rounded-lg overflow-hidden bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center text-[#161114] hover:bg-[#f7ebf2] transition-colors text-lg font-light border-r border-[#e5d5df]"
                    >
                      −
                    </button>
                    <span className="w-12 text-center font-bold text-[#161114] text-sm">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(Math.min(10, activeStock), quantity + 1))}
                      disabled={quantity >= Math.min(10, activeStock)}
                      className="w-10 h-10 flex items-center justify-center text-[#161114] hover:bg-[#f7ebf2] transition-colors disabled:opacity-20 text-lg font-light border-l border-[#e5d5df]"
                    >
                      +
                    </button>
                  </div>
                  {activeStock <= 5 && activeStock > 0 && (
                    <span className="text-[14px] text-amber-600 font-bold uppercase tracking-wider animate-pulse">
                      Only {activeStock} left
                    </span>
                  )}
                  {activeStock <= 0 && (
                    <span className="text-[14px] text-red-500 font-bold uppercase tracking-wider">
                      Temporarily Out of Stock
                    </span>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={activeStock <= 0 || cartLoading}
                    className={`flex-1 h-14 text-[14px] uppercase tracking-[0.3em] font-bold rounded-xl transition-all duration-500 flex items-center justify-center gap-3 cursor-pointer ${
                      activeStock <= 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                      : itemInCart
                      ? 'bg-[#b13896] text-white shadow-lg shadow-[#b13896]/20'
                      : 'bg-[#161114] text-white hover:bg-[#b13896] shadow-lg shadow-[#161114]/15'
                    }`}
                  >
                    {cartLoading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <ShoppingBag size={18} />
                    )}
                    {activeStock <= 0 ? 'Out of Stock' : itemInCart ? 'Added to Cart' : 'Add to Cart'}
                  </button>
                </div>

                {/* Buy Now */}
                <button
                  onClick={() => { handleAddToCart(); navigate('/checkout'); }}
                  disabled={activeStock <= 0}
                  className="w-full h-14 text-[14px] uppercase tracking-[0.3em] font-bold rounded-xl border-2 border-[#161114] text-[#161114] hover:bg-[#161114] hover:text-white transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  Buy Now
                </button>
              </div>

              {/* Divider */}
              <div className="h-px bg-[#e5d5df]/40" />

              {/* Trust Signals - Horizontal */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { icon: Shield, label: "Secure\nCheckout" },
                  { icon: Truck, label: "Free\nDelivery" },
                  { icon: RotateCcw, label: "Easy\nReturns" },
                  { icon: Gem, label: "Heritage\nWeavers" }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 text-center py-3">
                    <div className="w-10 h-10 rounded-full bg-[#f7ebf2] flex items-center justify-center">
                      <item.icon size={18} className="text-[#b13896]" strokeWidth={1.5} />
                    </div>
                    <span className="text-[9px] uppercase tracking-wider font-bold text-[#4a3f44] whitespace-pre-line leading-tight">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="h-px bg-[#e5d5df]/40" />

              {/* Accordion-Style Tabs */}
              <div className="space-y-0">
                {[
                  { 
                    id: 'details', 
                    label: 'Product Details',
                    content: (
                      <div className="grid grid-cols-2 gap-4 py-1">
                        {[
                          { label: 'Reference Code', value: product.id.slice(0, 10).toUpperCase() },
                          { label: 'Fabric / Material', value: product.material || 'Authentic Bengal Cotton / Silk' },
                          { label: 'Selected Size', value: selectedSize ? selectedSize.size : 'Standard / Saree Size' },
                          { label: 'Sub-Category', value: product.subCategory || 'Handloom' },
                          { label: 'Collection Group', value: product.category || 'Tuka Elite' },
                          { label: 'Origin', value: 'West Bengal, India' },
                        ].map((d, i) => (
                          <div key={i}>
                            <p className="text-[14px] uppercase tracking-wider text-[#4a3f44]/60 font-bold mb-1">{d.label}</p>
                            <p className="text-[13px] text-[#161114] font-medium">{d.value}</p>
                          </div>
                        ))}
                      </div>
                    )
                  },
                  { 
                    id: 'craft', 
                    label: 'Heritage & Weaving',
                    content: (
                      <div className="space-y-3 py-1">
                        <p className="text-[13px] text-[#161114]/70 leading-relaxed font-serif">
                          This product is woven using traditional wooden shuttle loom clusters in Bengal. Motif patterns are created by lifting specific threads using supplementary weft techniques, passing down knowledge across generations.
                        </p>
                        <div className="flex items-center gap-2 text-[#b13896]">
                          <Sparkles size={14} />
                          <span className="text-[14px] uppercase tracking-wider font-bold">100% Authentic Handloom Mark</span>
                        </div>
                      </div>
                    )
                  },
                  { 
                    id: 'care', 
                    label: 'Care Instructions',
                    content: product.care_instructions ? (
                      <p className="text-[13px] text-[#161114]/70 leading-relaxed font-serif whitespace-pre-line">
                        {product.care_instructions}
                      </p>
                    ) : (
                      <ul className="space-y-2.5 py-1">
                        {[
                          "Dry clean only recommended for premium silk variants",
                          "For cotton, hand wash separately in cold water with mild detergent",
                          "Do not wring; dry flat in shade to preserve fibers",
                          "Iron on reverse with low/medium heat settings"
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-[13px] text-[#161114]/70">
                            <span className="w-1 h-1 rounded-full bg-[#b13896] mt-2 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )
                  },
                  { 
                    id: 'shipping', 
                    label: 'Shipping & Delivery',
                    content: (
                      <div className="space-y-3 py-1">
                        <div className="flex items-start gap-3">
                          <Package size={16} className="text-[#b13896] mt-0.5 flex-shrink-0" />
                          <p className="text-[13px] text-[#161114]/70">Free premium delivery across India. Usually ships within 48 hours and arrives in 3-5 business days.</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <Clock size={16} className="text-[#b13896] mt-0.5 flex-shrink-0" />
                          <p className="text-[13px] text-[#161114]/70">Easy exchange on unworn sizing variants. Feel free to contact our customer support for any custom drape questions.</p>
                        </div>
                      </div>
                    )
                  },
                ].map((tab) => (
                  <div key={tab.id} className="border-b border-[#e5d5df]/30">
                    <button
                      onClick={() => setActiveTab(activeTab === tab.id ? '' : tab.id)}
                      className="w-full flex items-center justify-between py-4 text-left group cursor-pointer"
                    >
                      <span className="text-[13px] font-bold text-[#161114] uppercase tracking-wider">{tab.label}</span>
                      <ChevronRight 
                        size={16} 
                        className={`text-[#4a3f44] transition-transform duration-300 ${activeTab === tab.id ? 'rotate-90' : ''}`} 
                      />
                    </button>
                    <AnimatePresence>
                      {activeTab === tab.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="pb-5 px-1">
                            {tab.content}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Fixed Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-xl border-t border-[#e5d5df]/30 z-50 lg:hidden flex gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
        <button
          onClick={handleAddToCart}
          disabled={activeStock <= 0 || cartLoading}
          className={`flex-1 h-12 text-[14px] uppercase tracking-[0.2em] font-bold rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeStock <= 0
            ? 'bg-gray-100 text-gray-400 border border-gray-200'
            : itemInCart
            ? 'bg-[#b13896] text-white shadow-md shadow-[#b13896]/20'
            : 'bg-[#161114] text-white'
          }`}
        >
          {cartLoading ? <Loader2 size={14} className="animate-spin" /> : <ShoppingBag size={14} />}
          {activeStock <= 0 ? 'Sold Out' : itemInCart ? 'In Cart' : 'Add to Cart'}
        </button>
        <button
          onClick={() => { handleAddToCart(); navigate('/checkout'); }}
          disabled={activeStock <= 0}
          className="flex-1 h-12 text-[14px] uppercase tracking-[0.2em] font-bold rounded-xl border-2 border-[#161114] text-[#161114] active:scale-[0.98] transition-all disabled:opacity-30 cursor-pointer"
        >
          Buy Now
        </button>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default ProductDetail;