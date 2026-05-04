import { ChecklistCard } from "@/components/checklists/checklist-card";
import type { Checklist } from "@/types";

interface ChecklistListProps {
  checklists: Checklist[];
}

export function ChecklistList({ checklists }: ChecklistListProps) {
  if (checklists.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-zinc-300 px-4 py-8 text-center text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
        Nog geen checklists. Maak er een aan om te beginnen.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {checklists.map((c) => (
        <li key={c.id}>
          <ChecklistCard checklist={c} />
        </li>
      ))}
    </ul>
  );
}
