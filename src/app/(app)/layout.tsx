import { AppHeader } from "@/components/layout/app-header";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AppShellLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-full flex-col">
      <AppHeader email={user.email ?? ""} />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
