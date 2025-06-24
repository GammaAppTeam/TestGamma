
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: string[];
  selected: string;
  onSelect: (cat: string) => void;
}

const CategoryFilter = ({ categories, selected, onSelect }: CategoryFilterProps) => (
  <div className="flex flex-wrap gap-2 mb-4">
    {categories.map((cat) => (
      <button
        key={cat}
        className={cn(
          "px-4 py-1 text-sm rounded-full border transition-colors font-medium focus:outline-none",
          selected === cat
            ? "bg-primary text-primary-foreground border-primary shadow"
            : "bg-background text-muted-foreground border-muted hover:bg-muted"
        )}
        onClick={() => onSelect(cat)}
        aria-pressed={selected === cat}
      >
        {cat}
      </button>
    ))}
  </div>
);

export default CategoryFilter;
