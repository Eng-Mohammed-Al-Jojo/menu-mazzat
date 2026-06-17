import React, { useState } from "react";
import { ref, push, update } from "firebase/database";
import { db } from "../../firebase";
import { FiEdit, FiTrash2, FiImage } from "react-icons/fi";
import { type PopupState } from "./types";
import ImagePickerModal from "./ImagePickerModal";

interface Props {
  categories: any;
  items: any;
  popup: PopupState;
  setPopup: (popup: PopupState) => void;
  onUpdateItemImage?: (itemId: string, imageName: string) => void;
}

const ItemSection: React.FC<Props> = ({ categories, items, setPopup, onUpdateItemImage }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemIngredients, setItemIngredients] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [quickSearch, setQuickSearch] = useState("");
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const addItem = async () => {
    if (!selectedCategory || !itemName || !itemPrice) return;
    await push(ref(db, "items"), {
      name: itemName,
      ingredients: itemIngredients,
      price: itemPrice,
      categoryId: selectedCategory,
      visible: true,
      createdAt: Date.now(),
    });
    setItemName("");
    setItemIngredients("");
    setItemPrice("");
    setSelectedCategory("");
  };

  const toggleItem = async (id: string, visible: boolean) => {
    await update(ref(db, `items/${id}`), { visible: !visible });
  };

  const handleSelectImage = (imageName: string) => {
    if (selectedItemId && onUpdateItemImage) {
      onUpdateItemImage(selectedItemId, imageName);
    }
  };

  const openImagePicker = (itemId: string) => {
    setSelectedItemId(itemId);
    setImagePickerOpen(true);
  };

  return (
    <div className="admin-card admin-animate-in p-5 md:p-6">
      <h2 className="admin-section-header">الأصناف</h2>

      {/* ADD ITEM */}
      <div className="grid gap-3 mb-6">
        <select
          className="admin-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">اختر القسم</option>
          {Object.keys(categories).map((id) => (
            <option key={id} value={id}>
              {categories[id].name}
            </option>
          ))}
        </select>

        <input
          className="admin-input"
          placeholder="اسم الصنف"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />

        <input
          className="admin-input"
          placeholder="المكونات أو الوصف (اختياري)"
          value={itemIngredients}
          onChange={(e) => setItemIngredients(e.target.value)}
        />

        <input
          className="admin-input"
          placeholder="الأسعار (افصل بين الأسعار بفاصلة)"
          value={itemPrice}
          onChange={(e) => setItemPrice(e.target.value)}
        />

        <button
          onClick={addItem}
          className="admin-btn admin-btn-primary w-full py-2.5"
        >
          إضافة الصنف
        </button>
      </div>

      {/* QUICK SEARCH */}
      <div className="rounded-xl border border-black/5 bg-gray-50/50 p-4 md:p-5">
        <label className="admin-label">بحث سريع</label>
        <input
          className="admin-input mb-5"
          placeholder="ابحث بسرعة عن صنف أو سعر..."
          value={quickSearch}
          onChange={(e) => setQuickSearch(e.target.value)}
        />

        {/* الأقسام */}
        {Object.keys(categories).map((catId) => {
          const category = categories[catId];

          const categoryItems = Object.keys(items).filter((id) => {
            const item = items[id];
            if (item.categoryId !== catId) return false;

            const prices = String(item.price)
              .split(",")
              .map((p) => p.trim());
            const search = quickSearch.toLowerCase();

            return (
              item.name.toLowerCase().includes(search) ||
              prices.some((p) => p.includes(search))
            );
          });

          if (categoryItems.length === 0) return null;

          const isOpen = openCategory === catId;

          return (
            <div key={catId} className="mb-4 last:mb-0">
              {/* كارد القسم */}
              <div
                onClick={() =>
                  setOpenCategory(isOpen ? null : catId)
                }
                className="admin-accordion p-4 flex justify-between items-center cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-lg text-[#231F20]">
                    {category.name}
                  </span>
                  <span className="bg-[#FCD451] text-[#D2000E] px-3 py-0.5 text-sm font-semibold rounded-full">
                    {categoryItems.length}
                  </span>
                </div>
                <span className="text-xl font-light text-[#D2000E] transition-transform duration-200">
                  {isOpen ? "−" : "+"}
                </span>
              </div>

              {/* الأصناف */}
              {isOpen && (
                <div className="mt-3 space-y-2">
                  {categoryItems.map((id) => {
                    const item = items[id];
                    const prices = String(item.price)
                      .split(",")
                      .map((p) => p.trim());

                    return (
                      <div
                        key={id}
                        className={`admin-row p-4 rounded-xl flex flex-col sm:flex-row justify-between gap-3 border border-black/5 ${item.visible
                          ? "bg-white"
                          : "bg-gray-100 opacity-70"
                          }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-start gap-4">
                            {item.image && (
                              <img
                                src={`/images/${item.image}`}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-xl border border-black/5 shadow-sm"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "/logo_mazzat.png";
                                }}
                              />
                            )}
                            <div className="space-y-1">
                              <p className="font-bold text-[#231F20]">
                                {item.name}
                              </p>
                              {item.ingredients && (
                                <p className="text-sm text-gray-500 leading-relaxed">
                                  مكونات: {item.ingredients}
                                </p>
                              )}
                              <p className="text-sm font-semibold text-[#D2000E]">
                                {prices
                                  .map((p) => `${p}₪`)
                                  .join(" / ")}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() =>
                              toggleItem(id, item.visible)
                            }
                            className={`admin-btn admin-btn-card admin-btn-card-text ${item.visible
                              ? "admin-btn-success"
                              : "admin-btn-secondary"
                              }`}
                          >
                            {item.visible
                              ? "متوفر"
                              : "غير متوفر"}
                          </button>

                          <button
                            onClick={() => openImagePicker(id)}
                            className={`admin-btn admin-btn-card admin-btn-card-icon ${item.image ? "admin-btn-primary" : "admin-btn-secondary"}`}
                            title={item.image ? "تغيير الصورة" : "اختيار صورة"}
                          >
                            <FiImage size={16} />
                          </button>

                          <button
                            onClick={() =>
                              setPopup({ type: "editItem", id })
                            }
                            className="admin-btn admin-btn-accent admin-btn-card admin-btn-card-icon"
                          >
                            <FiEdit size={16} />
                          </button>

                          <button
                            onClick={() =>
                              setPopup({
                                type: "deleteItem",
                                id,
                              })
                            }
                            className="admin-btn admin-btn-danger admin-btn-card admin-btn-card-icon"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <ImagePickerModal
        isOpen={imagePickerOpen}
        onClose={() => {
          setImagePickerOpen(false);
          setSelectedItemId(null);
        }}
        onSelectImage={handleSelectImage}
        currentImage={selectedItemId ? items[selectedItemId]?.image : undefined}
      />
    </div>
  );
};

export default ItemSection;
