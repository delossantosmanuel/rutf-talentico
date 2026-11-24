import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";

export async function iniciarNotificacionesCreadores(alAbrirSubir: () => void) {
  if (!Capacitor.isNativePlatform()) return;

  try {
    await LocalNotifications.addListener("localNotificationActionPerformed", (evento) => {
      if (evento.notification?.extra?.destino === "subir") {
        alAbrirSubir();
      }
    });

    const permiso = await LocalNotifications.checkPermissions();
    if (permiso.display !== "granted") {
      const solicitud = await LocalNotifications.requestPermissions();
      if (solicitud.display !== "granted") return;
    }

    const yaProgramada = localStorage.getItem("rutf_notif_cadencia_v1");
    if (!yaProgramada) {
      const ahora = Date.now();
      await LocalNotifications.schedule({
        notifications: [
          {
            id: 1001,
            title: "🎬 ¡Crea tu primer video y hazte viral!",
            body: "Sube tu talento a RUTF Talentico, gana seguidores y empieza a destacar.",
            smallIcon: "ic_launcher",
            largeIcon: "ic_launcher",
            schedule: { at: new Date(ahora + 20 * 60 * 1000) },
            extra: { destino: "subir" },
          },
          {
            id: 1002,
            title: "🚀 ¡Tu público te espera en RUTF Talentico!",
            body: "Publica un video corto hoy y suma más vistas calificadas (+15 seg).",
            smallIcon: "ic_launcher",
            largeIcon: "ic_launcher",
            schedule: { at: new Date(ahora + 3 * 24 * 60 * 60 * 1000) },
            extra: { destino: "subir" },
          },
          {
            id: 1003,
            title: "💰 Impulsa tu canal hacia la monetización",
            body: "Publica esta semana para acercarte a 100 suscriptores y 1,000 vistas (+15s).",
            smallIcon: "ic_launcher",
            largeIcon: "ic_launcher",
            schedule: {
              at: new Date(ahora + 7 * 24 * 60 * 60 * 1000),
              every: "week",
            },
            extra: { destino: "subir" },
          },
        ],
      });
      localStorage.setItem("rutf_notif_cadencia_v1", "ok");
    }
  } catch (error) {
    console.warn("Notificaciones nativas no disponibles:", error);
  }
}
