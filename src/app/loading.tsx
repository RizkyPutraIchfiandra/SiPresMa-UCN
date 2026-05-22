import { PageSkeleton } from "@/components/layout/page-skeleton";

/**
 * Root-level loading fallback. Next.js automatically renders this while
 * any route segment is suspending, giving the user instant visual feedback
 * on every page transition.
 */
export default function Loading() {
  return <PageSkeleton />;
}