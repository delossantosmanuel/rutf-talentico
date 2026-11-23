import type { Metadata, Viewport } from "next";
import "./globals.css";
import AdMobManager from "./AdMobManager";

export const metadata: Metadata = {
  title: "RUTF Talentico",
  description: "Plataforma oficial de RUTF Talentico",
  appleWebApp: {
    title: "RUTF Talentico",
  },
};

export const viewport: Viewport = {
  themeColor: "#dc2626",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased bg-slate-50 text-slate-900 pb-16">
        <AdMobManager />
        {children}
      </body>
    </html>
  );
}
