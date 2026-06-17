import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageName: string) => void;
  currentImage?: string;
}

const AVAILABLE_IMAGES = [
  "كاليزوني.jpeg",
  "برجر بروست.jpeg",
  "برجر كرسبي.jpeg",
  "تشيكن ألاكينج.jpeg",
  "تشيكن ايطالي.jpeg",
  "تشيكن بارميزان.jpeg",
  "تشيكن بيكانتي.jpeg",
  "تشيكن سكالوبيني.jpeg",
  "طعجة شنيتسل.jpeg",
  "فطيرة ذهبية.jpeg",
];

export default function ImagePickerModal({ isOpen, onClose, onSelectImage, currentImage }: Props) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedImage(currentImage || null);
    }
  }, [isOpen, currentImage]);

  if (!isOpen) return null;

  const handleSelect = (imageName: string) => {
    setSelectedImage(imageName);
  };

  const handleConfirm = () => {
    if (selectedImage) {
      onSelectImage(selectedImage);
      onClose();
    }
  };

  const handleRemove = () => {
    onSelectImage("");
    onClose();
  };

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm admin-modal-overlay"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="admin-card admin-modal-content p-6 md:p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-[#D2000E]">
            اختر صورة للصنف
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
            {AVAILABLE_IMAGES.map((imageName) => {
              const isSelected = selectedImage === imageName;
              const isCurrent = currentImage === imageName;

              return (
                <div
                  key={imageName}
                  onClick={() => handleSelect(imageName)}
                  className={`
                    relative cursor-pointer rounded-xl overflow-hidden
                    border-2 transition-all duration-200
                    hover:scale-[1.01]
                    ${isSelected ? "border-[#D2000E] shadow-lg ring-2 ring-[#D2000E]/20" : "border-gray-200 hover:border-[#FCD451]"}
                    ${isCurrent && !isSelected ? "border-blue-400" : ""}
                  `}
                >
                  <img
                    src={`/images/${imageName}`}
                    alt={imageName}
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/logo_mazzat.png";
                    }}
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-[#D2000E]/30 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">✓</span>
                    </div>
                  )}
                  {isCurrent && !isSelected && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      الحالية
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 text-center">
                    {imageName}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center gap-3 flex-wrap">
            <button
              onClick={handleConfirm}
              disabled={!selectedImage}
              className="admin-btn admin-btn-primary px-6 py-2.5"
            >
              تأكيد الاختيار
            </button>
            {currentImage && (
              <button
                onClick={handleRemove}
                className="admin-btn admin-btn-danger px-6 py-2.5"
              >
                حذف الصورة
              </button>
            )}
            <button
              onClick={onClose}
              className="admin-btn admin-btn-secondary px-6 py-2.5"
            >
              إلغاء
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-5">
            ملاحظة: الصور يجب أن تكون موجودة في مجلد public/images
          </p>
        </div>
      </div>
    </>,
    document.body
  );
}
