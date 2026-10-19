import ItemRow from "./ItemRow";
import type { Category, Item } from "./Menu";

interface Props {
  category: Category;
  items: Item[];
  onImageClick?: (item: Item) => void;
}

export default function CategorySection({ category, items, onImageClick }: Props) {
  return (
    <section className="mb-10 px-0 md:px-0 text-black">
      {/* Section Header */}
      <div className="mb-6 flex items-center gap-3 w-full">
        <h2 className="
          font-[Almarai] font-extrabold text-[#D2000E]
          drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)]
          tracking-wide uppercase
          whitespace-nowrap
          text-[clamp(1.3rem,4vw,2.5rem)]
        ">
          {category.name}
        </h2>

        {/* Golden Divider Line */}
        <span className="flex-1 h-1 bg-linear-to-r from-transparent via-[#FCD451] to-transparent rounded-full" />
      </div>

      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {items.map((item) => (
          <ItemRow key={item.id} item={item} onImageClick={onImageClick} />
        ))}
      </div>
    </section>
  );
}