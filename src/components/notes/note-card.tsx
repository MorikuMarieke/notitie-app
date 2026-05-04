import type { NoteWithCategory } from "@/types";
import Link from "next/link";

interface NoteCardProps {
  note: NoteWithCategory;
}

export function NoteCard({ note }: NoteCardProps) {
  const title = note.title.trim() || "Zonder titel";
  const preview = note.content.trim().slice(0, 160);

  return (
    <Link
      href={`/notes/${note.id}`}
      className="block rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-zinc-300 hover:shadow dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          {title}
        </h2>
        {note.category ? (
          <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
            {note.category.name}
          </span>
        ) : null}
      </div>
      {preview ? (
        <p className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
          {preview}
          {note.content.length > 160 ? "…" : ""}
        </p>
      ) : (
        <p className="mt-2 text-sm italic text-zinc-500">Lege notitie</p>
      )}
    </Link>
  );
}
