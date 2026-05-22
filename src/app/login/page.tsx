import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { LoginForm } from "./login-form";

// `useSearchParams()` inside <LoginForm> requires a Suspense boundary when
// the page is rendered statically. Wrapping it here keeps the rest of the
// page server-rendered.
export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white p-4">
      {/* Soft teal blobs */}
      <div className="animate-blob-1 pointer-events-none absolute -left-32 top-20 h-[420px] w-[420px] rounded-full bg-cyan-200/40 blur-[120px]" />
      <div className="animate-blob-2 pointer-events-none absolute -right-32 bottom-20 h-[480px] w-[480px] rounded-full bg-teal-200/40 blur-[140px]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(13,148,136,0.10) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="animate-fade-in-up relative w-full max-w-sm space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-slate-600 transition-colors hover:text-teal-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke beranda
        </Link>

        <div className="flex flex-col items-center text-center">
          <div className="animate-float">
            <Logo size={64} />
          </div>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.3em] text-teal-700">
            Portal Akademik
          </p>
          <h1 className="mt-2 font-serif-display text-3xl italic text-slate-900">
            Masuk ke sistem
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Akses internal untuk staf akademik UCN.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-teal-100 bg-white shadow-xl shadow-teal-500/10">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent" />
          <div className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-teal-600" />
              <p className="font-display text-base font-semibold tracking-wide text-slate-900">
                Login Pengelola
              </p>
            </div>
            <Suspense fallback={null}>
              <LoginForm />
            </Suspense>
          </div>
        </div>

        <p className="text-center text-xs uppercase tracking-[0.2em] text-slate-500">
          SiPresMa UCN · Akses Internal
        </p>
      </div>
    </main>
  );
}