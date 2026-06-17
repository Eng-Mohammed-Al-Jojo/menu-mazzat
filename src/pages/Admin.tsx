import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { ref, onValue, push, remove, update } from "firebase/database";
import { FiDownload, FiUpload } from "react-icons/fi";

import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import { FiLogOut } from "react-icons/fi";
import { useLocation } from "react-router-dom";

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import CategorySection from "../components/admin/CategorySection";
import ItemSection from "../components/admin/ItemSection";
import Popup from "../components/admin/Popup";
import { type PopupState } from "../components/admin/types";

export default function Admin() {
  const location = useLocation();
  const [authOk, setAuthOk] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [categories, setCategories] = useState<any>({});
  const [newCategoryName, setNewCategoryName] = useState("");
  const [items, setItems] = useState<any>({});
  const [popup, setPopup] = useState<PopupState>({ type: null });
  const [resetPasswordPopup, setResetPasswordPopup] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [editItemValues, setEditItemValues] = useState<{
    itemName: string;
    itemPrice: string;
    priceTw: string;
    selectedCategory: string;
    itemIngredients?: string;
    itemImage?: string;
  }>({
    itemName: "",
    itemPrice: "",
    priceTw: "",
    selectedCategory: "",
    itemIngredients: "",
    itemImage: "",
  });
  const [editItemId, setEditItemId] = useState("");
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= AUTH LISTENER =================
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setAuthOk(!!user);
    });
    return () => unsub();
  }, []);

  // ================= AUTO LOGOUT ON LEAVE /admin =================
  useEffect(() => {
    return () => {
      signOut(auth);
    };
  }, [location.pathname]);

  // ================= FIREBASE DATA =================
  useEffect(() => {
    if (!authOk) return;
    const catRef = ref(db, "categories");
    const itemRef = ref(db, "items");
    onValue(catRef, (snap) => setCategories(snap.val() || {}));
    onValue(itemRef, (snap) => setItems(snap.val() || {}));
  }, [authOk]);

  // ================= LOGIN =================
  const login = async () => {
    if (!email || !password) return alert("أدخل البريد وكلمة المرور");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      alert("بيانات الدخول غير صحيحة");
    }
  };

  // ================= RESET PASSWORD =================
  const handleResetPassword = async () => {
    if (!resetEmail.trim()) {
      setResetMessage("أدخل البريد الإلكتروني أولاً");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetMessage("تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك!");
    } catch (err: any) {
      console.error(err);
      setResetMessage(err.message);
    }
  };

  // ================= LOGOUT =================
  const logout = async () => {
    await signOut(auth);
    setPopup({ type: null });
  };

  // ================= CATEGORY =================
  const addCategory = async () => {
    if (!newCategoryName.trim()) {
      setToast("⚠️  يجب إدخال اسم القسم أولاً");
      setTimeout(() => setToast(""), 3000);
      return;
    }
    const newName = newCategoryName.trim();
    const exists = Object.values(categories).some(
      (cat: any) => cat.name.trim().toLowerCase() === newName.toLowerCase()
    );
    if (exists) {
      setToast(`القسم "${newName}" موجود مسبقاً`);
      setTimeout(() => setToast(""), 3000);
      return;
    }
    await push(ref(db, "categories"), {
      name: newName,
      createdAt: Date.now(),
    });
    setNewCategoryName("");
    setPopup({ type: null });
    setToast(`تم إضافة القسم "${newName}" بنجاح ✅`);
    setTimeout(() => setToast(""), 4000);
  };

  const deleteCategory = async (id: string) => {
    await remove(ref(db, `categories/${id}`));
    Object.keys(items).forEach((itemId) => {
      if (items[itemId].categoryId === id) remove(ref(db, `items/${itemId}`));
    });
    setPopup({ type: null });
    setToast("  تم حذف القسم بنجاح ✅");
    setTimeout(() => setToast(""), 4000);
  };

  // ================= ITEMS =================
  const deleteItem = async () => {
    if (!popup.id) return;
    await remove(ref(db, `items/${popup.id}`));
    setPopup({ type: null });
    setToast("  تم حذف الصنف بنجاح ✅");
    setTimeout(() => setToast(""), 4000);
  };

  const updateItem = async () => {
    if (!editItemId) return;
    await update(ref(db, `items/${editItemId}`), {
      name: editItemValues.itemName,
      price: editItemValues.itemPrice,
      priceTw: editItemValues.priceTw || "",
      categoryId: editItemValues.selectedCategory,
      ingredients: editItemValues.itemIngredients || "",
      image: editItemValues.itemImage || null,
    });
    setPopup({ type: null });
    setEditItemId("");
    setEditItemValues({
      itemName: "",
      itemPrice: "",
      priceTw: "",
      selectedCategory: "",
      itemIngredients: "",
      itemImage: "",
    });
    setToast("  تم التعديل بنجاح ✅");
    setTimeout(() => setToast(""), 4000);
  };

  const updateItemImage = async (itemId: string, imageName: string) => {
    if (!imageName) {
      await update(ref(db, `items/${itemId}`), { image: null });
      setToast("  تم حذف الصورة بنجاح ✅");
    } else {
      await update(ref(db, `items/${itemId}`), { image: imageName });
      setToast("  تم تحديث الصورة بنجاح ✅");
    }
    setTimeout(() => setToast(""), 4000);
  };

  // ================= EXPORT EXCEL =================
  const exportToExcel = async () => {
    if (!categories || !items) {
      alert("البيانات لم يتم تحميلها بعد!");
      return;
    }
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Items");
    sheet.columns = [
      { header: "الاسم", key: "name", width: 30 },
      { header: "السعر", key: "price", width: 15 },
      { header: "سعر TW", key: "priceTw", width: 15 },
      { header: "القسم", key: "categoryName", width: 30 },
      { header: "المكونات", key: "ingredients", width: 40 },
    ];
    Object.values(items).forEach((item: any) => {
      const categoryName = categories[item.categoryId]?.name ?? "غير محدد";
      sheet.addRow({
        name: item.name,
        price: item.price,
        priceTw: item.priceTw || "",
        categoryName,
        ingredients: item.ingredients || "",
      });
    });
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "mazzat-menu.xlsx");
  };

  // ================= IMPORT EXCEL =================
  const importFromExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const workbook = new ExcelJS.Workbook();
      const buffer = await file.arrayBuffer();
      await workbook.xlsx.load(buffer);
      const sheet = workbook.getWorksheet(1);
      if (!sheet) {
        setToast("ملف غير صالح");
        setLoading(false);
        return;
      }
      const categoryMap: Record<string, string> = {};
      Object.entries(categories).forEach(([id, cat]: any) => {
        categoryMap[cat.name.trim().toLowerCase()] = id;
      });
      const rows: any[] = [];
      sheet.eachRow((row, index) => {
        if (index === 1) return;
        rows.push({
          name: row.getCell(1).value?.toString().trim() || "",
          price: row.getCell(2).value?.toString().trim() || "",
          priceTw: row.getCell(3).value?.toString().trim() || "",
          categoryName: row.getCell(4).value?.toString().trim() || "",
          ingredients: row.getCell(5).value?.toString().trim() || "",
        });
      });
      let addedCount = 0;
      for (const item of rows) {
        if (!item.name || !item.categoryName) continue;
        const categoryId = categoryMap[item.categoryName.toLowerCase()];
        if (!categoryId) continue;
        const exists = Object.values(items).some(
          (i: any) =>
            i.name.trim().toLowerCase() === item.name.toLowerCase() &&
            i.categoryId === categoryId
        );
        if (exists) continue;
        await push(ref(db, "items"), {
          name: item.name,
          price: item.price,
          priceTw: item.priceTw || "",
          categoryId,
          ingredients: item.ingredients || "",
          createdAt: Date.now(),
        });
        addedCount++;
      }
      if (addedCount > 0) setToast(`تم إضافة ${addedCount} صنف جديد ✅`);
      else setToast("القائمة محدثة بالفعل ✅");
    } catch (err) {
      console.error(err);
      setToast("حدث خطأ أثناء الاستيراد ❌");
    } finally {
      setLoading(false);
      e.target.value = "";
      setTimeout(() => setToast(""), 4000);
    }
  };

  // ================= EXPORT JSON =================
  const exportToJSON = () => {
    const data = {
      categories: categories,
      items: items,
      meta: { version: "1.0", exportedAt: Date.now() },
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mazzat-data.json";
    a.click();
    URL.revokeObjectURL(url);
    setToast("📦 تم تصدير ملف JSON بنجاح");
    setTimeout(() => setToast(""), 4000);
  };


  // ================= LOGIN UI =================
  if (!authOk) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCD451] p-4" dir="rtl">
        {resetPasswordPopup && (
          <div className="fixed inset-0 bg-[#FCD451] flex justify-center items-center z-50 p-4">
            <div className="admin-card admin-modal-content p-8 w-full max-w-sm">
              <div className="flex justify-center mb-6">
                <img
                  src="/logo_mazzat.png"
                  alt="mazzat-logo"
                  className="w-32 h-auto object-contain"
                />
              </div>
              <h2 className="text-xl font-bold mb-6 text-[#D2000E] text-center">
                إعادة تعيين كلمة المرور
              </h2>
              <label className="admin-label">البريد الإلكتروني</label>
              <input
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                className="admin-input mb-4"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
              {resetMessage && (
                <p className="text-sm text-center text-green-600 mb-4">{resetMessage}</p>
              )}
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleResetPassword}
                  className="admin-btn admin-btn-primary"
                >
                  إرسال الرابط
                </button>
                <button
                  onClick={() => {
                    setResetPasswordPopup(false);
                    setResetMessage("");
                  }}
                  className="admin-btn admin-btn-secondary"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}
        {!resetPasswordPopup && (
          <div className="admin-card admin-animate-in p-8 w-full max-w-sm">
            <div className="flex justify-center mb-6">
              <img
                src="/logo_mazzat.png"
                alt="mazzat-logo"
                className="w-32 h-auto object-contain"
              />
            </div>
            <h1 className="text-xl font-bold mb-6 text-center text-[#D2000E]">دخول الأدمن</h1>
            <label className="admin-label">اسم المستخدم (Email)</label>
            <input
              type="email"
              className="admin-input mb-4"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="admin-label">كلمة المرور</label>
            <input
              type="password"
              className="admin-input mb-6"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              onClick={login}
              className="admin-btn admin-btn-accent w-full py-3 text-base"
            >
              دخول
            </button>
            <button
              onClick={() => setResetPasswordPopup(true)}
              className="mt-4 w-full text-sm text-[#D2000E] hover:underline transition-colors duration-200"
            >
              نسيت كلمة المرور؟
            </button>
          </div>
        )}
      </div>
    );
  }

  // ================= ADMIN PANEL =================
  return (
    <div className="min-h-screen w-full bg-[#FCD451] flex justify-center py-6 md:py-8 px-4 md:px-6" dir="rtl">
      {toast && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 bg-[#D2000E] text-white px-6 py-3 rounded-xl shadow-lg admin-animate-in">
          {toast}
        </div>
      )}
      {loading && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-40 admin-modal-overlay">
          <div className="admin-card admin-modal-content p-8 text-[#231F20] font-bold">
            جاري تحميل البيانات...
          </div>
        </div>
      )}

      {/* Inputs مخفية للملفات */}
      <input type="file" accept=".xlsx" id="excelUpload" hidden onChange={importFromExcel} />

      <div className="w-full max-w-7xl space-y-6">
        <div className="admin-card admin-animate-in p-5 md:p-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#D2000E]">لوحة تحكم Mazzat</h1>
              <p className="text-sm text-gray-600 mt-1">إدارة الأقسام والأصناف</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={exportToExcel}
                className="admin-btn admin-btn-success"
                title="تصدير Excel"
              >
                <FiUpload size={18} />
              </button>
              <button
                onClick={() => document.getElementById("excelUpload")?.click()}
                className="admin-btn admin-btn-primary"
                title="استيراد Excel"
              >
                <FiDownload size={18} />
              </button>
              <button
                onClick={exportToJSON}
                className="admin-btn admin-btn-primary"
                title="نسخ احتياطي JSON"
              >
                backup
                <FiUpload size={18} />
              </button>
              <button
                onClick={() => setPopup({ type: "logout" })}
                className="admin-btn admin-btn-danger"
              >
                <FiLogOut size={18} /> خروج
              </button>
            </div>
          </div>
        </div>

        <CategorySection
          categories={categories}
          setPopup={setPopup}
          newCategoryName={newCategoryName}
          setNewCategoryName={setNewCategoryName}
        />

        <ItemSection
          categories={categories}
          items={items}
          popup={popup}
          setPopup={(p) => {
            setPopup(p);
            if (p.type === "editItem" && p.id) {
              const item = items[p.id];
              if (item) {
                setEditItemId(p.id);
                setEditItemValues({
                  itemName: item.name,
                  itemPrice: item.price,
                  priceTw: item.priceTw || "",
                  selectedCategory: item.categoryId,
                  itemIngredients: item.ingredients || "",
                  itemImage: item.image || "",
                });
              }
            }
          }}
          onUpdateItemImage={updateItemImage}
        />

        <Popup
          popup={popup}
          setPopup={setPopup}
          addCategory={addCategory}
          deleteCategory={deleteCategory}
          deleteItem={deleteItem}
          updateItem={updateItem}
          editItemValues={editItemValues}
          setEditItemValues={setEditItemValues}
          categories={categories}
          resetPasswordPopup={resetPasswordPopup}
          setResetPasswordPopup={setResetPasswordPopup}
          resetEmail={resetEmail}
          setResetEmail={setResetEmail}
          resetMessage={resetMessage}
          handleResetPassword={handleResetPassword}
          logout={logout}
        />
      </div>
    </div>
  );
}