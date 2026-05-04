import type { Category } from "@/types";

interface NotesToolbarProps {
  categories: Pick<Category, "id" | "name">[];
  q: string;
  categoryId: string;
}

export function NotesToolbar({ categories, q, categoryId }: NotesToolbarProps) {
  return (
    <form
      method="get"
      action="/notes"
      className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40 sm:flex-row sm:flex-wrap sm:items-end"
    >
      <div className="min-w-0 flex-1 space-y-1">
        <label htmlFor="q" className="block text-sm font-medium">
          Zoeken
        </label>
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Titel of inhoud…"
          className="block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-950"
        />
      </div>
      <div className="w-full space-y-1 sm:w-56">
        <label htmlFor="category" className="block text-sm font-medium">
          Categorie
        </label>
        <select
          id="category"
          name="category"
          defaultValue={categoryId}
          className="block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-950"
        >
          <option value="">Alle categorieën</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        aria-label="Zoeken en filter toepassen"
      >
        Toepassen
      </button>
    </form>
  );
}
