import { useState } from "react";
import { type Item } from "./Menu";
import { FiX, FiMaximize2, FiCheckCircle } from "react-icons/fi";

interface Props {
  item: Item;
  isOpen: boolean;
  onClose: () => void;
}

export default function ItemDetailModal({ item, isOpen, onClose }: Props) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!isOpen) return null;

  const hasCustomImage = Boolean(item.image) && !imgError;
  const imageUrl = item.image ? `/images/${item.image}` : "/logo_mazzat.png";
  const prices = String(item.price).split(",");

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Background Backdrop Overlay with gentle blur and fade */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-modalOverlay"
        onClick={onClose}
      />

      {/* Main Modal Sheet with smooth slide up */}
      <div className="relative w-full sm:max-w-md max-h-[90vh] bg-[#FFFDF7] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 border border-yellow-500/20 font-[Cairo] animate-modalSheet">

        {/* Floating Control Buttons */}
        <div className="absolute top-3 left-3 right-3 z-20 flex justify-between items-center pointer-events-none">
          <button
            onClick={onClose}
            className="pointer-events-auto w-9 h-9 sm:w-10 sm:h-10 bg-white/90 text-[#D2000E] hover:bg-white rounded-full flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer"
            aria-label="إغلاق"
          >
            <FiX size={20} />
          </button>

          {hasCustomImage && (
            <button
              onClick={() => setIsZoomed(true)}
              className="pointer-events-auto w-10 h-10 bg-white/90 text-[#D2000E] hover:bg-white rounded-full flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer"
              title="تكبير الصورة"
            >
              <FiMaximize2 size={18} />
            </button>
          )}
        </div>

        {/* Prominent Large Food Hero Image */}
        <div className="relative w-full h-64 sm:h-72 bg-amber-50/80 overflow-hidden flex-shrink-0">
          <img
            src={imageUrl}
            alt={item.name}
            className={`w-full h-full transition-transform duration-700 ${
              hasCustomImage ? "object-cover hover:scale-105" : "object-contain p-8 opacity-80"
            }`}
            onError={() => setImgError(true)}
          />
          {hasCustomImage && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          )}
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 text-right">

          {/* Title & Availability */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#D2000E] leading-snug">
                {item.name}
              </h2>
              {item.visible !== false ? (
                <span className="inline-flex items-center gap-1.5 mt-2 text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full border border-emerald-300/60">
                  <FiCheckCircle size={13} /> متوفر للطلب
                </span>
              ) : (
                <span className="inline-block mt-2 text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                  غير متوفر حالياً
                </span>
              )}
            </div>
          </div>

          {/* Ingredients Box */}
          {item.ingredients && (
            <div className="bg-[#FEFCE8] rounded-2xl p-4 border border-yellow-200/80 text-right shadow-xs">
              <h3 className="font-bold text-[#D2000E] text-xs mb-1.5 tracking-wide">
                المكونات والتحضير:
              </h3>
              <p className="text-stone-700 text-sm leading-relaxed font-[Cairo]">
                {item.ingredients}
              </p>
            </div>
          )}

          {/* Golden Signature Price Tag Banner */}
          <div className="bg-gradient-to-r from-[#FDE68A] via-[#FCD451] to-[#FDE68A] border border-yellow-400/80 rounded-2xl p-3.5 flex items-center justify-between shadow-sm">
            <span className="text-[#7a0c12] font-extrabold text-sm uppercase tracking-wider">
              السعر
            </span>
            <div className="flex items-center gap-2 font-extrabold text-xl sm:text-2xl text-[#7a0c12]">
              {prices.map((p, i) => (
                <span key={i} className="flex items-center">
                  {p.trim()} <span className="text-base mr-0.5">₪</span>
                  {i !== prices.length - 1 && (
                    <span className="mx-2 text-[#7a0c12]/40">|</span>
                  )}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Fullscreen Lightbox Image Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-[60] bg-black/92 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-5 left-5 text-white bg-white/20 p-3 rounded-full hover:bg-white/40 transition-colors cursor-pointer"
            aria-label="إغلاق التكبير"
          >
            <FiX size={24} />
          </button>
          <img
            src={imageUrl}
            alt={item.name}
            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
