import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SmoothCursor } from "@/components/ui/smooth-cursor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ModulKu - Platform Administrasi & Evaluasi Kurikulum Merdeka",
  description:
    "Platform terpadu guru Indonesia untuk pembuatan Modul Ajar BSKAP 2024, Soal Evaluasi AKM/HOTS, Kisi-kisi, ATP, Prota, Promes, dan Media Ajar PPTX.",
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
        {children}
      </body>
    </html>
  );
}
