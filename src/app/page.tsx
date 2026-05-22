import Link from "next/link";
import {
  ScanFace,
  UserPlus,
  ShieldCheck,
  Zap,
  Eye,
  ArrowRight,
  Sparkles,
  Star,
  Award,
  Lock,
  GraduationCap,
} from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />

      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="animate-blob-1 pointer-events-none absolute -left-32 top-20 h-[420px] w-[420px] rounded-full bg-cyan-200/40 blur-[120px]" />
          <div className="animate-blob-2 pointer-events-none absolute -right-32 top-40 h-[480px] w-[480px] rounded-full bg-teal-200/40 blur-[140px]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(94,234,212,0.18)_0%,_transparent_60%)]" />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.4]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(13,148,136,0.10) 1px, transparent 0)",
              backgroundSize: "28px 28px",
            }}
          />

          <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-16 sm:px-6 sm:pb-32 sm:pt-24 lg:pt-32">
            <div className="mx-auto max-w-3xl text-center">
              <div className="animate-fade-in-up inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-teal-800">
                <GraduationCap className="h-3.5 w-3.5" />
                Universitas Cendekia Nusantara
              </div>

              <h1 className="animate-fade-in-up stagger-1 mt-8 text-balance font-display text-5xl font-bold leading-[1.05] tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
                Presensi mahasiswa
                <br />
                <span className="font-serif-display italic text-brand-gradient">
                  cukup tatap kamera.
                </span>
              </h1>

              <p className="animate-fade-in-up stagger-2 mx-auto mt-8 max-w-2xl text-balance text-lg leading-relaxed text-slate-600 sm:text-xl">
                <strong className="text-slate-900">SiPresMa UCN</strong> —
                Sistem Presensi Mahasiswa berbasis pengenalan wajah. Daftar
                sekali pakai NIM, lalu absen kuliah dalam hitungan detik.
              </p>

              <div className="animate-fade-in-up stagger-3 mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/scan"
                  className="group relative inline-flex h-14 items-center gap-2.5 overflow-hidden rounded-full bg-brand-gradient px-9 text-base font-semibold text-white shadow-xl shadow-teal-500/25 transition-transform hover:scale-[1.03]"
                >
                  <span className="animate-shimmer absolute inset-0" />
                  <ScanFace className="relative h-5 w-5" />
                  <span className="relative">Absen Sekarang</span>
                  <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/register"
                  className="inline-flex h-14 items-center gap-2.5 rounded-full border border-slate-300 bg-white px-9 text-base font-semibold text-slate-900 transition-colors hover:border-teal-500 hover:text-teal-700"
                >
                  <UserPlus className="h-5 w-5" />
                  Daftar Mahasiswa Baru
                </Link>
              </div>

              <div className="animate-fade-in-up stagger-4 mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs uppercase tracking-[0.18em] text-slate-500">
                <div className="flex items-center gap-2">
                  <Star className="h-3.5 w-3.5 text-teal-600" />
                  Akurasi Tinggi
                </div>
                <span className="hidden h-4 w-px bg-slate-300 sm:block" />
                <div className="flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5 text-teal-600" />
                  Privasi Terjaga
                </div>
                <span className="hidden h-4 w-px bg-slate-300 sm:block" />
                <div className="flex items-center gap-2">
                  <Zap className="h-3.5 w-3.5 text-teal-600" />
                  Real-time
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* KEUNGGULAN */}
        <section className="relative bg-gradient-to-b from-white to-cyan-50/40">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-700">
                Tiga Keunggulan
              </p>
              <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                Dirancang untuk{" "}
                <span className="font-serif-display italic text-teal-700">
                  mahasiswa modern
                </span>
              </h2>
              <div className="divider-gold mx-auto mt-8 w-32" />
            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-3">
              <FeatureCard
                number="01"
                icon={<ShieldCheck className="h-6 w-6" />}
                title="Privasi Terjaga"
                description="Sistem hanya menyimpan tanda tangan matematis wajah, bukan foto. Identitas mahasiswa tetap aman."
                delay="stagger-1"
              />
              <FeatureCard
                number="02"
                icon={<Zap className="h-6 w-6" />}
                title="Cepat & Real-time"
                description="Pengenalan wajah berlangsung langsung di browser. Hemat waktu, tidak perlu antri di kelas."
                delay="stagger-2"
              />
              <FeatureCard
                number="03"
                icon={<Eye className="h-6 w-6" />}
                title="Akurat & Konsisten"
                description="Multi-frame averaging memastikan presensi tetap akurat meski pencahayaan ruangan berubah."
                delay="stagger-3"
              />
            </div>
          </div>
        </section>

        {/* CARA PENGGUNAAN */}
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-700">
                Cara Penggunaan
              </p>
              <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                Tiga langkah,{" "}
                <span className="font-serif-display italic">selesai.</span>
              </h2>
            </div>

            <div className="relative mt-16">
              <div className="absolute left-1/2 top-12 hidden h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-teal-300 to-transparent md:block" />
              <div className="grid gap-6 md:grid-cols-3">
                <StepCard
                  step="I"
                  title="Daftar Mahasiswa"
                  description="Isi NIM, nama, dan email kampus. Ambil 3 sampel wajah dari sudut yang berbeda."
                />
                <StepCard
                  step="II"
                  title="Buka Halaman Presensi"
                  description="Saat masuk kelas, buka halaman Presensi. Posisikan wajah di depan kamera."
                />
                <StepCard
                  step="III"
                  title="Kehadiran Tercatat"
                  description="Sistem otomatis mencocokkan dan menyimpan kehadiran lengkap dengan waktu."
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden bg-gradient-to-br from-cyan-50 via-teal-50 to-white py-20 sm:py-28">
          <div className="animate-blob-2 pointer-events-none absolute -right-40 top-10 h-[500px] w-[500px] rounded-full bg-teal-200/50 blur-[140px]" />
          <div className="animate-blob-1 pointer-events-none absolute -left-40 bottom-10 h-[420px] w-[420px] rounded-full bg-cyan-200/50 blur-[120px]" />

          <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-teal-700 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Mulai Sekarang
            </div>
            <h2 className="mt-6 font-display text-4xl font-bold leading-tight text-slate-900 text-balance sm:text-5xl lg:text-6xl">
              Siap absen tanpa{" "}
              <span className="font-serif-display italic text-brand-gradient">
                ribet?
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-slate-600">
              Mahasiswa baru cukup daftar sekali. Setelah itu, presensi kuliah
              hanya butuh hitungan detik.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="group relative inline-flex h-14 items-center gap-2.5 overflow-hidden rounded-full bg-brand-gradient px-9 text-base font-semibold text-white shadow-xl shadow-teal-500/30 transition-transform hover:scale-[1.03]"
              >
                <span className="animate-shimmer absolute inset-0" />
                <UserPlus className="relative h-5 w-5" />
                <span className="relative">Daftar Sekarang</span>
              </Link>
              <Link
                href="/scan"
                className="inline-flex h-14 items-center gap-2.5 rounded-full border border-slate-300 bg-white px-9 text-base font-semibold text-slate-900 transition-colors hover:border-teal-500 hover:text-teal-700"
              >
                <span>Sudah terdaftar? Absen</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function FeatureCard({
  number,
  icon,
  title,
  description,
  delay,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: string;
}) {
  return (
    <div
      className={`animate-fade-in-up ${delay ?? ""} group relative overflow-hidden rounded-2xl border border-teal-100 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-teal-300 hover:shadow-xl hover:shadow-teal-500/10`}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400 to-transparent opacity-60" />
      <div className="flex items-center justify-between">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-lg shadow-teal-500/30 transition-transform group-hover:scale-110">
          {icon}
        </div>
        <span className="font-serif-display text-4xl italic text-teal-300/60">
          {number}
        </span>
      </div>
      <h3 className="mt-6 font-display text-xl font-bold tracking-tight text-slate-900">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">{description}</p>
    </div>
  );
}

function StepCard({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative">
      <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-teal-200 bg-white shadow-lg shadow-teal-500/10">
        <span className="font-serif-display text-3xl italic text-teal-700">
          {step}
        </span>
        <span className="absolute inset-0 rounded-full border border-teal-100" />
      </div>
      <h3 className="mt-6 text-center font-display text-xl font-bold text-slate-900">
        {title}
      </h3>
      <p className="mx-auto mt-3 max-w-xs text-center text-sm leading-relaxed text-slate-600">
        {description}
      </p>
    </div>
  );
}