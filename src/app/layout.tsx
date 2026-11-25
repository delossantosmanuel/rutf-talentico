import type { Metadata, Viewport } from "next";
import "./globals.css";
import AdMobManager from "./AdMobManager";

export const metadata: Metadata = {
  title: "RUTF Talentico — Tu talento vale, paso a paso",
  description:
    "Comparte tu talento original, haz crecer tu comunidad y monetiza tus videos en RUTF Talentico.",
  icons: {
    icon: "/logo-rutf.png",
    shortcut: "/logo-rutf.png",
    apple: "/logo-rutf.png",
  },
  openGraph: {
    title: "RUTF Talentico — Tu talento vale, paso a paso",
    description:
      "Plataforma global de videos y talentos originales. Publica tu arte y monetiza tu contenido.",
    images: ["/logo-rutf.png"],
  },
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
