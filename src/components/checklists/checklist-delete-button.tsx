"use client";

import { deleteChecklist } from "@/lib/actions/checklists";

interface ChecklistDeleteButtonProps {
  checklistId: string;
}

export function ChecklistDeleteButton({ checklistId }: ChecklistDeleteButtonProps) {
  return (
    <form
      action={deleteChecklist}
      onSubmit={(e) => {
        if (!confirm("Deze checklist permanent verwijderen?")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={checklistId} />
      <button
        type="submit"
        className="rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950"
        aria-label="Checklist verwijderen"
      >
        Verwijderen
      </button>
    </form>
  );
}
