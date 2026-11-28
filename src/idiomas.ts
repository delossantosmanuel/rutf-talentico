export interface IdiomaOpcion {
  codigo: string;
  nativo: string;
  espanol: string;
  region: string;
}

export const IDIOMAS_MUNDO: IdiomaOpcion[] = [
  { codigo: "es", nativo: "Español", espanol: "Español", region: "Global / Latinoamérica / España" },
  { codigo: "en", nativo: "English", espanol: "Inglés", region: "Global / EE. UU. / Reino Unido" },
  { codigo: "pt", nativo: "Português", espanol: "Portugués", region: "Brasil / Portugal" },
  { codigo: "fr", nativo: "Français", espanol: "Francés", region: "Francia / Canadá / África" },
  { codigo: "it", nativo: "Italiano", espanol: "Italiano", region: "Italia / Suiza" },
  { codigo: "de", nativo: "Deutsch", espanol: "Alemán", region: "Alemania / Austria / Suiza" },
  { codigo: "ar", nativo: "العربية", espanol: "Árabe", region: "Medio Oriente / Norte de África" },
  { codigo: "hi", nativo: "हिन्दी", espanol: "Hindi", region: "India" },
  { codigo: "zh", nativo: "中文 (简体)", espanol: "Chino", region: "China / Singapur" },
  { codigo: "ja", nativo: "日本語", espanol: "Japonés", region: "Japón" },
  { codigo: "ko", nativo: "한국어", espanol: "Coreano", region: "Corea del Sur" },
  { codigo: "ru", nativo: "Русский", espanol: "Ruso", region: "Rusia / Europa del Este" },
  { codigo: "tr", nativo: "Türkçe", espanol: "Turco", region: "Turquía" },
  { codigo: "nl", nativo: "Nederlands", espanol: "Neerlandés", region: "Países Bajos / Bélgica" },
  { codigo: "pl", nativo: "Polski", espanol: "Polaco", region: "Polonia" },
  { codigo: "sv", nativo: "Svenska", espanol: "Sueco", region: "Suecia" },
  { codigo: "id", nativo: "Bahasa Indonesia", espanol: "Indonesio", region: "Indonesia" },
  { codigo: "tl", nativo: "Filipino / Tagalog", espanol: "Filipino", region: "Filipinas" },
  { codigo: "vi", nativo: "Tiếng Việt", espanol: "Vietnamita", region: "Vietnam" },
  { codigo: "th", nativo: "ไทย", espanol: "Tailandés", region: "Tailandia" },
  { codigo: "uk", nativo: "Українська", espanol: "Ucraniano", region: "Ucrania" },
  { codigo: "el", nativo: "Ελληνικά", espanol: "Griego", region: "Grecia / Chipre" },
  { codigo: "he", nativo: "עברית", espanol: "Hebreo", region: "Israel" },
  { codigo: "ro", nativo: "Română", espanol: "Rumano", region: "Rumanía / Moldavia" },
  { codigo: "ca", nativo: "Català", espanol: "Catalán", region: "Cataluña / Andorra" }
];

const cacheMemoria: Record<string, Record<string, string>> = {};
let enProceso = false;

function leerCache(codigo: string): Record<string, string> {
  if (cacheMemoria[codigo]) return cacheMemoria[codigo];
  try {
    const raw = localStorage.getItem("rutf_trad_v3_" + codigo);
    cacheMemoria[codigo] = raw ? JSON.parse(raw) : {};
  } catch {
    cacheMemoria[codigo] = {};
  }
  return cacheMemoria[codigo];
}

function guardarCache(codigo: string, mapa: Record<string, string>) {
  cacheMemoria[codigo] = mapa;
  try {
    localStorage.setItem("rutf_trad_v3_" + codigo, JSON.stringify(mapa));
  } catch {}
}

function esTraducible(texto: string): boolean {
  const t = texto.trim();
  if (t.length < 2) return false;
  if (/^[@0-9.,:/+$%•·\-–—()✓×]+$/.test(t)) return false;
  if (t === "RUTF TALENTICO" || t === "RUTF Talentico" || t === "RUTF Pro" || t === "RUTF Ads" || t === "PayPal") return false;
  return true;
}

export function obtenerNombreIdioma(codigo: string): string {
  return IDIOMAS_MUNDO.find((i) => i.codigo === codigo)?.nativo || "Español";
}

export async function aplicarIdiomaPlataforma(codigo: string): Promise<void> {
  if (typeof document === "undefined") return;
  document.documentElement.lang = codigo || "es";
  const mapa = codigo !== "es" ? leerCache(codigo) : {};
  const faltantes = new Set<string>();

  const inputs = Array.from(document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input[placeholder], textarea[placeholder]"));
  for (const el of inputs) {
    if (el.closest("[data-sin-traducir='true']")) continue;
    const origPh = el.getAttribute("data-ph-orig") ?? el.placeholder;
    if (!el.hasAttribute("data-ph-orig")) el.setAttribute("data-ph-orig", origPh);
    if (codigo === "es") {
      el.placeholder = origPh;
    } else if (mapa[origPh]) {
      el.placeholder = mapa[origPh];
    } else if (esTraducible(origPh)) {
      faltantes.add(origPh);
    }
  }

  const nodos: { nodo: Text; base: string; limpio: string }[] = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let actual = walker.nextNode();
  while (actual) {
    const padre = actual.parentElement;
    if (padre && !padre.closest("[data-sin-traducir='true']")) {
      const ref = actual as unknown as { _rutfOrig?: string };
      if (ref._rutfOrig === undefined) ref._rutfOrig = actual.nodeValue || "";
      const base = ref._rutfOrig;
      const limpio = base.trim();
      if (codigo === "es") {
        actual.nodeValue = base;
      } else if (esTraducible(limpio)) {
        if (mapa[limpio]) {
          actual.nodeValue = base.replace(limpio, mapa[limpio]);
        } else {
          faltantes.add(limpio);
          nodos.push({ nodo: actual as Text, base, limpio });
        }
      }
    }
    actual = walker.nextNode();
  }

  if (codigo !== "es" && faltantes.size > 0 && !enProceso) {
    enProceso = true;
    try {
      const res = await fetch("/api/traducir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ textos: Array.from(faltantes), destino: codigo })
      });
      const json = await res.json();
      const nuevas: Record<string, string> = json?.traducciones || {};
      Object.assign(mapa, nuevas);
      guardarCache(codigo, mapa);

      for (const el of inputs) {
        const origPh = el.getAttribute("data-ph-orig") || "";
        if (origPh && mapa[origPh]) el.placeholder = mapa[origPh];
      }
      for (const item of nodos) {
        if (mapa[item.limpio]) {
          item.nodo.nodeValue = item.base.replace(item.limpio, mapa[item.limpio]);
        }
      }
    } catch {} finally {
      enProceso = false;
    }
  }
}