"use client";

import * as faceapi from "face-api.js";

/**
 * Loads face-api.js models from /public/models. Models are cached at the
 * module level so repeated calls (across page navigations) are no-ops.
 */

const MODEL_URL = "/models";
let loadPromise: Promise<void> | null = null;

export function loadFaceApiModels(): Promise<void> {
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    ]);
  })();

  // Reset on error so the next attempt can retry.
  loadPromise.catch(() => {
    loadPromise = null;
  });

  return loadPromise;
}

export interface DetectionResult {
  descriptor: number[];
  detection: faceapi.FaceDetection;
  /** Bounding box area as fraction of frame area — proxy for closeness. */
  faceArea: number;
  /** Detector confidence score (0..1). */
  score: number;
}

/**
 * Detects the most prominent face in a video frame and returns its 128-d
 * descriptor. Returns null if no face is found, or if quality is too low.
 *
 * Quality gates:
 *  - minConfidence 0.6 (was 0.5) — reject low-confidence detections
 *  - face must occupy at least ~5% of the frame — too small = unreliable
 */
export async function detectFaceDescriptor(
  video: HTMLVideoElement
): Promise<DetectionResult | null> {
  const result = await faceapi
    .detectSingleFace(
      video,
      new faceapi.SsdMobilenetv1Options({ minConfidence: 0.6 })
    )
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!result) return null;

  const box = result.detection.box;
  const frameArea = (video.videoWidth || 640) * (video.videoHeight || 480);
  const faceArea = (box.width * box.height) / frameArea;

  // Reject if the face is too small (likely background person or far away).
  if (faceArea < 0.05) return null;

  return {
    descriptor: Array.from(result.descriptor),
    detection: result.detection,
    faceArea,
    score: result.detection.score,
  };
}

/**
 * Multi-frame averaging — captures `frames` descriptors over `durationMs` and
 * returns their L2-normalised average. This dramatically reduces noise vs a
 * single snapshot, especially under variable lighting or head motion.
 *
 * Strategy:
 *  1. Sample N frames with a small interval between them
 *  2. Discard any frame where no face is detected
 *  3. Require at least `minFrames` valid samples (else return null)
 *  4. Average element-wise, then L2-normalise (preserves cosine semantics)
 */
export async function captureAveragedDescriptor(
  video: HTMLVideoElement,
  options: {
    frames?: number;
    intervalMs?: number;
    minFrames?: number;
  } = {}
): Promise<{ descriptor: number[]; samples: number; avgScore: number } | null> {
  const frames = options.frames ?? 5;
  const intervalMs = options.intervalMs ?? 120;
  const minFrames = options.minFrames ?? 3;

  const collected: { descriptor: number[]; score: number }[] = [];

  for (let i = 0; i < frames; i++) {
    const detection = await detectFaceDescriptor(video);
    if (detection) {
      collected.push({
        descriptor: detection.descriptor,
        score: detection.score,
      });
    }
    // Pause between frames so the camera can settle on a different image.
    if (i < frames - 1) {
      await new Promise((r) => setTimeout(r, intervalMs));
    }
  }

  if (collected.length < minFrames) return null;

  // Element-wise mean.
  const dim = collected[0].descriptor.length;
  const avg = new Array<number>(dim).fill(0);
  for (const c of collected) {
    for (let j = 0; j < dim; j++) {
      avg[j] += c.descriptor[j];
    }
  }
  for (let j = 0; j < dim; j++) avg[j] /= collected.length;

  // L2-normalise so distances stay comparable to single-frame descriptors.
  let norm = 0;
  for (let j = 0; j < dim; j++) norm += avg[j] * avg[j];
  norm = Math.sqrt(norm) || 1;
  // face-api descriptors are already roughly unit-length, so we keep the
  // same scale by dividing by norm only if it deviates noticeably.
  for (let j = 0; j < dim; j++) avg[j] /= norm;

  const avgScore =
    collected.reduce((sum, c) => sum + c.score, 0) / collected.length;

  return { descriptor: avg, samples: collected.length, avgScore };
}

export { faceapi };