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
  { codigo: "ar", nativo: "العربية", espanol: "Árabe", region: "Medio Oriente" },
  { codigo: "hi", nativo: "हिन्दी", espanol: "Hindi", region: "India" },
  { codigo: "zh", nativo: "中文 (简体)", espanol: "Chino", region: "China" },
  { codigo: "ja", nativo: "日本語", espanol: "Japonés", region: "Japón" },
  { codigo: "ko", nativo: "한국어", espanol: "Coreano", region: "Corea" },
  { codigo: "ru", nativo: "Русский", espanol: "Ruso", region: "Rusia" }
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
    "Confirmar": "Confirm",
    "Aplicando...": "Applying...",
    "VIDEOS": "VIDEOS",
    "FAN": "FAN",
    "FANS": "FANS",
    "ALCANCE TOTAL": "TOTAL REACH",
    "Fecha de creación": "Creation date",
    "Miembro fundador": "Founding member",
    "Fans totales": "Total fans",
    "Alcance histórico": "Historical reach",
    "DESCRIPCIÓN DEL CANAL": "CHANNEL DESCRIPTION",
    "Mis Videos Publicados": "My Published Videos",
    "Videos Publicados": "Published Videos",
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
    "Debes contar con al menos 5 videos originales de tu propia creación o talento. No se acepta contenido copiado ni resubido sin autorización.": "You must have at least 5 original videos of your own creation or talent. Copied or unauthorized re-uploaded content is not accepted.",
    "¿Cómo funcionan los pagos por PayPal?": "How do PayPal payouts work?",
    "Al alcanzar los 100 Fans reales, 1,000 vistas calificadas (+16s) y 5 videos originales, se desbloquea el botón para vincular tu correo de PayPal.": "Upon reaching 100 real Fans, 1,000 qualified views (+16s), and 5 original videos, the button to link your PayPal email unlocks.",
    "¿Cuánto tarda la revisión cuando cumplo los requisitos?": "How long does review take once I meet the requirements?",
    "Nuestro equipo revisa la autenticidad de tu audiencia y tus videos en un plazo de 24 a 72 horas hábiles tras vincular tu cuenta.": "Our team reviews the authenticity of your audience and videos within 24 to 72 business hours after linking your account.",
    "¿Qué ocurre si se detectan bots o contenido resubido?": "What happens if bots or re-uploaded content are detected?",
    "Cualquier manipulación artificial de Fans, vistas automatizadas o resubida de videos ajenos conlleva la suspensión permanente de la monetización.": "Any artificial manipulation of Fans, automated views, or re-uploading of others' videos results in permanent suspension of monetization.",
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
  },
  pt: {
    "Inicio": "Início",
    "Escenario Principal": "Palco Principal",
    "Verticales": "Verticais",
    "Verticales / Shorts": "Verticais / Shorts",
    "Talentos Verticales": "Talentos Verticais",
    "Crear Short": "Criar Short",
    "Ver en pantalla completa": "Ver em tela cheia",
    "Subir": "Enviar",
    "Subir Video": "Enviar Vídeo",
    "Monetización": "Monetização",
    "Fundación": "Fundação",
    "Buscar talento, título o @canal...": "Buscar talento, título ou @canal...",
    "Buscar idioma o país...": "Buscar idioma ou país...",
    "Volver": "Voltar",
    "Editar Descripción": "Editar Descrição",
    "Editar canal": "Editar canal",
    "Información del canal": "Informações do canal",
    "Idioma del Escenario": "Idioma do Palco",
    "Confirmar": "Confirmar",
    "Aplicando...": "Aplicando...",
    "Cerrar sesión": "Sair",
    "Preguntas Frecuentes sobre Monetización y Pagos": "Perguntas Frequentes sobre Monetização e Pagamentos",
    "¿Qué cuenta como una vista calificada (+16s)?": "O que conta como uma visualização qualificada (+16s)?",
    "Únicamente las reproducciones orgánicas de usuarios reales que permanecen viendo tu video de forma continua durante más de 16 segundos.": "Apenas reproduções orgânicas de usuários reais que assistem ao seu vídeo continuamente por mais de 16 segundos.",
    "¿Qué contenido se necesita para ser aprobado?": "Qual conteúdo é necessário para ser aprovado?",
    "Debes contar con al menos 5 videos originales de tu propia creación o talento. No se acepta contenido copiado ni resubido sin autorización.": "Você deve ter pelo menos 5 vídeos originais de sua própria criação ou talento. Conteúdo copiado ou reenviado sem autorização não é aceito.",
    "¿Cómo funcionan los pagos por PayPal?": "Como funcionam os pagamentos via PayPal?",
    "Al alcanzar los 100 Fans reales, 1,000 vistas calificadas (+16s) y 5 videos originales, se desbloquea el botón para vincular tu correo de PayPal.": "Ao atingir 100 Fãs reais, 1.000 visualizações qualificadas (+16s) e 5 vídeos originais, o botão para vincular seu e-mail do PayPal é desbloqueado.",
    "¿Cuánto tarda la revisión cuando cumplo los requisitos?": "Quanto tempo leva a análise quando cumpro os requisitos?",
    "Nuestro equipo revisa la autenticidad de tu audiencia y tus videos en un plazo de 24 a 72 horas hábiles tras vincular tu cuenta.": "Nossa equipe analisa a autenticidade do seu público e vídeos em um prazo de 24 a 72 horas úteis após vincular sua conta.",
    "¿Qué ocurre si se detectan bots o contenido resubido?": "O que acontece se forem detectados bots ou conteúdo reenviado?",
    "Cualquier manipulación artificial de Fans, vistas automatizadas o resubida de videos ajenos conlleva la suspensión permanente de la monetización.": "Qualquer manipulação artificial de Fãs, visualizações automatizadas ou reenvio de vídeos de terceiros resulta na suspensão permanente da monetização."
  },
  fr: {
    "Inicio": "Accueil",
    "Escenario Principal": "Scène Principale",
    "Verticales": "Verticaux",
    "Verticales / Shorts": "Verticaux / Shorts",
    "Subir": "Publier",
    "Subir Video": "Publier une vidéo",
    "Monetización": "Monétisation",
    "Fundación": "Fondation",
    "Buscar talento, título o @canal...": "Rechercher un talent, un titre ou @chaîne...",
    "Buscar idioma o país...": "Rechercher une langue ou un pays...",
    "Volver": "Retour",
    "Editar Descripción": "Modifier la description",
    "Editar canal": "Modifier la chaîne",
    "Información del canal": "Informations sur la chaîne",
    "Idioma del Escenario": "Langue de la Scène",
    "Confirmar": "Confirmer",
    "Aplicando...": "Application...",
    "Cerrar sesión": "Déconnexion",
    "Preguntas Frecuentes sobre Monetización y Pagos": "Questions Fréquentes sur la Monétisation et les Paiements",
    "¿Qué cuenta como una vista calificada (+16s)?": "Qu'est-ce qui compte comme une vue qualifiée (+16s) ?",
    "Únicamente las reproducciones orgánicas de usuarios reales que permanecen viendo tu video de forma continua durante más de 16 segundos.": "Uniquement les lectures organiques d'utilisateurs réels qui regardent votre vidéo en continu pendant plus de 16 secondes.",
    "¿Qué contenido se necesita para ser aprobado?": "Quel contenu est requis pour être approuvé ?",
    "Debes contar con al menos 5 videos originales de tu propia creación o talento. No se acepta contenido copiado ni resubido sin autorización.": "Vous devez disposer d'au moins 5 vidéos originales de votre propre création ou talent. Le contenu copié ou republié sans autorisation n'est pas accepté.",
    "¿Cómo funcionan los pagos por PayPal?": "Comment fonctionnent les paiements PayPal ?",
    "Al alcanzar los 100 Fans reales, 1,000 vistas calificadas (+16s) y 5 videos originales, se desbloquea el botón para vincular tu correo de PayPal.": "En atteignant 100 vrais Fans, 1 000 vues qualifiées (+16s) et 5 vidéos originales, le bouton pour lier votre e-mail PayPal se débloque.",
    "¿Cuánto tarda la revisión cuando cumplo los requisitos?": "Combien de temps prend l'examen une fois les conditions remplies ?",
    "Nuestro equipo revisa la autenticidad de tu audiencia y tus videos en un plazo de 24 a 72 horas hábiles tras vincular tu cuenta.": "Notre équipe vérifie l'authenticité de votre audience et de vos vidéos sous 24 à 72 heures ouvrées après avoir lié votre compte.",
    "¿Qué ocurre si se detectan bots o contenido resubido?": "Que se passe-t-il si des bots ou du contenu republié sont détectés ?",
    "Cualquier manipulación artificial de Fans, vistas automatizadas o resubida de videos ajenos conlleva la suspensión permanente de la monetización.": "Toute manipulation artificielle de Fans, vues automatisées ou republication de vidéos d'autrui entraîne la suspension permanente de la monétisation."
  },
  it: {
    "Inicio": "Home",
    "Escenario Principal": "Palco Principale",
    "Verticales": "Verticali",
    "Subir": "Carica",
    "Subir Video": "Carica Video",
    "Monetización": "Monetizzazione",
    "Fundación": "Fondazione",
    "Volver": "Indietro",
    "Editar Descripción": "Modifica Descrizione",
    "Editar canal": "Modifica canale",
    "Información del canal": "Informazioni sul canale",
    "Idioma del Escenario": "Lingua del Palco",
    "Confirmar": "Conferma",
    "Aplicando...": "Applicazione...",
    "Cerrar sesión": "Disconnetti",
    "Preguntas Frecuentes sobre Monetización y Pagos": "Domande Frequenti su Monetizzazione e Pagamenti"
  },
  de: {
    "Inicio": "Startseite",
    "Escenario Principal": "Hauptbühne",
    "Verticales": "Vertikale",
    "Subir": "Hochladen",
    "Subir Video": "Video hochladen",
    "Monetización": "Monetarisierung",
    "Fundación": "Stiftung",
    "Volver": "Zurück",
    "Editar Descripción": "Beschreibung bearbeiten",
    "Editar canal": "Kanal bearbeiten",
    "Información del canal": "Kanalinformationen",
    "Idioma del Escenario": "Bühnensprache",
    "Confirmar": "Bestätigen",
    "Aplicando...": "Wird angewendet...",
    "Cerrar sesión": "Abmelden",
    "Preguntas Frecuentes sobre Monetización y Pagos": "Häufig gestellte Fragen zu Monetarisierung und Auszahlungen"
  }
};
export function obtenerNombreIdioma(codigo: string): string {
  return IDIOMAS_MUNDO.find((i) => i.codigo === codigo)?.nativo || "Español";
}

export async function aplicarIdiomaPlataforma(codigo: string): Promise<void> {
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