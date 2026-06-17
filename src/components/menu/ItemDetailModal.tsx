import { type Item } from "./Menu";
import { FiX } from "react-icons/fi";

interface Props {
  item: Item;
  isOpen: boolean;
  onClose: () => void;
}

export default function ItemDetailModal({ item, isOpen, onClose }: Props) {
  if (!isOpen) return null;

  const imageUrl = item.image ? `/images/${item.image}` : "/logo_mazzat.png";
  const prices = String(item.price).split(",");

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md admin-modal-overlay"
        onClick={onClose}
      />

      <div className="relative w-full h-full flex items-center justify-center p-4 md:p-6">
        <div className="admin-modal-content relative w-full max-w-lg max-h-[90vh] bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col border border-black/5">

          <button
            onClick={onClose}
            className="absolute top-4 left-4 z-20 w-10 h-10 bg-white/95 text-[#D2000E] rounded-full flex items-center justify-center shadow-md hover:scale-105 transition-all duration-200"
          >
            <FiX size={18} />
          </button>

          <div className="relative w-full h-72 md:h-80 flex-shrink-0 p-3 pb-0">
            <img
              src={imageUrl}
              alt={item.name}
              className="w-full h-full object-cover rounded-xl"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/logo_mazzat.png";
              }}
            />

            <div className="absolute inset-3 bottom-0 rounded-xl bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

            <h2 className="absolute bottom-7 right-7 text-white text-2xl font-bold drop-shadow-md">
              {item.name}
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-7 space-y-5">

            {item.ingredients && (
              <div className="bg-gray-50 rounded-xl p-5 border border-black/5">
                <h3 className="font-bold text-[#D2000E] mb-2.5 text-base">
                  المكونات
                </h3>
                <p className="text-gray-600 leading-relaxed text-[0.9375rem]">
                  {item.ingredients}
                </p>
              </div>
            )}

            <div className="bg-gradient-to-r from-[#FDE68A] to-[#F59E0B] rounded-xl p-5 text-center shadow-sm">
              <h3 className="font-bold text-black/80 mb-3 text-sm uppercase tracking-wide">السعر</h3>

              <div className="flex justify-center gap-2 flex-wrap font-bold text-[#7a0c12] text-xl">
                {prices.map((p, i) => (
                  <span key={i} className="flex items-center">
                    {p.trim()}₪
                    {i !== prices.length - 1 && (
                      <span className="mx-2 text-black/30">|</span>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {item.visible === false && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                <p className="text-red-600 font-bold">
                  غير متوفر حالياً
                </p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
