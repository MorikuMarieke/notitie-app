"use client";

interface ChecklistCompletedToggleProps {
  visible: boolean;
  onToggle: () => void;
}

export function ChecklistCompletedToggle({ visible, onToggle }: ChecklistCompletedToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 sm:text-sm"
      aria-pressed={visible}
      aria-label={visible ? "Afgeronde items verbergen" : "Afgeronde items tonen"}
    >
      {visible ? "Verberg afgeronde" : "Toon afgeronde"}
    </button>
  );
}
