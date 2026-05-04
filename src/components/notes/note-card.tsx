import { sanitizeNoteHtml, stripHtmlToText } from "@/lib/html/note-content";
import type { NoteWithCategory } from "@/types";
import Link from "next/link";

interface NoteCardProps {
  note: NoteWithCategory;
}

export function NoteCard({ note }: NoteCardProps) {
  const title = note.title.trim() || "Zonder titel";
  const safeHtml = sanitizeNoteHtml(note.content);
  const plain = stripHtmlToText(safeHtml).replace(/\s+/g, " ").trim();

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
      {plain ? (
        <div className="relative mt-2 max-h-[5.25rem] overflow-hidden text-sm text-zinc-700 dark:text-zinc-300">
          <div
            className="max-w-full break-words [&_b]:font-semibold [&_strong]:font-semibold [&_em]:italic [&_i]:italic [&_u]:underline [&_s]:line-through [&_strike]:line-through [&_del]:line-through [&_li]:my-0 [&_li]:list-item [&_ol]:my-0.5 [&_ol]:ml-4 [&_ol]:list-decimal [&_ol]:pl-1 [&_p]:my-0.5 [&_ul]:my-0.5 [&_ul]:ml-4 [&_ul]:list-disc [&_ul]:pl-1 [&_*]:break-words"
            dangerouslySetInnerHTML={{ __html: safeHtml }}
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-white to-transparent dark:from-zinc-950"
            aria-hidden
          />
        </div>
      ) : (
        <p className="mt-2 text-sm italic text-zinc-500">Lege notitie</p>
      )}
    </Link>
  );
}
