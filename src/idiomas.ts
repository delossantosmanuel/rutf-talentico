export interface IdiomaOpcion { codigo: string; nativo: string; espanol: string; region: string; }
export const IDIOMAS_MUNDO: IdiomaOpcion[] = [
  { codigo: "es", nativo: "Español", espanol: "Español", region: "Global" },
  { codigo: "en", nativo: "English", espanol: "Inglés", region: "Global" },
  { codigo: "pt", nativo: "Português", espanol: "Portugués", region: "Brasil / Portugal" },
  { codigo: "fr", nativo: "Français", espanol: "Francés", region: "Francia / Canadá" },
  { codigo: "it", nativo: "Italiano", espanol: "Italiano", region: "Italia" },
  { codigo: "de", nativo: "Deutsch", espanol: "Alemán", region: "Alemania" },
  { codigo: "ar", nativo: "العربية", espanol: "Árabe", region: "Medio Oriente" },
  { codigo: "hi", nativo: "हिन्दी", espanol: "Hindi", region: "India" },
  { codigo: "zh", nativo: "中文 (简体)", espanol: "Chino", region: "China" },
  { codigo: "ja", nativo: "日本語", espanol: "Japonés", region: "Japón" },
  { codigo: "ko", nativo: "한국어", espanol: "Coreano", region: "Corea" },
  { codigo: "ru", nativo: "Русский", espanol: "Ruso", region: "Rusia" }
];
const DICCIONARIO_UI: Record<string, Record<string, string>> = {
  en: {
    "Inicio": "Home", "Escenario Principal": "Main Stage", "Verticales": "Verticals",
    "Verticales / Shorts": "Verticals / Shorts", "Talentos Verticales": "Vertical Talents",
    "Crear Short": "Create Short", "Ver en pantalla completa": "Watch full screen",
    "Subir": "Upload", "Subir Video": "Upload Video", "Monetización": "Monetization",
    "Fundación": "Foundation", "Política de Privacidad": "Privacy Policy", "Términos de Uso": "Terms of Use",
    "Notificaciones RUTF": "RUTF Notifications", "Fans y nuevos talentos": "Fans and new talents",
    "Buscar talento, título o @canal...": "Search talent, title or @channel...",
    "Buscar idioma o país...": "Search language or country...", "Cuenta activa": "Active account",
    "Canales": "Channels", "Ver canal →": "View channel →", "Eres Fan ✓": "You're a Fan ✓",
    "Hazte Fan": "Become a Fan", "Cerrar": "Close", "Cerrar sesión": "Sign out", "Volver": "Back",
    "Editar Descripción": "Edit Description", "Editar canal": "Edit channel", "Cerrar edición": "Close editor",
    "Información del canal": "Channel information", "Idioma del Escenario": "Stage Language",
    "Confirmar": "Confirm", "Aplicando...": "Applying...", "Videos": "Videos", "VIDEOS": "VIDEOS",
    "FAN": "FAN", "FANS": "FANS", "Alcance Total": "Total Reach", "ALCANCE TOTAL": "TOTAL REACH",
    "Fecha de creación": "Creation date", "Miembro fundador": "Founding member",
    "Fans totales": "Total fans", "Alcance histórico": "Historical reach",
    "Descripción del canal": "Channel description", "DESCRIPCIÓN DEL CANAL": "CHANNEL DESCRIPTION",
    "Define tu Esencia": "Define your Essence",
    "Selecciona tu talento principal para conectar con tu audiencia": "Select your main talent to connect with your audience",
    "Aún no has definido tu esencia": "You haven't defined your essence yet",
    "Sube tu primer video y empieza a monetizar tu talento": "Upload your first video and start monetizing your talent",
    "Este canal aún no ha subido ningún video": "This channel hasn't uploaded any videos yet",
    "Agrega tu descripción y haz destacar tu talento.": "Add your description and make your talent stand out.",
    "Este canal aún no ha agregado una descripción.": "This channel hasn't added a description yet.",
    "Eliminar video": "Delete video", "¿Eliminar video?": "Delete video?", "Compartir talento": "Share talent",
    "Lanzar Vertical": "Launch Vertical", "Publica tu talento en 9:16": "Publish your talent in 9:16",
    "Sé el primero en comentar este video.": "Be the first to comment on this video.",
    "Sé el primero en comentar este talento.": "Be the first to comment on this talent.",
    "Inicia sesión primero para poder comentar": "Sign in first to comment",
    "Comentar": "Comment", "Compartir": "Share", "Aportar": "Support", "En escena": "On stage",
    "Tu Canal": "Your Channel", "Tu canal": "Your channel", "más": "more",
    "PROGRAMA DE CREADORES RUTF TALENTICO": "RUTF TALENTICO CREATOR PROGRAM",
    "Monetiza tu talento original y genera ingresos reales": "Monetize your original talent and earn real income",
    "Al completar los 3 requisitos del canal, activamos tus pagos directos por PayPal.": "Once you complete all 3 channel requirements, we activate your direct PayPal payouts.",
    "ACCESO OFICIAL FUNDADOR": "OFFICIAL FOUNDER ACCESS",
    "Solicitudes de Retiro y Pagos PayPal": "Withdrawal Requests & PayPal Payouts",
    "Revisar Solicitudes →": "Review Requests →",
    "Requisitos de Elegibilidad en Tiempo Real": "Real-Time Eligibility Requirements",
    "Actualizar": "Refresh", "En progreso": "In progress", "Fans reales": "Real fans",
    "Vistas calificadas (+16s)": "Qualified views (+16s)", "Videos originales": "Original videos",
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
    "Formato del Video": "Video Format", "Video Horizontal (16:9)": "Horizontal Video (16:9)",
    "Short Vertical (9:16)": "Vertical Short (9:16)", "Título del Talent": "Talent Title",
    "Título del Talento": "Talent Title", "Ej: Mi presentación acústica en vivo...": "Ex: My live acoustic performance...",
    "Falta contexto — escribe entre 15 y 65 letras": "Missing context — write between 15 and 65 characters",
    "Historia y Contexto del Talento": "Talent Story & Context",
    "Cuenta la historia de tu talento, quién participa y qué lo hace único...": "Tell the story of your talent, who participates and what makes it unique...",
    "Mínimo 20 caracteres": "Minimum 20 characters", "Esencia de este Video": "Essence of this Video",
    "Selecciona el talento principal de esta publicación": "Select the main talent of this post",
    "Ritmo y Voz": "Rhythm & Voice", "Arte Visual": "Visual Art", "Escena y Humor": "Stage & Comedy",
    "Acción y Deporte": "Action & Sports", "Mente e Innovación": "Mind & Innovation", "Mundo y Vida": "World & Life",
    "Toca aquí para elegir tu video (.mp4 / .mov)": "Tap here to choose your video (.mp4 / .mov)",
    "Máximo 500 MB • Alta definición recomendada": "Max 500 MB • High definition recommended",
    "Miniatura / Portada del Video (Opcional)": "Video Thumbnail / Cover (Optional)",
    "Auto-selección inteligente de mejor escena": "Smart auto-selection of best scene",
    "Requisitos: JPG, PNG o WebP (máx. 5 MB) con orientación Horizontal 16:9 (1280×720). Se optimiza automáticamente a menos de 120 KB. Si no subes una, RUTF Talentico analiza tu video y elige la mejor escena": "Requirements: JPG, PNG or WebP (max 5 MB) in Horizontal 16:9 (1280×720). Automatically optimized under 120 KB. If none is uploaded, RUTF Talentico analyzes your video and picks the best scene",
    "Elegir Portada de Escenario": "Choose Stage Cover",
    "VERIFICACIÓN DE AUTORÍA OBLIGATORIA": "MANDATORY AUTHORSHIP VERIFICATION",
    "Declaro que este video y su audio son de mi autoría original (o cuento con derechos legales de uso) y no infringen normas de derechos de autor de terceros.": "I declare that this video and its audio are my original creation (or I hold legal usage rights) and do not infringe third-party copyright rules.",
    "Selecciona un video para publicar": "Select a video to publish"
  },
  pt: {
    "Inicio": "Início", "Escenario Principal": "Palco Principal", "Verticales": "Verticais",
    "Verticales / Shorts": "Verticais / Shorts", "Subir": "Enviar", "Subir Video": "Enviar Vídeo",
    "Monetización": "Monetização", "Fundación": "Fundação", "Volver": "Voltar",
    "Editar Descripción": "Editar Descrição", "Editar canal": "Editar canal",
    "Información del canal": "Informações do canal", "Idioma del Escenario": "Idioma do Palco",
    "Confirmar": "Confirmar", "Aplicando...": "Aplicando...", "Cerrar sesión": "Sair",
    "Preguntas Frecuentes sobre Monetización y Pagos": "Perguntas Frequentes sobre Monetização e Pagamentos",
    "Publicar en RUTF Talentico": "Publicar no RUTF Talentico", "Selecciona un video para publicar": "Selecione um vídeo para publicar"
  },
  fr: {
    "Inicio": "Accueil", "Escenario Principal": "Scène Principale", "Verticales": "Verticaux",
    "Verticales / Shorts": "Verticaux / Shorts", "Subir": "Publier", "Subir Video": "Publier une vidéo",
    "Monetización": "Monétisation", "Fundación": "Fondation", "Volver": "Retour",
    "Editar Descripción": "Modifier la description", "Editar canal": "Modifier la chaîne",
    "Información del canal": "Informations sur la chaîne", "Idioma del Escenario": "Langue de la Scène",
    "Confirmar": "Confirmer", "Aplicando...": "Application...", "Cerrar sesión": "Déconnexion",
    "Preguntas Frecuentes sobre Monetización y Pagos": "Questions Fréquentes sur la Monétisation et les Paiements",
    "Publicar en RUTF Talentico": "Publier sur RUTF Talentico", "Selecciona un video para publicar": "Sélectionnez une vidéo à publier"
  },
  it: {
    "Inicio": "Home", "Escenario Principal": "Palco Principale", "Verticales": "Verticali",
    "Subir": "Carica", "Subir Video": "Carica Video", "Monetización": "Monetizzazione",
    "Fundación": "Fondazione", "Volver": "Indietro", "Editar Descripción": "Modifica Descrizione",
    "Editar canal": "Modifica canale", "Información del canal": "Informazioni sul canale",
    "Idioma del Escenario": "Lingua del Palco", "Confirmar": "Conferma", "Aplicando...": "Applicazione...",
    "Cerrar sesión": "Disconnetti"
  },
  de: {
    "Inicio": "Startseite", "Escenario Principal": "Hauptbühne", "Verticales": "Vertikale",
    "Subir": "Hochladen", "Subir Video": "Video hochladen", "Monetización": "Monetarisierung",
    "Fundación": "Stiftung", "Volver": "Zurück", "Editar Descripción": "Beschreibung bearbeiten",
    "Editar canal": "Kanal bearbeiten", "Información del canal": "Kanalinformationen",
    "Idioma del Escenario": "Bühnensprache", "Confirmar": "Bestätigen", "Aplicando...": "Wird angewendet...",
    "Cerrar sesión": "Abmelden"
  },
  ar: {
    "Inicio": "الرئيسية", "Escenario Principal": "المسرح الرئيسي", "Verticales": "فيديوهات عمودية",
    "Verticales / Shorts": "فيديوهات قصيرة", "Subir": "رفع", "Subir Video": "رفع فيديو",
    "Monetización": "تحقيق الدخل", "Fundación": "المؤسسة", "Volver": "رجوع",
    "Editar Descripción": "تعديل الوصف", "Editar canal": "تعديل القناة",
    "Información del canal": "معلومات القناة", "Idioma del Escenario": "لغة المنصة",
    "Confirmar": "تأكيد", "Aplicando...": "جارٍ التطبيق...", "Cerrar sesión": "تسجيل الخروج",
    "Preguntas Frecuentes sobre Monetización y Pagos": "الأسئلة الشائعة حول تحقيق الدخل والمدفوعات",
    "Publicar en RUTF Talentico": "النشر في RUTF Talentico", "Selecciona un video para publicar": "اختر فيديو للنشر"
  },
  hi: {
    "Inicio": "होम", "Escenario Principal": "मुख्य मंच", "Verticales": "शॉर्ट वीडियो",
    "Subir": "अपलोड", "Subir Video": "वीडियो अपलोड करें", "Monetización": "मुद्रीकरण",
    "Fundación": "फाउंडेशन", "Volver": "वापस", "Editar Descripción": "विवरण संपादित करें",
    "Editar canal": "चैनल संपादित करें", "Información del canal": "चैनल की जानकारी",
    "Idioma del Escenario": "मंच की भाषा", "Confirmar": "पुष्टि करें", "Aplicando...": "लागू हो रहा है...",
    "Cerrar sesión": "लॉग आउट"
  },
  zh: {
    "Inicio": "首页", "Escenario Principal": "主舞台", "Verticales": "竖屏短视频",
    "Verticales / Shorts": "竖屏 / 短视频", "Subir": "上传", "Subir Video": "上传视频",
    "Monetización": "变现收益", "Fundación": "基金会", "Volver": "返回",
    "Editar Descripción": "编辑简介", "Editar canal": "编辑频道",
    "Información del canal": "频道信息", "Idioma del Escenario": "舞台语言",
    "Confirmar": "确认", "Aplicando...": "应用中...", "Cerrar sesión": "退出登录",
    "Preguntas Frecuentes sobre Monetización y Pagos": "关于变现与支付的常见问题",
    "Publicar en RUTF Talentico": "发布到 RUTF Talentico", "Selecciona un video para publicar": "选择要发布的视频"
  },
  ja: {
    "Inicio": "ホーム", "Escenario Principal": "メインステージ", "Verticales": "縦型動画",
    "Verticales / Shorts": "縦型 / ショート", "Subir": "アップロード", "Subir Video": "動画をアップロード",
    "Monetización": "収益化", "Fundación": "財団", "Volver": "戻る",
    "Editar Descripción": "説明を編集", "Editar canal": "チャンネルを編集",
    "Información del canal": "チャンネル情報", "Idioma del Escenario": "ステージの言語",
    "Confirmar": "確定", "Aplicando...": "適用中...", "Cerrar sesión": "ログアウト",
    "Preguntas Frecuentes sobre Monetización y Pagos": "収益化とお支払いに関するよくある質問",
    "Publicar en RUTF Talentico": "RUTF Talentico に投稿", "Selecciona un video para publicar": "投稿する動画を選択"
  },
  ko: {
    "Inicio": "홈", "Escenario Principal": "메인 무대", "Verticales": "세로 영상",
    "Subir": "업로드", "Subir Video": "동영상 업로드", "Monetización": "수익 창출",
    "Fundación": "재단", "Volver": "뒤로", "Editar Descripción": "설명 수정",
    "Editar canal": "채널 수정", "Información del canal": "채널 정보",
    "Idioma del Escenario": "무대 언어", "Confirmar": "확인", "Aplicando...": "적용 중...",
    "Cerrar sesión": "로그아웃"
  },
  ru: {
    "Inicio": "Главная", "Escenario Principal": "Главная сцена", "Verticales": "Вертикальные",
    "Subir": "Загрузить", "Subir Video": "Загрузить видео", "Monetización": "Монетизация",
    "Fundación": "Фонд", "Volver": "Назад", "Editar Descripción": "Изменить описание",
    "Editar canal": "Изменить канал", "Información del canal": "Информация о канале",
    "Idioma del Escenario": "Язык сцены", "Confirmar": "Подтвердить", "Aplicando...": "Применение...",
    "Cerrar sesión": "Выйти"
  }
};
export function obtenerNombreIdioma(codigo: string): string {
  return IDIOMAS_MUNDO.find((i) => i.codigo === codigo)?.nativo || "Español";
}

function traducirTexto(limpio: string, mapa: Record<string, string>): string | null {
  if (mapa[limpio]) return mapa[limpio];
  if (limpio.startsWith("Mis Videos Publicados (") && mapa["Mis Videos Publicados"]) {
    return limpio.replace("Mis Videos Publicados", mapa["Mis Videos Publicados"]);
  }
  if (limpio.startsWith("Videos Publicados (") && mapa["Videos Publicados"]) {
    return limpio.replace("Videos Publicados", mapa["Videos Publicados"]);
  }
  return null;
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
      } else if (limpio) {
        const tr = traducirTexto(limpio, mapa);
        if (tr) nodo.nodeValue = base.replace(limpio, tr);
      }
    }
    nodo = walker.nextNode();
  }
}