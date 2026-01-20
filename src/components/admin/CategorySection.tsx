import React from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { type PopupState } from "./types";

interface Props {
  categories: any;
  items: any;
  setPopup: (popup: PopupState) => void;
  newCategoryName: string;
  setNewCategoryName: React.Dispatch<React.SetStateAction<string>>;
}

const CategorySection: React.FC<Props> = ({
  categories,
  setPopup,
  newCategoryName,
  setNewCategoryName,
}) => {
  return (
    <div className="bg-white p-4 rounded-3xl mb-6 border-4" style={{ borderColor: "#D2000E" }}>
      <h2 className="font-bold mb-3 text-xl">الأقسام</h2>
      <div className="flex gap-2 flex-wrap mb-4">
        <input
          className="flex-1 p-2 border rounded-xl min-w-30"
          placeholder="اسم القسم"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />

        <button
          onClick={() => setPopup({ type: "addCategory" })}
          className="px-4 rounded-xl bg-[#D2000E] flex items-center text-black hover:bg-[#d02c37] hover:text-white hover:cursor-pointer"
        >
          <FiPlus className="text-lg" />
        </button>
      </div>
      <div className="flex gap-2 flex-wrap">
        {Object.keys(categories).map((id) => (
          <div key={id} className="bg-gray-100 px-3 py-1 rounded-xl flex gap-2 items-center">
            <span>{categories[id].name}</span>
            <button
              onClick={() => setPopup({ type: "deleteCategory", id })}
              className="text-red-600 hover:cursor-pointer"
            >
              <FiTrash2 />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
