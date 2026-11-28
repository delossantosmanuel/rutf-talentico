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
    "Escenario Principal": "Main Stage",
    "Verticales": "Verticals",
    "Verticales / Shorts": "Verticals / Shorts",
    "Ver en pantalla completa": "Watch full screen",
    "Subir": "Upload",
    "Subir Video": "Upload Video",
    "Monetización": "Monetization",
    "Fundación": "Foundation",
    "Buscar talento, título o @canal...": "Search talent, title or @channel...",
    "Volver": "Back",
    "Editar Descripción": "Edit Description",
    "Editar canal": "Edit channel",
    "Cerrar edición": "Close editor",
    "Información del canal": "Channel information",
    "Idioma del Escenario": "Stage Language",
    "Cerrar sesión": "Sign out",
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
    "Hazte Fan": "Become a Fan",
    "Lanzar Vertical": "Launch Vertical",
    "Publica tu talento en 9:16": "Publish your talent in 9:16",
    "más": "more"
  },
  pt: {
    "Escenario Principal": "Palco Principal",
    "Verticales": "Verticais",
    "Verticales / Shorts": "Verticais / Shorts",
    "Ver en pantalla completa": "Ver em tela cheia",
    "Subir": "Enviar",
    "Subir Video": "Enviar Vídeo",
    "Monetización": "Monetização",
    "Fundación": "Fundação",
    "Buscar talento, título o @canal...": "Buscar talento, título ou @canal...",
    "Volver": "Voltar",
    "Editar Descripción": "Editar Descrição",
    "Editar canal": "Editar canal",
    "Cerrar edición": "Fechar edição",
    "Información del canal": "Informações do canal",
    "Idioma del Escenario": "Idioma do Palco",
    "Cerrar sesión": "Sair",
    "VIDEOS": "VÍDEOS",
    "FAN": "FÃ",
    "FANS": "FÃS",
    "ALCANCE TOTAL": "ALCANCE TOTAL",
    "Fecha de creación": "Data de criação",
    "Miembro fundador": "Membro fundador",
    "Fans totales": "Total de fãs",
    "Alcance histórico": "Alcance histórico",
    "DESCRIPCIÓN DEL CANAL": "DESCRIÇÃO DO CANAL",
    "Sube tu primer video y empieza a monetizar tu talento": "Envie seu primeiro vídeo e comece a monetizar seu talento",
    "Este canal aún no ha subido ningún video": "Este canal ainda não enviou nenhum vídeo",
    "Agrega tu descripción y haz destacar tu talento.": "Adicione sua descrição e destaque seu talento.",
    "Este canal aún no ha agregado una descripción.": "Este canal ainda não adicionou uma descrição.",
    "Hazte Fan": "Virar Fã",
    "Lanzar Vertical": "Lançar Vertical",
    "Publica tu talento en 9:16": "Publique seu talento em 9:16",
    "más": "mais"
  },
  fr: {
    "Escenario Principal": "Scène Principale",
    "Verticales": "Verticaux",
    "Verticales / Shorts": "Verticaux / Shorts",
    "Ver en pantalla completa": "Voir en plein écran",
    "Subir": "Publier",
    "Subir Video": "Publier une vidéo",
    "Monetización": "Monétisation",
    "Fundación": "Fondation",
    "Buscar talento, título o @canal...": "Rechercher un talent, un titre ou @chaîne...",
    "Volver": "Retour",
    "Editar Descripción": "Modifier la description",
    "Editar canal": "Modifier la chaîne",
    "Cerrar edición": "Fermer l'édition",
    "Información del canal": "Informations sur la chaîne",
    "Idioma del Escenario": "Langue de la Scène",
    "Cerrar sesión": "Déconnexion",
    "VIDEOS": "VIDÉOS",
    "FAN": "FAN",
    "FANS": "FANS",
    "ALCANCE TOTAL": "PORTÉE TOTALE",
    "Fecha de creación": "Date de création",
    "Miembro fundador": "Membre fondateur",
    "Fans totales": "Total des fans",
    "Alcance histórico": "Portée historique",
    "DESCRIPCIÓN DEL CANAL": "DESCRIPTION DE LA CHAÎNE",
    "Sube tu primer video y empieza a monetizar tu talento": "Publiez votre première vidéo et monétisez votre talent",
    "Este canal aún no ha subido ningún video": "Cette chaîne n'a pas encore publié de vidéo",
    "Agrega tu descripción y haz destacar tu talento.": "Ajoutez votre description et mettez votre talent en valeur.",
    "Este canal aún no ha agregado una descripción.": "Cette chaîne n'a pas encore ajouté de description.",
    "Hazte Fan": "Devenir Fan",
    "Lanzar Vertical": "Lancer un Vertical",
    "Publica tu talento en 9:16": "Publiez votre talent en 9:16",
    "más": "plus"
  },
  it: {
    "Escenario Principal": "Palco Principale",
    "Verticales": "Verticali",
    "Verticales / Shorts": "Verticali / Shorts",
    "Ver en pantalla completa": "Guarda a schermo intero",
    "Subir": "Carica",
    "Subir Video": "Carica Video",
    "Monetización": "Monetizzazione",
    "Fundación": "Fondazione",
    "Buscar talento, título o @canal...": "Cerca talento, titolo o @canale...",
    "Volver": "Indietro",
    "Editar Descripción": "Modifica Descrizione",
    "Editar canal": "Modifica canale",
    "Cerrar edición": "Chiudi modifica",
    "Información del canal": "Informazioni sul canale",
    "Idioma del Escenario": "Lingua del Palco",
    "Cerrar sesión": "Disconnetti",
    "VIDEOS": "VIDEO",
    "FAN": "FAN",
    "FANS": "FAN",
    "ALCANCE TOTAL": "COPERTURA TOTALE",
    "Fecha de creación": "Data di creazione",
    "Miembro fundador": "Membro fondatore",
    "Fans totales": "Fan totali",
    "Alcance histórico": "Copertura storica",
    "DESCRIPCIÓN DEL CANAL": "DESCRIZIONE DEL CANALE",
    "Sube tu primer video y empieza a monetizar tu talento": "Carica il tuo primo video e inizia a monetizzare il tuo talento",
    "Este canal aún no ha subido ningún video": "Questo canale non ha ancora caricato alcun video",
    "Agrega tu descripción y haz destacar tu talento.": "Aggiungi la tua descrizione e fai emergere il tuo talento.",
    "Este canal aún no ha aggiunto una descrizione.": "Questo canale non ha ancora aggiunto una descrizione.",
    "Hazte Fan": "Diventa Fan",
    "Lanzar Vertical": "Lancia Verticale",
    "Publica tu talento en 9:16": "Pubblica il tuo talento in 9:16",
    "más": "altro"
  },
  de: {
    "Escenario Principal": "Hauptbühne",
    "Verticales": "Vertikale",
    "Verticales / Shorts": "Vertikale / Shorts",
    "Ver en pantalla completa": "Vollbild ansehen",
    "Subir": "Hochladen",
    "Subir Video": "Video hochladen",
    "Monetización": "Monetarisierung",
    "Fundación": "Stiftung",
    "Buscar talento, título o @canal...": "Talent, Titel oder @Kanal suchen...",
    "Volver": "Zurück",
    "Editar Descripción": "Beschreibung bearbeiten",
    "Editar canal": "Kanal bearbeiten",
    "Cerrar edición": "Bearbeitung schließen",
    "Información del canal": "Kanalinformationen",
    "Idioma del Escenario": "Bühnensprache",
    "Cerrar sesión": "Abmelden",
    "VIDEOS": "VIDEOS",
    "FAN": "FAN",
    "FANS": "FANS",
    "ALCANCE TOTAL": "GESAMTREICHWEITE",
    "Fecha de creación": "Erstellungsdatum",
    "Miembro fundador": "Gründungsmitglied",
    "Fans totales": "Fans insgesamt",
    "Alcance histórico": "Historische Reichweite",
    "DESCRIPCIÓN DEL CANAL": "KANALBESCHREIBUNG",
    "Sube tu primer video y empieza a monetizar tu talento": "Lade dein erstes Video hoch und monetarisiere dein Talent",
    "Este canal aún no ha subido ningún video": "Dieser Kanal hat noch keine Videos hochgeladen",
    "Agrega tu descripción y haz destacar tu talento.": "Füge deine Beschreibung hinzu und hebe dein Talent hervor.",
    "Este canal aún no ha agregado una descripción.": "Dieser Kanal hat noch keine Beschreibung hinzugefügt.",
    "Hazte Fan": "Fan werden",
    "Lanzar Vertical": "Vertical starten",
    "Publica tu talento en 9:16": "Veröffentliche dein Talent in 9:16",
    "más": "mehr"
  }
};

export function obtenerNombreIdioma(codigo: string): string {
  return IDIOMAS_MUNDO.find((i) => i.codigo === codigo)?.nativo || "Español";
}

export function aplicarIdiomaPlataforma(codigo: string) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = codigo || "es";
  const mapa = DICCIONARIO_UI[codigo] || {};
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