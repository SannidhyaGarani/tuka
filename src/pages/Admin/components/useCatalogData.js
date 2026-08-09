import { useState, useEffect } from "react";
import { collection, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../components/Firebase";

export const DEFAULT_CATEGORIES = [
  "Handloom Saree",
  "Designer Blouse",
  "Saree",
  "Boutique Collection",
  "Kurtis",
  "Stoles",
  "Dress material",
  "New Arrivals"
];

export const DEFAULT_SUBCATEGORIES = [
  "Cotton",
  "Khadi",
  "Silk",
  "Linen",
  "Jamdani",
  "Baluchari",
  "Dhaniakhali",
  "Begumpuri",
  "Shantipuri",
  "Appliqué",
  "Mul Cotton",
  "Tussar Silk",
  "Chanderi"
];

export const DEFAULT_BRANDS = ["Tuka", "Boutique"];

export const useCatalogData = () => {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [subCategories, setSubCategories] = useState(DEFAULT_SUBCATEGORIES);
  const [brands, setBrands] = useState(DEFAULT_BRANDS);

  useEffect(() => {
    const unsubCat = onSnapshot(collection(db, "categories"), (snap) => {
      const dbCats = snap.docs.map((doc) => doc.data().name).filter(Boolean);
      const merged = Array.from(new Set([...DEFAULT_CATEGORIES, ...dbCats]));
      setCategories(merged);
    });

    const unsubSub = onSnapshot(collection(db, "subcategories"), (snap) => {
      const dbSubs = snap.docs.map((doc) => doc.data().name).filter(Boolean);
      const merged = Array.from(new Set([...DEFAULT_SUBCATEGORIES, ...dbSubs]));
      setSubCategories(merged);
    });

    const unsubBrand = onSnapshot(collection(db, "brands"), (snap) => {
      const dbBrands = snap.docs.map((doc) => doc.data().name).filter(Boolean);
      const merged = Array.from(new Set([...DEFAULT_BRANDS, ...dbBrands]));
      setBrands(merged);
    });

    return () => {
      unsubCat();
      unsubSub();
      unsubBrand();
    };
  }, []);

  const addCategory = async (name, description = "") => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (!categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      await addDoc(collection(db, "categories"), {
        name: trimmed,
        description: description.trim(),
        status: "Active",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  };

  const addSubCategory = async (name, category = "") => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (!subCategories.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      await addDoc(collection(db, "subcategories"), {
        name: trimmed,
        category: category || "",
        status: "Active",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  };

  return {
    categories,
    subCategories,
    brands,
    addCategory,
    addSubCategory,
  };
};
