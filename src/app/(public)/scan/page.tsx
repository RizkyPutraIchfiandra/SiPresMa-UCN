"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { CheckCircle2, XCircle, Radar, ScanFace, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { formatTime } from "@/lib/utils";

// Lazy-load the heavy face-api scanner. The 6 MB ML model only needs to be
// fetched once the user is actually on this page; everything *around* the
// scanner can render instantly while the bundle streams in.
const FaceScanner = dynamic(
  () =>
    import("@/components/face-scanner/face-scanner").then((m) => m.FaceScanner),
  {
    ssr: false,
    loading: () => (
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-900">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/90">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-sm">Menyiapkan kamera & model AI...</span>
        </div>
      </div>
    ),
  }
);

interface ScanSuccess {
  kind: "success";
  user: { id: string; nim: string; name: string };
  timestamp: string;
  status: "PRESENT" | "LATE";
  /** True if the user already had attendance today before this scan. */
  alreadyAttendedToday: boolean;
}
interface ScanFailure {
  kind: "failure";
  message: string;
}
type ScanState =
  | { kind: "idle" }
  | { kind: "scanning" }
  | ScanSuccess
  | ScanFailure;

export default function ScanPage() {
  const [state, setState] = React.useState<ScanState>({ kind: "idle" });
  const inFlight = React.useRef(false);

  const handleDetected = React.useCallback(async (descriptor: number[]) => {
    // Guard: don't fire while one is in-flight or while showing a result.
    if (inFlight.current) return;
    if (state.kind === "success" || state.kind === "failure") return;

    inFlight.current = true;
    setState({ kind: "scanning" });

    try {
      const res = await fetch("/api/attendance/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ descriptor }),
      });
      const json = await res.json();

      if (res.ok) {
        setState({
          kind: "success",
          user: json.data.user,
          timestamp: json.data.attendance.timestamp,
          status: json.data.attendance.status,
          alreadyAttendedToday: json.data.alreadyAttendedToday ?? false,
        });
      } else {
        // Translate common backend error messages to friendlier Indonesian.
        const raw = json?.error?.message ?? "Verifikasi gagal";
        const message = translateError(raw);
        setState({ kind: "failure", message });
      }
    } catch (err) {
      console.error(err);
      setState({
        kind: "failure",
        message:
          "Tidak bisa terhubung ke server. Cek koneksi internet lalu coba lagi.",
      });
    } finally {
      inFlight.current = false;
    }
  }, [state.kind]);

  const reset = () => setState({ kind: "idle" });

  // After a result, show it for a few seconds then reset for the next person.
  // Repeat-attendance results stay a bit longer so users have time to read.
  React.useEffect(() => {
    if (state.kind === "success") {
      const t = setTimeout(reset, state.alreadyAttendedToday ? 6000 : 4000);
      return () => clearTimeout(t);
    }
    if (state.kind === "failure") {
      const t = setTimeout(reset, 4000);
      return () => clearTimeout(t);
    }
  }, [state]);

  const paused = state.kind === "success" || state.kind === "failure";

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-cyan-50/30 via-white to-white">
      <SiteHeader />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-3xl space-y-8 px-4 py-12 sm:px-6">
          <div className="animate-fade-in-up text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-700">
              Live Face Recognition
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Tatap kamera,{" "}
              <span className="font-serif-display italic text-teal-700">
                kami yang verifikasi.
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-md text-sm text-slate-600">
              Posisikan wajah di tengah kamera. Sistem mendeteksi secara otomatis.
            </p>
            <div className="divider-gold mx-auto mt-8 w-32" />
          </div>

          <Card className="animate-fade-in-up stagger-1 relative overflow-hidden border-teal-100 shadow-2xl shadow-teal-500/10">
            <div className="absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent" />
            <CardContent className="relative p-2 sm:p-3">
              <div className="relative">
                <FaceScanner
                  onFaceDetected={handleDetected}
                  paused={paused}
                  detectIntervalMs={1200}
                />
                {state.kind === "idle" && (
                  <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2 rounded-full bg-slate-900/75 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-cyan-300 backdrop-blur-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
                    </span>
                    Live
                  </div>
                )}
                {state.kind === "idle" && (
                  <div className="pointer-events-none absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-slate-900/75 px-3 py-1 text-xs text-white backdrop-blur-sm">
                    <ScanFace className="h-3.5 w-3.5 text-cyan-300" />
                    SiPresMa UCN
                  </div>
                )}
                {state.kind === "scanning" && (
                  <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
                    <div className="animate-scan-line absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_24px_rgba(34,211,238,0.9)]" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {state.kind === "scanning" && (
            <Card className="animate-fade-in border-teal-200 bg-cyan-50/50">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-brand-gradient text-white shadow-md shadow-teal-500/30">
                  <Radar className="h-5 w-5" />
                  <span className="animate-pulse-ring absolute inset-0 rounded-full text-teal-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Memverifikasi wajah...
                  </p>
                  <p className="text-xs text-slate-600">
                    Mencocokkan tanda tangan biometrik
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {state.kind === "success" && !state.alreadyAttendedToday && (
            <Card className="animate-fade-in-up overflow-hidden border-emerald-300/40 shadow-2xl shadow-emerald-500/15">
              <div className="h-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500" />
              <CardHeader className="flex-row items-center gap-4 space-y-0 bg-gradient-to-br from-emerald-50/60 to-white">
                <div className="animate-float flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-2xl shadow-emerald-500/40">
                  <CheckCircle2 className="h-9 w-9" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
                    Presensi Berhasil
                  </p>
                  <CardTitle className="font-serif-display text-2xl italic text-slate-900">
                    Selamat datang, {state.user.name.split(" ")[0]}!
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 p-6 text-sm">
                <Row label="Nama" value={state.user.name} />
                <Row label="NIM" value={state.user.nim} />
                <Row label="Waktu" value={formatTime(state.timestamp)} />
                <div className="flex items-center justify-between border-t border-emerald-100 pt-3">
                  <span className="text-slate-600">Status</span>
                  <Badge
                    variant={state.status === "PRESENT" ? "success" : "warning"}
                    className="rounded-full uppercase tracking-wider"
                  >
                    {state.status === "PRESENT" ? "Tepat Waktu" : "Terlambat"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {state.kind === "success" && state.alreadyAttendedToday && (
            <Card className="animate-fade-in-up overflow-hidden border-sky-300/40 shadow-2xl shadow-sky-500/15">
              <div className="h-1 bg-gradient-to-r from-sky-400 via-cyan-500 to-teal-500" />
              <CardHeader className="flex-row items-center gap-4 space-y-0 bg-gradient-to-br from-sky-50/60 to-white">
                <div className="animate-float flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-cyan-600 text-white shadow-2xl shadow-sky-500/40">
                  <CheckCircle2 className="h-9 w-9" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-700">
                    Sudah Tercatat
                  </p>
                  <CardTitle className="font-serif-display text-2xl italic text-slate-900">
                    Halo lagi, {state.user.name.split(" ")[0]}!
                  </CardTitle>
                  <CardDescription className="mt-1 text-sm text-slate-600">
                    Anda sudah melakukan presensi hari ini.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 p-6 text-sm">
                <Row label="Nama" value={state.user.name} />
                <Row label="NIM" value={state.user.nim} />
                <Row
                  label="Tercatat sejak"
                  value={formatTime(state.timestamp)}
                />
                <div className="flex items-center justify-between border-t border-sky-100 pt-3">
                  <span className="text-slate-600">Status awal</span>
                  <Badge
                    variant={state.status === "PRESENT" ? "success" : "warning"}
                    className="rounded-full uppercase tracking-wider"
                  >
                    {state.status === "PRESENT" ? "Tepat Waktu" : "Terlambat"}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500">
                  Presensi hanya bisa dilakukan satu kali per hari.
                </p>
              </CardContent>
            </Card>
          )}

          {state.kind === "failure" && (
            <Card className="animate-fade-in-up overflow-hidden border-red-300/40">
              <div className="h-1 bg-gradient-to-r from-red-400 via-red-500 to-orange-500" />
              <CardHeader className="flex-row items-center gap-4 space-y-0 bg-gradient-to-br from-red-50/60 to-white">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-400 to-red-600 text-white shadow-2xl shadow-red-500/40">
                  <XCircle className="h-9 w-9" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-700">
                    Gagal
                  </p>
                  <CardTitle className="font-serif-display text-2xl italic text-slate-900">
                    Verifikasi tidak berhasil
                  </CardTitle>
                  <CardDescription className="mt-1 text-sm text-slate-700">
                    {state.message}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex h-11 w-full items-center justify-center rounded-full border border-slate-300 text-sm font-semibold text-slate-900 transition-colors hover:border-slate-900"
                >
                  Coba Lagi
                </button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-600">{label}</span>
      <span className="font-semibold text-slate-900">{value}</span>
    </div>
  );
}

/**
 * Map common backend error messages to friendly Indonesian copy.
 * Keep the original as a fallback for anything we haven't seen.
 */
function translateError(raw: string): string {
  const m = raw.toLowerCase();
  if (m.includes("already checked in")) {
    return "Anda sudah melakukan presensi hari ini.";
  }
  if (m.includes("not recognized") || m.includes("not recognised") || m.includes("face not")) {
    return "Wajah tidak dikenali. Pastikan Anda sudah terdaftar dan posisi wajah jelas.";
  }
  if (m.includes("no face") || m.includes("face detected")) {
    return "Wajah tidak terdeteksi. Mendekat ke kamera dan pastikan pencahayaan cukup.";
  }
  return raw;
}