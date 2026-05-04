import { ChecklistNewForm } from "@/components/checklists/checklist-new-form";
import Link from "next/link";

export default function NewChecklistPage() {
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Nieuwe checklist</h1>
        <Link
          href="/checklists"
          className="text-sm font-medium text-zinc-600 underline-offset-4 hover:text-zinc-950 hover:underline dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          Terug naar overzicht
        </Link>
      </div>
      <ChecklistNewForm />
    </div>
  );
}
