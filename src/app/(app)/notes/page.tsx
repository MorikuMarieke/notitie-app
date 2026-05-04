import { NoteList } from "@/components/notes/note-list";
import { NotesToolbar } from "@/components/notes/notes-toolbar";
import { noteContentSearchText } from "@/lib/html/note-content";
import { mapNoteRow, type NoteRowDb } from "@/lib/notes/map-note-row";
import { createClient } from "@/lib/supabase/server";
import type { NoteWithCategory } from "@/types";
import Link from "next/link";

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("notes")
    .select(
      "id, user_id, title, content, created_at, updated_at, category_id, categories ( id, name )",
    )
    .order("updated_at", { ascending: false });

  if (category) {
    query = query.eq("category_id", category);
  }

  const { data: rows, error } = await query;

  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
        Kon notities niet laden: {error.message}
      </div>
    );
  }

  let notes: NoteWithCategory[] = (rows as NoteRowDb[] | null)?.map(mapNoteRow) ?? [];

  const needle = q?.trim().toLowerCase();
  if (needle) {
    notes = notes.filter(
      (n) =>
        n.title.toLowerCase().includes(needle) ||
        noteContentSearchText(n.content).includes(needle),
    );
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name", { ascending: true });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Notities</h1>
        <Link
          href="/notes/new"
          className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Nieuwe notitie
        </Link>
      </div>
      <NotesToolbar
        categories={categories ?? []}
        q={q ?? ""}
        categoryId={category ?? ""}
      />
      <NoteList notes={notes} />
    </div>
  );
}
