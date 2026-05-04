import { LoginForm } from "@/components/auth/login-form";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect("/notes");
  }

  const params = await searchParams;
  const urlError =
    params.error === "auth"
      ? "Inloggen via link is mislukt. Probeer opnieuw."
      : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Inloggen</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Nog geen account?{" "}
          <Link
            href="/register"
            className="font-medium text-zinc-950 underline underline-offset-4 dark:text-zinc-50"
          >
            Registreren
          </Link>
        </p>
      </div>
      <LoginForm urlError={urlError} />
    </div>
  );
}
