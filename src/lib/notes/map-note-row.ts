import type { NoteWithCategory } from "@/types";

/** Supabase row shape with embedded `categories` from select. */
export type NoteRowDb = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  category_id: string | null;
  categories: { id: string; name: string } | { id: string; name: string }[] | null;
};

function normalizeCategory(
  embedded: NoteRowDb["categories"],
): { id: string; name: string } | null {
  if (embedded == null) {
    return null;
  }
  if (Array.isArray(embedded)) {
    const first = embedded[0];
    return first ? { id: first.id, name: first.name } : null;
  }
  return { id: embedded.id, name: embedded.name };
}

export function mapNoteRow(row: NoteRowDb): NoteWithCategory {
  return {
    id: row.id,
    user_id: row.user_id,
    title: row.title,
    content: row.content,
    created_at: row.created_at,
    updated_at: row.updated_at,
    category_id: row.category_id,
    category: normalizeCategory(row.categories),
  };
}
