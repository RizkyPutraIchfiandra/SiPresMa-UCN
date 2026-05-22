"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/users", label: "Users", icon: Users },
  { href: "/dashboard/attendance", label: "Attendance", icon: Calendar },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto pb-1">
      {NAV.map((item) => {
        const Icon = item.icon;
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex items-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-medium tracking-wide transition-colors",
              active
                ? "text-teal-700"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
            {active && (
              <span className="absolute inset-x-4 -bottom-px h-px bg-gradient-to-r from-cyan-400 to-teal-600" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}