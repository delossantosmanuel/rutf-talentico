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
    "Verticales / Shorts": "Verticais / Shorts", "Talentos Verticales": "Talentos Verticais",
    "Crear Short": "Criar Short", "Ver en pantalla completa": "Ver em tela cheia",
    "Subir": "Enviar", "Subir Video": "Enviar Vídeo", "Monetización": "Monetização",
    "Fundación": "Fundação", "Política de Privacidad": "Política de Privacidade", "Términos de Uso": "Termos de Uso",
    "Notificaciones RUTF": "Notificações RUTF", "Fans y nuevos talentos": "Fãs e novos talentos",
    "Buscar talento, título o @canal...": "Buscar talento, título ou @canal...",
    "Buscar idioma o país...": "Buscar idioma ou país...", "Cuenta activa": "Conta ativa",
    "Canales": "Canais", "Ver canal →": "Ver canal →", "Eres Fan ✓": "Você é Fã ✓",
    "Hazte Fan": "Virar Fã", "Cerrar": "Fechar", "Cerrar sesión": "Sair", "Volver": "Voltar",
    "Editar Descripción": "Editar Descrição", "Editar canal": "Editar canal", "Cerrar edición": "Fechar edição",
    "Información del canal": "Informações do canal", "Idioma del Escenario": "Idioma do Palco",
    "Confirmar": "Confirmar", "Aplicando...": "Aplicando...", "Videos": "Vídeos", "VIDEOS": "VÍDEOS",
    "FAN": "FÃ", "FANS": "FÃS", "Alcance Total": "Alcance Total", "ALCANCE TOTAL": "ALCANCE TOTAL",
    "Fecha de creación": "Data de criação", "Miembro fundador": "Membro fundador",
    "Fans totales": "Total de fãs", "Alcance histórico": "Alcance histórico",
    "Descripción del canal": "Descrição do canal", "DESCRIPCIÓN DEL CANAL": "DESCRIÇÃO DO CANAL",
    "Define tu Esencia": "Defina sua Essência",
    "Selecciona tu talento principal para conectar con tu audiencia": "Selecione seu talento principal para conectar com seu público",
    "Aún no has definido tu esencia": "Você ainda não definiu sua essência",
    "Sube tu primer video y empieza a monetizar tu talento": "Envie seu primeiro vídeo e comece a monetizar seu talento",
    "Este canal aún no ha subido ningún video": "Este canal ainda não enviou nenhum vídeo",
    "Agrega tu descripción y haz destacar tu talento.": "Adicione sua descrição e destaque seu talento.",
    "Este canal aún no ha agregado una descripción.": "Este canal ainda não adicionou uma descrição.",
    "Eliminar video": "Excluir vídeo", "¿Eliminar video?": "Excluir vídeo?", "Compartir talento": "Compartilhar talento",
    "Lanzar Vertical": "Lançar Vertical", "Publica tu talento en 9:16": "Publique seu talento em 9:16",
    "Sé el primero en comentar este video.": "Seja o primeiro a comentar este vídeo.",
    "Sé el primero en comentar este talento.": "Seja o primeiro a comentar este talento.",
    "Inicia sesión primero para poder comentar": "Entre primeiro para poder comentar",
    "Comentar": "Comentar", "Compartir": "Compartilhar", "Aportar": "Apoiar", "En escena": "Em cena",
    "Tu Canal": "Seu Canal", "Tu canal": "Seu canal", "más": "mais",
    "PROGRAMA DE CREADORES RUTF TALENTICO": "PROGRAMA DE CRIADORES RUTF TALENTICO",
    "Monetiza tu talento original y genera ingresos reales": "Monetize seu talento original e gere renda real",
    "Al completar los 3 requisitos del canal, activamos tus pagos directos por PayPal.": "Ao concluir os 3 requisitos do canal, ativamos seus pagamentos diretos pelo PayPal.",
    "ACCESO OFICIAL FUNDADOR": "ACESSO OFICIAL FUNDADOR",
    "Solicitudes de Retiro y Pagos PayPal": "Solicitações de Saque e Pagamentos PayPal",
    "Revisar Solicitudes →": "Revisar Solicitações →",
    "Requisitos de Elegibilidad en Tiempo Real": "Requisitos de Elegibilidade em Tempo Real",
    "Actualizar": "Atualizar", "En progreso": "Em andamento", "Fans reales": "Fãs reais",
    "Vistas calificadas (+16s)": "Visualizações qualificadas (+16s)", "Videos originales": "Vídeos originais",
    "Completa los 3 requisitos para activar tus pagos": "Complete os 3 requisitos para ativar seus pagamentos",
    "Desbloquear Monetización (Pagos vía PayPal)": "Desbloquear Monetização (Pagamentos via PayPal)",
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
    "Cualquier manipulación artificial de Fans, vistas automatizadas o resubida de videos ajenos conlleva la suspensión permanente de la monetización.": "Qualquer manipulação artificial de Fãs, visualizações automatizadas ou reenvio de vídeos de terceiros resulta na suspensão permanente da monetização.",
    "Publicar en RUTF Talentico": "Publicar no RUTF Talentico",
    "Publicando como canal único protegido": "Publicando como canal único protegido",
    "Formato del Video": "Formato do Vídeo", "Video Horizontal (16:9)": "Vídeo Horizontal (16:9)",
    "Short Vertical (9:16)": "Short Vertical (9:16)", "Título del Talent": "Título do Talento",
    "Título del Talento": "Título do Talento", "Ej: Mi presentación acústica en vivo...": "Ex: Minha apresentação acústica ao vivo...",
    "Falta contexto — escribe entre 15 y 65 letras": "Falta contexto — escreva entre 15 e 65 letras",
    "Historia y Contexto del Talento": "História e Contexto do Talento",
    "Cuenta la historia de tu talento, quién participa y qué lo hace único...": "Conte a história do seu talento, quem participa e o que o torna único...",
    "Mínimo 20 caracteres": "Mínimo 20 caracteres", "Esencia de este Video": "Essência deste Vídeo",
    "Selecciona el talento principal de esta publicación": "Selecione o talento principal desta publicação",
    "Ritmo y Voz": "Ritmo e Voz", "Arte Visual": "Arte Visual", "Escena y Humor": "Cena e Humor",
    "Acción y Deporte": "Ação e Esporte", "Mente e Innovación": "Mente e Inovação", "Mundo y Vida": "Mundo e Vida",
    "Toca aquí para elegir tu video (.mp4 / .mov)": "Toque aqui para escolher seu vídeo (.mp4 / .mov)",
    "Máximo 500 MB • Alta definición recomendada": "Máximo 500 MB • Alta definição recomendada",
    "Miniatura / Portada del Video (Opcional)": "Miniatura / Capa do Vídeo (Opcional)",
    "Auto-selección inteligente de mejor escena": "Seleção automática inteligente da melhor cena",
    "Requisitos: JPG, PNG o WebP (máx. 5 MB) con orientación Horizontal 16:9 (1280×720). Se optimiza automáticamente a menos de 120 KB. Si no subes una, RUTF Talentico analiza tu video y elige la mejor escena": "Requisitos: JPG, PNG ou WebP (máx. 5 MB) na orientação Horizontal 16:9 (1280×720). Otimizada automaticamente para menos de 120 KB. Se não enviar uma, o RUTF Talentico analisa seu vídeo e escolhe a melhor cena",
    "Elegir Portada de Escenario": "Escolher Capa do Palco",
    "VERIFICACIÓN DE AUTORÍA OBLIGATORIA": "VERIFICAÇÃO DE AUTORIA OBRIGATÓRIA",
    "Declaro que este video y su audio son de mi autoría original (o cuento con derechos legales de uso) y no infringen normas de derechos de autor de terceros.": "Declaro que este vídeo e seu áudio são de minha autoria original (ou possuo direitos legais de uso) e não violam normas de direitos autorais de terceiros.",
    "Selecciona un video para publicar": "Selecione um vídeo para publicar"
  },
  fr: {
    "Buscar talento, título o @canal...": "Rechercher un talent, un titre ou @chaîne...",
    "Ver en pantalla completa": "Voir en plein écran", "Lanzar Vertical": "Lancer un Vertical",
    "Publica tu talento en 9:16": "Publiez votre talent en 9:16",
    "Mis Videos Publicados": "Mes Vidéos Publiées", "Videos Publicados": "Vidéos Publiées",
    "Sube tu primer video y empieza a monetizar tu talento": "Publiez votre première vidéo et monétisez votre talent",
    "Alcance total": "Portée totale", "Publicando como canal único protegido": "Publication en tant que chaîne unique protégée",
    "Ej: Mi presentación acústica en vivo...": "Ex : Ma prestation acoustique en direct...",
    "Falta contexto — escribe entre 15 y 65 letras": "Contexte manquant — écrivez entre 15 et 65 caractères",
    "Cuenta la historia de tu talento, quién participa y qué lo hace único...": "Racontez l'histoire de votre talent, qui participe et ce qui le rend unique...",
    "Mínimo 20 caracteres": "Minimum 20 caractères", "Ritmo y Voz": "Rythme et Voix", "Arte Visual": "Art Visuel",
    "Escena y Humor": "Scène et Humour", "Acción y Deporte": "Action et Sport", "Mente e Innovación": "Esprit et Innovation", "Mundo y Vida": "Monde et Vie",
    "Máximo 500 MB • Alta definición recomendada": "Maximum 500 Mo • Haute définition recommandée",
    "Miniatura / Portada del Video (Opcional)": "Miniature / Couverture de la vidéo (Optionnel)",
    "Auto-selección inteligente de mejor escena": "Sélection automatique intelligente de la meilleure scène",
    "Elegir Portada de Escenario": "Choisir la couverture de scène",
    "Declaro que este video y su audio son de": "Je déclare que cette vidéo et son audio sont",
    "mi autoría original": "ma création originale", "(o cuento con": "(ou que je détiens",
    "derechos legales de uso": "les droits légaux d'utilisation",
    ") y no infringen normas de derechos de autor de terceros.": ") et n'enfreignent aucun droit d'auteur de tiers."
  },
  it: { "Buscar talento, título o @canal...": "Cerca talento, titolo o @canale...", "Ver en pantalla completa": "Guarda a schermo intero", "Lanzar Vertical": "Lancia Verticale", "Publica tu talento en 9:16": "Pubblica il tuo talento in 9:16", "Mis Videos Publicados": "I Miei Video Pubblicati", "Sube tu primer video y empieza a monetizar tu talento": "Carica il tuo primo video e inizia a monetizzare il tuo talento", "Alcance total": "Copertura totale", "Toca aquí para elegir tu video (.mp4 / .mov)": "Tocca qui per scegliere il tuo video (.mp4 / .mov)", "Declaro que este video y su audio son de": "Dichiaro che questo video e il relativo audio sono", "mi autoría original": "una mia creazione originale", "(o cuento con": "(o possiedo", "derechos legales de uso": "i diritti legali d'uso", ") y no infringen normas de derechos de autor de terceros.": ") e non violano i diritti d'autore di terzi." },
  de: { "Buscar talento, título o @canal...": "Talent, Titel oder @Kanal suchen...", "Ver en pantalla completa": "Vollbild ansehen", "Lanzar Vertical": "Vertical starten", "Publica tu talento en 9:16": "Veröffentliche dein Talent in 9:16", "Mis Videos Publicados": "Meine veröffentlichten Videos", "Sube tu primer video y empieza a monetizar tu talento": "Lade dein erstes Video hoch und monetarisiere dein Talent", "Alcance total": "Gesamtreichweite", "Toca aquí para elegir tu video (.mp4 / .mov)": "Tippe hier, um dein Video auszuwählen (.mp4 / .mov)", "Declaro que este video y su audio son de": "Ich erkläre, dass dieses Video und sein Ton", "mi autoría original": "meine eigene Schöpfung sind", "(o cuento con": "(oder ich über", "derechos legales de uso": "gesetzliche Nutzungsrechte verfüge", ") y no infringen normas de derechos de autor de terceros.": ") und keine Urheberrechte Dritter verletzen." },
  ar: { "Buscar talento, título o @canal...": "ابحث عن موهبة أو عنوان أو @قناة...", "Ver en pantalla completa": "مشاهدة بملء الشاشة", "Lanzar Vertical": "إطلاق فيديو عمودي", "Publica tu talento en 9:16": "انشر موهبتك بصيغة 9:16", "Mis Videos Publicados": "فيديوهاتي المنشورة", "Sube tu primer video y empieza a monetizar tu talento": "ارفع أول فيديو لك وابدأ في تحقيق الدخل من موهبتك", "Alcance total": "إجمالي الوصول", "Toca aquí para elegir tu video (.mp4 / .mov)": "اضغط هنا لاختيار الفيديو (.mp4 / .mov)", "Declaro que este video y su audio son de": "أقر بأن هذا الفيديو وصوته من", "mi autoría original": "إبداعي الأصلي", "(o cuento con": "(أو أملك", "derechos legales de uso": "حقوق استخدام قانونية", ") y no infringen normas de derechos de autor de terceros.": ") ولا ينتهكان حقوق الطبع والنشر للغير." },
  hi: { "Buscar talento, título o @canal...": "प्रतिभा, शीर्षक या @चैनल खोजें...", "Ver en pantalla completa": "पूर्ण स्क्रीन में देखें", "Lanzar Vertical": "वर्टिकल लॉन्च करें", "Publica tu talento en 9:16": "9:16 में अपनी प्रतिभा प्रकाशित करें", "Mis Videos Publicados": "मेरे प्रकाशित वीडियो", "Sube tu primer video y empieza a monetizar tu talento": "अपना पहला वीडियो अपलोड करें और अपनी प्रतिभा से कमाई शुरू करें", "Alcance total": "कुल पहुंच", "Toca aquí para elegir tu video (.mp4 / .mov)": "अपना वीडियो चुनने के लिए यहाँ टैप करें (.mp4 / .mov)", "Declaro que este video y su audio son de": "मैं घोषणा करता हूँ कि यह वीडियो और इसका ऑडियो", "mi autoría original": "मेरी मूल रचना है", "(o cuento con": "(या मेरे पास", "derechos legales de uso": "कानूनी उपयोग अधिकार हैं", ") y no infringen normas de derechos de autor de terceros.": ") और किसी तीसरे पक्ष के कॉपीराइट का उल्लंघन नहीं करते।" },
  zh: { "Buscar talento, título o @canal...": "搜索才艺、标题或 @频道...", "Ver en pantalla completa": "全屏观看", "Lanzar Vertical": "发布竖屏视频", "Publica tu talento en 9:16": "以 9:16 格式展示你的才华", "Mis Videos Publicados": "我发布的视频", "Sube tu primer video y empieza a monetizar tu talento": "上传你的第一个视频，开启才艺变现之旅", "Alcance total": "总覆盖量", "Toca aquí para elegir tu video (.mp4 / .mov)": "点击此处选择视频 (.mp4 / .mov)", "Declaro que este video y su audio son de": "本人声明该视频及其音频为", "mi autoría original": "本人原创作品", "(o cuento con": "（或拥有", "derechos legales de uso": "合法使用权", ") y no infringen normas de derechos de autor de terceros.": "），未侵犯任何第三方版权。" },
  ja: { "Buscar talento, título o @canal...": "才能、タイトル、@チャンネルを検索...", "Ver en pantalla completa": "全画面で見る", "Lanzar Vertical": "縦型動画を投稿", "Publica tu talento en 9:16": "9:16 であなたの才能を公開しよう", "Mis Videos Publicados": "公開中の動画", "Sube tu primer video y empieza a monetizar tu talento": "最初の動画をアップロードして才能を収益化しましょう", "Alcance total": "総リーチ数", "Toca aquí para elegir tu video (.mp4 / .mov)": "ここをタップして動画を選択 (.mp4 / .mov)", "Declaro que este video y su audio son de": "この動画と音声は", "mi autoría original": "私自身のオリジナル作品", "(o cuento con": "（または", "derechos legales de uso": "正当な利用権", ") y no infringen normas de derechos de autor de terceros.": "を有するもの）であり、第三者の著作権を侵害していないことを宣言します。" },
  ko: { "Buscar talento, título o @canal...": "재능, 제목 또는 @채널 검색...", "Ver en pantalla completa": "전체 화면으로 보기", "Lanzar Vertical": "세로 영상 올리기", "Publica tu talento en 9:16": "9:16 비율로 재능을 공개하세요", "Mis Videos Publicados": "내 게시된 동영상", "Sube tu primer video y empieza a monetizar tu talento": "첫 동영상을 업로드하고 재능으로 수익을 창출하세요", "Alcance total": "총 도달수", "Toca aquí para elegir tu video (.mp4 / .mov)": "여기를 눌러 동영상 선택 (.mp4 / .mov)", "Declaro que este video y su audio son de": "본 동영상과 오디오는", "mi autoría original": "본인의 순수 창작물", "(o cuento con": "(또는", "derechos legales de uso": "정당한 사용권", ") y no infringen normas de derechos de autor de terceros.": "을 보유함)이며 제3자의 저작권을 침해하지 않음을 선언합니다." },
  ru: { "Buscar talento, título o @canal...": "Поиск таланта, названия или @канала...", "Ver en pantalla completa": "Смотреть на весь экран", "Lanzar Vertical": "Запустить вертикальное", "Publica tu talento en 9:16": "Опубликуйте свой талант в 9:16", "Mis Videos Publicados": "Мои опубликованные видео", "Sube tu primer video y empieza a monetizar tu talento": "Загрузите первое видео и начните монетизировать свой талант", "Alcance total": "Общий охват", "Toca aquí para elegir tu video (.mp4 / .mov)": "Нажмите здесь, чтобы выбрать видео (.mp4 / .mov)", "Declaro que este video y su audio son de": "Я подтверждаю, что это видео и аудио являются", "mi autoría original": "моим оригинальным произведением", "(o cuento con": "(или у меня есть", "derechos legales de uso": "законные права", ") y no infringen normas de derechos de autor de terceros.": ") и не нарушают авторские права третьих лиц." }
};};
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
  const mapa = { ...(DICCIONARIO_UI[codigo] || {}), ...(EXTRA_FRASES[codigo] || {}) };

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












