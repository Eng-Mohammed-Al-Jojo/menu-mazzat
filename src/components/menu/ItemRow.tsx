import { type Item } from "./Menu";

interface Props {
  item: Item;
}

export default function ItemRow({ item }: Props) {
  const prices = String(item.price).split(",");
  const unavailable = item.visible === false;

  return (
    <div
      className={`
        rounded-3xl p-0.5
        transition-all duration-300
        ${unavailable ? "opacity-60" : "hover:scale-105"}
      `}
    >
      <div
        className={`
          relative rounded-4xl px-5 py-3
          flex items-center justify-between gap-6
          bg-linear-to-r from-[#FDE68A] to-[#FCD451]
          border-2 border-yellow-400/40
          shadow-inner shadow-yellow-300/30
          transition-all duration-500
          font-[Almarai] font-bold
          ${unavailable ? "pointer-events-none" : ""}
        `}
      >
        {/* Glow فقط للمتوفر */}
        {!unavailable && (
          <div className="absolute inset-0 rounded-4xl bg-yellow-300/10 animate-pulse z-0"></div>
        )}

        {/* Name + Ingredients */}
        <div className="flex-1 min-w-0 relative z-10">
          <h3
            className={`
              text-lg md:text-xl font-extrabold
              bg-linear-to-r from-yellow-900 to-yellow-700 bg-clip-text text-transparent
              ${unavailable
                ? "line-through decoration-black/40 decoration-2"
                : ""
              }
            `}
          >
            {item.name}
          </h3>

          {item.ingredients && (
            <p
              className={`
                mt-1 text-xs md:text-md text-black/60
                ${unavailable
                  ? "line-through decoration-black/30 decoration-1"
                  : ""
                }
              `}
            >
              {item.ingredients}
            </p>
          )}
        </div>

        {/* Price */}
        <div
          className={`
            flex items-center relative z-10 text-md md:text-lg text-black/80
            ${unavailable
              ? "line-through decoration-black/50 decoration-2"
              : ""
            }
          `}
        >
          {prices.map((p, i) => (
            <span key={i} className="flex items-center">
              {p.trim()}₪
              {i !== prices.length - 1 && (
                <span className="mx-1 text-black/40">|</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
