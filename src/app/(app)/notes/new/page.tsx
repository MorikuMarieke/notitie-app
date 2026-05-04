import { NoteForm } from "@/components/notes/note-form";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function NewNotePage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name", { ascending: true });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Nieuwe notitie</h1>
        <Link
          href="/notes"
          className="text-sm font-medium text-zinc-600 underline-offset-4 hover:text-zinc-950 hover:underline dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          Terug naar overzicht
        </Link>
      </div>
      <NoteForm categories={categories ?? []} />
    </div>
  );
}
