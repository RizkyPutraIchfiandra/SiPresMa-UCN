import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: "SiPresMa UCN — Sistem Presensi Mahasiswa",
    template: "%s · SiPresMa UCN",
  },
  description:
    "Sistem Presensi Mahasiswa Universitas Cendekia Nusantara berbasis pengenalan wajah. Cepat, akurat, dan privasi terjaga.",
  keywords: [
    "presensi mahasiswa",
    "absensi kuliah",
    "face recognition",
    "UCN",
    "Universitas Cendekia Nusantara",
    "SiPresMa",
  ],
  authors: [{ name: "Universitas Cendekia Nusantara" }],
  openGraph: {
    title: "SiPresMa UCN — Sistem Presensi Mahasiswa",
    description:
      "Sistem Presensi Mahasiswa UCN berbasis pengenalan wajah. Cepat, akurat, privasi terjaga.",
    type: "website",
    locale: "id_ID",
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0b1020",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${jakarta.variable} ${cormorant.variable}`}
    >
      <body className={`min-h-screen bg-background ${inter.className}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}