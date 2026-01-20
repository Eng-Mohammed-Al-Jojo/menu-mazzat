import ItemRow from "./ItemRow";
import type { Category, Item } from "./Menu";

interface Props {
  category: Category;
  items: Item[];
}

export default function CategorySection({ category, items }: Props) {
  return (
    <section className="mb-20 px-4 md:px-0">
      {/* عنوان القسم */}
      <div className="mb-12 flex items-center gap-4">
        <h2 className="text-4xl md:text-6xl font-[Almarai] font-extrabold text-[#D2000E] drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)] tracking-wide uppercase">
          {category.name}
        </h2>
        {/* فاصل ذهبي لامع */}
        <span className="flex-1 h-1 bg-linear-to-r from-[#FCD451] via-[#D2000E] to-[#FCD451] rounded-full shadow-lg" />
      </div>

      {/* قائمة الأصناف */}
      <div className="flex flex-col gap-6">
        {items.map((item) => (
          <ItemRow key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
