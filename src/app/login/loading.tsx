import { Shimmer } from "@/components/layout/page-skeleton";

export default function Loading() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white p-4">
      <div className="pointer-events-none absolute -left-32 top-20 h-[420px] w-[420px] rounded-full bg-cyan-200/40 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-20 h-[480px] w-[480px] rounded-full bg-teal-200/40 blur-[140px]" />
      <div className="relative w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-3">
          <Shimmer className="h-16 w-16 rounded-2xl" />
          <Shimmer className="h-3 w-24" />
          <Shimmer className="h-8 w-48" />
          <Shimmer className="h-3 w-40" />
        </div>
        <Shimmer className="h-72 rounded-2xl" />
      </div>
    </main>
  );
}