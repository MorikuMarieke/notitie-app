import { NoteContentDisplay } from "@/components/notes/note-content-display";
import { NoteDeleteButton } from "@/components/notes/note-delete-button";
import { NoteForm } from "@/components/notes/note-form";
import { sanitizeNoteHtml, stripHtmlToText } from "@/lib/html/note-content";
import { mapNoteRow, type NoteRowDb } from "@/lib/notes/map-note-row";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";

interface NotePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ edit?: string }>;
}

export default async function EditNotePage({ params, searchParams }: NotePageProps) {
  const { id } = await params;
  const { edit } = await searchParams;
  const isEditing = edit === "1" || edit === "true";
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
  const hasReadableContent =
    stripHtmlToText(sanitizeNoteHtml(note.content))
      .replace(/\s+/g, " ")
      .trim().length > 0;

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name", { ascending: true });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {isEditing ? "Notitie bewerken" : note.title.trim() || "Notitie"}
          </h1>
          <Link
            href="/notes"
            className="text-sm font-medium text-zinc-600 underline-offset-4 hover:text-zinc-950 hover:underline dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            Terug naar overzicht
          </Link>
        </div>
        <NoteDeleteButton noteId={note.id} />
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <Link
            href={`/notes/${id}`}
            className="inline-flex text-sm font-medium text-zinc-600 underline-offset-4 hover:text-zinc-950 hover:underline dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            Terug naar weergave
          </Link>
          <NoteForm categories={categories ?? []} note={note} />
        </div>
      ) : (
        <div className="space-y-4">
          <article className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="sr-only">Inhoud</h2>
            {hasReadableContent ? (
              <NoteContentDisplay html={note.content} className="text-base" />
            ) : (
              <p className="text-sm italic text-zinc-500">Lege notitie</p>
            )}
          </article>
          <Link
            href={`/notes/${id}?edit=1`}
            className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            aria-label="Notitie bewerken"
          >
            Bewerken
          </Link>
        </div>
      )}
    </div>
  );
}
