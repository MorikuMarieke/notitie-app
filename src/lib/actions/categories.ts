"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ActionResult = { error: string | null };

export async function createCategory(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    return { error: "Categorienaam is verplicht." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Niet ingelogd." };
  }

  const { error } = await supabase
    .from("categories")
    .insert({ user_id: user.id, name });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/categories");
  revalidatePath("/notes");
  return { error: null };
}

export async function updateCategory(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  if (!id || !name) {
    return;
  }

  const supabase = await createClient();
  const { error } = await supabase.from("categories").update({ name }).eq("id", id);

  if (error) {
    console.error(error.message);
    return;
  }

  revalidatePath("/categories");
  revalidatePath("/notes");
}

export async function deleteCategory(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return;
  }

  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    console.error(error.message);
    return;
  }

  revalidatePath("/categories");
  revalidatePath("/notes");
}
