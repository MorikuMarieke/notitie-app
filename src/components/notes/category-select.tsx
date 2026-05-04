import type { Category } from "@/types";

interface CategorySelectProps {
  categories: Pick<Category, "id" | "name">[];
  defaultCategoryId: string | null;
}

export function CategorySelect({
  categories,
  defaultCategoryId,
}: CategorySelectProps) {
  return (
    <div className="space-y-1">
      <label htmlFor="category_id" className="block text-sm font-medium">
        Categorie
      </label>
      <select
        id="category_id"
        name="category_id"
        defaultValue={defaultCategoryId ?? ""}
        className="block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-950"
      >
        <option value="">Geen categorie</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
