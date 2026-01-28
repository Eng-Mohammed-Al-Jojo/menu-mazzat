import React, { useState } from "react";
import { ref, push, update } from "firebase/database";
import { db } from "../../firebase";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { type PopupState } from "./types";

interface Props {
  categories: any;
  items: any;
  popup: PopupState;
  setPopup: (popup: PopupState) => void;
}

const ItemSection: React.FC<Props> = ({ categories, items, setPopup }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemIngredients, setItemIngredients] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [quickSearch, setQuickSearch] = useState("");
  const [openCategory, setOpenCategory] = useState<string | null>(null);

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

  return (
    <div
      className="bg-white p-6 rounded-3xl border-4"
      style={{ borderColor: "#D2000E" }}
    >
      <h2 className="font-bold mb-4 text-2xl text-[#231F20]">الأصناف</h2>

      {/* ADD ITEM */}
      <div className="flex gap-2 flex-wrap mb-6">
        <select
          className="w-full p-2 border rounded-xl mb-2"
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
          className="w-full p-2 border rounded-xl mb-2"
          placeholder="اسم الصنف"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />

        <input
          className="w-full p-2 border rounded-xl mb-2"
          placeholder="المكونات أو الوصف (اختياري)"
          value={itemIngredients}
          onChange={(e) => setItemIngredients(e.target.value)}
        />

        <input
          className="w-full p-2 border rounded-xl mb-3"
          placeholder="الأسعار (افصل بين الأسعار بفاصلة)"
          value={itemPrice}
          onChange={(e) => setItemPrice(e.target.value)}
        />

        <button
          onClick={addItem}
          className="py-2 rounded-xl font-bold bg-[#D2000E] grow text-[#FCD451]
          hover:bg-[#e2444f] hover:cursor-pointer"
        >
          إضافة الصنف
        </button>
      </div>

      {/* QUICK SEARCH */}
      <div
        className="bg-white p-4 rounded-3xl border-3"
        style={{ borderColor: "#D2000E" }}
      >
        <input
          className="w-full p-2 border rounded-xl mb-4"
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
            <div key={catId} className="mb-4">
              {/* كارد القسم */}
              <div
                onClick={() =>
                  setOpenCategory(isOpen ? null : catId)
                }
                className="bg-gray-100 text-black p-4 rounded-2xl
                flex justify-between items-center cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-lg">
                    {category.name}
                  </span>
                  <span className="bg-[#fbe395] px-3 py-1 text-sm rounded-full">
                    {categoryItems.length}
                  </span>
                </div>
                <span className="text-2xl">
                  {isOpen ? "−" : "+"}
                </span>
              </div>

              {/* الأصناف */}
              {isOpen && (
                <div className="mt-3 space-y-3">
                  {categoryItems.map((id) => {
                    const item = items[id];
                    const prices = String(item.price)
                      .split(",")
                      .map((p) => p.trim());

                    return (
                      <div
                        key={id}
                        className={`p-3 rounded-xl flex flex-col sm:flex-row justify-between ${item.visible
                          ? "bg-gray-50 hover:shadow-md"
                          : "bg-gray-200 opacity-60"
                          }`}
                      >
                        <div>
                          <p className="font-bold text-[#231F20]">
                            {item.name}
                          </p>
                          {item.ingredients && (
                            <p className="text-sm text-gray-600">
                              مكونات: {item.ingredients}
                            </p>
                          )}
                          <p className="text-sm text-gray-500">
                            {prices
                              .map((p) => `${p}₪`)
                              .join(" / ")}
                          </p>
                        </div>

                        <div className="flex gap-2 mt-3 sm:mt-0">
                          <button
                            onClick={() =>
                              toggleItem(id, item.visible)
                            }
                            className={`px-3 py-1 rounded-xl text-white ${item.visible
                              ? "bg-green-600"
                              : "bg-gray-500"
                              }`}
                          >
                            {item.visible
                              ? "متوفر"
                              : "غير متوفر"}
                          </button>

                          <button
                            onClick={() =>
                              setPopup({ type: "editItem", id })
                            }
                            className="bg-yellow-400 px-3 py-1 rounded-xl"
                          >
                            <FiEdit />
                          </button>

                          <button
                            onClick={() =>
                              setPopup({
                                type: "deleteItem",
                                id,
                              })
                            }
                            className="bg-red-600 text-white px-3 py-1 rounded-xl"
                          >
                            <FiTrash2 />
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
    </div>
  );
};

export default ItemSection;
