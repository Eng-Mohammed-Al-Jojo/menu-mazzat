import { memo } from "react";
import ItemRow from "./ItemRow";
import type { Category, Item } from "./Menu";

interface Props {
  category: Category;
  items: Item[];
  onImageClick?: (item: Item) => void;
}

function CategorySectionComponent({ category, items, onImageClick }: Props) {
  if (!items || items.length === 0) return null;

  return (
    <section className="mb-10 px-0 md:px-0 text-black">
      {/* Section Header */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          {/* Decorative luxury accent bar */}
          <span className="w-1.5 h-7 sm:h-8 bg-gradient-to-b from-[#D2000E] to-[#9B111E] rounded-full shadow-xs" />
          <h2 className="
            font-[Cairo] font-extrabold text-[#7a0c12]
            tracking-tight
            whitespace-nowrap
            text-[clamp(1.25rem,3.5vw,1.85rem)]
            drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]
          ">
            {category.name}
          </h2>
        </div>

        {/* Golden Luxury Divider Line */}
        <div className="flex-1 flex items-center gap-2">
          <div className="flex-1 h-[2px] bg-gradient-to-l from-transparent via-[#D2000E]/25 to-[#D2000E]/40 rounded-full" />
          <span className="w-2 h-2 rounded-full bg-[#D2000E]/50 shrink-0" />
        </div>
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

const CategorySection = memo(CategorySectionComponent);
export default CategorySection;