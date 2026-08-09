import React, { useState, useEffect } from "react";
import { useAuth } from "../components/useAuth";
import { db } from "../components/Firebase";
import { doc, getDoc, collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { 
  User, 
  Package, 
  Heart, 
  LogOut, 
  ChevronRight, 
  Settings, 
  ShoppingBag, 
  CreditCard, 
  MapPin, 
  Bell,
  Award,
  Star,
  Crown,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import Breadcrumb from "../components/Breadcrumb";

const Account = () => {
  const { user, logout, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const breadcrumbLinks = [
    { name: 'Home', href: '/' },
    { name: 'Account', href: '/account?tab=overview', active: true }
  ];

  const setActiveTab = (tabName) => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', tabName);
    setSearchParams(params, { replace: true });
  };

  const [userData, setUserData] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [stats, setStats] = useState({ cart: 0, wishlist: 0 });
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        }

        const cartSnap = await getDocs(collection(db, "users", user.uid, "cart"));
        const wishlistSnap = await getDocs(collection(db, "users", user.uid, "wishlist"));
        
        let userOrders = [];
        try {
          const userOrdersSnap = await getDocs(collection(db, "users", user.uid, "orders"));
          userOrders = userOrdersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        } catch (e) {
          console.log("Subcollection orders fetch fallback:", e);
        }

        try {
          const globalOrdersQuery = query(collection(db, "orders"));
          const globalSnap = await getDocs(globalOrdersQuery);
          const matchedGlobal = globalSnap.docs
            .map(d => ({ id: d.id, ...d.data() }))
            .filter(o => o.userId === user.uid || (user.email && o.userEmail === user.email));

          // Combine and deduplicate
          const combinedMap = new Map();
          [...userOrders, ...matchedGlobal].forEach(ord => {
            if (ord.id) combinedMap.set(ord.id, ord);
          });

          userOrders = Array.from(combinedMap.values());
        } catch (e) {
          console.log("Global orders fetch fallback:", e);
        }

        setRecentOrders(userOrders);
        setStats({
          cart: cartSnap.size,
          wishlist: wishlistSnap.size
        });
      } catch (error) {
        console.error("Error fetching account data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      navigate("/");
    } catch (error) {
      alert("Failed to delete account. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F4EF] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#b13896]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFAF5] font-sans text-[#161114] pb-24">
      {/* Shared Ultra-Premium Hero Banner */}
      <Breadcrumb
        title="My Account"
        subtitle="Manage your atelier orders, profile settings, saved addresses, and wishlist."
        bgImage="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=1600"
        links={breadcrumbLinks}
        badgeText="TUKA PATRON • PRIVATE ATELIER"
      />

      <div className="max-w-[1200px] mx-auto px-6 pt-8">
        
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          
          {/* Sidebar - Compact Profile */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#f7ebf2]/40 backdrop-blur-xl rounded-[40px] p-10 border border-[#e5d5df]/30 shadow-sm relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#b13896]/5 rounded-full blur-3xl" />
              
              <div className="flex items-center gap-6 mb-10">
                <div className="relative">
                  <div className="w-24 h-24 rounded-3xl bg-white border border-[#e5d5df]/30 flex items-center justify-center overflow-hidden shadow-sm">
                    {userData?.photoURL ? (
                      <img src={userData.photoURL} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User size={36} className="text-[#4a3f44]/20" />
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-9 h-9 bg-[#b13896] rounded-xl flex items-center justify-center text-white border-4 border-white shadow-lg">
                    <Crown size={16} />
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-serif text-[#161114] tracking-tight leading-none mb-3">
                    {userData?.displayName || "Member"}
                  </h2>
                  <p className="text-[9px] font-bold text-[#b13896] uppercase tracking-[0.3em]">Tuka Elite Status</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-5 rounded-3xl bg-white/50 border border-[#e5d5df]/30">
                  <span className="text-[14px] font-bold text-[#4a3f44] uppercase tracking-widest">Points</span>
                  <span className="text-sm font-bold text-[#b13896]">2,450 XP</span>
                </div>
                <div className="flex justify-between items-center p-5 rounded-3xl bg-white/50 border border-[#e5d5df]/30">
                  <span className="text-[14px] font-bold text-[#4a3f44] uppercase tracking-widest">Member Since</span>
                  <span className="text-sm font-bold text-[#161114]/70">2026</span>
                </div>
              </div>

              <div className="mt-10 pt-10 border-t border-[#e5d5df]/30 space-y-2">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between p-5 rounded-3xl hover:bg-[#b13896]/5 transition-all group text-left"
                >
                  <div className="flex items-center gap-4">
                    <LogOut size={18} className="text-[#4a3f44] group-hover:text-red-600" />
                    <span className="text-[14px] font-bold text-[#4a3f44] uppercase tracking-widest group-hover:text-red-600">Sign Out</span>
                  </div>
                  <ChevronRight size={14} className="text-[#4a3f44]/40" />
                </button>
              </div>
            </motion.div>

            {/* Stats Grid - Very Compact */}
            <div className="grid grid-cols-2 gap-4">
              <Link to="/cart" className="bg-[#f7ebf2]/40 backdrop-blur-xl p-8 rounded-[32px] border border-[#e5d5df]/30 hover:border-[#b13896] transition-all group shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#b13896]/5 flex items-center justify-center text-[#b13896]">
                    <ShoppingBag size={20} />
                  </div>
                  <ChevronRight size={14} className="text-[#4a3f44]/20 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-3xl font-sans font-bold text-[#161114]">{stats.cart}</p>
                <p className="text-[8px] font-bold text-[#4a3f44]/40 uppercase tracking-[0.2em] mt-2">In Your Bag</p>
              </Link>
              <Link to="/wishlist" className="bg-[#f7ebf2]/40 backdrop-blur-xl p-8 rounded-[32px] border border-[#e5d5df]/30 hover:border-[#b13896] transition-all group shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#b13896]/5 flex items-center justify-center text-[#b13896]">
                    <Heart size={20} fill="currentColor" />
                  </div>
                  <ChevronRight size={14} className="text-[#4a3f44]/20 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-3xl font-sans font-bold text-[#161114]">{stats.wishlist}</p>
                <p className="text-[8px] font-bold text-[#4a3f44]/40 uppercase tracking-[0.2em] mt-2">Wishlist</p>
              </Link>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50/50 rounded-[32px] p-8 border border-red-100/50">
              {!showDeleteConfirm ? (
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full py-4 text-[9px] font-bold text-red-900/40 hover:text-red-600 uppercase tracking-[0.3em] transition-colors"
                >
                  Deactivate Account
                </button>
              ) : (
                <div className="space-y-6 text-center">
                  <p className="text-[14px] text-red-600 font-bold uppercase tracking-widest leading-relaxed">Proceed with caution? <br/> All data will be lost.</p>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 py-3 bg-white border border-red-100 rounded-2xl text-[9px] font-bold text-[#161114] uppercase tracking-widest"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleDeleteAccount}
                      className="flex-1 py-3 bg-red-600 rounded-2xl text-[9px] font-bold text-white uppercase tracking-widest shadow-lg shadow-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content - Activity */}
          <div className="lg:col-span-8 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#f7ebf2]/40 backdrop-blur-xl rounded-[40px] border border-[#e5d5df]/30 p-10 md:p-14 relative overflow-hidden shadow-sm"
            >
              <div className="flex items-center justify-between mb-14">
                <div>
                  <h3 className="text-4xl font-serif text-[#161114] mb-3">Order History</h3>
                  <p className="text-[14px] font-bold text-[#4a3f44]/40 uppercase tracking-[0.3em]">Tracking your latest acquisitions</p>
                </div>
                <Link to="/orders" className="w-12 h-12 rounded-full border border-[#e5d5df]/30 flex items-center justify-center text-[#b13896] hover:bg-[#b13896] hover:text-white transition-all shadow-sm">
                  <ArrowRight size={18} />
                </Link>
              </div>

              <div className="space-y-6">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <div key={order.id} className="group flex flex-col sm:flex-row sm:items-center justify-between p-8 rounded-[32px] bg-white/50 border border-[#e5d5df]/20 hover:border-[#b13896]/30 transition-all gap-6 shadow-sm">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-[#F8F4EF] flex items-center justify-center text-[#b13896] border border-[#e5d5df]/30 shadow-sm">
                          <Package size={24} strokeWidth={1.5} />
                        </div>
                        <div>
                          <p className="text-[12px] font-bold text-[#161114] tracking-widest">#{order.id.slice(0, 8).toUpperCase()}</p>
                          <p className="text-[14px] text-[#4a3f44]/50 font-bold uppercase tracking-widest mt-1">
                            {new Date(order.createdAt?.seconds * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
                        <p className="text-xl font-serif font-bold text-[#b13896]">₹{Number(order.total).toLocaleString()}</p>
                        <span className="text-[9px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full bg-[#b13896]/5 text-[#b13896] border border-[#b13896]/10">
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-24 bg-white/30 rounded-[40px] border border-dashed border-[#e5d5df]/50">
                    <ShoppingBag size={48} strokeWidth={1} className="mx-auto text-[#b13896]/10 mb-8" />
                    <p className="text-[#4a3f44]/40 font-serif text-2xl italic">No acquisitions found</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: MapPin, label: "Shipping Addresses", sub: "2 Saved Locations" },
                { icon: CreditCard, label: "Payment Vault", sub: "Encrypted Methods" },
                { icon: Award, label: "Elite Rewards", sub: "Level: Platinum" },
                { icon: Bell, label: "Notification Center", sub: "3 Unread Updates" }
              ].map((action, i) => (
                <button key={i} className="flex items-center gap-8 p-8 rounded-[36px] bg-[#f7ebf2]/40 backdrop-blur-xl border border-[#e5d5df]/30 hover:border-[#b13896]/30 hover:shadow-xl hover:shadow-[#b13896]/5 transition-all text-left group shadow-sm">
                  <div className="w-14 h-14 rounded-2xl bg-white/50 flex items-center justify-center text-[#b13896] group-hover:bg-[#b13896] group-hover:text-white transition-all shadow-sm">
                    <action.icon size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-[#161114] uppercase tracking-widest mb-1.5">{action.label}</p>
                    <p className="text-[9px] text-[#4a3f44]/40 font-bold uppercase tracking-widest">{action.sub}</p>
                  </div>
                </button>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};


export default Account;
