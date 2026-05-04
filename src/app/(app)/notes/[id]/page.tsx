import { NoteDeleteButton } from "@/components/notes/note-delete-button";
import { NoteForm } from "@/components/notes/note-form";
import { mapNoteRow, type NoteRowDb } from "@/lib/notes/map-note-row";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";

interface NotePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditNotePage({ params }: NotePageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: row, error } = await supabase
    .from("notes")
    .select(
      "id, user_id, title, content, created_at, updated_at, category_id, categories ( id, name )",
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !row) {
    notFound();
  }

  const note = mapNoteRow(row as NoteRowDb);

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name", { ascending: true });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Notitie bewerken</h1>
          <Link
            href="/notes"
            className="text-sm font-medium text-zinc-600 underline-offset-4 hover:text-zinc-950 hover:underline dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            Terug naar overzicht
          </Link>
        </div>
        <NoteDeleteButton noteId={note.id} />
      </div>
      <NoteForm categories={categories ?? []} note={note} />
    </div>
  );
}
