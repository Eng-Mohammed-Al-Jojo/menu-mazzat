import React from "react";
import { type PopupState } from "./types";

interface Props {
  popup: PopupState;
  setPopup: (popup: PopupState) => void;
  deleteItem?: () => void;
  deleteCategory?: (id: string) => void;
  addCategory?: () => void;
  updateItem?: () => void;


  editItemValues?: {
    itemName: string;
    itemPrice: string;
    priceTw: string;
    selectedCategory: string;
    itemIngredients?: string;
    itemImage?: string;
  };
  setEditItemValues?: (values: {
    itemName: string;
    itemPrice: string;
    priceTw: string;
    selectedCategory: string;
    itemIngredients?: string;
    itemImage?: string;
  }) => void;
  categories?: any;

  // ===== خصائص reset password =====
  resetPasswordPopup?: boolean;
  setResetPasswordPopup?: (val: boolean) => void;
  resetEmail?: string;
  setResetEmail?: (val: string) => void;
  resetMessage?: string;
  handleResetPassword?: () => void;
  logout?: () => void;
}

const Popup: React.FC<Props> = ({
  popup,
  setPopup,
  deleteItem,
  deleteCategory,
  addCategory,
  updateItem,
  editItemValues,
  setEditItemValues,
  categories,
  resetPasswordPopup,
  setResetPasswordPopup,
  resetEmail,
  setResetEmail,
  resetMessage,
  handleResetPassword,
  logout,
}) => {
  if (!popup.type && !resetPasswordPopup) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm admin-modal-overlay"
        onClick={() => {
          setPopup({ type: null });
          setResetPasswordPopup && setResetPasswordPopup(false);
        }}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="admin-card admin-modal-content relative p-6 md:p-8 w-full max-w-sm"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ===== Logout ===== */}
          {popup.type === "logout" && (
            <>
              <p className="mb-6 font-bold text-center text-lg text-[#231F20]">تسجيل الخروج؟</p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    logout && logout();
                    setPopup({ type: null });
                  }}
                  className="admin-btn admin-btn-accent"
                >
                  نعم
                </button>
                <button
                  onClick={() => setPopup({ type: null })}
                  className="admin-btn admin-btn-secondary"
                >
                  لا
                </button>
              </div>
            </>
          )}

          {/* ===== Add Category ===== */}
          {popup.type === "addCategory" && (
            <>
              <p className="mb-6 font-bold text-center text-lg text-[#231F20]">إضافة قسم</p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={addCategory}
                  className="admin-btn admin-btn-success flex-1"
                >
                  حفظ
                </button>
                <button
                  onClick={() => setPopup({ type: null })}
                  className="admin-btn admin-btn-secondary flex-1"
                >
                  إلغاء
                </button>
              </div>
            </>
          )}

          {/* ===== Delete Category ===== */}
          {popup.type === "deleteCategory" && (
            <>
              <p className="mb-6 font-bold text-center text-lg text-[#231F20]">تأكيد حذف القسم؟</p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => deleteCategory && deleteCategory(popup.id!)}
                  className="admin-btn admin-btn-danger"
                >
                  حذف
                </button>
                <button
                  onClick={() => setPopup({ type: null })}
                  className="admin-btn admin-btn-secondary"
                >
                  إلغاء
                </button>
              </div>
            </>
          )}

          {/* ===== Delete Item ===== */}
          {popup.type === "deleteItem" && (
            <>
              <h2 className="text-xl font-bold mb-3 text-center text-[#231F20]">تأكيد الحذف</h2>
              <p className="text-center text-gray-600 mb-6">هل أنت متأكد من حذف هذا المنتج؟</p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={deleteItem}
                  className="admin-btn admin-btn-danger"
                >
                  نعم، حذف
                </button>
                <button
                  onClick={() => setPopup({ type: null })}
                  className="admin-btn admin-btn-secondary"
                >
                  لا
                </button>
              </div>
            </>
          )}

          {/* ===== Edit Item ===== */}
          {popup.type === "editItem" && editItemValues && setEditItemValues && categories && (
            <>
              <h2 className="text-xl font-bold mb-5 text-center text-[#D2000E]">تعديل المنتج</h2>

              <div className="space-y-3">
                <div>
                  <label className="admin-label">القسم</label>
                  <select
                    className="admin-select"
                    value={editItemValues.selectedCategory}
                    onChange={(e) =>
                      setEditItemValues({
                        ...editItemValues,
                        selectedCategory: e.target.value,
                      })
                    }
                  >
                    {Object.keys(categories).map((id) => (
                      <option key={id} value={id}>
                        {categories[id].name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="admin-label">اسم المنتج</label>
                  <input
                    className="admin-input"
                    placeholder="اسم المنتج"
                    value={editItemValues.itemName}
                    onChange={(e) =>
                      setEditItemValues({
                        ...editItemValues,
                        itemName: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="admin-label">المكونات أو الوصف</label>
                  <input
                    className="admin-input"
                    placeholder="المكونات أو الوصف (اختياري)"
                    value={editItemValues.itemIngredients}
                    onChange={(e) =>
                      setEditItemValues({
                        ...editItemValues,
                        itemIngredients: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="admin-label">اسم الصورة</label>
                  <input
                    className="admin-input"
                    placeholder="اسم الصورة (مثال: pizza.png)"
                    value={editItemValues.itemImage}
                    onChange={(e) =>
                      setEditItemValues({
                        ...editItemValues,
                        itemImage: e.target.value,
                      })
                    }
                  />
                  {editItemValues.itemImage && (
                    <div className="mt-2">
                      <img
                        src={`/images/${editItemValues.itemImage}`}
                        alt="معاينة"
                        className="w-20 h-20 object-cover rounded-xl border border-black/5"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="admin-label">الأسعار</label>
                  <input
                    className="admin-input"
                    placeholder="الأسعار (افصل بين الأسعار بفاصلة)"
                    value={editItemValues.itemPrice}
                    onChange={(e) =>
                      setEditItemValues({
                        ...editItemValues,
                        itemPrice: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-5">
                <button
                  onClick={updateItem}
                  className="admin-btn admin-btn-primary"
                >
                  حفظ
                </button>
                <button
                  onClick={() => setPopup({ type: null })}
                  className="admin-btn admin-btn-secondary"
                >
                  إلغاء
                </button>
              </div>
            </>
          )}

          {/* ===== Reset Password ===== */}
          {resetPasswordPopup && (
            <>
              <h2 className="text-xl font-bold mb-5 text-[#D2000E] text-center">
                إعادة تعيين كلمة المرور
              </h2>

              <label className="admin-label">البريد الإلكتروني</label>
              <input
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                className="admin-input mb-4"
                value={resetEmail}
                onChange={(e) => setResetEmail && setResetEmail(e.target.value)}
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
                  onClick={() => setResetPasswordPopup && setResetPasswordPopup(false)}
                  className="admin-btn admin-btn-secondary"
                >
                  إلغاء
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Popup;
