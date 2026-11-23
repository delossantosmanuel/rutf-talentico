"use client";
import React, { useState, useEffect, useRef } from "react";
import { Bell, UserPlus, PlayCircle, CheckCheck } from "lucide-react";

export type NotificacionRUTF = {
  id: string;
  tipo: "suscripcion" | "nuevo_video";
  titulo: string;
  mensaje: string;
  videoId?: string;
  leida: boolean;
  fecha: string;
};

export function reproducirSonidoRUTF() {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const notas = [523.25, 659.25, 783.99];
    notas.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.09);
      gain.gain.setValueAtTime(0.001, ctx.currentTime + i * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.14, ctx.currentTime + i * 0.09 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.09 + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.09);
      osc.stop(ctx.currentTime + i * 0.09 + 0.36);
    });
  } catch {}
}

export function CampanaNotificaciones({
  usuario,
  videos,
  suscritos,
  notifCreador,
  supabase,
  onAbrirVideo,
}: {
  usuario: { id: string; username: string } | null;
  videos: { id: string; titulo: string; creador: string; creado_en?: string }[];
  suscritos: Record<string, boolean>;
  notifCreador: Record<string, "todas" | "ninguna">;
  supabase: any;
  onAbrirVideo: (videoId: string) => void;
}) {
  const [abierto, setAbierto] = useState(false);
  const [items, setItems] = useState<NotificacionRUTF[]>([]);
  const ultimoTotalRef = useRef<number>(0);

  useEffect(() => {
    if (!usuario) {
      setItems([]);
      return;
    }

    const cargarNotificacionesReales = async () => {
      const leidasGuardadas: Record<string, boolean> = JSON.parse(
        localStorage.getItem(`rutf_notif_leidas_${usuario.id}`) || "{}"
      );
      const listaGenerada: NotificacionRUTF[] = [];

      const { data: subs } = await supabase
        .from("suscripciones_usuarios")
        .select("id, usuario_id, creado_en")
        .eq("canal", usuario.username)
        .order("creado_en", { ascending: false })
        .limit(15);

      if (subs && subs.length > 0) {
        const idsUsuarios = subs.map((s: { usuario_id: string }) => s.usuario_id);
        const { data: perfiles } = await supabase
          .from("usuarios_rutf")
          .select("id, username")
          .in("id", idsUsuarios);

        const mapaNombres: Record<string, string> = {};
        (perfiles || []).forEach((p: { id: string; username: string }) => {
          mapaNombres[p.id] = p.username;
        });

        subs.forEach((s: { id: string; usuario_id: string; creado_en?: string }) => {
          const nombreSeguidor = mapaNombres[s.usuario_id] || "@talento_nuevo";
          const notifId = `sub_${s.id}`;
          listaGenerada.push({
            id: notifId,
            tipo: "suscripcion",
            titulo: "Nuevo suscriptor en tu canal",
            mensaje: `${nombreSeguidor} se suscribió a tu canal`,
            leida: Boolean(leidasGuardadas[notifId]),
            fecha: s.creado_en ? new Date(s.creado_en).toLocaleDateString() : "Reciente",
          });
        });
      }

      videos.slice(0, 20).forEach((v) => {
        const estaSuscrito = suscritos[v.creador];
        const alertasActivas = notifCreador[v.creador] !== "ninguna";
        const noEsPropio = v.creador.toLowerCase() !== usuario.username.toLowerCase();

        if (estaSuscrito && alertasActivas && noEsPropio) {
          const notifId = `vid_${v.id}`;
          listaGenerada.push({
            id: notifId,
            tipo: "nuevo_video",
            titulo: `Nuevo talento de ${v.creador}`,
            mensaje: v.titulo,
            videoId: v.id,
            leida: Boolean(leidasGuardadas[notifId]),
            fecha: v.creado_en ? new Date(v.creado_en).toLocaleDateString() : "Nuevo",
          });
        }
      });

      const noLeidas = listaGenerada.filter((n) => !n.leida).length;
      if (noLeidas > ultimoTotalRef.current) {
        reproducirSonidoRUTF();
      }
      ultimoTotalRef.current = noLeidas;
      setItems(listaGenerada);
    };

    cargarNotificacionesReales();
  }, [usuario, videos, suscritos, notifCreador, supabase]);

  if (!usuario) return null;

  const sinLeer = items.filter((i) => !i.leida).length;

  const marcarLeida = (id: string) => {
    const prev: Record<string, boolean> = JSON.parse(localStorage.getItem(`rutf_notif_leidas_${usuario.id}`) || "{}");
    prev[id] = true;
    localStorage.setItem(`rutf_notif_leidas_${usuario.id}`, JSON.stringify(prev));
    setItems((list) => list.map((it) => (it.id === id ? { ...it, leida: true } : it)));
  };

  const marcarTodasLeidas = () => {
    const mapa: Record<string, boolean> = {};
    items.forEach((i) => {
      mapa[i.id] = true;
    });
    localStorage.setItem(`rutf_notif_leidas_${usuario.id}`, JSON.stringify(mapa));
    setItems((prev) => prev.map((i) => ({ ...i, leida: true })));
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          const abrir = !abierto;
          setAbierto(abrir);
          if (abrir) reproducirSonidoRUTF();
        }}
        title="Notificaciones RUTF Talentico"
        className={`flex items-center gap-1 px-2 py-1.5 rounded-full border transition ${
          sinLeer > 0
            ? "bg-blue-50/80 border-blue-300 text-blue-600"
            : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600"
        }`}
      >
        <Bell className="w-3.5 h-3.5" />
        {sinLeer > 0 && (
          <span className="flex items-center gap-0.5 pr-0.5" aria-label={`${sinLeer} notificaciones`}>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          </span>
        )}
      </button>

      {abierto && (
        <div className="fixed left-3 right-3 sm:left-auto sm:right-4 top-14 z-50 sm:w-80 bg-white border border-blue-200 rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-orange-500 text-white px-3.5 py-2.5 flex items-center justify-between">
            <div>
              <p className="text-xs font-black">Notificaciones RUTF</p>
              <p className="text-[10px] text-white/90">Suscriptores y nuevos talentos</p>
            </div>
            {sinLeer > 0 && (
              <button
                type="button"
                onClick={marcarTodasLeidas}
                title="Marcar todas como leídas"
                className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white"
              >
                <CheckCheck className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
            {items.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6 px-4">
                Aún no tienes notificaciones nuevas.
              </p>
            ) : (
              items.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    marcarLeida(n.id);
                    if (n.videoId) {
                      onAbrirVideo(n.videoId);
                      setAbierto(false);
                    }
                  }}
                  className={`p-3 flex items-start gap-2.5 text-xs transition ${
                    n.videoId ? "cursor-pointer hover:bg-blue-50/70" : ""
                  } ${!n.leida ? "bg-blue-50/40" : "bg-white"}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    n.tipo === "suscripcion" ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"
                  }`}>
                    {n.tipo === "suscripcion" ? <UserPlus className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="font-black text-slate-900 truncate">{n.titulo}</p>
                      {!n.leida && <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />}
                    </div>
                    <p className="text-slate-600 line-clamp-2 mt-0.5">{n.mensaje}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">{n.fecha}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
