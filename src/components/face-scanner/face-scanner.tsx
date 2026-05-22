"use client";

import * as React from "react";
import { Loader2, Camera, AlertCircle } from "lucide-react";
import {
  captureAveragedDescriptor,
  detectFaceDescriptor,
  loadFaceApiModels,
} from "@/lib/face-api/loader";
import { cn } from "@/lib/utils";

export interface FaceScannerHandle {
  capture: () => Promise<number[] | null>;
}

interface FaceScannerProps {
  /**
   * Called every time a face is detected during the live preview.
   * Useful for the /scan flow to auto-submit on detection.
   */
  onFaceDetected?: (descriptor: number[]) => void;
  /** Throttle window between auto-detections, in ms. Default 1500. */
  detectIntervalMs?: number;
  /** Disable the auto-detection loop (e.g. when the parent is busy). */
  paused?: boolean;
  className?: string;
}

/**
 * Reusable webcam + face-api.js component.
 *
 * - Loads the face-api models once.
 * - Streams the webcam into a <video>.
 * - Runs detection on an interval and reports the descriptor up.
 * - Cleans up the camera stream on unmount (the spec calls this out).
 */
export const FaceScanner = React.forwardRef<FaceScannerHandle, FaceScannerProps>(
  function FaceScanner(
    { onFaceDetected, detectIntervalMs = 1500, paused = false, className },
    ref
  ) {
    const videoRef = React.useRef<HTMLVideoElement | null>(null);
    const streamRef = React.useRef<MediaStream | null>(null);
    const [modelsReady, setModelsReady] = React.useState(false);
    const [cameraReady, setCameraReady] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    // 1) Load face-api models.
    React.useEffect(() => {
      let cancelled = false;
      loadFaceApiModels()
        .then(() => {
          if (!cancelled) setModelsReady(true);
        })
        .catch((err) => {
          console.error(err);
          if (!cancelled) {
            setError(
              "Failed to load face recognition models. Did you download them into /public/models?"
            );
          }
        });
      return () => {
        cancelled = true;
      };
    }, []);

    // 2) Open the webcam (after models are ready, so the UI shows a clear
    //    "loading models" state first).
    React.useEffect(() => {
      if (!modelsReady) return;

      let cancelled = false;
      (async () => {
        try {
          if (
            typeof navigator === "undefined" ||
            !navigator.mediaDevices?.getUserMedia
          ) {
            throw new Error(
              "Camera API is unavailable. Make sure you're using a modern browser over http://localhost or HTTPS."
            );
          }

          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user", width: 640, height: 480 },
            audio: false,
          });
          if (cancelled) {
            stream.getTracks().forEach((t) => t.stop());
            return;
          }
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            await videoRef.current.play().catch(() => {
              /* autoplay may be blocked; user can tap */
            });
          }
          setCameraReady(true);
        } catch (err) {
          console.error("[FaceScanner] camera error:", err);
          // Surface a helpful, specific message based on the DOMException name.
          let message = "Could not access the camera.";
          if (err instanceof Error) {
            const name = (err as DOMException).name ?? err.name;
            if (name === "NotAllowedError" || name === "PermissionDeniedError") {
              message =
                "Camera permission was denied. Click the camera icon in the address bar, allow access, then reload.";
            } else if (name === "NotFoundError" || name === "DevicesNotFoundError") {
              message =
                "No camera was found on this device. Plug one in or try a different device.";
            } else if (name === "NotReadableError" || name === "TrackStartError") {
              message =
                "Camera is already in use by another app (Zoom, Meet, OBS, etc.). Close it and reload.";
            } else if (name === "OverconstrainedError") {
              message =
                "Your camera doesn't support the requested settings. Try a different camera.";
            } else if (name === "SecurityError") {
              message =
                "Browser blocked the camera. Open the site via http://localhost or HTTPS, not an http://IP address.";
            } else if (err.message) {
              message = `Could not access the camera: ${err.message}`;
            }
          }
          setError(message);
        }
      })();

      // Cleanup: stop all camera tracks on unmount.
      return () => {
        cancelled = true;
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
          streamRef.current = null;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      };
    }, [modelsReady]);

    // 3) Auto-detection loop with stability check.
    //
    // Strategy: a face must remain in-frame for STABILITY_FRAMES consecutive
    // ticks before we trigger onFaceDetected with the *averaged* descriptor.
    // This prevents false positives from glitchy single frames and is what
    // makes recognition feel reliable in practice.
    const STABILITY_FRAMES = 2;
    const stableCountRef = React.useRef(0);
    const triggeredRef = React.useRef(false);

    React.useEffect(() => {
      if (!cameraReady || !modelsReady || paused || !onFaceDetected) {
        stableCountRef.current = 0;
        triggeredRef.current = false;
        return;
      }

      let active = true;
      let timer: number | undefined;

      const tick = async () => {
        if (!active) return;
        try {
          const video = videoRef.current;
          if (video && video.readyState >= 2) {
            // Quick presence check first.
            const detection = await detectFaceDescriptor(video);
            if (detection) {
              stableCountRef.current += 1;
            } else {
              stableCountRef.current = 0;
              triggeredRef.current = false;
            }

            // Once stable, capture an averaged descriptor for the actual scan.
            if (
              stableCountRef.current >= STABILITY_FRAMES &&
              !triggeredRef.current &&
              active
            ) {
              triggeredRef.current = true;
              const averaged = await captureAveragedDescriptor(video, {
                frames: 5,
                intervalMs: 100,
                minFrames: 3,
              });
              if (averaged && active) {
                onFaceDetected(averaged.descriptor);
              } else {
                // Quality gate failed; reset and try again next loop.
                triggeredRef.current = false;
                stableCountRef.current = 0;
              }
            }
          }
        } catch (err) {
          console.error(err);
        } finally {
          if (active) {
            timer = window.setTimeout(tick, detectIntervalMs);
          }
        }
      };
      timer = window.setTimeout(tick, detectIntervalMs);

      return () => {
        active = false;
        if (timer !== undefined) window.clearTimeout(timer);
      };
    }, [cameraReady, modelsReady, paused, onFaceDetected, detectIntervalMs]);

    // Imperative capture API for the registration flow — averaged for accuracy.
    React.useImperativeHandle(
      ref,
      () => ({
        async capture() {
          const video = videoRef.current;
          if (!video || video.readyState < 2) return null;
          // Use averaging here too — a registration sample should be as clean
          // as possible because it becomes the reference for matching later.
          const averaged = await captureAveragedDescriptor(video, {
            frames: 6,
            intervalMs: 120,
            minFrames: 4,
          });
          return averaged?.descriptor ?? null;
        },
      }),
      []
    );

    return (
      <div
        className={cn(
          "relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-black",
          className
        )}
      >
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          playsInline
          muted
        />
        {!modelsReady && !error && (
          <Overlay>
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Memuat model AI...</span>
          </Overlay>
        )}
        {modelsReady && !cameraReady && !error && (
          <Overlay>
            <Camera className="h-6 w-6" />
            <span>Membuka kamera...</span>
          </Overlay>
        )}
        {error && (
          <Overlay variant="error">
            <AlertCircle className="h-6 w-6" />
            <span className="px-6 text-center text-sm">{error}</span>
          </Overlay>
        )}
      </div>
    );
  }
);

function Overlay({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "error";
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 flex flex-col items-center justify-center gap-2 backdrop-blur-sm",
        variant === "error"
          ? "bg-red-950/70 text-red-100"
          : "bg-black/60 text-white"
      )}
    >
      {children}
    </div>
  );
}