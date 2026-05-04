import { signOut } from "@/lib/actions/auth";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-100 dark:hover:bg-zinc-800"
        aria-label="Uitloggen"
      >
        Uitloggen
      </button>
    </form>
  );
}
