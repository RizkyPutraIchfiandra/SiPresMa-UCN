"use client";

import * as React from "react";
import Link from "next/link";
import { Loader2, Check, Camera, UserPlus, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FaceScanner,
  type FaceScannerHandle,
} from "@/components/face-scanner/face-scanner";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { cn } from "@/lib/utils";

const REQUIRED_CAPTURES = 3;

/** Map common backend error messages to friendly Indonesian copy. */
function translateError(raw: string): string {
  const m = raw.toLowerCase();
  if (m.includes("already exists") || m.includes("duplicate") || m.includes("unique")) {
    return "NIM atau email sudah terdaftar. Gunakan data yang berbeda.";
  }
  if (m.includes("invalid email")) {
    return "Format email tidak valid.";
  }
  if (m.includes("validation")) {
    return "Data yang Anda masukkan tidak valid. Periksa kembali.";
  }
  return raw;
}

export default function RegisterPage() {
  const scannerRef = React.useRef<FaceScannerHandle>(null);
  const [form, setForm] = React.useState({ nim: "", name: "", email: "" });
  const [descriptors, setDescriptors] = React.useState<number[][]>([]);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const onChange = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function captureOne() {
    setError(null);
    if (!scannerRef.current) return;
    setBusy(true);
    try {
      const d = await scannerRef.current.capture();
      if (!d) {
        setError(
          "Wajah belum terdeteksi. Pastikan wajah berada di tengah kamera dan pencahayaan cukup, lalu coba lagi."
        );
        return;
      }
      setDescriptors((arr) => [...arr, d]);
    } finally {
      setBusy(false);
    }
  }

  async function submit() {
    setError(null);
    if (descriptors.length < REQUIRED_CAPTURES) {
      setError(
        `Ambil minimal ${REQUIRED_CAPTURES} sampel wajah terlebih dahulu.`
      );
      return;
    }
    if (!form.nim.trim() || !form.name.trim() || !form.email.trim()) {
      setError("Lengkapi NIM, nama lengkap, dan email kampus.");
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, descriptors }),
      });
      const json = await res.json();
      if (!res.ok) {
        const raw = json?.error?.message ?? "Pendaftaran gagal";
        setError(translateError(raw));
        return;
      }
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(
        "Tidak bisa terhubung ke server. Cek koneksi internet lalu coba lagi."
      );
    } finally {
      setBusy(false);
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-cyan-50/30 via-white to-white">
        <SiteHeader />
        <main className="flex flex-1 items-center justify-center p-6">
          <Card className="animate-fade-in-up w-full max-w-md overflow-hidden border-teal-100 shadow-2xl shadow-teal-500/10">
            <div className="h-1 bg-brand-gradient" />
            <CardHeader className="text-center">
              <div className="animate-float mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-2xl shadow-teal-500/30">
                <Check className="h-10 w-10" strokeWidth={2.5} />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-700">
                Selamat Datang di UCN
              </p>
              <CardTitle className="font-serif-display text-3xl italic">
                Pendaftaran Berhasil
              </CardTitle>
              <CardDescription className="text-base">
                <span className="font-medium text-slate-900">{form.name}</span>{" "}
                (NIM {form.nim}) telah terdaftar di sistem.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/scan"
                className="inline-flex h-11 items-center justify-center rounded-full bg-brand-gradient px-6 text-sm font-semibold text-white shadow-lg shadow-teal-500/30 transition-transform hover:scale-[1.02]"
              >
                Mulai Presensi
              </Link>
              <Link
                href="/"
                className="inline-flex h-11 items-center justify-center rounded-full border border-slate-300 px-6 text-sm font-semibold text-slate-900 transition-colors hover:border-teal-500 hover:text-teal-700"
              >
                Beranda
              </Link>
            </CardContent>
          </Card>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-cyan-50/30 via-white to-white">
      <SiteHeader />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-5xl space-y-8 px-4 py-12 sm:px-6">
          <div className="animate-fade-in-up text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-700">
              Pendaftaran Wajah
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Daftarkan{" "}
              <span className="font-serif-display italic text-teal-700">
                wajah Anda.
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm text-slate-600 sm:text-base">
              Khusus mahasiswa baru. Ambil {REQUIRED_CAPTURES} sampel wajah dari
              sudut sedikit berbeda — depan, agak menoleh kanan, agak menoleh kiri.
            </p>
            <div className="divider-gold mx-auto mt-8 w-32" />
          </div>

          {/* Progress dots */}
          <div className="animate-fade-in-up stagger-1 mx-auto flex max-w-md items-center gap-2">
            {Array.from({ length: REQUIRED_CAPTURES }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1 flex-1 rounded-full transition-all duration-700",
                  i < descriptors.length ? "bg-brand-gradient" : "bg-slate-200"
                )}
              />
            ))}
            <span className="ml-3 font-serif-display text-sm italic text-teal-700">
              {descriptors.length} / {REQUIRED_CAPTURES}
            </span>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="animate-fade-in-up stagger-2 overflow-hidden border-teal-100 shadow-lg shadow-teal-500/5">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/60 to-transparent" />
              <CardHeader className="border-b border-teal-100 bg-gradient-to-br from-cyan-50/40 to-white">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-gradient text-white shadow-md shadow-teal-500/20">
                    <Camera className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="font-display">Kamera</CardTitle>
                    <CardDescription>
                      Posisikan wajah di tengah, lalu ambil sampel.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <FaceScanner ref={scannerRef} />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setDescriptors([])}
                    disabled={busy || descriptors.length === 0}
                    className="inline-flex h-10 items-center rounded-full border border-slate-300 px-5 text-sm font-medium text-slate-700 transition-colors hover:border-teal-500 hover:text-teal-700 disabled:opacity-50"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={captureOne}
                    disabled={busy}
                    className="inline-flex h-10 items-center gap-2 rounded-full bg-brand-gradient px-5 text-sm font-semibold text-white shadow-md shadow-teal-500/30 transition-transform hover:scale-[1.02] disabled:opacity-60"
                  >
                    {busy ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Camera className="h-4 w-4" />
                    )}
                    Ambil Sampel
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fade-in-up stagger-3 overflow-hidden border-teal-100 shadow-lg shadow-teal-500/5">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/60 to-transparent" />
              <CardHeader className="border-b border-teal-100 bg-gradient-to-br from-cyan-50/40 to-white">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-gradient text-white shadow-md shadow-teal-500/20">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="font-display">Data Diri</CardTitle>
                    <CardDescription>
                      NIM dan email harus unik di sistem.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="space-y-2">
                  <Label htmlFor="nim" className="text-xs uppercase tracking-wider text-slate-700">
                    NIM
                  </Label>
                  <Input
                    id="nim"
                    value={form.nim}
                    onChange={onChange("nim")}
                    placeholder="21010001"
                    className="h-11 border-slate-200 bg-white focus-visible:border-teal-500 focus-visible:ring-teal-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs uppercase tracking-wider text-slate-700">
                    Nama Lengkap
                  </Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={onChange("name")}
                    placeholder="Budi Santoso"
                    className="h-11 border-slate-200 bg-white focus-visible:border-teal-500 focus-visible:ring-teal-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs uppercase tracking-wider text-slate-700">
                    Email Kampus
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={onChange("email")}
                    placeholder="budi@mahasiswa.ucn.ac.id"
                    className="h-11 border-slate-200 bg-white focus-visible:border-teal-500 focus-visible:ring-teal-500/20"
                  />
                </div>

                {error && (
                  <div className="animate-fade-in rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="button"
                  onClick={submit}
                  disabled={busy || descriptors.length < REQUIRED_CAPTURES}
                  className="group relative inline-flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-brand-gradient text-base font-semibold text-white shadow-lg shadow-teal-500/30 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none disabled:hover:scale-100"
                >
                  <span className="animate-shimmer absolute inset-0" />
                  {busy ? (
                    <Loader2 className="relative h-4 w-4 animate-spin" />
                  ) : (
                    <UserPlus className="relative h-4 w-4" />
                  )}
                  <span className="relative">Daftar Sekarang</span>
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
    </main>

      <SiteFooter />
    </div>
  );
}