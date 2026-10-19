import { useState, memo } from "react";
import { type Item } from "./Menu";

interface Props {
  item: Item;
  onImageClick?: (item: Item) => void;
}

function ItemRowComponent({ item, onImageClick }: Props) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const rawPrices = String(item.price).split(",");
  const unavailable = item.visible === false;
  const imageUrl = item.image && !imgError ? `/images/${item.image}` : "/logo_mazzat.png";
  const primaryPrice = rawPrices[0]?.trim() || "0";
  const hasMultiplePrices = rawPrices.length > 1;

  return (
    <article
      className={`
        group relative bg-white rounded-2xl sm:rounded-3xl
        border border-amber-200/70 border-b-[4px] border-b-amber-300
        shadow-[0_4px_12px_rgba(136,13,22,0.06),0_1px_2px_rgba(0,0,0,0.04)]
        transition-all duration-150 ease-out
        overflow-hidden flex flex-col justify-between
        ${unavailable 
          ? "opacity-50 grayscale-[40%] pointer-events-none" 
          : "cursor-pointer active:translate-y-[2px] active:border-b-[2px] active:shadow-[0_2px_6px_rgba(136,13,22,0.08)] md:hover:-translate-y-1 md:hover:border-b-[5px] md:hover:shadow-[0_12px_24px_rgba(210,0,14,0.12)]"
        }
      `}
      onClick={() => onImageClick && onImageClick(item)}
    >
      <div className="flex flex-col">
        {/* ===== FOOD IMAGE WITH INNER SHADOW BEVEL ===== */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-amber-50/70">
          {!imageLoaded && (
            <div className="absolute inset-0 skeleton-shimmer z-0" />
          )}

          <img
            src={imageUrl}
            alt={item.name}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImgError(true);
              setImageLoaded(true);
            }}
            className={`w-full h-full object-cover transition-transform duration-500 ease-out ${
              imageLoaded ? "opacity-100" : "opacity-0"
            } ${item.image && !imgError ? "group-hover:scale-105" : "object-contain p-5 opacity-70"}`}
            loading="lazy"
          />

          {/* Gentle Bottom Inner Gradient for Image */}
          <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/20 via-black/5 to-transparent pointer-events-none" />

          {/* Unavailable Banner if disabled */}
          {unavailable && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center z-10">
              <span className="bg-red-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-md font-[Cairo] shadow-md">
                غير متوفر
              </span>
            </div>
          )}
        </div>

        {/* ===== CONTENT WITH 3D DEPTH ===== */}
        <div className="p-3 sm:p-3.5 flex flex-col text-right">
          {/* Header Row: Title & 3D Price Capsule */}
          <div className="flex items-center justify-between gap-1.5">
            <h3
              className={`
                font-[Cairo] font-bold text-stone-900 leading-snug
                text-[0.94rem] sm:text-[1.08rem] line-clamp-1 flex-1
                group-hover:text-[#D2000E] transition-colors duration-150
                ${unavailable ? "line-through text-stone-400" : ""}
              `}
            >
              {item.name}
            </h3>

            {/* Tactile 3D Price Capsule */}
            <div className="flex items-baseline shrink-0 bg-amber-50/90 text-[#D2000E] border border-amber-200/80 border-b-[2px] border-b-amber-300/90 px-2 py-0.5 rounded-lg shadow-xs font-[Cairo]">
              <span className="font-extrabold text-[0.95rem] sm:text-[1.05rem] leading-none">
                {primaryPrice}
              </span>
              <span className="text-[10px] sm:text-xs font-bold mr-0.5 text-[#b8000c]">
                ₪
              </span>
            </div>
          </div>

          {/* Ingredients / Subtitle */}
          {item.ingredients ? (
            <p
              className={`
                mt-1.5 font-[Cairo] font-normal text-stone-500 leading-relaxed
                text-[0.72rem] sm:text-[0.8rem] line-clamp-2 min-h-[2.2rem] sm:min-h-[2.5rem]
                ${unavailable ? "text-stone-400" : ""}
              `}
            >
              {item.ingredients}
            </p>
          ) : (
            <div className="min-h-[2.2rem] sm:min-h-[2.5rem]" />
          )}

          {/* Multiple Sizes Tag */}
          {hasMultiplePrices && (
            <div className="mt-1 flex justify-end">
              <span className="text-[9px] sm:text-[10px] text-amber-900/80 bg-amber-100/60 border border-amber-200/60 px-1.5 py-0.5 rounded font-[Cairo]">
                {rawPrices.length} أحجام متاحة
              </span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

const ItemRow = memo(ItemRowComponent);
export default ItemRow;