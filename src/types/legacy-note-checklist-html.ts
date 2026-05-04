/**
 * Legacy embedded checklist markup inside {@link Note.content} (subset HTML).
 * Used only for sanitization and read-only display of older notes.
 */
export const NOTE_CHECKLIST = {
  ulClass: "note-checklist",
  liClass: "note-checklist-item",
  inputClass: "note-checklist-input",
  bodyClass: "note-checklist-body",
} as const;

export type NoteChecklistClassName =
  (typeof NOTE_CHECKLIST)[keyof typeof NOTE_CHECKLIST];
