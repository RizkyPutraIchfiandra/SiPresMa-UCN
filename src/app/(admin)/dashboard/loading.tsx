import { Shimmer } from "@/components/layout/page-skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50/30 via-white to-white">
      <div className="sticky top-0 z-30 border-b border-teal-100 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex h-[72px] items-center justify-between">
            <div className="flex items-center gap-3">
              <Shimmer className="h-10 w-10 rounded-2xl" />
              <div className="space-y-1.5">
                <Shimmer className="h-3 w-28" />
                <Shimmer className="h-2 w-20" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shimmer className="h-10 w-10 rounded-full" />
              <Shimmer className="h-9 w-24 rounded-full" />
            </div>
          </div>
          <div className="flex gap-1 pb-1">
            <Shimmer className="h-10 w-28" />
            <Shimmer className="h-10 w-24" />
            <Shimmer className="h-10 w-32" />
          </div>
        </div>
      </div>
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="space-y-8">
          <div className="space-y-3">
            <Shimmer className="h-3 w-24" />
            <Shimmer className="h-10 w-72" />
            <Shimmer className="h-4 w-96" />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Shimmer className="h-32 rounded-2xl" />
            <Shimmer className="h-32 rounded-2xl" />
            <Shimmer className="h-32 rounded-2xl" />
          </div>
          <Shimmer className="h-80 rounded-2xl" />
        </div>
      </main>
    </div>
  );
}