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
const pendientes = new Set<string>();

function leerCache(codigo: string): Record<string, string> {
  if (cacheMemoria[codigo]) return cacheMemoria[codigo];
  try {
    const raw = localStorage.getItem("rutf_trad_" + codigo);
    cacheMemoria[codigo] = raw ? JSON.parse(raw) : {};
  } catch {
    cacheMemoria[codigo] = {};
  }
  return cacheMemoria[codigo];
}

function guardarCache(codigo: string, mapa: Record<string, string>) {
  cacheMemoria[codigo] = mapa;
  try {
    localStorage.setItem("rutf_trad_" + codigo, JSON.stringify(mapa));
  } catch {}
}

async function traducirTextoReal(texto: string, codigo: string): Promise<string> {
  const mapa = leerCache(codigo);
  if (mapa[texto]) return mapa[texto];
  const clave = codigo + "::" + texto;
  if (pendientes.has(clave)) return texto;
  pendientes.add(clave);
  try {
    const url = "https://googleapis.com" + encodeURIComponent(codigo) + "&dt=t&q=" + encodeURIComponent(texto);
    const res = await fetch(url);
    const data = await res.json();
    const traducido = Array.isArray(data?.[0]) ? data[0].map((seg: unknown[]) => seg?.[0] || "").join("") : texto;
    if (traducido) {
      mapa[texto] = traducido;
      guardarCache(codigo, mapa);
      return traducido;
    }
  } catch {} finally {
    pendientes.delete(clave);
  }
  return texto;
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

export function aplicarIdiomaPlataforma(codigo: string) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = codigo || "es";
  const mapa = codigo !== "es" ? leerCache(codigo) : {};

  document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input[placeholder], textarea[placeholder]").forEach((el) => {
    if (el.closest("[data-sin-traducir='true']")) return;
    const origPh = el.getAttribute("data-ph-orig") ?? el.placeholder;
    if (!el.hasAttribute("data-ph-orig")) el.setAttribute("data-ph-orig", origPh);
    if (codigo === "es") {
      el.placeholder = origPh;
    } else if (mapa[origPh]) {
      el.placeholder = mapa[origPh];
    } else if (esTraducible(origPh)) {
      traducirTextoReal(origPh, codigo).then((tr) => {
        if ((localStorage.getItem("rutf_idioma") || "es") === codigo) el.placeholder = tr;
      });
    }
  });

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let nodo = walker.nextNode();
  while (nodo) {
    const padre = nodo.parentElement;
    if (padre && !padre.closest("[data-sin-traducir='true']")) {
      const ref = nodo as unknown as { _rutfOrig?: string };
      if (ref._rutfOrig === undefined) ref._rutfOrig = nodo.nodeValue || "";
      const base = ref._rutfOrig;
      const limpio = base.trim();
      if (codigo === "es") {
        nodo.nodeValue = base;
      } else if (esTraducible(limpio)) {
        if (mapa[limpio]) {
          nodo.nodeValue = base.replace(limpio, mapa[limpio]);
        } else {
          const nodoActual = nodo;
          traducirTextoReal(limpio, codigo).then((tr) => {
            if ((localStorage.getItem("rutf_idioma") || "es") === codigo) {
              nodoActual.nodeValue = base.replace(limpio, tr);
            }
          });
        }
      }
    }
    nodo = walker.nextNode();
  }
}

