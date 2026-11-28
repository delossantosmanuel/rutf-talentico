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

const DICCIONARIO_UI: Record<string, Record<string, string>> = {
  en: {
    "Inicio": "Home",
    "Escenario Principal": "Main Stage",
    "Verticales": "Verticals",
    "Verticales / Shorts": "Verticals / Shorts",
    "Talentos Verticales": "Vertical Talents",
    "Crear Short": "Create Short",
    "Ver en pantalla completa": "Watch full screen",
    "Subir": "Upload",
    "Subir Video": "Upload Video",
    "Monetización": "Monetization",
    "Fundación": "Foundation",
    "Buscar talento, título o @canal...": "Search talent, title or @channel...",
    "Buscar idioma o país...": "Search language or country...",
    "Cuenta activa": "Active account",
    "Canales": "Channels",
    "Ver canal →": "View channel →",
    "Eres Fan ✓": "You're a Fan ✓",
    "Hazte Fan": "Become a Fan",
    "Cerrar": "Close",
    "Cerrar sesión": "Sign out",
    "Volver": "Back",
    "Editar Descripción": "Edit Description",
    "Editar canal": "Edit channel",
    "Cerrar edición": "Close editor",
    "Información del canal": "Channel information",
    "Idioma del Escenario": "Stage Language",
    "Confirmar idioma": "Confirm language",
    "VIDEOS": "VIDEOS",
    "FAN": "FAN",
    "FANS": "FANS",
    "ALCANCE TOTAL": "TOTAL REACH",
    "Fecha de creación": "Creation date",
    "Miembro fundador": "Founding member",
    "Fans totales": "Total fans",
    "Alcance histórico": "Historical reach",
    "DESCRIPCIÓN DEL CANAL": "CHANNEL DESCRIPTION",
    "Sube tu primer video y empieza a monetizar tu talento": "Upload your first video and start monetizing your talent",
    "Este canal aún no ha subido ningún video": "This channel hasn't uploaded any videos yet",
    "Agrega tu descripción y haz destacar tu talento.": "Add your description and make your talent stand out.",
    "Este canal aún no ha agregado una descripción.": "This channel hasn't added a description yet.",
    "Lanzar Vertical": "Launch Vertical",
    "Publica tu talento en 9:16": "Publish your talent in 9:16",
    "Sé el primero en comentar este video.": "Be the first to comment on this video.",
    "Sé el primero en comentar este talento.": "Be the first to comment on this talent.",
    "Inicia sesión primero para poder comentar": "Sign in first to comment",
    "Comentar": "Comment",
    "Compartir": "Share",
    "Aportar": "Support",
    "En escena": "On stage",
    "Tu Canal": "Your Channel",
    "Tu canal": "Your channel",
    "Impulsa tu talento y monetiza tus videos": "Boost your talent and monetize your videos",
    "¡Crea tu primer Short y hazte viral en RUTF Talentico!": "Create your first Short and go viral on RUTF Talentico!",
    "Desliza a la derecha para más talentos": "Swipe right for more talents",
    "más": "more",
    "PROGRAMA DE CREADORES RUTF TALENTICO": "RUTF TALENTICO CREATOR PROGRAM",
    "Monetiza tu talento original y genera ingresos reales": "Monetize your original talent and earn real income",
    "Al completar los 3 requisitos del canal, activamos tus pagos directos por PayPal.": "Once you complete all 3 channel requirements, we activate your direct PayPal payouts.",
    "ACCESO OFICIAL FUNDADOR": "OFFICIAL FOUNDER ACCESS",
    "Solicitudes de Retiro y Pagos PayPal": "Withdrawal Requests & PayPal Payouts",
    "Revisar Solicitudes →": "Review Requests →",
    "Requisitos de Elegibilidad en Tiempo Real": "Real-Time Eligibility Requirements",
    "Actualizar": "Refresh",
    "En progreso": "In progress",
    "Fans reales": "Real fans",
    "Vistas calificadas (+16s)": "Qualified views (+16s)",
    "Videos originales": "Original videos",
    "Completa los 3 requisitos para activar tus pagos": "Complete all 3 requirements to activate your payouts",
    "Desbloquear Monetización (Pagos vía PayPal)": "Unlock Monetization (PayPal Payouts)",
    "Preguntas Frecuentes sobre Monetización y Pagos": "Frequently Asked Questions on Monetization & Payouts",
    "¿Qué cuenta como una vista calificada (+16s)?": "What counts as a qualified view (+16s)?",
    "Únicamente las reproducciones orgánicas de usuarios reales que permanecen viendo tu video de forma continua durante más de 16 segundos.": "Only organic plays from real users who watch your video continuously for more than 16 seconds.",
    "¿Qué contenido se necesita para ser aprobado?": "What content is required for approval?",
    "¿Cómo funcionan los pagos por PayPal?": "How do PayPal payouts work?",
    "¿Cuánto tarda la revisión cuando cumplo los requisitos?": "How long does review take once I meet the requirements?",
    "¿Qué ocurre si se detectan bots o contenido resubido?": "What happens if bots or re-uploaded content are detected?",
    "Publicar en RUTF Talentico": "Publish on RUTF Talentico",
    "Publicando como canal único protegido": "Publishing as a protected unique channel",
    "Formato del Video": "Video Format",
    "Video Horizontal (16:9)": "Horizontal Video (16:9)",
    "Short Vertical (9:16)": "Vertical Short (9:16)",
    "Título del Talent": "Talent Title",
    "Título del Talento": "Talent Title",
    "Historia y Contexto del Talento": "Talent Story & Context",
    "Mínimo 20 caracteres": "Minimum 20 characters",
    "Esencia de este Video": "Essence of this Video",
    "Selecciona el talento principal de esta publicación": "Select the main talent of this post",
    "Toca aquí para elegir tu video (.mp4 / .mov)": "Tap here to choose your video (.mp4 / .mov)",
    "Miniatura / Portada del Video (Opcional)": "Video Thumbnail / Cover (Optional)",
    "Elegir Portada de Escenario": "Choose Stage Cover",
    "VERIFICACIÓN DE AUTORÍA OBLIGATORIA": "MANDATORY AUTHORSHIP VERIFICATION",
    "Selecciona un video para publicar": "Select a video to publish"
  }
};

export function obtenerNombreIdioma(codigo: string): string {
  return IDIOMAS_MUNDO.find((i) => i.codigo === codigo)?.nativo || "Español";
}

export function aplicarIdiomaPlataforma(codigo: string) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = codigo || "es";
  const mapa = DICCIONARIO_UI[codigo] || {};

  document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input[placeholder], textarea[placeholder]").forEach((el) => {
    if (el.closest("[data-sin-traducir='true']")) return;
    const origPh = el.getAttribute("data-ph-orig") ?? el.placeholder;
    if (!el.hasAttribute("data-ph-orig")) el.setAttribute("data-ph-orig", origPh);
    if (codigo === "es") {
      el.placeholder = origPh;
    } else if (mapa[origPh]) {
      el.placeholder = mapa[origPh];
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
      } else if (limpio && mapa[limpio]) {
        nodo.nodeValue = base.replace(limpio, mapa[limpio]);
      }
    }
    nodo = walker.nextNode();
  }
}