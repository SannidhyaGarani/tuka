import React, { useState, useEffect } from "react";
import {
  Image,
  Upload,
  Save,
  CheckCircle2,
  Sparkles,
  Layout,
  Layers,
  FolderPlus,
  RefreshCw,
  Video,
  Grid,
} from "lucide-react";
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { db } from "../../../components/Firebase";
import { uploadToCloudinary } from "../../../config/cloudinary";
import CloudinaryImageLibrary from "./CloudinaryImageLibrary";

const DEFAULT_HOMEPAGE = {
  heroBgImage: "/img/b (1).jpeg",
  heroVideoUrl: "https://res.cloudinary.com/ewqgfmrg/video/upload/v1784458209/tuka2_vrapwj.mp4",
  heroHeading: "Timeless Elegance Woven in Pure Bengal Threads",
  heroTagline: "ATELIER & WEAVES",
  editorialImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&auto=format&fit=crop&q=80",
  editorialTitle: "Bengal Handloom Heritage & Master Weaving Heritage",
  hindshreeBannerImage: "https://images.unsplash.com/photo-1610030470298-40e1eaccf77d?auto=format&fit=crop&q=80&w=800",
  heritageImage1: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&q=80&w=800",
  heritageImage2: "https://images.unsplash.com/photo-1583390389001-8c9ac72a65f4?auto=format&fit=crop&q=80&w=800",
  storiesImage: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=800",
  galleryImage1: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=600",
  galleryImage2: "https://images.unsplash.com/photo-1610030470298-40e1eaccf77d?auto=format&fit=crop&q=80&w=600",
  galleryImage3: "https://images.unsplash.com/photo-1583390389001-8c9ac72a65f4?auto=format&fit=crop&q=80&w=600",
  galleryImage4: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=600",
  promoImage: "https://images.unsplash.com/photo-1610030470298-40e1eaccf77d?auto=format&fit=crop&q=80&w=1200",
};

