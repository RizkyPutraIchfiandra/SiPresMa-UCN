import { cn } from "@/lib/utils";

/**
 * Reusable shimmering skeleton primitives. Used across loading.tsx files
 * so route transitions feel instant — the user always sees structure first,
 * even before the real page has finished compiling/rendering.
 */
export function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-slate-200/70",
        "after:absolute after:inset-0 after:-translate-x-full",
        "after:bg-gradient-to-r after:from-transparent after:via-white/60 after:to-transparent",
        "after:animate-[shimmer_1.6s_infinite]",
        className
      )}
    />
  );
}

/** Header skeleton mirroring the real SiteHeader so layout doesn't shift. */
export function HeaderSkeleton({ light = false }: { light?: boolean }) {
  return (
    <div
      className={cn(
        "sticky top-0 z-40 w-full border-b backdrop-blur-xl",
        light ? "border-white/10 bg-slate-900/70" : "border-teal-100 bg-white/80"
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Shimmer className="h-10 w-10 rounded-2xl" />
          <div className="space-y-1.5">
            <Shimmer className="h-3 w-28" />
            <Shimmer className="h-2 w-20" />
          </div>
        </div>
        <Shimmer className="h-9 w-32 rounded-full" />
      </div>
    </div>
  );
}

/** Generic centered page skeleton with header. */
export function PageSkeleton({
  height = "min-h-[60vh]",
}: { height?: string }) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-cyan-50/30 via-white to-white">
      <HeaderSkeleton />
      <main className={cn("flex flex-1 items-center justify-center px-6", height)}>
        <div className="w-full max-w-3xl space-y-6">
          <div className="flex flex-col items-center gap-4">
            <Shimmer className="h-3 w-32" />
            <Shimmer className="h-12 w-3/4" />
            <Shimmer className="h-4 w-2/3" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Shimmer className="h-32 rounded-2xl" />
            <Shimmer className="h-32 rounded-2xl" />
          </div>
        </div>
      </main>
    </div>
  );
}