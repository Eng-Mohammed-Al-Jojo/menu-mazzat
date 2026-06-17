import ItemRow from "./ItemRow";
import type { Category, Item } from "./Menu";

interface Props {
  category: Category;
  items: Item[];
  onImageClick?: (item: Item) => void;
}

export default function CategorySection({ category, items, onImageClick }: Props) {
  return (
    <section className="mb-12 px-0 md:px-0 text-black">
      {/* عنوان القسم */}
      <div className="mb-12 flex items-center gap-4 w-full">
        <h2
          className="
            font-[Almarai] font-extrabold text-[#D2000E]
            drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)]
            tracking-wide uppercase
            whitespace-nowrap
            text-[clamp(1.4rem,5vw,3rem)]
          "
        >
          {category.name}
        </h2>

        {/* الخط الذهبي */}
        <span className="flex-1 h-1 bg-linear-to-r from-[#FCD451] via-[#D2000E] to-[#FCD451] rounded-full shadow-lg" />
      </div>

      {/* قائمة الأصناف */}
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <ItemRow key={item.id} item={item} onImageClick={onImageClick} />
        ))}
      </div>
    </section>
  );
}
