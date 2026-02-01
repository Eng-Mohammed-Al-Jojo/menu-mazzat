import React, { useState } from "react";
import { FiPlus, FiTrash2, FiEdit, FiCheck, FiMenu, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { db } from "../../firebase";
import { ref, update } from "firebase/database";
import type { PopupState, Category } from "./types";

import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/* ===== Sortable Item with Drag Handle ===== */
function SortableItem({
  id,
  children,
}: {
  id: string;
  children: (props: {
    setActivatorNodeRef: (node: HTMLElement | null) => void;
    listeners: any;
    attributes: any;
  }) => React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children({ setActivatorNodeRef, listeners, attributes })}
    </div>
  );
}

/* ===== Component ===== */
interface Props {
  categories: Record<string, Category>;
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempName, setTempName] = useState("");
  const [open, setOpen] = useState(false); // التحكم في الستارة العامة

  const startEditing = (id: string, currentName: string) => {
    setEditingId(id);
    setTempName(currentName);
  };

  const saveEdit = async (id: string) => {
    if (!tempName.trim()) return;
    try {
      await update(ref(db, `categories/${id}`), {
        name: tempName.trim(),
      });
      setEditingId(null);
      setTempName("");
    } catch (err) {
      console.error(err);
    }
  };

  const toggleAvailability = async (id: string, current: boolean) => {
    try {
      await update(ref(db, `categories/${id}`), {
        available: !current,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const sortedCategories = Object.entries(categories).sort(
    (a, b) => (a[1].order ?? 0) - (b[1].order ?? 0)
  );

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sortedCategories.findIndex(
      ([id]) => id === active.id
    );
    const newIndex = sortedCategories.findIndex(
      ([id]) => id === over.id
    );

    const newOrder = arrayMove(sortedCategories, oldIndex, newIndex);

    const updates: Record<string, any> = {};
    newOrder.forEach(([id], index) => {
      updates[`categories/${id}/order`] = index;
    });

    try {
      await update(ref(db), updates);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className="bg-white p-4 rounded-3xl mb-6 border-4"
      style={{ borderColor: "#D2000E" }}
    >
      <h2 className="font-bold text-2xl mb-2">الأقسام</h2>

      {/* ===== خانة إدخال قسم جديد + زر الإضافة ===== */}
      <div className="flex gap-2 flex-wrap mb-4">
        <input
          className="flex-1 p-2 border rounded-xl min-w-[160px]"
          placeholder="اسم القسم"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <button
          onClick={() => setPopup({ type: "addCategory" })}
          className="px-4 rounded-xl bg-[#FDB143] flex items-center text-white hover:bg-[#FDB143]/80"
        >
          <FiPlus className="text-xl" />
        </button>
      </div>

      {/* ===== عنوان الستارة للأقسام ===== */}
      <div
        className="bg-gray-100 text-black p-4 rounded-2xl
                flex justify-between items-center cursor-pointer mb-3 "
        onClick={() => setOpen((prev) => !prev)}
      >
        <h2 className="font-bold text-xl">عرض الأقسام</h2>
        {open ? <FiChevronUp /> : <FiChevronDown />}
      </div>

      {/* ===== محتوى الستارة للأقسام ===== */}
      {open && (
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sortedCategories.map(([id]) => id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-2">
              {sortedCategories.map(([id, cat]) => (
                <SortableItem key={id} id={id}>
                  {({ setActivatorNodeRef, listeners, attributes }) => (
                    <div className="bg-gray-100 px-3 py-2 rounded-xl flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                      {/* الاسم + مقبض السحب */}
                      <div className="flex items-center gap-2 flex-1">
                        <button
                          ref={setActivatorNodeRef}
                          {...listeners}
                          {...attributes}
                          className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-700 touch-none"
                        >
                          <FiMenu />
                        </button>

                        {editingId === id ? (
                          <>
                            <input
                              className="flex-1 p-1 border rounded-xl"
                              value={tempName}
                              onChange={(e) => setTempName(e.target.value)}
                            />
                            <button
                              onClick={() => saveEdit(id)}
                              className="text-green-600 hover:text-green-800"
                            >
                              <FiCheck />
                            </button>
                          </>
                        ) : (
                          <span className="flex-1 font-medium">{cat.name}</span>
                        )}
                      </div>

                      {/* الجهة اليمنى */}
                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        {/* تعديل + حذف */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => startEditing(id, cat.name)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FiEdit />
                          </button>

                          <button
                            onClick={() => setPopup({ type: "deleteCategory", id })}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FiTrash2 />
                          </button>
                        </div>

                        {/* السويتش */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleAvailability(id, cat.available)}
                            className={`relative w-10 h-5 rounded-full transition-all ${cat.available
                              ? "bg-green-500"
                              : "bg-gray-400"
                              }`}
                          >
                            <span
                              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${cat.available
                                ? "translate-x-5"
                                : "translate-x-0.5"
                                }`}
                            />
                          </button>
                          <span className="text-[11px] font-bold">
                            {cat.available ? "متوفر" : "غير متوفر"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default CategorySection;
