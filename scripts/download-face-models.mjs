// Downloads the face-api.js weights into /public/models.
//
// This script is idempotent: it skips files that are already present and
// have non-zero size. That makes it safe to wire into `prebuild` so every
// production build (Vercel, Docker, etc.) automatically has the models.
//
// Manual usage: `node scripts/download-face-models.mjs`

import { mkdir, stat, writeFile } from "node:fs/promises";
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

let downloaded = 0;
let skipped = 0;

for (const file of FILES) {
  const dest = path.join(outDir, file);

  // Skip if file already present with a non-trivial size.
  if (existsSync(dest)) {
    const st = await stat(dest);
    if (st.size > 1024) {
      skipped++;
      continue;
    }
  }

  const url = `${BASE}/${file}`;
  process.stdout.write(`Downloading ${file}... `);
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`FAILED (HTTP ${res.status})`);
      process.exit(1);
    }
    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(dest, buf);
    downloaded++;
    console.log(`ok (${(buf.length / 1024).toFixed(1)} KB)`);
  } catch (err) {
    console.error(`FAILED: ${err.message ?? err}`);
    process.exit(1);
  }
}

console.log(
  `\nDone. ${downloaded} downloaded, ${skipped} already present. Files saved to ${outDir}`
);