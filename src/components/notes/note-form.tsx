"use client";

import { CategorySelect } from "@/components/notes/category-select";
import { RichTextEditor } from "@/components/notes/rich-text-editor";
import { createNote, updateNote, type NoteActionResult } from "@/lib/actions/notes";
import { prepareEditorInitialHtml } from "@/lib/html/note-content";
import type { Category, NoteWithCategory } from "@/types";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

interface NoteFormProps {
  categories: Pick<Category, "id" | "name">[];
  note?: NoteWithCategory;
}

const initial: NoteActionResult = { error: null };

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      aria-label={pending ? "Bezig met opslaan" : label}
    >
      {pending ? "Bezig…" : label}
    </button>
  );
}

export function NoteForm({ categories, note }: NoteFormProps) {
  const isEdit = Boolean(note);
  const action = isEdit ? updateNote : createNote;
  const [state, formAction] = useActionState(action, initial);
  const editorHtml = prepareEditorInitialHtml(note?.content ?? "");

  return (
    <form action={formAction} className="space-y-6">
      {state.error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          {state.error}
        </p>
      ) : null}
      {isEdit ? <input type="hidden" name="id" value={note!.id} /> : null}
      <div className="space-y-1">
        <label htmlFor="title" className="block text-sm font-medium">
          Titel
        </label>
        <input
          id="title"
          name="title"
          type="text"
          defaultValue={note?.title ?? ""}
          className="block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-950"
        />
      </div>
      <CategorySelect
        categories={categories}
        defaultCategoryId={note?.category_id ?? null}
      />
      <div className="space-y-1">
        <label htmlFor="content" className="block text-sm font-medium">
          Inhoud
        </label>
        <RichTextEditor key={note?.id ?? "new"} defaultHtml={editorHtml} name="content" />
      </div>
      <div className="flex flex-wrap gap-3">
        <SubmitButton label={isEdit ? "Wijzigingen opslaan" : "Notitie opslaan"} />
      </div>
    </form>
  );
}
