/**
 * Strategy Pattern — pluggable face-similarity algorithms.
 *
 * The matching service depends on this interface, so swapping
 * Euclidean distance for cosine similarity (or anything else) is
 * a one-line change in the service factory.
 */
export interface FaceMatchingStrategy {
  /** Stable identifier for logging / debugging. */
  readonly name: string;

  /**
   * Returns a "distance" between two descriptors. Lower means more similar.
   * Implementations of similarity-style metrics (e.g. cosine) must invert
   * their score so that lower-is-better is preserved across strategies.
   */
  distance(a: number[], b: number[]): number;

  /** A reasonable default threshold for this metric. */
  readonly defaultThreshold: number;
}