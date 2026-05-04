export type { Checklist, ChecklistItem, ChecklistWithItems } from "./checklist";
export { NOTE_CHECKLIST, type NoteChecklistClassName } from "./legacy-note-checklist-html";

export interface Category {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}

export interface Note {
  id: string;
  user_id: string;
  category_id: string | null;
  title: string;
  /** Rich text (subset-HTML); legacy embedded checklists worden nog weergegeven. */
  content: string;
  created_at: string;
  updated_at: string;
}

export type NoteWithCategory = Note & {
  category: Pick<Category, "id" | "name"> | null;
};
