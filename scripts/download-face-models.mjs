// Downloads the face-api.js weights into /public/models.
// Usage: `node scripts/download-face-models.mjs`

import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const BASE =
  "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights";

const FILES = [
  // SsdMobilenetv1
  "ssd_mobilenetv1_model-weights_manifest.json",
  "ssd_mobilenetv1_model-shard1",
  "ssd_mobilenetv1_model-shard2",
  // FaceLandmark68Net
  "face_landmark_68_model-weights_manifest.json",
  "face_landmark_68_model-shard1",
  // FaceRecognitionNet
  "face_recognition_model-weights_manifest.json",
  "face_recognition_model-shard1",
  "face_recognition_model-shard2",
];

const outDir = path.join(process.cwd(), "public", "models");
if (!existsSync(outDir)) {
  await mkdir(outDir, { recursive: true });
}

for (const file of FILES) {
  const url = `${BASE}/${file}`;
  const dest = path.join(outDir, file);
  process.stdout.write(`Downloading ${file}... `);
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`FAILED (${res.status})`);
    process.exit(1);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(dest, buf);
  console.log("ok");
}

console.log(`\nDone. Files saved to ${outDir}`);