import React, { useState, useEffect } from 'react';
import { db } from '../components/Firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Search, Heart, ShoppingBag, Eye, ChevronRight, Loader2, SlidersHorizontal, X } from 'lucide-react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../components/useAuth';
import { useStore } from '../hooks/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import QuickView from '../components/QuickView';
import Breadcrumb from '../components/Breadcrumb';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [cartLoadings, setCartLoadings] = useState({});
  const [wishlistLoadings, setWishlistLoadings] = useState({});
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Sync state from URL search parameters
  useEffect(() => {
    const categoryQuery = searchParams.get('category') || searchParams.get('cat');
    const searchQuery = searchParams.get('q') || searchParams.get('search') || searchParams.get('query');
    const sortQuery = searchParams.get('sort') || searchParams.get('sortBy');
    const quickviewId = searchParams.get('quickview');

    if (categoryQuery) {
      setSelectedCategory(categoryQuery);
    } else if (!searchParams.has('cat') && !searchParams.has('category')) {
      setSelectedCategory('All');
    }

    if (searchQuery !== null) {
      setSearchTerm(searchQuery);
    }

    if (sortQuery) {
      setSortBy(sortQuery);
    }

    if (quickviewId && products.length > 0) {
      const p = products.find(prod => String(prod.id) === String(quickviewId));
      if (p) setSelectedProduct(p);
    }
  }, [searchParams, products]);

  // Helper to sync state changes to URL query parameters
  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    const params = new URLSearchParams(searchParams);
    if (cat && cat !== 'All') {
      params.set('cat', cat);
    } else {
      params.delete('cat');
      params.delete('category');
    }
    setSearchParams(params, { replace: true });
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
      params.delete('search');
      params.delete('query');
    }
    setSearchParams(params, { replace: true });
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    const params = new URLSearchParams(searchParams);
    if (sort && sort !== 'newest') {
      params.set('sort', sort);
    } else {
      params.delete('sort');
      params.delete('sortBy');
    }
    setSearchParams(params, { replace: true });
  };

  const handleQuickViewOpen = (product) => {
    setSelectedProduct(product);
    const params = new URLSearchParams(searchParams);
    if (product) {
      params.set('quickview', product.id);
    } else {
      params.delete('quickview');
    }
    setSearchParams(params, { replace: true });
  };

  const curatedProducts = [];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        const dbProducts = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(dbProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts(curatedProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const { addToCart, addToWishlist, isInCart, isInWishlist } = useStore();

  const handleAddToCart = async (e, product) => {
    e.stopPropagation();
    setCartLoadings(prev => ({ ...prev, [product.id]: true }));
    try {
      const defaultVariant = product.sizeVariants && product.sizeVariants.length > 0 
        ? (product.sizeVariants.find(v => Number(v.stock || 0) > 0) || product.sizeVariants[0])
        : null;

      const productToCart = {
        ...product,
        id: defaultVariant ? `${product.id}_${defaultVariant.size}` : product.id,
        name: defaultVariant ? `${product.name} (${defaultVariant.size})` : product.name,
        price: defaultVariant ? Number(defaultVariant.price) : Number(product.price),
        original_price: defaultVariant ? Number(defaultVariant.original_price) : Number(product.original_price),
        stock: defaultVariant ? Number(defaultVariant.stock) : Number(product.stock),
        selectedSize: defaultVariant ? defaultVariant.size : null
      };

      await addToCart(productToCart);
    } finally {
      setCartLoadings(prev => ({ ...prev, [product.id]: false }));
    }
  };

  const handleAddToWishlist = async (e, product) => {
    e.stopPropagation();
    setWishlistLoadings(prev => ({ ...prev, [product.id]: true }));
    try {
      await addToWishlist(product);
    } finally {
      setWishlistLoadings(prev => ({ ...prev, [product.id]: false }));
    }
  };

  const categories = [
    'All', 
    'HANDLOOM SAREE', 
    'DESIGNER BLOUSE', 
    'Handloom Saree', 
    'Blouse', 
    'Boutique Collection', 
    'New Arrivals'
  ];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesCategory = false;
    if (selectedCategory === 'All') {
      matchesCategory = true;
    } else {
      const targetCat = selectedCategory.toLowerCase().replace(/[^a-z0-9]/g, '');
      const prodCat = (p.category || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const prodName = (p.name || '').toLowerCase();
      const prodDesc = (p.description || '').toLowerCase();
      const prodTags = (p.tags || []).map(t => String(t).toLowerCase());

      matchesCategory = prodCat.includes(targetCat) ||
                        targetCat.includes(prodCat) ||
                        prodName.includes(selectedCategory.toLowerCase()) ||
                        prodDesc.includes(selectedCategory.toLowerCase()) ||
                        prodTags.some(t => t.includes(selectedCategory.toLowerCase()));
    }
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#FDFAF5] font-sans text-[#161114]">
      
      {selectedProduct && <QuickView product={selectedProduct} onClose={() => handleQuickViewOpen(null)} />}

      {/* Premium Breadcrumb */}
      <Breadcrumb 
        title="Our Collection"
        subtitle="Discover our curated selection of handcrafted Bengal sarees and designer blouses, woven with timeless tradition and modern grace."
        bgImage="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1600"
        links={[
          { name: 'Home', href: '/?ref=shop#hero' },
          { name: 'Shop', href: '/shop?cat=all#products', active: true }
        ]}
      />

      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-8">
        
        {/* Toolbar: Categories + Search + Sort */}
        <div className="flex flex-col gap-5 mb-8">
          
          {/* Categories - Scrollable */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-full text-[14px] font-bold tracking-wider uppercase transition-all whitespace-nowrap border cursor-pointer ${
                  selectedCategory === cat 
                    ? 'bg-[#b13896] text-white border-[#b13896]' 
                    : 'bg-white text-[#4a3f44] border-[#e5d5df]/50 hover:border-[#b13896] hover:text-[#b13896]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search + Sort Row */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a3f44]/40" size={16} />
              <input 
                type="text" 
                placeholder="Search products..." 
                className="w-full bg-white border border-[#e5d5df]/50 rounded-lg pl-10 pr-4 py-2.5 text-[13px] text-[#161114] outline-none focus:border-[#b13896] transition-all placeholder:text-[#4a3f44]/40"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <select 
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="bg-white border border-[#e5d5df]/50 rounded-lg px-4 py-2.5 text-[12px] text-[#161114] outline-none focus:border-[#b13896] transition-all cursor-pointer appearance-none pr-8 font-medium"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237B6D63' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
            <p className="text-[12px] text-[#4a3f44] hidden sm:block">{sortedProducts.length} products</p>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-[#f7ebf2] rounded-xl mb-3" />
                <div className="h-3 bg-[#f7ebf2] rounded w-3/4 mb-2" />
                <div className="h-3 bg-[#f7ebf2] rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : sortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {sortedProducts.map((product, index) => {
              // Extract pricing details based on optional size variants
              const defaultVariant = product.sizeVariants && product.sizeVariants.length > 0
                ? (product.sizeVariants.find(v => Number(v.stock || 0) > 0) || product.sizeVariants[0])
                : null;
              
              const price = defaultVariant ? Number(defaultVariant.price) : Number(product.price || 0);
              const original_price = defaultVariant ? Number(defaultVariant.original_price) : Number(product.original_price || 0);
              const stock = defaultVariant ? Number(defaultVariant.stock || 0) : Number(product.stock || 0);
              
              const isSale = original_price > price;
              const hasVariants = product.sizeVariants && product.sizeVariants.length > 0;
              const isItemInCart = isInCart(defaultVariant ? `${product.id}_${defaultVariant.size}` : product.id);

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (index % 4) * 0.05 }}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}?ref=shop#product-details`)}
                >
                  {/* Image */}
                  <div className="aspect-[3/4] overflow-hidden bg-[#f7ebf2] mb-3 relative rounded-xl border border-[#e5d5df]/20">
                    <img 
                      src={product.image || product.images?.[0]} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
                      {isSale && (
                        <span className="bg-[#b13896] text-white px-2 py-1 rounded-md text-[9px] font-bold tracking-wider">
                          -{Math.round(((original_price - price) / original_price) * 100)}%
                        </span>
                      )}
                      {stock <= 0 && (
                        <span className="bg-[#161114] text-white px-2 py-1 rounded-md text-[9px] font-bold tracking-wider">
                          Sold Out
                        </span>
                      )}
                      {hasVariants && (
                        <span className="bg-[#571c4c] text-white px-2 py-1 rounded-md text-[9px] font-bold tracking-wider uppercase">
                          Sizing Options
                        </span>
                      )}
                    </div>

                    {/* Wishlist */}
                    <button 
                      onClick={(e) => handleAddToWishlist(e, product)} 
                      disabled={wishlistLoadings[product.id]}
                      className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 cursor-pointer ${
                        isInWishlist(product.id) 
                          ? 'bg-[#b13896] text-white' 
                          : 'bg-white/80 backdrop-blur-sm text-[#161114] opacity-0 group-hover:opacity-100 hover:bg-[#b13896] hover:text-white'
                      }`}
                    >
                      {wishlistLoadings[product.id] ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Heart size={14} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                      )}
                    </button>

                    {/* Quick View */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleQuickViewOpen(product); }} 
                      className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#161114] opacity-0 group-hover:opacity-100 hover:bg-[#b13896] hover:text-white transition-all z-10 cursor-pointer"
                    >
                      <Eye size={14} />
                    </button>

                    {/* Add to Cart - Bottom overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-2.5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
                      <button 
                        onClick={(e) => stock > 0 && handleAddToCart(e, product)}
                        disabled={stock <= 0 || cartLoadings[product.id]}
                        className={`w-full py-2.5 text-[14px] tracking-wider font-bold uppercase flex items-center justify-center gap-2 rounded-lg transition-all cursor-pointer ${
                          stock <= 0
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                          : isItemInCart 
                          ? 'bg-[#b13896] text-white' 
                          : 'bg-[#161114] text-white hover:bg-[#b13896]'
                        }`}
                      >
                        {cartLoadings[product.id] ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <ShoppingBag size={12} />
                        )}
                        {stock <= 0 ? 'Sold Out' : isItemInCart ? 'In Cart' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="space-y-1 px-0.5">
                    <p className="text-[9px] tracking-[0.2em] font-bold uppercase text-[#4a3f44]">{product.brand || "Tuka"}</p>
                    <h3 className="font-serif text-[15px] text-[#161114] group-hover:text-[#b13896] transition-colors leading-snug line-clamp-1">{product.name}</h3>
                    <div className="flex items-baseline gap-2 pt-0.5">
                      <span className="text-[14px] font-medium text-[#161114]">₹{Number(price).toLocaleString()}</span>
                      {isSale && (
                        <span className="text-[12px] text-[#4a3f44]/50 line-through">₹{Number(original_price).toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24">
            <ShoppingBag size={40} strokeWidth={1} className="mx-auto text-[#b13896]/20 mb-4" />
            <p className="font-serif text-xl text-[#4a3f44]/60 mb-4">No products found</p>
            <button 
              onClick={() => { handleSearchChange(''); handleCategoryChange('All'); }} 
              className="text-[12px] font-bold text-[#b13896] hover:text-[#161114] transition-colors cursor-pointer"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
      <style dangerouslySetInnerHTML={{ __html: `.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }` }} />
    </div>
  );
};

export default Shop;