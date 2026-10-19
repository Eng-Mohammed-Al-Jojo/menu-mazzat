import { type Item } from "./Menu";
import { FiChevronLeft, FiCheckCircle, FiTag } from "react-icons/fi";

interface Props {
  item: Item;
  onImageClick?: (item: Item) => void;
}

export default function ItemRow({ item, onImageClick }: Props) {
  const prices = String(item.price).split(",");
  const unavailable = item.visible === false;
  const imageUrl = item.image ? `/images/${item.image}` : "/logo_mazzat.png";
  const primaryPrice = prices[0]?.trim() || "0";

  return (
    <article
      className={`
        group relative bg-white/95 backdrop-blur-sm rounded-2xl
        border border-yellow-200/60 shadow-sm
        hover:shadow-2xl hover:border-yellow-300/80 hover:-translate-y-1
        transition-all duration-500 ease-out
        overflow-hidden flex flex-col
        ${unavailable ? "opacity-50 saturate-0 pointer-events-none" : "cursor-pointer"}
      `}
      onClick={() => onImageClick && onImageClick(item)}
    >
      {/* ===== ANIMATED GLOW BORDER ===== */}
      {!unavailable && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#FCD451]/0 via-[#FCD451]/10 to-[#D2000E]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl" />
      )}

      {/* ===== HERO IMAGE SECTION ===== */}
      <div className="relative aspect-[4/3] overflow-hidden bg-amber-50/50 flex-shrink-0">
        <img
          src={imageUrl}
          alt={item.name}
          className={`w-full h-full transition-all duration-700 ease-out ${
            item.image ? "object-cover group-hover:scale-105" : "object-contain p-6 opacity-70"
          }`}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/logo_mazzat.png";
          }}
          loading="lazy"
        />

        {/* Gradient Overlay for Depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />

        {/* Zoom Hint - Appears on hover/tap */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm text-[#D2000E] p-2 rounded-full shadow-lg
          opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 scale-95 group-hover:scale-100">
          <FiChevronLeft size={16} className="rotate-180" />
        </div>

        {/* Availability Badge - Top Right */}
        {!unavailable && (
          <div className="absolute top-3 right-3">
            <span className="bg-emerald-500/95 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg backdrop-blur-sm flex items-center gap-1">
              <FiCheckCircle size={10} /> متوفر
            </span>
          </div>
        )}

        {/* ===== FLOATING PRICE PILL - TOP LEFT ON IMAGE ===== */}
        {!unavailable && (
          <div className="absolute top-3 left-3 z-10">
            <div className={`
              bg-white/95 backdrop-blur-md text-[#7a0c12]
              border border-yellow-300/50
              rounded-full px-3 py-1.5 shadow-lg
              flex items-center gap-1.5
              transition-all duration-400
              group-hover:shadow-xl group-hover:border-yellow-400/80 group-hover:scale-105
              animate-in fade-in slide-in-from-top-2 duration-500 ease-out
            `}>
              <FiTag size={13} className="text-[#FCD451] drop-shadow-[0_1px_2px_rgba(210,0,14,0.3)]" />
              <span className="font-extrabold text-base sm:text-lg leading-none whitespace-nowrap">
                {primaryPrice} <span className="text-sm font-bold">₪</span>
              </span>
              {prices.length > 1 && (
                <span className="text-[10px] text-stone-500 ml-1 hidden sm:inline">
                  +{prices.length - 1} سعر
                </span>
              )}
            </div>
          </div>
        )}

        {/* Unavailable Overlay */}
        {unavailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <span className="bg-red-500/95 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-xl backdrop-blur-sm border border-red-400/30">
              غير متوفر حالياً
            </span>
          </div>
        )}
      </div>

      {/* ===== CONTENT SECTION - CLEAN & FOCUSED ===== */}
      <div className="p-4 flex flex-col flex-1 text-right">

        {/* Name */}
        <h3 className={`
          font-extrabold text-[#D2000E] leading-snug
          transition-colors duration-300
          group-hover:text-[#B8000C]
          ${unavailable ? "line-through decoration-red-400/50 decoration-2" : ""}
        `}
          style={{ fontSize: 'clamp(0.9375rem, 2.5vw, 1.0625rem)' }}
        >
          {item.name}
        </h3>

        {/* Ingredients */}
        {item.ingredients && (
          <p className={`
            mt-2 text-stone-600 leading-relaxed font-[Cairo] line-clamp-2
            transition-colors duration-300
            ${unavailable ? "line-through decoration-stone-400/50" : ""}
          `}
            style={{ fontSize: 'clamp(0.75rem, 2vw, 0.8125rem)' }}
          >
            {item.ingredients}
          </p>
        )}

        {/* ===== ALTERNATIVE: MINIMAL PRICE LINE (BOTTOM) ===== */}
        {/* Shows only on larger screens as a subtle confirmation */}
        <div className="mt-auto pt-3 hidden sm:flex items-center justify-end">
          <div className={`
            bg-gradient-to-r from-[#FDE68A]/60 via-transparent to-[#FDE68A]/60
            border border-yellow-300/30
            rounded-lg px-3 py-1.5
            transition-all duration-400
            ${unavailable ? "opacity-30 grayscale" : "group-hover:border-yellow-400/60 group-hover:bg-gradient-to-r group-hover:from-[#FDE68A]/80 group-hover:to-[#FDE68A]/80"}
          `}>
            <span className="font-bold text-[#7a0c12] text-sm leading-none">
              {primaryPrice}₪
            </span>
            {prices.length > 1 && (
              <span className="text-[10px] text-stone-500 ml-2 font-medium">
                +{prices.length - 1} خيار
              </span>
            )}
          </div>
        </div>

      </div>

      {/* ===== BOTTOM GOLDEN ACCENT BAR ===== */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FCD451]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
    </article>
  );
}