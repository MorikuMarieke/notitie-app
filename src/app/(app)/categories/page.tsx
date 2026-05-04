import { CategoryForm } from "@/components/categories/category-form";
import { CategoryList } from "@/components/categories/category-list";
import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/types";
import Link from "next/link";

export default async function CategoriesPage() {
  const supabase = await createClient();
  const { data: rows, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
        Kon categorieën niet laden: {error.message}
      </div>
    );
  }

  const categories = (rows ?? []) as Category[];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Categorieën</h1>
        <Link
          href="/notes"
          className="text-sm font-medium text-zinc-600 underline-offset-4 hover:text-zinc-950 hover:underline dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          Naar notities
        </Link>
      </div>
      <CategoryForm />
      <CategoryList categories={categories} />
    </div>
  );
}
