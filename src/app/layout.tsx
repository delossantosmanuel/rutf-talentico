import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RUTF Talentico — Tu talento vale, paso a paso",
  description: "Plataforma oficial de talento en República Dominicana y el mundo. Sube videos largos y verticales, diseña tu canal y crece paso a paso.",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo-rt.png",
    apple: "/logo-rt.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "RUTF Talentico",
  },
};

export const viewport: Viewport = {
  themeColor: "#dc2626",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="antialiased bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
