"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type AuthMessageState = {
  error: string | null;
  success: string | null;
};

export async function signIn(
  _prev: AuthMessageState,
  formData: FormData,
): Promise<AuthMessageState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) {
    return { error: "E-mail en wachtwoord zijn verplicht.", success: null };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: error.message, success: null };
  }

  revalidatePath("/", "layout");
  redirect("/notes");
}

export async function signUp(
  _prev: AuthMessageState,
  formData: FormData,
): Promise<AuthMessageState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) {
    return { error: "E-mail en wachtwoord zijn verplicht.", success: null };
  }

  const supabase = await createClient();
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000";

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message, success: null };
  }

  return {
    error: null,
    success:
      "Account aangemaakt. Controleer je e-mail als bevestiging aan staat; anders kun je direct inloggen.",
  };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
