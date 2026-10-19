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
        group relative bg-[#FFFDF7] rounded-2xl
        border border-amber-200/80 border-b-[4px] border-b-amber-300
        shadow-[0_4px_14px_rgba(136,13,22,0.05),0_1px_3px_rgba(0,0,0,0.03)]
        transition-all duration-150 ease-out
        overflow-hidden flex flex-col
        ${unavailable
          ? "opacity-50 grayscale-[40%] pointer-events-none"
          : "cursor-pointer active:translate-y-[2px] active:border-b-[2px] active:shadow-[0_2px_6px_rgba(136,13,22,0.07)] md:hover:-translate-y-1 md:hover:border-b-[5px] md:hover:shadow-[0_12px_24px_rgba(210,0,14,0.11)]"
        }
      `}
      onClick={() => onImageClick && onImageClick(item)}
    >
      {/* ===== IMAGE SECTION ===== */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-amber-100/40">
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
          className={`w-full h-full transition-transform duration-500 ease-out ${
            imageLoaded ? "opacity-100" : "opacity-0"
          } ${item.image && !imgError
            ? "object-cover group-hover:scale-105"
            : "object-contain p-5 opacity-70"
          }`}
          loading="lazy"
        />

        {/* ===== PRICE BADGE — Top Left, Bold & Clear ===== */}
        {!unavailable && (
          <div className="absolute top-0 left-0 z-10">
            {/* Notch-style badge anchored to top-left corner */}
            <div
              className="
                flex items-baseline gap-[2px]
                bg-[#D2000E] text-white
                font-[Cairo] font-extrabold
                pl-2.5 pr-3 pt-1.5 pb-1
                rounded-br-2xl
                shadow-[2px_2px_8px_rgba(210,0,14,0.35)]
              "
            >
              <span className="text-[1rem] sm:text-[1.1rem] leading-none tracking-tight">
                {primaryPrice}
              </span>
              <span className="text-[11px] sm:text-[13px] font-bold opacity-90 leading-none">
                ₪
              </span>
              {hasMultiplePrices && (
                <span className="text-[9px] opacity-80 font-semibold mr-0.5">+</span>
              )}
            </div>
          </div>
        )}

        {/* Unavailable overlay */}
        {unavailable && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center z-10">
            <span className="bg-red-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-md font-[Cairo] shadow-md">
              غير متوفر
            </span>
          </div>
        )}
      </div>

      {/* ===== CONTENT SECTION ===== */}
      <div className="p-3 sm:p-3.5 flex flex-col flex-1 text-right">
        {/* Name */}
        <h3
          className={`
            font-[Cairo] font-bold text-stone-900 leading-snug
            text-[0.9rem] sm:text-[1.02rem] line-clamp-2
            group-hover:text-[#D2000E] transition-colors duration-150
            ${unavailable ? "line-through text-stone-400" : ""}
          `}
        >
          {item.name}
        </h3>

        {/* Ingredients */}
        {item.ingredients ? (
          <p
            className={`
              mt-1 font-[Cairo] font-normal text-stone-500 leading-relaxed
              text-[0.7rem] sm:text-[0.76rem] line-clamp-2
              ${unavailable ? "text-stone-400" : ""}
            `}
          >
            {item.ingredients}
          </p>
        ) : null}

        {/* Sizes badge */}
        {hasMultiplePrices && (
          <div className="mt-auto pt-2 flex justify-start">
            <span className="text-[9px] sm:text-[10px] font-semibold text-amber-900 bg-amber-100/90 border border-amber-200 px-1.5 py-0.5 rounded-md font-[Cairo]">
              {rawPrices.length} أحجام
            </span>
          </div>
        )}
      </div>
    </article>
  );
}

const ItemRow = memo(ItemRowComponent);
export default ItemRow;