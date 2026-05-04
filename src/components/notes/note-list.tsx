import { NoteCard } from "@/components/notes/note-card";
import type { NoteWithCategory } from "@/types";

interface NoteListProps {
  notes: NoteWithCategory[];
}

export function NoteList({ notes }: NoteListProps) {
  if (notes.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-zinc-300 px-4 py-8 text-center text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
        Geen notities gevonden. Maak een nieuwe notitie of pas je zoekfilter aan.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {notes.map((note) => (
        <li key={note.id}>
          <NoteCard note={note} />
        </li>
      ))}
    </ul>
  );
}
