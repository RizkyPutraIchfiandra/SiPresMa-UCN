import Link from "next/link";
import {
  ScanFace,
  UserPlus,
  Camera,
  Clock,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
} from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata = {
  title: "Panduan Penggunaan",
  description: "Panduan lengkap penggunaan SiPresMa UCN untuk mahasiswa.",
};

export default function PanduanPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-cyan-50/30 via-white to-white">
      <SiteHeader />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-4xl space-y-12 px-4 py-12 sm:px-6">
          {/* Header */}
          <div className="animate-fade-in-up text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-700">
              Panduan Penggunaan
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Cara pakai{" "}
              <span className="font-serif-display italic text-teal-700">
                SiPresMa UCN
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm text-slate-600 sm:text-base">
              Panduan singkat untuk mahasiswa Universitas Cendekia Nusantara.
              Cuma butuh 2 menit untuk paham semuanya.
            </p>
            <div className="divider-gold mx-auto mt-8 w-32" />
          </div>

          {/* Step 1 */}
          <Section
            number="1"
            icon={<UserPlus className="h-5 w-5" />}
            title="Pendaftaran (Sekali Saja)"
            description="Khusus mahasiswa baru atau yang belum terdaftar."
          >
            <ol className="space-y-3 text-sm text-slate-700">
              <li className="flex gap-3">
                <Bullet>1</Bullet>
                <span>
                  Klik tombol{" "}
                  <strong className="text-slate-900">Daftar</strong> di menu
                  atas, atau buka halaman{" "}
                  <Link href="/register" className="font-medium text-teal-700 underline">
                    Daftar
                  </Link>
                  .
                </span>
              </li>
              <li className="flex gap-3">
                <Bullet>2</Bullet>
                <span>
                  Isi <strong className="text-slate-900">NIM</strong>,{" "}
                  <strong className="text-slate-900">nama lengkap</strong>, dan{" "}
                  <strong className="text-slate-900">email kampus</strong> Anda.
                </span>
              </li>
              <li className="flex gap-3">
                <Bullet>3</Bullet>
                <span>
                  Izinkan akses kamera saat browser meminta.
                </span>
              </li>
              <li className="flex gap-3">
                <Bullet>4</Bullet>
                <span>
                  Ambil <strong className="text-slate-900">3 sampel wajah</strong>{" "}
                  — pertama menghadap depan, kedua sedikit menoleh ke kanan,
                  ketiga sedikit menoleh ke kiri. Klik tombol{" "}
                  <em>Ambil Sampel</em> di setiap pose.
                </span>
              </li>
              <li className="flex gap-3">
                <Bullet>5</Bullet>
                <span>
                  Klik <strong className="text-slate-900">Daftar Sekarang</strong>.
                  Selesai. Anda hanya perlu mendaftar satu kali.
                </span>
              </li>
            </ol>
          </Section>

          {/* Step 2 */}
          <Section
            number="2"
            icon={<ScanFace className="h-5 w-5" />}
            title="Presensi Harian"
            description="Setiap kali Anda masuk kelas atau kampus."
          >
            <ol className="space-y-3 text-sm text-slate-700">
              <li className="flex gap-3">
                <Bullet>1</Bullet>
                <span>
                  Klik <strong className="text-slate-900">Absen Sekarang</strong>{" "}
                  di menu atas, atau buka halaman{" "}
                  <Link href="/scan" className="font-medium text-teal-700 underline">
                    Presensi
                  </Link>
                  .
                </span>
              </li>
              <li className="flex gap-3">
                <Bullet>2</Bullet>
                <span>
                  Posisikan wajah di tengah kamera. Tunggu sebentar — sistem
                  akan mendeteksi otomatis dalam 1-2 detik.
                </span>
              </li>
              <li className="flex gap-3">
                <Bullet>3</Bullet>
                <span>
                  Setelah verifikasi berhasil, kartu hijau akan muncul lengkap
                  dengan nama, NIM, jam, dan status (Tepat Waktu / Terlambat).
                </span>
              </li>
              <li className="flex gap-3">
                <Bullet>4</Bullet>
                <span>
                  Selesai. Anda hanya bisa absen sekali per hari.
                </span>
              </li>
            </ol>
          </Section>

          {/* Tips */}
          <Section
            number="3"
            icon={<Lightbulb className="h-5 w-5" />}
            title="Tips Akurasi Maksimal"
            description="Biar pengenalan wajah selalu sukses dalam sekali coba."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Tip icon={<Camera className="h-4 w-4" />} title="Pencahayaan cukup">
                Cahaya dari depan atau samping. Hindari membelakangi jendela
                atau lampu terang.
              </Tip>
              <Tip icon={<ScanFace className="h-4 w-4" />} title="Wajah terlihat jelas">
                Lepas masker dan kacamata hitam. Kacamata bening tidak masalah.
              </Tip>
              <Tip icon={<CheckCircle2 className="h-4 w-4" />} title="Posisi tegak">
                Wajah lurus menghadap kamera, tidak terlalu menunduk atau
                mendongak.
              </Tip>
              <Tip icon={<Clock className="h-4 w-4" />} title="Sabar 1-2 detik">
                Sistem mengambil beberapa frame untuk akurasi. Jangan keburu
                menjauh dari kamera.
              </Tip>
            </div>
          </Section>

          {/* FAQ */}
          <Section
            number="?"
            icon={<HelpCircle className="h-5 w-5" />}
            title="Pertanyaan Umum"
            description="Jawaban singkat untuk pertanyaan yang sering muncul."
          >
            <div className="space-y-4">
              <Faq
                q="Apakah foto wajah saya disimpan?"
                a="Tidak. Sistem hanya menyimpan tanda tangan matematis (128 angka) yang merepresentasikan ciri wajah Anda. Tidak mungkin merekonstruksi foto dari angka-angka ini."
              />
              <Faq
                q="Bagaimana jika saya gagal absen karena terlalu pagi/sore?"
                a="Tidak ada batasan jam absen. Status PRESENT untuk absen sebelum jam 09:00, dan LATE setelahnya."
              />
              <Faq
                q="Apa yang terjadi jika saya absen dua kali dalam sehari?"
                a="Sistem akan menolak. Anda hanya bisa absen sekali per hari. Jika kamu lupa apakah sudah absen, cukup coba — sistem yang akan memberitahu."
              />
              <Faq
                q="Saya kembar identik. Apakah sistem bisa membedakan?"
                a="Algoritma face recognition modern memiliki akurasi sangat tinggi tapi bukan 100%. Jika Anda kembar, hubungi admin akademik untuk penanganan khusus."
              />
              <Faq
                q="Bisakah saya pakai dari HP?"
                a="Bisa. Web ini responsive dan bekerja di kamera depan smartphone selama menggunakan browser modern (Chrome, Safari, Edge, Firefox)."
              />
            </div>
          </Section>

          {/* Privacy callout */}
          <div className="animate-fade-in-up rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-cyan-50 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-md shadow-emerald-500/30">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-slate-900">
                  Privasi Anda Adalah Prioritas
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  Universitas Cendekia Nusantara berkomitmen melindungi data
                  mahasiswa. Sistem ini dirancang dengan prinsip{" "}
                  <em>privacy by design</em>: tidak ada foto wajah yang
                  disimpan, hanya tanda tangan matematis. Data terenkripsi dan
                  hanya digunakan untuk keperluan presensi resmi.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-brand-gradient px-7 text-sm font-semibold text-white shadow-lg shadow-teal-500/30 transition-transform hover:scale-[1.03]"
            >
              <UserPlus className="h-4 w-4" />
              Daftar Sekarang
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/scan"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-slate-300 bg-white px-7 text-sm font-semibold text-slate-900 transition-colors hover:border-teal-500 hover:text-teal-700"
            >
              <ScanFace className="h-4 w-4" />
              Sudah Terdaftar? Absen
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function Section({
  number,
  icon,
  title,
  description,
  children,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="animate-fade-in-up relative overflow-hidden rounded-2xl border border-teal-100 bg-white p-6 shadow-lg shadow-teal-500/5 sm:p-8">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/60 to-transparent" />
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-md shadow-teal-500/30">
          {icon}
        </div>
        <div className="flex-1">
          <p className="font-serif-display text-2xl italic text-teal-700">
            Langkah {number}
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-slate-900">
            {title}
          </h2>
          <p className="mt-1 text-sm text-slate-600">{description}</p>
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </section>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-100 font-display text-xs font-bold text-teal-700">
      {children}
    </span>
  );
}

function Tip({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-teal-100 bg-cyan-50/40 p-4">
      <div className="flex items-center gap-2 text-teal-700">
        {icon}
        <h4 className="font-display text-sm font-bold">{title}</h4>
      </div>
      <p className="mt-2 text-sm text-slate-700">{children}</p>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <details className="group rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-teal-300">
      <summary className="flex cursor-pointer items-center justify-between gap-3 text-sm font-semibold text-slate-900">
        {q}
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700 transition-transform group-open:rotate-45">
          +
        </span>
      </summary>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">{a}</p>
    </details>
  );
}