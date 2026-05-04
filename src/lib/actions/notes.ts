"use server";

import { createClient } from "@/lib/supabase/server";
import { isEmptyNoteContent, sanitizeNoteHtml } from "@/lib/html/note-content";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type NoteActionResult = { error: string | null };

function readCategoryId(formData: FormData): string | null {
  const raw = String(formData.get("category_id") ?? "").trim();
  return raw === "" ? null : raw;
}

export async function createNote(
  _prev: NoteActionResult,
  formData: FormData,
): Promise<NoteActionResult> {
  const title = String(formData.get("title") ?? "");
  const rawContent = String(formData.get("content") ?? "");
  const content = sanitizeNoteHtml(rawContent);
  const category_id = readCategoryId(formData);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Niet ingelogd." };
  }

  if (isEmptyNoteContent(content)) {
    return {
      error: "Inhoud mag niet leeg zijn (alleen spaties of lege opmaak telt ook als leeg).",
    };
  }

  const { error } = await supabase.from("notes").insert({
    user_id: user.id,
    title,
    content,
    category_id,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/notes");
  redirect("/notes");
}

export async function updateNote(
  _prev: NoteActionResult,
  formData: FormData,
): Promise<NoteActionResult> {
  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "");
  const rawContent = String(formData.get("content") ?? "");
  const content = sanitizeNoteHtml(rawContent);
  const category_id = readCategoryId(formData);

  if (!id) {
    return { error: "Ontbrekende notitie." };
  }

  if (isEmptyNoteContent(content)) {
    return {
      error: "Inhoud mag niet leeg zijn (alleen spaties of lege opmaak telt ook als leeg).",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("notes")
    .update({ title, content, category_id })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/notes");
  revalidatePath(`/notes/${id}`);
  redirect(`/notes/${id}`);
}

export async function deleteNote(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return;
  }

  const supabase = await createClient();
  const { error } = await supabase.from("notes").delete().eq("id", id);

  if (error) {
    console.error(error.message);
    return;
  }

  revalidatePath("/notes");
  redirect("/notes");
}
