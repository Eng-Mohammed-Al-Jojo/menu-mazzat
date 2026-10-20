import { useEffect, useState, useMemo, useCallback } from "react";
import { db } from "../../firebase";
import { ref, onValue } from "firebase/database";
import CategorySection from "./CategorySection";
import ItemDetailModal from "./ItemDetailModal";

import SplashScreen from "./SplashScreen";

/* ================= Types ================= */
export interface Category {
  id: string;
  name: string;
  available?: boolean;
  order?: number;
  createdAt?: number;
}

export interface Item {
  id: string;
  name: string;
  price: number;
  ingredients?: string;
  priceTw?: number;
  categoryId: string;
  visible?: boolean;
  createdAt?: number;
  image?: string;
}

/* ================= LocalStorage ================= */
const saveToLocal = (cats: Category[], its: Item[]) => {
  localStorage.setItem(
    "menu_cache",
    JSON.stringify({ categories: cats, items: its, savedAt: Date.now() })
  );
};

const loadFromLocal = () => {
  const cached = localStorage.getItem("menu_cache");
  if (!cached) return null;
  return JSON.parse(cached);
};
/* ======================================== */

export default function Menu() {
  // Stale-While-Revalidate: قراءة الكاش للرندر الفوري خلف شاشة البداية
  const cachedData = useMemo(() => loadFromLocal(), []);

  const [categories, setCategories] = useState<Category[]>(() => cachedData?.categories || []);
  const [items, setItems] = useState<Item[]>(() => cachedData?.items || []);
  
  // 1. وقت أدنى لشاشة البداية لترسيخ الهوية البصرية (1 ثانية)
  const [minTimePassed, setMinTimePassed] = useState(false);
  // 2. حالة جاهزية مزامنة Firebase
  const [firebaseReady, setFirebaseReady] = useState(false);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; color: "green" | "red" } | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  /* ================= 1. Minimum Display Timer ================= */
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimePassed(true);
    }, 1000); // 1000ms لظهور الشعار واستقبال الزبون
    return () => clearTimeout(timer);
  }, []);

  /* ================= 2. Firebase Load & Background Sync ================= */
  useEffect(() => {
    let emergencyTimeoutId: number | null = null;
    let cacheFallbackTimeoutId: number | null = null;

    let cats: Category[] = [];
    let its: Item[] = [];
    let catsLoaded = false;
    let itemsLoaded = false;

    // إذا توفر كاش سابق، لا نحبس الزبون أكثر من 1.4 ثانية إذا تعثرت شبكة الهاتف
    if (cachedData) {
      cacheFallbackTimeoutId = window.setTimeout(() => {
        setFirebaseReady(true);
      }, 1400);
    }

    // مهلة طوارئ عامة (6 ثوانٍ) في حال انقطاع الشبكة تماماً
    emergencyTimeoutId = window.setTimeout(() => {
      setFirebaseReady(true);
      if (!cachedData) {
        setToast({ message: "الإنترنت ضعيف، يرجى إعادة المحاولة", color: "red" });
        setTimeout(() => setToast(null), 4000);
      }
    }, 6000);

    const finishFirebase = () => {
      if (emergencyTimeoutId) clearTimeout(emergencyTimeoutId);
      if (cacheFallbackTimeoutId) clearTimeout(cacheFallbackTimeoutId);
      saveToLocal(cats, its);
      setFirebaseReady(true);
    };

    const unsubCats = onValue(ref(db, "categories"), (snap) => {
      const data = snap.val();
      cats = data
        ? Object.entries(data).map(([id, v]: any) => ({
            id,
            name: v.name,
            available: v.available === true,
            order: Number(v.order ?? 9999),
            createdAt: v.createdAt || 0,
          }))
        : [];
      setCategories(cats);
      catsLoaded = true;
      if (itemsLoaded) finishFirebase();
    });

    const unsubItems = onValue(ref(db, "items"), (snap) => {
      const data = snap.val();
      its = data
        ? Object.entries(data).map(([id, v]: any) => ({
            id,
            ...v,
            visible: v.visible !== false,
            createdAt: v.createdAt || 0,
          }))
        : [];
      setItems(its);
      itemsLoaded = true;
      if (catsLoaded) finishFirebase();
    });

    return () => {
      if (emergencyTimeoutId) clearTimeout(emergencyTimeoutId);
      if (cacheFallbackTimeoutId) clearTimeout(cacheFallbackTimeoutId);
      unsubCats();
      unsubItems();
    };
  }, [cachedData]);

  /* ================= ORDERED Categories (useMemo safe) ================= */
  const availableCategories = useMemo(() => {
    return categories
      .filter((cat) => cat.available)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [categories]);

  /* ================= Group Items by Category (Only available/visible items) ================= */
  const itemsByCategory = useMemo(() => {
    const map = new Map<string, Item[]>();
    for (const item of items) {
      // إذا كان الصنف غير متوفر من لوحة التحكم، لا يظهر للزبون نهائياً
      if (item.visible === false) continue;

      if (!map.has(item.categoryId)) {
        map.set(item.categoryId, []);
      }
      map.get(item.categoryId)!.push(item);
    }
    return map;
  }, [items]);

  const handleImageClick = useCallback((item: Item) => {
    setSelectedItem(item);
    setDetailModalOpen(true);
  }, []);

  const handleCloseDetailModal = useCallback(() => {
    setDetailModalOpen(false);
    setSelectedItem(null);
  }, []);

  // Memoize visible category list to prevent unnecessary re-filtering
  const displayedCategories = useMemo(() => {
    if (!activeCategory) return availableCategories;
    return availableCategories.filter((c) => c.id === activeCategory);
  }, [activeCategory, availableCategories]);

  // حالة التحميل الإجمالية
  const isLoading = !minTimePassed || !firebaseReady;

  /* ================= Tabs / Filter Buttons ================= */
  return (
    <>
      {/* Branded Splash Screen with Smooth Fade Transition */}
      <SplashScreen isLoading={isLoading} />

      <main className="max-w-4xl mx-auto px-4 pb-20 space-y-8 font-[Cairo] text-black">
      {toast && (
        <div
          className="fixed top-6 right-6 px-6 py-3 rounded-2xl font-bold shadow-2xl z-50 text-white"
          style={{
            background:
              toast.color === "green"
                ? "linear-gradient(to right, #FDE68A, #F59E0B)"
                : "linear-gradient(to right, #D2000E, #9B111E)",
          }}
        >
          {toast.message}
        </div>
      )}

      {/* =============== Filter Buttons =============== */}
      <nav
        aria-label="أقسام المنيو"
        className="flex flex-wrap gap-2.5 sm:gap-3 justify-center items-center py-1 z-20"
      >
        <button
          type="button"
          onClick={() => setActiveCategory(null)}
          className={`px-4 py-2 rounded-full font-bold text-sm font-[Cairo] select-none touch-manipulation transform-gpu transition-all duration-150 active:scale-95 ${
            activeCategory === null
              ? "bg-[#D2000E] text-white shadow-md shadow-red-900/20 scale-105"
              : "bg-white/95 text-stone-800 hover:bg-white shadow-xs hover:shadow-sm"
          }`}
        >
          جميع الأصناف
        </button>

        {availableCategories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full font-bold text-sm font-[Cairo] select-none touch-manipulation transform-gpu transition-all duration-150 active:scale-95 ${
                isActive
                  ? "bg-[#D2000E] text-white shadow-md shadow-red-900/20 scale-105"
                  : "bg-white/95 text-stone-800 hover:bg-white shadow-xs hover:shadow-sm"
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </nav>

      {/* =============== Display Sections =============== */}
      {displayedCategories.map((cat) => (
        <CategorySection
          key={cat.id}
          category={cat}
          items={itemsByCategory.get(cat.id) || []}
          onImageClick={handleImageClick}
        />
      ))}

      {/* Item Detail Modal */}
      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          isOpen={detailModalOpen}
          onClose={handleCloseDetailModal}
        />
      )}
    </main>
    </>
  );
}
