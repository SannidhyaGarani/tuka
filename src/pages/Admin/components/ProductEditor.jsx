import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ChevronRight, Plus, Trash } from "lucide-react";
import { createProduct, updateProduct } from "../../../services/productService";
import { uploadToCloudinary } from "../../../config/cloudinary";
import ProductMediaPicker from "./ProductMediaPicker";

const CATEGORIES = [
  "Handloom Saree",
  "Designer Blouse",
  "Saree",
  "Bags",
  "Kurtis",
  "Stoles",
  "Dress material",
  "Jewellary",
  "Boutique Collection",
  "New Arrivals"
];

const BRANDS = ["Tuka", "Boutique"];

const ProductEditor = ({ product, onCancel, onSuccess }) => {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: "",
      brand: "Tuka",
      category: "",
      subCategory: "",
      material: "",
      original_price: 0,
      price: 0,
      stock: 0,
      description: "",
      care_instructions: "",
      tags: "",
      status: "Published",
      visibility: "Public",
      featuredProduct: false
    }
  });

  const [saving, setSaving] = useState(false);
  const [media, setMedia] = useState([]);
  const [notice, setNotice] = useState("");

  // Size pricing variants state: [{ size: "S", original_price: 1500, price: 1200, stock: 10, discount: 20 }]
  const [variants, setVariants] = useState([]);
  const [newSize, setNewSize] = useState("");
  const [newOrigPrice, setNewOrigPrice] = useState("");
  const [newSelPrice, setNewSelPrice] = useState("");
  const [newStock, setNewStock] = useState("");

  // Load product if editing
  useEffect(() => {
    if (product) {
      reset({
        name: product.name || "",
        brand: product.brand || "Tuka",
        category: product.category || "",
        subCategory: product.subCategory || "",
        material: product.material || "",
        original_price: product.original_price || 0,
        price: product.price || 0,
        stock: product.stock || 0,
        description: product.description || "",
        care_instructions: product.care_instructions || "",
        tags: product.tags ? product.tags.join(", ") : "",
        status: product.status || "Published",
        visibility: product.visibility || "Public",
        featuredProduct: !!product.featuredProduct
      });
      setMedia((product.images || []).map((url, i) => ({
        id: `saved-${i}-${url}`,
        url,
        source: "cloudinary"
      })));
      setVariants(product.sizeVariants || []);
    } else {
      reset({
        name: "",
        brand: "Tuka",
        category: "",
        subCategory: "",
        material: "",
        original_price: 0,
        price: 0,
        stock: 0,
        description: "",
        care_instructions: "",
        tags: "",
        status: "Published",
        visibility: "Public",
        featuredProduct: false
      });
      setMedia([]);
      setVariants([]);
    }
  }, [product, reset]);

  const addVariant = () => {
    if (!newSize.trim() || !newSelPrice) {
      alert("Size name and Selling Price are required.");
      return;
    }
    const valOrig = Number(newOrigPrice) || 0;
    const valSel = Number(newSelPrice) || 0;
    const discount = valOrig ? Math.round(((valOrig - valSel) / valOrig) * 100) : 0;

    const newVar = {
      size: newSize.trim().toUpperCase(),
      original_price: valOrig,
      price: valSel,
      discount: discount,
      stock: Number(newStock) || 0
    };

    setVariants([...variants, newVar]);
    setNewSize("");
    setNewOrigPrice("");
    setNewSelPrice("");
    setNewStock("");
  };

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const submit = async (values, intent = "Published") => {
    setNotice("");
    if (!values.name?.trim()) {
      setNotice("Product Name is required.");
      return;
    }
    if (!values.category) {
      setNotice("Please select a Product Category.");
      return;
    }

    setSaving(true);
    try {
      // 1. Upload new media files to Cloudinary
      const results = await Promise.allSettled(
        media.map((item) => (item.file ? uploadToCloudinary(item.file) : item.url))
      );
      const imageUrls = results
        .filter((res) => res.status === "fulfilled")
        .map((res) => res.value);

      // 2. Parse basic fields
      const orig = Number(values.original_price) || 0;
      const sel = Number(values.price) || 0;
      const disc = orig ? Math.round(((orig - sel) / orig) * 100) : 0;

      const payload = {
        name: values.name.trim(),
        brand: values.brand,
        category: values.category,
        subCategory: values.subCategory || "",
        material: values.material || "",
        original_price: orig,
        price: sel,
        discount: disc,
        stock: Number(values.stock || 0),
        description: values.description || "",
        care_instructions: values.care_instructions || "",
        tags: values.tags ? values.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        sizeVariants: variants,
        images: imageUrls,
        image: imageUrls[0] || "",
        stock_status: (Number(values.stock || 0) <= 0 && variants.length === 0) ? "Out of Stock" : "In Stock",
        status: intent,
        visibility: values.visibility || "Public",
        featuredProduct: !!values.featuredProduct,
      };

      if (product?.id) {
        await updateProduct(product.id, payload);
      } else {
        await createProduct(payload, { status: intent, visibility: payload.visibility, images: imageUrls });
      }

      onSuccess();
    } catch (err) {
      setNotice(err?.message || "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit((values) => submit(values, watch("status") || "Published"))} className="pb-12 text-slate-800">
      {/* Top Header Panel */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{product ? "Edit Handloom Product" : "Add New Handloom Product"}</h1>
          <p className="mt-1 text-[13px] text-slate-400">
            Dashboard <ChevronRight className="inline mx-1" size={12} /> Products <ChevronRight className="inline mx-1" size={12} /> {product ? "Edit Product" : "New Entry"}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-650 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handleSubmit((values) => submit(values, "Draft"))}
            className="rounded-xl border border-[#b13896]/30 bg-white px-4 py-2 text-sm font-semibold text-[#b13896] hover:bg-[#b13896]/5 transition-colors"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-[#b13896] hover:bg-[#962e7f] text-white px-5 py-2 text-sm font-semibold transition-colors shadow-md shadow-[#b13896]/20"
          >
            <Plus size={14} />
            {saving ? "Saving..." : product ? "Save Changes" : "Publish Product"}
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_320px]">
        {/* Main Forms Section - Left */}
        <div className="space-y-6">
          {/* Section 1: Basic Information */}
          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-800 border-b pb-2">Basic Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="mb-1 text-xs font-semibold text-slate-500 uppercase tracking-widest block">Product Name *</span>
                <input
                  type="text"
                  placeholder="e.g. Dhaniakhali Traditional Saree"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-[14px] outline-none focus:border-[#b13896] transition-colors"
                  {...register("name", { required: true })}
                />
                {errors.name && <span className="text-xs text-red-500 mt-1 block">Name is required</span>}
              </label>

              <label className="block">
                <span className="mb-1 text-xs font-semibold text-slate-500 uppercase tracking-widest block">Brand</span>
                <select
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-[14px] bg-white outline-none focus:border-[#b13896] transition-colors"
                  {...register("brand")}
                >
                  {BRANDS.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="block">
                <span className="mb-1 text-xs font-semibold text-slate-500 uppercase tracking-widest block">Category *</span>
                <select
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-[14px] bg-white outline-none focus:border-[#b13896] transition-colors"
                  {...register("category", { required: true })}
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.category && <span className="text-xs text-red-500 mt-1 block">Category is required</span>}
              </label>

              <label className="block">
                <span className="mb-1 text-xs font-semibold text-slate-500 uppercase tracking-widest block">Sub Category</span>
                <input
                  type="text"
                  placeholder="e.g. Cotton, Khadi, Silk, Linen, Bangles, Necklaces, etc."
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-[14px] outline-none focus:border-[#b13896] transition-colors"
                  {...register("subCategory")}
                />
              </label>

              <label className="block">
                <span className="mb-1 text-xs font-semibold text-slate-500 uppercase tracking-widest block">Material / Fabric Yarn</span>
                <input
                  type="text"
                  placeholder="e.g. Pure Tissue Linen"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-[14px] outline-none focus:border-[#b13896] transition-colors"
                  {...register("material")}
                />
              </label>
            </div>
          </section>

          {/* Section 2: Pricing & Sizing */}
          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-5">
            <h2 className="text-sm font-bold text-slate-800 border-b pb-2">Pricing & Size Options</h2>

            {/* Standard Pricing */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-[#b13896] uppercase tracking-wider">Standard Base Rates</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="block">
                  <span className="mb-1 text-xs font-semibold text-slate-500 uppercase tracking-wider block">Original Price (MRP ₹)</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-[14px] outline-none focus:border-[#b13896] transition-colors"
                    {...register("original_price")}
                  />
                </label>
                <label className="block">
                  <span className="mb-1 text-xs font-semibold text-slate-500 uppercase tracking-wider block">Selling Price (₹)</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-[14px] outline-none focus:border-[#b13896] transition-colors"
                    {...register("price")}
                  />
                </label>
                <label className="block">
                  <span className="mb-1 text-xs font-semibold text-slate-500 uppercase tracking-wider block">Stock Quantity</span>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-[14px] outline-none focus:border-[#b13896] transition-colors"
                    {...register("stock")}
                  />
                </label>
              </div>
            </div>

            {/* Dynamic Sizing Grid */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className="flex flex-wrap justify-between items-center gap-2">
                <h3 className="text-xs font-bold text-[#b13896] uppercase tracking-wider">Sizing Variants (Different Sizes, Different Prices)</h3>
                <span className="text-[11px] text-slate-400">Complete this section only if sizes have distinct rates (e.g. Bangles/Sarees with custom cuts)</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 items-end bg-slate-50 p-4 rounded-xl border border-slate-200/50">
                <label className="block">
                  <span className="mb-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Size Target</span>
                  <input
                    type="text"
                    placeholder="e.g. M, XL"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-[#b13896]"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="mb-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Original MRP</span>
                  <input
                    type="number"
                    placeholder="MRP"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-[#b13896]"
                    value={newOrigPrice}
                    onChange={(e) => setNewOrigPrice(e.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="mb-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Selling Price</span>
                  <input
                    type="number"
                    placeholder="Sale"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-[#b13896]"
                    value={newSelPrice}
                    onChange={(e) => setNewSelPrice(e.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="mb-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Stock</span>
                  <input
                    type="number"
                    placeholder="Qty"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-[#b13896]"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                  />
                </label>
                <button
                  type="button"
                  onClick={addVariant}
                  className="w-full py-2 rounded-lg bg-[#b13896] hover:bg-[#962e7f] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  + Add Variant
                </button>
              </div>

              {variants.length > 0 && (
                <div className="overflow-hidden border border-slate-100 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold">
                      <tr>
                        <th className="p-3">Size</th>
                        <th className="p-3">Original Price</th>
                        <th className="p-3">Selling Price</th>
                        <th className="p-3">Discount</th>
                        <th className="p-3">Stock</th>
                        <th className="p-3 text-right">Remove</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {variants.map((v, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-3 font-bold text-[#b13896]">{v.size}</td>
                          <td className="p-3">₹{v.original_price}</td>
                          <td className="p-3 font-semibold">₹{v.price}</td>
                          <td className="p-3 text-emerald-600 font-bold">{v.discount}% Off</td>
                          <td className="p-3">{v.stock} pcs</td>
                          <td className="p-3 text-right">
                            <button
                              type="button"
                              onClick={() => removeVariant(idx)}
                              className="text-red-500 hover:text-red-700 font-bold"
                            >
                              Discard
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>

          {/* Section 3: Media Upload */}
          <ProductMediaPicker value={media} onChange={setMedia} />

          {/* Section 4: Description & Details */}
          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-800 border-b pb-2">Description & Care Info</h2>
            <label className="block">
              <span className="mb-1 text-xs font-semibold text-slate-500 uppercase tracking-widest block">Product Description</span>
              <textarea
                rows="4"
                placeholder="Integrate yarn thickness, loop density, Phulia weavers references, custom styling notes..."
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-[14px] outline-none focus:border-[#b13896] transition-colors"
                {...register("description")}
              />
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="mb-1 text-xs font-semibold text-slate-500 uppercase tracking-widest block">Care Instructions</span>
                <input
                  type="text"
                  placeholder="e.g. Dry Clean Only, wash separately with cold water"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-[14px] outline-none focus:border-[#b13896] transition-colors"
                  {...register("care_instructions")}
                />
              </label>

              <label className="block">
                <span className="mb-1 text-xs font-semibold text-slate-500 uppercase tracking-widest block">Search tags / Classifiers</span>
                <input
                  type="text"
                  placeholder="e.g. jamdani, phulia, red, blouse (comma-separated)"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-[14px] outline-none focus:border-[#b13896] transition-colors"
                  {...register("tags")}
                />
              </label>
            </div>
          </section>
        </div>

        {/* Sidebar Controls - Right */}
        <aside className="space-y-6">
          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">Publish Panel</h2>
            <label className="block">
              <span className="mb-1 text-xs font-semibold text-slate-500 uppercase tracking-widest block">Store Status</span>
              <select
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white focus:border-[#b13896] outline-none"
                {...register("status")}
              >
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-1 text-xs font-semibold text-slate-500 uppercase tracking-widest block">Visibility</span>
              <select
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white focus:border-[#b13896] outline-none"
                {...register("visibility")}
              >
                <option value="Public">Public (Storefront)</option>
                <option value="Private">Private (Hidden)</option>
              </select>
            </label>

            <label className="flex items-center gap-2 text-sm text-slate-650 cursor-pointer py-2 border-t mt-3">
              <input
                type="checkbox"
                {...register("featuredProduct")}
                className="w-4 h-4 rounded text-[#b13896] border-slate-200 focus:ring-[#b13896] accent-[#b13896]"
              />
              <span className="font-semibold text-xs text-slate-500 uppercase tracking-wider">Featured on Home</span>
            </label>
          </section>

          <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4 text-[13px] leading-relaxed text-amber-800 shadow-sm border-dashed">
            💡 <strong>Pro-Tip:</strong> Size variations override standard prices when dynamic items are browsed. The primary image is the first card added under Media.
          </div>

          {notice && (
            <div className="rounded-xl bg-red-50 p-4 text-xs font-bold text-red-700 border border-red-200/50">
              ⚠️ {notice}
            </div>
          )}
        </aside>
      </div>
    </form>
  );
};

export default ProductEditor;
