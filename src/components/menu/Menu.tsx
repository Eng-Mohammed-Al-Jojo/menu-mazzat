/* ================= ORDERED Menu Component ================= */
import { useEffect, useState, useMemo } from "react";
import { db } from "../../firebase";
import { ref, onValue } from "firebase/database";
import CategorySection from "./CategorySection";
import ItemDetailModal from "./ItemDetailModal";

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
  // Stale-While-Revalidate: اقرأ الكاش فوراً للظهور اللحظي بدون شاشة بيضاء
  const cachedData = useMemo(() => loadFromLocal(), []);

  const [categories, setCategories] = useState<Category[]>(() => cachedData?.categories || []);
  const [items, setItems] = useState<Item[]>(() => cachedData?.items || []);
  const [loading, setLoading] = useState<boolean>(() => !cachedData);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; color: "green" | "red" } | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  /* ================= Firebase Load (Background Revalidation) ================= */
  useEffect(() => {
    let timeoutId: number | null = null;
    let firebaseLoaded = false;

    let cats: Category[] = [];
    let its: Item[] = [];
    let catsLoaded = false;
    let itemsLoaded = false;

    // مهلة للطوارئ فقط إذا لم يتوفر أي كاش سابق
    timeoutId = window.setTimeout(() => {
      if (!firebaseLoaded && !cachedData) {
        setLoading(false);
        setToast({ message: "الإنترنت ضعيف، يرجى إعادة المحاولة", color: "red" });
        setTimeout(() => setToast(null), 4000);
      }
    }, 6000);

    const finishFirebase = () => {
      firebaseLoaded = true;
      if (timeoutId) clearTimeout(timeoutId);
      saveToLocal(cats, its);
      setLoading(false);
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
      if (timeoutId) clearTimeout(timeoutId);
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

  /* ================= Group Items by Category (Prevents repeated filtering on render) ================= */
  const itemsByCategory = useMemo(() => {
    const map = new Map<string, Item[]>();
    for (const item of items) {
      if (!map.has(item.categoryId)) {
        map.set(item.categoryId, []);
      }
      map.get(item.categoryId)!.push(item);
    }
    return map;
  }, [items]);

  const handleImageClick = (item: Item) => {
    setSelectedItem(item);
    setDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedItem(null);
  };

  /* ================= Loading Screen ================= */
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-linear-to-br from-[#FDE68A] to-[#FCD451] font-[Almarai] font-bold">
        <div className="relative w-56 h-56 mb-6">
          <img
            src="/logo_mazzat.png"
            alt="Logo"
            className="w-full h-full object-contain rounded-full shadow-2xl animate-pulseScale"
          />
          <div className="absolute inset-0 rounded-full border-4 border-yellow-300 opacity-50 animate-ping"></div>
        </div>

        <h2 className="text-3xl md:text-5xl font-extrabold bg-linear-to-r from-yellow-900 to-yellow-700 bg-clip-text text-transparent animate-textGradient">
          يتم تحضير القائمة
          <span className="text-[#D2000E] animate-ping ml-1">...</span>
        </h2>

        <p className="mt-4 text-black/70 text-lg md:text-xl font-[Alamiri] tracking-wide animate-fadeIn">
          انتظر قليلاً، سيتم عرض كل الأصناف قريباً
        </p>
      </div>
    );
  }

  /* ================= Tabs / Filter Buttons ================= */
  return (
    <main className="max-w-4xl mx-auto px-4 pb-20 space-y-8 font-[Alamiri] text-black">
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
      <div className="flex flex-wrap gap-3 justify-center top-2 z-30">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-4 py-2 rounded-full font-bold transition-all duration-200 font-[Cairo] ${activeCategory === null
            ? "bg-[#D2000E] text-white shadow-lg scale-105 text-sm md:text-md"
            : "bg-white/80 backdrop-blur text-black hover:bg-white shadow text-xs md:text-md"
            }`}
        >
          جميع الأصناف
        </button>

        {availableCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full font-bold transition-all duration-200 font-[Cairo] ${activeCategory === cat.id
              ? "bg-[#D2000E] text-white shadow-lg scale-105 text-sm md:text-md"
              : "bg-white/80 backdrop-blur text-black hover:bg-white shadow text-xs md:text-md"
              }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* =============== Display Sections =============== */}
      {(activeCategory
        ? availableCategories.filter((c) => c.id === activeCategory)
        : availableCategories
      ).map((cat) => (
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
  );
}
