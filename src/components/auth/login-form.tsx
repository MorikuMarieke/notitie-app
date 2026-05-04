"use client";

import { signIn } from "@/lib/actions/auth";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

interface LoginFormProps {
  urlError: string | null;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full justify-center rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      aria-label={pending ? "Bezig met inloggen" : "Inloggen"}
    >
      {pending ? "Bezig…" : "Inloggen"}
    </button>
  );
}

export function LoginForm({ urlError }: LoginFormProps) {
  const [state, formAction] = useActionState(signIn, {
    error: null,
    success: null,
  });

  return (
    <form action={formAction} className="space-y-4">
      {(state.error || urlError) && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          {state.error ?? urlError}
        </p>
      )}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-950"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium">
          Wachtwoord
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-950"
        />
      </div>
      <SubmitButton />
    </form>
  );
}
