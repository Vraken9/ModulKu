import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SmoothCursor } from "@/components/ui/smooth-cursor";
import { AuthProvider } from "@/components/providers/AuthProvider";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans-main",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ModulKu - Platform Administrasi & Evaluasi Standar BKPDM Kemendikdasmen",
  description:
    "Platform terpadu guru Indonesia untuk penyusunan Modul Ajar Standar BKPDM Kemendikdasmen (Deep Learning), Soal Evaluasi AKM/HOTS, Kisi-kisi, ATP, Prota, Promes, dan Media Ajar PPTX.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${plusJakartaSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <SmoothCursor />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
