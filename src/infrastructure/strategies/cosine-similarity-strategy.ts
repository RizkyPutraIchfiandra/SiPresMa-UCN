import type { FaceMatchingStrategy } from "@/core/services/face-matching-strategy";

/**
 * Cosine-similarity-based strategy. Returns `1 - cos(a, b)` so that
 * "lower is more similar" matches the Euclidean strategy contract.
 */
export class CosineSimilarityStrategy implements FaceMatchingStrategy {
  readonly name = "cosine";
  readonly defaultThreshold = 0.4;

  distance(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error(
        `Descriptor length mismatch: ${a.length} vs ${b.length}`
      );
    }

    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    const denom = Math.sqrt(normA) * Math.sqrt(normB);
    if (denom === 0) return 1;
    const similarity = dot / denom;
    return 1 - similarity;
  }
}