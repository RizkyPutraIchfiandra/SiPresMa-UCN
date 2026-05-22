import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon,
  className,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "card-hover relative overflow-hidden border-teal-100 shadow-md shadow-teal-500/5",
        className
      )}
    >
      {/* Teal hairline at top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/60 to-transparent" />
      <CardContent className="flex items-start justify-between gap-4 p-6">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-700">
            {label}
          </p>
          <p className="mt-3 font-display text-4xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
          {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
        </div>
        {icon && (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-lg shadow-teal-500/30">
            {icon}
          </div>
        )}
      </CardContent>
    </Card>
  );
}