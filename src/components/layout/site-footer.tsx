import Link from "next/link";
import { ShieldCheck, Lock, Sparkles } from "lucide-react";
import { Logo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-teal-100 bg-gradient-to-b from-white to-cyan-50/40 text-slate-700">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[600px] -translate-x-1/2 rounded-full bg-teal-200/30 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="space-y-4 md:col-span-5">
            <div className="flex items-center gap-3">
              <Logo size={40} />
              <div>
                <p className="font-display text-lg font-extrabold tracking-[0.12em] text-slate-900">
                  SiPresMa <span className="text-teal-600">UCN</span>
                </p>
                <p className="text-[10px] uppercase tracking-[0.25em] text-teal-700">
                  Universitas Cendekia Nusantara
                </p>
              </div>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-slate-600">
              Sistem Presensi Mahasiswa berbasis pengenalan wajah. Tidak ada
              foto yang disimpan, hanya tanda tangan matematis dari wajah
              Anda — privasi terjaga, presensi tetap akurat.
            </p>
            <p className="text-xs text-slate-500">
              Jl. Pendidikan Cendekia No. 1, Kampus Utama UCN
            </p>
          </div>

          <div className="space-y-3 md:col-span-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.25em] text-teal-700">
              Navigasi
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-slate-600 transition-colors hover:text-teal-700">Beranda</Link></li>
              <li><Link href="/scan" className="text-slate-600 transition-colors hover:text-teal-700">Presensi</Link></li>
              <li><Link href="/register" className="text-slate-600 transition-colors hover:text-teal-700">Pendaftaran</Link></li>
              <li><Link href="/panduan" className="text-slate-600 transition-colors hover:text-teal-700">Panduan</Link></li>
            </ul>
          </div>

          <div className="space-y-3 md:col-span-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.25em] text-teal-700">
              Komitmen
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3 text-slate-700">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-100 text-emerald-700">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </span>
                Tanpa menyimpan foto wajah
              </li>
              <li className="flex items-center gap-3 text-slate-700">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-sky-100 text-sky-700">
                  <Lock className="h-3.5 w-3.5" />
                </span>
                Data terenkripsi
              </li>
              <li className="flex items-center gap-3 text-slate-700">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-teal-100 text-teal-700">
                  <Sparkles className="h-3.5 w-3.5" />
                </span>
                Akurasi tinggi & real-time
              </li>
            </ul>
          </div>
        </div>

        <div className="divider-gold mt-12" />

        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Universitas Cendekia Nusantara. Hak cipta dilindungi.</p>
          <p className="tracking-[0.15em]">DIBANGUN UNTUK MAHASISWA UCN</p>
        </div>
      </div>
    </footer>
  );
}