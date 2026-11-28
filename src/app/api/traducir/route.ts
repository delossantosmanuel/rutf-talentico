import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const textos: string[] = Array.isArray(body?.textos) ? body.textos : [];
    const destino: string = String(body?.destino || "es");
    if (!textos.length || destino === "es") {
      return NextResponse.json({ traducciones: {} });
    }

    const resultados: Record<string, string> = {};
    await Promise.all(
      textos.slice(0, 60).map(async (txt) => {
        try {
          const url = "https://googleapis.com" + encodeURIComponent(destino) + "&dt=t&q=" + encodeURIComponent(txt);
          const r = await fetch(url);
          const d = await r.json();
          const bloques = Array.isArray(d) ? d[0] : null;
          const tr = Array.isArray(bloques)
            ? bloques.map((s: unknown) => (Array.isArray(s) ? String(s[0] || "") : "")).join("")
            : txt;
          resultados[txt] = tr || txt;
        } catch {
          resultados[txt] = txt;
        }
      })
    );

    return NextResponse.json({ traducciones: resultados });
  } catch {
    return NextResponse.json({ traducciones: {} });
  }
}