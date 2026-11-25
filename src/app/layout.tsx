import type { Metadata, Viewport } from "next";
import "./globals.css";
import AdMobManager from "./AdMobManager";

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<{ v?: string }>;
}): Promise<Metadata> {
  const baseUrl = "https://vercel.app";
  const resolved = searchParams ? await searchParams : undefined;
  const videoId = resolved?.v;

  let titulo = "RUTF Talentico — Tu talento vale, paso a paso";
  let descripcion =
    "Comparte tu talento original, haz crecer tu comunidad y monetiza tus videos en RUTF Talentico.";
  let url = baseUrl;
  let imagen = `${baseUrl}/logo-rutf.png`;

  if (
    videoId &&
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/videos?id=eq.${encodeURIComponent(
          videoId
        )}&select=titulo,creador,descripcion,miniatura_url`,
        {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          next: { revalidate: 60 },
        }
      );
      const rows = await res.json();
      const vRow = Array.isArray(rows) ? rows.at(0) : null;
      if (vRow) {
        titulo = `${vRow.titulo} • ${vRow.creador} | RUTF Talentico`;
        descripcion =
          vRow.descripcion?.trim() ||
          `Mira este talento original publicado por ${vRow.creador} en RUTF Talentico.`;
        url = `${baseUrl}/?v=${videoId}`;
        if (vRow.miniatura_url) imagen = vRow.miniatura_url;
      }
    } catch {}
  }

  return {
    metadataBase: new URL(baseUrl),
    title: titulo,
    description: descripcion,
    icons: {
      icon: "/logo-rutf.png",
      shortcut: "/logo-rutf.png",
      apple: "/logo-rutf.png",
    },
    openGraph: {
      type: "website",
      siteName: "RUTF Talentico",
      title: titulo,
      description: descripcion,
      url,
      images: [
        {
          url: imagen,
          width: 960,
          height: 540,
          alt: titulo,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: titulo,
      description: descripcion,
      images: [imagen],
    },
    appleWebApp: {
      title: "RUTF Talentico",
    },
  };
}

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
