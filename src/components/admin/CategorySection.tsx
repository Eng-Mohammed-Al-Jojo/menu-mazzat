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
    <div className="admin-card admin-animate-in p-5 md:p-6">
      <h2 className="admin-section-header">الأقسام</h2>

      {/* ===== خانة إدخال قسم جديد + زر الإضافة ===== */}
      <div className="flex gap-3 flex-wrap mb-5">
        <input
          className="admin-input flex-1 min-w-[160px]"
          placeholder="اسم القسم"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <button
          onClick={() => setPopup({ type: "addCategory" })}
          className="admin-btn admin-btn-accent px-5"
        >
          <FiPlus className="text-xl" />
        </button>
      </div>

      {/* ===== عنوان الستارة للأقسام ===== */}
      <div
        className="admin-accordion p-4 flex justify-between items-center cursor-pointer mb-3"
        onClick={() => setOpen((prev) => !prev)}
      >
        <h3 className="font-bold text-lg text-[#231F20]">عرض الأقسام</h3>
        <span className="text-[#D2000E] transition-transform duration-200">
          {open ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
        </span>
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
                    <div className="admin-row bg-gray-50 px-4 py-3 rounded-xl flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border border-black/5">

                      {/* الاسم + مقبض السحب */}
                      <div className="flex items-center gap-3 flex-1">
                        <button
                          ref={setActivatorNodeRef}
                          {...listeners}
                          {...attributes}
                          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-[#D2000E] touch-none transition-colors duration-200"
                        >
                          <FiMenu />
                        </button>

                        {editingId === id ? (
                          <>
                            <input
                              className="admin-input flex-1 py-1.5"
                              value={tempName}
                              onChange={(e) => setTempName(e.target.value)}
                            />
                            <button
                              onClick={() => saveEdit(id)}
                              className="admin-btn admin-btn-success px-3 py-1.5"
                            >
                              <FiCheck />
                            </button>
                          </>
                        ) : (
                          <span className="flex-1 font-semibold text-[#231F20]">{cat.name}</span>
                        )}
                      </div>

                      {/* الجهة اليمنى */}
                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        {/* تعديل + حذف */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => startEditing(id, cat.name)}
                            className="admin-btn admin-btn-secondary px-2.5 py-1.5 text-blue-600"
                          >
                            <FiEdit size={16} />
                          </button>

                          <button
                            onClick={() => setPopup({ type: "deleteCategory", id })}
                            className="admin-btn admin-btn-danger px-2.5 py-1.5"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>

                        {/* السويتش */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleAvailability(id, cat.available)}
                            className={`relative w-11 h-6 rounded-full transition-all duration-200 ${cat.available
                              ? "bg-green-500"
                              : "bg-gray-300"
                              }`}
                          >
                            <span
                              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200 ${cat.available
                                ? "translate-x-5"
                                : "translate-x-0.5"
                                }`}
                            />
                          </button>
                          <span className="text-xs font-semibold text-gray-600">
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
