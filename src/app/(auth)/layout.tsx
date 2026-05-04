export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-sm space-y-8">{children}</div>
    </div>
  );
}
