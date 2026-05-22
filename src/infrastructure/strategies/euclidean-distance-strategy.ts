import type { FaceMatchingStrategy } from "@/core/services/face-matching-strategy";

/**
 * Default strategy used by face-api.js.
 *
 * Threshold 0.55 — a balance point. Tighter than the face-api default of 0.6
 * (because we now average over multiple frames client-side, so descriptors
 * are cleaner and we can be a bit stricter), but loose enough that legitimate
 * users don't get rejected when lighting or angle changes between sessions.
 */
export class EuclideanDistanceStrategy implements FaceMatchingStrategy {
  readonly name = "euclidean";
  readonly defaultThreshold = 0.55;

  distance(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error(
        `Descriptor length mismatch: ${a.length} vs ${b.length}`
      );
    }
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
      const diff = a[i] - b[i];
      sum += diff * diff;
    }
    return Math.sqrt(sum);
  }
}