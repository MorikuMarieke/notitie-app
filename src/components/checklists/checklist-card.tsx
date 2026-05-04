import type { Checklist } from "@/types";
import Link from "next/link";

interface ChecklistCardProps {
  checklist: Checklist;
}

export function ChecklistCard({ checklist }: ChecklistCardProps) {
  const title = checklist.title.trim() || "Naamloze checklist";
  const updated = new Date(checklist.updated_at).toLocaleString("nl-NL", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <Link
      href={`/checklists/${checklist.id}`}
      className="block rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-zinc-300 hover:shadow dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
    >
      <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">{title}</h2>
      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Bijgewerkt {updated}</p>
    </Link>
  );
}
