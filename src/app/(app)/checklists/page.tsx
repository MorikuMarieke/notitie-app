import { ChecklistList } from "@/components/checklists/checklist-list";
import { createClient } from "@/lib/supabase/server";
import type { Checklist } from "@/types";
import Link from "next/link";

export default async function ChecklistsPage() {
  const supabase = await createClient();

  const { data: rows, error } = await supabase
    .from("checklists")
    .select("id, user_id, title, created_at, updated_at")
    .order("updated_at", { ascending: false });

  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
        Kon checklists niet laden: {error.message}
      </div>
    );
  }

  const checklists = (rows ?? []) as Checklist[];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Checklists</h1>
        <Link
          href="/checklists/new"
          className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Nieuwe checklist
        </Link>
      </div>
      <ChecklistList checklists={checklists} />
    </div>
  );
}
