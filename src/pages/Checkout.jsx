import React, { useState } from "react";
import { useStore } from "../hooks/useStore";
import { useAuth } from "../components/useAuth";
import { db } from "../components/Firebase";
import { collection, addDoc, serverTimestamp, doc, deleteDoc, writeBatch, getDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Truck, ArrowLeft, CreditCard, User, Mail, Phone, MapPin } from "lucide-react";

const Checkout = () => {
  const { cartItems, cartCount } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const total = cartItems.reduce((sum, item) => sum + (Number(item.price) * (item.quantity || 1)), 0);

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  React.useEffect(() => {
    if (!user) return;
    const loadUserSavedAddresses = async () => {
      try {
        const uSnap = await getDoc(doc(db, "users", user.uid));
        if (uSnap.exists()) {
          const uData = uSnap.data();
          const list = uData.savedAddresses || [];
          setSavedAddresses(list);
          const defaultAddr = list.find((a) => a.isDefault) || list[0];
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr.id);
            setFormData((prev) => ({
              ...prev,
              name: defaultAddr.fullName || prev.name,
              phone: defaultAddr.phone || prev.phone,
              address: defaultAddr.street || prev.address,
              city: defaultAddr.city || prev.city,
              pincode: defaultAddr.pincode || prev.pincode,
            }));
          }
        }
      } catch (err) {
        console.error("Saved address fetch error:", err);
      }
    };
    loadUserSavedAddresses();
  }, [user]);

  React.useEffect(() => {
    const checkAllStock = async () => {
      const status = {};
      for (const item of cartItems) {
        try {
          if (!item.id || item.id.startsWith('bs-')) continue;
          const pRef = doc(db, "products", item.id);
          const pSnap = await getDoc(pRef);
          if (pSnap.exists()) {
            const currentStock = Number(pSnap.data().stock || 0);
            status[item.id] = currentStock;
          }
        } catch (e) {
          console.error(e);
        }
      }
      setStockStatus(status);
    };
    if (cartItems.length > 0) checkAllStock();
  }, [cartItems]);

  const isAnyOutOfStock = cartItems.some(item => {
    const stock = stockStatus[item.id];
    return stock !== undefined && stock < (item.quantity || 1);
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [paymentMethod, setPaymentMethod] = useState("online");

  // Helper to save order into Firestore and user history
  const processFinalOrder = async (payMethod, paymentId = "COD_" + Date.now()) => {
    try {
      const orderRef = doc(collection(db, "orders"));
      const orderId = orderRef.id;

      const orderData = {
        orderId,
        userId: user?.uid || "guest",
        userEmail: user?.email || formData.email || "guest@tuka.in",
        userName: formData.name || "Valued Customer",
        items: cartItems,
        total: total,
        shippingDetails: formData,
        paymentMethod: payMethod === "online" ? "Online / UPI / Card" : "Cash on Delivery (COD)",
        paymentId: paymentId,
        status: payMethod === "online" ? "Paid" : "Placed",
        createdAt: serverTimestamp(),
      };

      // 1. Create main order document
      await addDoc(collection(db, "orders"), orderData);

      // 2. Save order copy inside user's orders collection if logged in
      if (user?.uid) {
        await addDoc(collection(db, "users", user.uid, "orders"), orderData);
      }

      // 3. Clear cart and Update Product Stock
      const batch = writeBatch(db);
      if (user?.uid) {
        for (const item of cartItems) {
          const cartRef = doc(db, "users", user.uid, "cart", item.id);
          batch.delete(cartRef);

          if (item.id && !item.id.startsWith('bs-')) {
            const baseId = item.id.split('_')[0];
            const productRef = doc(db, "products", baseId);
            const pSnap = await getDoc(productRef);
            if (pSnap.exists()) {
              const freshStock = pSnap.data().stock || 0;
              batch.update(productRef, { stock: Math.max(0, Number(freshStock) - (item.quantity || 1)) });
            }
          }
        }
      } else {
        for (const item of cartItems) {
          if (item.id && !item.id.startsWith('bs-')) {
            const baseId = item.id.split('_')[0];
            const productRef = doc(db, "products", baseId);
            const pSnap = await getDoc(productRef);
            if (pSnap.exists()) {
              const freshStock = pSnap.data().stock || 0;
              batch.update(productRef, { stock: Math.max(0, Number(freshStock) - (item.quantity || 1)) });
            }
          }
        }
        localStorage.removeItem("cart");
      }
      await batch.commit();

      alert(`🎉 Order Placed Successfully!\n\nOrder ID: ${orderId.substring(0, 8).toUpperCase()}\nThank you for choosing House of Tuka.`);
      navigate("/account?tab=orders");
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Error placing order. Please check connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!formData.name || !formData.phone || !formData.address || !formData.city || !formData.pincode) {
      alert("Please fill in all shipping details.");
      return;
    }

    setLoading(true);

    // Verify Stock Availability
    try {
      for (const item of cartItems) {
        if (!item.id || item.id.startsWith('bs-')) continue;
        const baseId = item.id.split('_')[0];
        const pRef = doc(db, "products", baseId);
        const pSnap = await getDoc(pRef);
        if (pSnap.exists()) {
          const currentStock = Number(pSnap.data().stock || 0);
          if (currentStock < (item.quantity || 1)) {
            alert(`Apologies. "${item.name}" has only ${currentStock} pieces left in stock. Please adjust your selection.`);
            setLoading(false);
            return;
          }
        }
      }
    } catch (e) {
      console.error("Stock check error:", e);
      alert("Error verifying stock. Please try again.");
      setLoading(false);
      return;
    }

    if (paymentMethod === "cod") {
      await processFinalOrder("cod");
      return;
    }

    // Online Razorpay Flow with fallback to COD if script fail
    if (typeof window.Razorpay === "undefined") {
      // Fallback direct placement if Razorpay script fails to load
      await processFinalOrder("online", "TXN_" + Date.now());
      return;
    }

    const RAZORPAY_KEY_ID = "rzp_test_1DP5mmOlF5G5ag";

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: total * 100,
      currency: "INR",
      name: "House of Tuka",
      description: "Handloom Heritage Order",
      image: "/img/Tuka-Logo.svg",
      handler: async function (response) {
        await processFinalOrder("online", response.razorpay_payment_id);
      },
      prefill: {
        name: formData.name,
        email: formData.email || "customer@tuka.in",
        contact: formData.phone,
      },
      theme: { color: "#b13896" },
    };

    try {
      const rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        alert("Payment Failed: " + (response.error?.description || "Transaction cancelled"));
        setLoading(false);
      });
      rzp1.open();
    } catch (e) {
      console.error("Razorpay initiation error:", e);
      // Fallback
      await processFinalOrder("online", "TXN_" + Date.now());
    }
  };

  if (cartCount === 0) {
    return (
      <div className="min-h-screen bg-[#F8F4EF] flex flex-col items-center justify-center p-6 pt-32 text-center">
        <h1 className="text-4xl sm:text-6xl font-serif text-[#161114] mb-8 italic">Your collection is empty</h1>
        <Link to="/shop" className="px-12 py-5 bg-[#b13896] text-white font-bold rounded-2xl uppercase tracking-[0.3em] text-[14px] shadow-2xl shadow-[#b13896]/20 hover:bg-[#161114] transition-all active:scale-95">
          Return to shop 
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F4EF] pt-20 pb-20 px-4 sm:px-6 lg:px-8 font-sans text-[#161114] selection:bg-[#b13896]/10 selection:text-[#b13896]">
      <div className="max-w-[1400px] mx-auto">

        {/* Editorial Header */}
        <div className="mb-20 border-b border-[#e5d5df]/30 pb-12 flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="space-y-6">
            <Link to="/cart" className="inline-flex items-center gap-3 text-[14px] font-bold uppercase tracking-[0.4em] text-[#4a3f44] hover:text-[#b13896] transition-all group">
              <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform duration-500" />
              Return to Selection
            </Link>
            <h1 className="text-5xl sm:text-7xl font-serif text-[#161114] tracking-tighter leading-none">
              Final <span className="text-[#b13896] italic font-light">Acquisition</span>
            </h1>
          </div>
          <div className="flex items-center gap-6 bg-white/40 backdrop-blur-xl px-8 py-4 rounded-full border border-[#e5d5df]/30 shadow-sm">
            <ShieldCheck size={18} className="text-[#b13896]" />
            <span className="text-[14px] font-bold uppercase tracking-[0.3em] text-[#4a3f44]">Encrypted Transaction</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">

          {/* Main Checkout Flow */}
          <div className="lg:col-span-7 space-y-16">

            {/* Step 1: Identity */}
            <section className="space-y-10">
              <div className="flex items-center gap-6">
                <span className="w-12 h-12 rounded-full bg-[#b13896] text-white flex items-center justify-center font-serif text-xl shadow-xl shadow-[#b13896]/20">1</span>
                <h2 className="text-3xl font-serif text-[#161114]">Identity & Contact</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8 pl-18">
                <div className="space-y-3">
                  <label className="text-[14px] font-bold uppercase tracking-[0.3em] text-[#4a3f44] ml-2">Full Name</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-white/60 border border-[#e5d5df]/50 rounded-2xl px-6 py-4 text-sm font-medium text-[#161114] outline-none focus:border-[#b13896] transition-all shadow-sm"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[14px] font-bold uppercase tracking-[0.3em] text-[#4a3f44] ml-2">Email Address</label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-white/60 border border-[#e5d5df]/50 rounded-2xl px-6 py-4 text-sm font-medium text-[#161114] outline-none focus:border-[#b13896] transition-all shadow-sm"
                  />
                </div>
                <div className="space-y-3 md:col-span-2">
                  <label className="text-[14px] font-bold uppercase tracking-[0.3em] text-[#4a3f44] ml-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-[#4a3f44]/30" size={16} />
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-white/60 border border-[#e5d5df]/50 rounded-2xl pl-16 pr-6 py-4 text-sm font-medium text-[#161114] outline-none focus:border-[#b13896] transition-all shadow-sm"
                      placeholder="+91 00000 00000"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Step 2: Shipping */}
            <section className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <span className="w-12 h-12 rounded-full bg-[#b13896] text-white flex items-center justify-center font-serif text-xl shadow-xl shadow-[#b13896]/20">2</span>
                  <h2 className="text-3xl font-serif text-[#161114]">Destination Atelier</h2>
                </div>
                {savedAddresses.length > 0 && (
                  <span className="text-xs font-bold text-[#b13896] bg-rose-50 px-3 py-1 rounded-full uppercase tracking-wider">
                    {savedAddresses.length} Saved Location{savedAddresses.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Saved Address Quick Selector */}
              {savedAddresses.length > 0 && (
                <div className="pl-18 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#4a3f44] block">Select Saved Address:</span>
                  <div className="flex flex-wrap gap-3">
                    {savedAddresses.map((addr) => {
                      const isSelected = selectedAddressId === addr.id;
                      return (
                        <button
                          type="button"
                          key={addr.id}
                          onClick={() => {
                            setSelectedAddressId(addr.id);
                            setFormData((prev) => ({
                              ...prev,
                              name: addr.fullName || prev.name,
                              phone: addr.phone || prev.phone,
                              address: addr.street || prev.address,
                              city: addr.city || prev.city,
                              pincode: addr.pincode || prev.pincode,
                            }));
                          }}
                          className={`p-3.5 rounded-2xl text-xs text-left border transition-all cursor-pointer flex-1 min-w-[200px] ${
                            isSelected
                              ? 'bg-white border-[#b13896] ring-2 ring-[#b13896]/20 shadow-md'
                              : 'bg-white/50 border-[#e5d5df]/60 hover:bg-white hover:border-[#b13896]/40'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-slate-900">{addr.fullName}</span>
                            {addr.isDefault && <span className="text-[9px] font-bold uppercase text-[#b13896] bg-rose-50 px-2 py-0.5 rounded-full">Default</span>}
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{addr.street}, {addr.city}</p>
                          <p className="text-[11px] font-bold text-slate-700 mt-1">Pincode: {addr.pincode}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-8 pl-18">
                <div className="space-y-3 md:col-span-2">
                  <label className="text-[14px] font-bold uppercase tracking-[0.3em] text-[#4a3f44] ml-2">Street Address</label>
                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full bg-white/60 border border-[#e5d5df]/50 rounded-2xl px-6 py-4 text-sm font-medium text-[#161114] outline-none focus:border="
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[14px] font-bold uppercase tracking-[0.3em] text-[#4a3f44] ml-2">City</label>
                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full bg-white/60 border border-[#e5d5df]/50 rounded-2xl px-6 py-4 text-sm font-medium text-[#161114] outline-none focus:border-[#b13896] transition-all shadow-sm"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[14px] font-bold uppercase tracking-[0.3em] text-[#4a3f44] ml-2">Postal Code</label>
                  <input
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full bg-white/60 border border-[#e5d5df]/50 rounded-2xl px-6 py-4 text-sm font-medium text-[#161114] outline-none focus:border-[#b13896] transition-all shadow-sm"
                  />
                </div>
              </div>
            </section>

            {/* Step 3: Payment */}
            <section className="space-y-10">
              <div className="flex items-center gap-6">
                <span className="w-12 h-12 rounded-full bg-[#b13896] text-white flex items-center justify-center font-serif text-xl shadow-xl shadow-[#b13896]/20">3</span>
                <h2 className="text-3xl font-serif text-[#161114]">Payment Protocol</h2>
              </div>

              <div className="pl-18 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div
                    onClick={() => setPaymentMethod("online")}
                    className={`flex flex-col items-start p-6 rounded-[24px] border transition-all duration-300 text-left cursor-pointer ${
                      paymentMethod === "online"
                        ? "bg-[#b13896] border-[#b13896] text-white shadow-xl shadow-[#b13896]/20"
                        : "bg-white/60 border-[#e5d5df]/60 text-[#161114] hover:border-[#b13896]"
                    }`}
                  >
                    <CreditCard size={24} strokeWidth={1.5} className="mb-4" />
                    <span className="text-xs font-bold uppercase tracking-[0.2em] mb-1">Online Payment</span>
                    <span className={`text-xs ${paymentMethod === "online" ? "text-white/80" : "text-[#4a3f44]/70"}`}>
                      UPI, Credit/Debit Cards, Net Banking
                    </span>
                  </div>

                  <div
                    onClick={() => setPaymentMethod("cod")}
                    className={`flex flex-col items-start p-6 rounded-[24px] border transition-all duration-300 text-left cursor-pointer ${
                      paymentMethod === "cod"
                        ? "bg-[#b13896] border-[#b13896] text-white shadow-xl shadow-[#b13896]/20"
                        : "bg-white/60 border-[#e5d5df]/60 text-[#161114] hover:border-[#b13896]"
                    }`}
                  >
                    <Truck size={24} strokeWidth={1.5} className="mb-4" />
                    <span className="text-xs font-bold uppercase tracking-[0.2em] mb-1">Cash on Delivery</span>
                    <span className={`text-xs ${paymentMethod === "cod" ? "text-white/80" : "text-[#4a3f44]/70"}`}>
                      Pay upon door delivery
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right: Order Summary */}
          <aside className="lg:col-span-5">
            <div className="bg-white/40 backdrop-blur-2xl rounded-[40px] border border-[#e5d5df]/30 p-10 sticky top-32 shadow-[0_32px_80px_rgba(122,14,46,0.05)]">
              <h2 className="text-3xl font-serif text-[#161114] mb-10 border-b border-[#e5d5df]/20 pb-6">Your Selection</h2>

              <div className="max-h-[400px] overflow-y-auto pr-4 mb-10 space-y-8 scrollbar-hide">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-6 items-center">
                    <div className="w-20 h-24 rounded-2xl overflow-hidden bg-[#f7ebf2] border border-[#e5d5df]/30 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="text-sm font-serif text-[#161114] font-bold">{item.name}</h4>
                      <div className="flex justify-between items-center">
                        <p className="text-[14px] text-[#4a3f44] font-bold uppercase tracking-widest">Qty: {item.quantity || 1}</p>
                        <p className="text-sm font-bold text-[#b13896]">₹{(Number(item.price) * (item.quantity || 1)).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-6 pt-10 border-t border-[#e5d5df]/20">
                <div className="flex justify-between text-[14px] font-bold uppercase tracking-widest text-[#4a3f44]">
                  <span>Subtotal</span>
                  <span className="text-[#161114]">₹{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[14px] font-bold uppercase tracking-widest text-[#4a3f44]">
                  <span>Shipping</span>
                  <span className="text-[#b13896] italic">Complimentary</span>
                </div>
                <div className="flex justify-between items-end pt-6">
                  <span className="text-sm font-bold uppercase tracking-[0.3em] text-[#161114]">Total Acquisition</span>
                  <span className="text-4xl font-serif text-[#b13896]">₹{total.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading || isAnyOutOfStock}
                className={`w-full py-6 rounded-2xl text-[14px] font-bold uppercase tracking-[0.5em] transition-all duration-700 shadow-2xl mt-12 flex items-center justify-center gap-4 ${isAnyOutOfStock
                    ? 'bg-[#161114]/10 text-[#161114]/40 cursor-not-allowed'
                    : 'bg-[#161114] text-white hover:bg-[#b13896] shadow-[#161114]/20'
                  }`}
              >
                {loading ? (
                  <div className="w-6 h-6 border-[3px] border-white/20 border-t-white rounded-full animate-spin" />
                ) : isAnyOutOfStock ? (
                  "Adjust Selection"
                ) : (
                  <>Complete Transaction</>
                )}
              </button>

              <p className="text-center mt-8 text-[9px] font-bold uppercase tracking-[0.2em] text-[#4a3f44]/50">
                Finalizing this order signifies your acceptance of our <br />
                <span className="text-[#b13896]">Terms of Service</span> and <span className="text-[#b13896]">Privacy Protocol</span>.
              </p>
            </div>
          </aside>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `.scrollbar-hide::-webkit-scrollbar { display: none; }` }} />
    </div>
  );
};


export default Checkout;
