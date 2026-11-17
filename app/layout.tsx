import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RepairVerse · Learn real-world repair skills in 3D",
  description:
    "Interactive 3D repair training. Inspect a virtual laptop, gather clues, diagnose the fault, and choose a safe repair. Built with Aholo Lux3D.",
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#080D1B",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-dvh bg-ink antialiased`}>
        {children}
      </body>
    </html>
  );
}
