import { HeaderSkeleton, Shimmer } from "@/components/layout/page-skeleton";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-cyan-50/30 via-white to-white">
      <HeaderSkeleton />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-3xl space-y-8 px-4 py-12 sm:px-6">
          <div className="flex flex-col items-center gap-3">
            <Shimmer className="h-3 w-40" />
            <Shimmer className="h-12 w-3/4" />
            <Shimmer className="h-4 w-2/3" />
          </div>
          <Shimmer className="aspect-[4/3] w-full rounded-2xl" />
        </div>
      </main>
    </div>
  );
}