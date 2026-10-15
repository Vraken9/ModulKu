import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SmoothCursor } from "@/components/ui/smooth-cursor";
import { AuthProvider } from "@/components/providers/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <SmoothCursor />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