const HomepageManager = () => {
  const [content, setContent] = useState(DEFAULT_HOMEPAGE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Cloudinary Library picker modal state
  const [activePickerField, setActivePickerField] = useState(null);

  // Sync real-time homepage settings from Firestore doc(db, "settings", "homepage")
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "settings", "homepage"),
      (docSnap) => {
        if (docSnap.exists()) {
          setContent({ ...DEFAULT_HOMEPAGE, ...docSnap.data() });
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error reading homepage settings:", err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const handleChange = (field, val) => {
    setContent((prev) => ({ ...prev, [field]: val }));
  };

  const handleFileUpload = async (field, file) => {
    if (!file) return;
    setUploadingField(field);
    setErrorMsg("");
    try {
      const url = await uploadToCloudinary(file);
      handleChange(field, url);
      setSuccessMsg(`Uploaded new media to Cloudinary!`);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setErrorMsg("Cloudinary upload failed: " + err.message);
    } finally {
      setUploadingField(null);
    }
  };

  const saveHomepage = async (e) => {
    e?.preventDefault();
    setSaving(true);
    setErrorMsg("");
    try {
      await setDoc(doc(db, "settings", "homepage"), {
        ...content,
        updatedAt: serverTimestamp(),
      });
      setSuccessMsg("Homepage section images & content saved to Firestore!");
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (err) {
      setErrorMsg("Failed to save homepage settings: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-[#b13896]/10 rounded-xl text-[#b13896]">
            <Layout size={22} />
          </span>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Homepage Layout & Image Manager</h1>
            <p className="text-xs text-slate-400 font-medium">
              Dynamically change image banners, videos, and section graphics for all homepage sections
            </p>
          </div>
        </div>

        <button
          onClick={saveHomepage}
          disabled={saving}
          className="flex items-center gap-2 bg-[#b13896] hover:bg-[#962e7f] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-[#b13896]/20 transition-all cursor-pointer"
        >
          <Save size={15} />
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-4 py-3 rounded-xl">
          <CheckCircle2 size={16} className="text-emerald-600" />
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold px-4 py-3 rounded-xl">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Cloudinary Modal Picker */}
      {activePickerField && (
        <CloudinaryImageLibrary
          onSelect={(url) => {
            handleChange(activePickerField, url);
            setActivePickerField(null);
          }}
          onClose={() => setActivePickerField(null)}
        />
      )}

      <form onSubmit={saveHomepage} className="space-y-6">
        {/* ── SECTION 1: HERO BANNER & VIDEO ── */}
        <section className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
            <Sparkles size={16} className="text-[#b13896]" />
            Section 1: Main Hero Banner & Video
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hero Background Image */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">
                Hero Background Image
              </label>
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group">
                <img
                  src={content.heroBgImage}
                  alt="Hero Bg"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                  <label className="px-3 py-1.5 bg-white text-slate-900 text-xs font-bold rounded-lg cursor-pointer hover:bg-slate-100">
                    <Upload size={12} className="inline mr-1" />
                    Upload Cloudinary
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload("heroBgImage", e.target.files?.[0])}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setActivePickerField("heroBgImage")}
                    className="px-3 py-1.5 bg-[#b13896] text-white text-xs font-bold rounded-lg"
                  >
                    Library
                  </button>
                </div>
              </div>
              <input
                type="text"
                value={content.heroBgImage}
                onChange={(e) => handleChange("heroBgImage", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#b13896]"
                placeholder="Image URL..."
              />
            </div>

            {/* Hero Video URL */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block flex items-center gap-1">
                <Video size={14} className="text-[#b13896]" />
                Hero Background Video URL (Cloudinary / MP4)
              </label>
              <input
                type="text"
                value={content.heroVideoUrl}
                onChange={(e) => handleChange("heroVideoUrl", e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#b13896]"
                placeholder="e.g. https://res.cloudinary.com/.../video.mp4"
              />
              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">
                  Hero Tagline
                </label>
                <input
                  type="text"
                  value={content.heroTagline}
                  onChange={(e) => handleChange("heroTagline", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#b13896]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">
                  Hero Main Heading
                </label>
                <input
                  type="text"
                  value={content.heroHeading}
                  onChange={(e) => handleChange("heroHeading", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#b13896]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 2: EDITORIAL BANNER ── */}
        <section className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
            <Image size={16} className="text-[#b13896]" />
            Section 2: Editorial Journal Banner
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">
                Editorial Banner Graphic Image
              </label>
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group">
                <img
                  src={content.editorialImage}
                  alt="Editorial Banner"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                  <label className="px-3 py-1.5 bg-white text-slate-900 text-xs font-bold rounded-lg cursor-pointer hover:bg-slate-100">
                    <Upload size={12} className="inline mr-1" />
                    Upload Cloudinary
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload("editorialImage", e.target.files?.[0])}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setActivePickerField("editorialImage")}
                    className="px-3 py-1.5 bg-[#b13896] text-white text-xs font-bold rounded-lg"
                  >
                    Library
                  </button>
                </div>
              </div>
              <input
                type="text"
                value={content.editorialImage}
                onChange={(e) => handleChange("editorialImage", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#b13896]"
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1">
                  Editorial Title
                </label>
                <input
                  type="text"
                  value={content.editorialTitle}
                  onChange={(e) => handleChange("editorialTitle", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#b13896]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 3: HINDSHREE HERITAGE & WEAVES ── */}
        <section className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
            <Layers size={16} className="text-[#b13896]" />
            Section 3: Hindshree Signature & Weaving Craft Sections
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Hindshree Banner */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">
                Hindshree Feature Banner
              </label>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group">
                <img src={content.hindshreeBannerImage} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 transition-opacity">
                  <label className="px-2.5 py-1 bg-white text-slate-900 text-[11px] font-bold rounded-lg cursor-pointer">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload("hindshreeBannerImage", e.target.files?.[0])}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setActivePickerField("hindshreeBannerImage")}
                    className="px-2.5 py-1 bg-[#b13896] text-white text-[11px] font-bold rounded-lg"
                  >
                    Library
                  </button>
                </div>
              </div>
              <input
                type="text"
                value={content.hindshreeBannerImage}
                onChange={(e) => handleChange("hindshreeBannerImage", e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-[11px] outline-none"
              />
            </div>

            {/* Heritage Craft 1 */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">
                Heritage Craft Card 1
              </label>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group">
                <img src={content.heritageImage1} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 transition-opacity">
                  <label className="px-2.5 py-1 bg-white text-slate-900 text-[11px] font-bold rounded-lg cursor-pointer">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload("heritageImage1", e.target.files?.[0])}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setActivePickerField("heritageImage1")}
                    className="px-2.5 py-1 bg-[#b13896] text-white text-[11px] font-bold rounded-lg"
                  >
                    Library
                  </button>
                </div>
              </div>
              <input
                type="text"
                value={content.heritageImage1}
                onChange={(e) => handleChange("heritageImage1", e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-[11px] outline-none"
              />
            </div>

            {/* Heritage Craft 2 */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">
                Heritage Craft Card 2
              </label>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group">
                <img src={content.heritageImage2} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 transition-opacity">
                  <label className="px-2.5 py-1 bg-white text-slate-900 text-[11px] font-bold rounded-lg cursor-pointer">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload("heritageImage2", e.target.files?.[0])}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setActivePickerField("heritageImage2")}
                    className="px-2.5 py-1 bg-[#b13896] text-white text-[11px] font-bold rounded-lg"
                  >
                    Library
                  </button>
                </div>
              </div>
              <input
                type="text"
                value={content.heritageImage2}
                onChange={(e) => handleChange("heritageImage2", e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-[11px] outline-none"
              />
            </div>
          </div>
        </section>

        {/* ── SECTION 4: SOCIAL GALLERY & PROMO BANNER ── */}
        <section className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
            <Grid size={16} className="text-[#b13896]" />
            Section 4: Social Gallery Grid Images (Instagram / Lookbook)
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["galleryImage1", "galleryImage2", "galleryImage3", "galleryImage4"].map((f, idx) => (
              <div key={f} className="space-y-2">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">
                  Gallery Image {idx + 1}
                </label>
                <div className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group">
                  <img src={content[f]} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 transition-opacity">
                    <label className="px-2 py-1 bg-white text-slate-900 text-[10px] font-bold rounded cursor-pointer">
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(f, e.target.files?.[0])}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setActivePickerField(f)}
                      className="px-2 py-1 bg-[#b13896] text-white text-[10px] font-bold rounded"
                    >
                      Library
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={content[f]}
                  onChange={(e) => handleChange(f, e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-[11px] outline-none"
                />
              </div>
            ))}
          </div>
        </section>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-[#b13896] hover:bg-[#962e7f] text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-[#b13896]/20 transition-all cursor-pointer"
          >
            <Save size={16} />
            {saving ? "Saving All Changes..." : "Save All Homepage Section Images"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HomepageManager;
