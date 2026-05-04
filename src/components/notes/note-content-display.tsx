import { noteContentHasDisplayableBody, sanitizeNoteHtml } from "@/lib/html/note-content";
import {
  htmlWithDisabledChecklistInputs,
  NOTE_CHECKLIST_CONTENT_TW,
} from "@/lib/html/note-checklist";

interface NoteContentDisplayProps {
  html: string;
  className?: string;
}

/** Server-safe weergave van opgeslagen (subset) HTML. */
export function NoteContentDisplay({ html, className = "" }: NoteContentDisplayProps) {
  if (!noteContentHasDisplayableBody(html)) {
    return null;
  }
  const safe = sanitizeNoteHtml(html);
  const toRender = htmlWithDisabledChecklistInputs(safe);
  return (
    <div
      className={`max-w-none break-words text-sm leading-relaxed text-zinc-800 dark:text-zinc-100 [&_b]:font-semibold [&_strong]:font-semibold [&_em]:italic [&_i]:italic [&_u]:underline [&_s]:line-through [&_strike]:line-through [&_del]:line-through [&_li]:my-0.5 [&_li]:list-item [&_ol]:my-2 [&_ol]:ml-6 [&_ol]:list-decimal [&_ol]:pl-1 [&_p]:my-2 [&_ul]:my-2 [&_ul]:ml-6 [&_ul]:list-disc [&_ul]:pl-1 [&_.note-checklist-input]:cursor-default ${NOTE_CHECKLIST_CONTENT_TW} ${className}`}
      dangerouslySetInnerHTML={{ __html: toRender }}
    />
  );
}
