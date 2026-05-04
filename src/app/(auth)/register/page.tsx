import { RegisterForm } from "@/components/auth/register-form";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect("/notes");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Registreren</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Heb je al een account?{" "}
          <Link
            href="/login"
            className="font-medium text-zinc-950 underline underline-offset-4 dark:text-zinc-50"
          >
            Inloggen
          </Link>
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}
