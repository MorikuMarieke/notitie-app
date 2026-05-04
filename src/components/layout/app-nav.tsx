import Link from "next/link";

export function AppNav() {
  return (
    <nav className="flex flex-wrap gap-4 text-sm font-medium">
      <Link
        href="/notes"
        className="text-zinc-700 underline-offset-4 hover:text-zinc-950 hover:underline dark:text-zinc-300 dark:hover:text-white"
      >
        Notities
      </Link>
      <Link
        href="/categories"
        className="text-zinc-700 underline-offset-4 hover:text-zinc-950 hover:underline dark:text-zinc-300 dark:hover:text-white"
      >
        Categorieën
      </Link>
    </nav>
  );
}
