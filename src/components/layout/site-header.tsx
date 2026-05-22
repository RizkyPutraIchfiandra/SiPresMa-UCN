"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScanFace } from "lucide-react";
import { LogoWithName } from "./logo";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Beranda" },
  { href: "/scan", label: "Presensi" },
  { href: "/register", label: "Daftar" },
  { href: "/panduan", label: "Panduan" },
];

interface SiteHeaderProps {
  variant?: "default" | "light";
}

export function SiteHeader({ variant = "default" }: SiteHeaderProps) {
  const pathname = usePathname();
  const isLight = variant === "light";

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b backdrop-blur-xl",
        isLight
          ? "border-white/10 bg-slate-900/70"
          : "border-teal-100 bg-white/80"
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="transition-opacity hover:opacity-80">
          <LogoWithName subtitle="Sistem Presensi Mahasiswa" variant={variant} />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative px-5 py-2 text-sm font-medium tracking-wide transition-colors",
                  active
                    ? isLight
                      ? "text-cyan-300"
                      : "text-teal-700"
                    : isLight
                      ? "text-slate-300 hover:text-white"
                      : "text-slate-600 hover:text-slate-900"
                )}
              >
                {item.label}
                {active && (
                  <span
                    className={cn(
                      "absolute inset-x-5 -bottom-px h-px",
                      isLight ? "bg-cyan-300" : "bg-teal-500"
                    )}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* CTA shortcut — bukan tombol admin. Admin masuk via /login langsung. */}
        <Link
          href="/scan"
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold tracking-wide transition-all",
            isLight
              ? "bg-white text-teal-700 hover:bg-cyan-50"
              : "bg-brand-gradient text-white shadow-md shadow-teal-500/30 hover:scale-[1.03]"
          )}
        >
          <ScanFace className="h-4 w-4" />
          <span className="hidden sm:inline">Absen Sekarang</span>
        </Link>
      </div>
    </header>
  );
}