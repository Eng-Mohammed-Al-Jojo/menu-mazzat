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
        ${unavailable ? "opacity-60 blur-sm" : "hover:scale-105"}
      `}
    >
      <div
        className={`
          relative
          rounded-4xl
          px-5 py-3
          flex items-center justify-between gap-6
          bg-linear-to-r from-[#FDE68A] to-[#FCD451]
          border-2 border-yellow-400/40
          shadow-inner shadow-yellow-300/30
          transition-all duration-500
          font-[Almarai] font-bold      /* تطبيق خط Cairo على كل النصوص داخل الكرت */
        `}
      >
        {/* Glow effect */}
        {!unavailable && (
          <div className="absolute inset-0 rounded-4xl bg-yellow-300/10 animate-pulse z-0"></div>
        )}

        {/* Name + Ingredients */}
        <div className="flex-1 min-w-0 relative z-10">
          <h3
            className={`
              text-lg md:text-xl 
              font-extrabold
              ${unavailable
                ? "line-through text-black/40 font-extralight"
                : "bg-linear-to-r from-yellow-900 to-yellow-700 bg-clip-text text-transparent font-bold"
              }
            `}
          >
            {item.name}
          </h3>

          {item.ingredients && (
            <p
              className={`
                mt-1 text-xs md:text-md font-[Almarai] font-regular
                ${unavailable
                  ? "line-through text-black/70"
                  : "text-black/60"
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
    flex items-center relative z-10 font-[Almarai] font-bold text-md md:text-lg
    ${unavailable ? "line-through text-black/40" : "text-black/80"}
  `}
        >
          {prices.map((p, i) => (
            <span key={i} className="flex items-center">
              {p.trim()}₪
              {i !== prices.length - 1 && (
                <span className="mx-1 text-black/50">|</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
