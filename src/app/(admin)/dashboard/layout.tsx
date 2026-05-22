import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LogoutButton } from "@/components/dashboard/logout-button";
import { LogoWithName } from "@/components/layout/logo";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login?callbackUrl=/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50/30 via-white to-white">
      <header className="sticky top-0 z-30 border-b border-teal-100 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex h-[72px] items-center justify-between">
            <Link
              href="/dashboard"
              className="transition-opacity hover:opacity-80"
            >
              <LogoWithName subtitle="Admin Console" />
            </Link>
            <div className="flex items-center gap-4 text-sm">
              <div className="hidden flex-col items-end leading-tight sm:flex">
                <span className="font-medium text-slate-900">
                  {session.user?.name}
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-teal-700">
                  Administrator
                </span>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gradient font-display text-sm font-bold text-white shadow-lg shadow-teal-500/30">
                {session.user?.name?.charAt(0).toUpperCase() ?? "A"}
              </div>
              <LogoutButton />
            </div>
          </div>
          <DashboardNav />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">{children}</main>
    </div>
  );
}