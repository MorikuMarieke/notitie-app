import { deleteCategory, updateCategory } from "@/lib/actions/categories";
import type { Category } from "@/types";

interface CategoryRowProps {
  category: Category;
}

export function CategoryRow({ category }: CategoryRowProps) {
  return (
    <li className="flex flex-col gap-3 border-b border-zinc-200 py-4 last:border-b-0 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
      <form
        action={updateCategory}
        className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center"
      >
        <input type="hidden" name="id" value={category.id} />
        <input
          name="name"
          type="text"
          defaultValue={category.name}
          required
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 sm:max-w-md"
          aria-label={`Naam van categorie ${category.name}`}
        />
        <button
          type="submit"
          className="shrink-0 rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-100 dark:hover:bg-zinc-800"
          aria-label={`Wijzigingen voor ${category.name} opslaan`}
        >
          Opslaan
        </button>
      </form>
      <form action={deleteCategory}>
        <input type="hidden" name="id" value={category.id} />
        <button
          type="submit"
          className="rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950"
          aria-label={`Categorie ${category.name} verwijderen`}
        >
          Verwijderen
        </button>
      </form>
    </li>
  );
}
