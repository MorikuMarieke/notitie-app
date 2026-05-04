"use client";

import { deleteNote } from "@/lib/actions/notes";

interface NoteDeleteButtonProps {
  noteId: string;
}

export function NoteDeleteButton({ noteId }: NoteDeleteButtonProps) {
  return (
    <form
      action={deleteNote}
      onSubmit={(e) => {
        if (!confirm("Deze notitie permanent verwijderen?")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={noteId} />
      <button
        type="submit"
        className="rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950"
        aria-label="Notitie verwijderen"
      >
        Verwijderen
      </button>
    </form>
  );
}
