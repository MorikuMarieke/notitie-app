"use client";

import { createCategory, type ActionResult } from "@/lib/actions/categories";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

const initial: ActionResult = { error: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      aria-label={pending ? "Bezig met toevoegen" : "Categorie toevoegen"}
    >
      {pending ? "Bezig…" : "Toevoegen"}
    </button>
  );
}

export function CategoryForm() {
  const [state, formAction] = useActionState(createCategory, initial);

  return (
    <form action={formAction} className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1 space-y-1">
          <label htmlFor="new-category-name" className="block text-sm font-medium">
            Nieuwe categorie
          </label>
          <input
            id="new-category-name"
            name="name"
            type="text"
            required
            placeholder="Bijv. Werk, Studie…"
            className="block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-950"
          />
        </div>
        <SubmitButton />
      </div>
      {state.error ? (
        <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
      ) : null}
    </form>
  );
}
