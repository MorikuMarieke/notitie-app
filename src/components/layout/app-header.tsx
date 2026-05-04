import { AppNav } from "@/components/layout/app-nav";
import { SignOutButton } from "@/components/layout/sign-out-button";

interface AppHeaderProps {
  email: string;
}

export function AppHeader({ email }: AppHeaderProps) {
  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Notitie-app
          </p>
          <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
            {email}
          </p>
          <AppNav />
        </div>
        <SignOutButton />
      </div>
    </header>
  );
}
