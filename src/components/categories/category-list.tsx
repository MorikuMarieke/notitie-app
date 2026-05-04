import { CategoryRow } from "@/components/categories/category-row";
import type { Category } from "@/types";

interface CategoryListProps {
  categories: Category[];
}

export function CategoryList({ categories }: CategoryListProps) {
  if (categories.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-zinc-300 px-4 py-8 text-center text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
        Nog geen categorieën. Voeg hieronder een eerste categorie toe.
      </p>
    );
  }

  return (
    <ul>
      {categories.map((c) => (
        <CategoryRow key={c.id} category={c} />
      ))}
    </ul>
  );
}
