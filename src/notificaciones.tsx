"use client";
import React, { useState, useEffect, useRef } from "react";
import { UserPlus, PlayCircle, Volume2, VolumeX, CheckCheck } from "lucide-react";

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
  const [sonidoActivo, setSonidoActivo] = useState(true);
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
      if (noLeidas > ultimoTotalRef.current && sonidoActivo) {
        reproducirSonidoRUTF();
      }
      ultimoTotalRef.current = noLeidas;
      setItems(listaGenerada);
    };

    cargarNotificacionesReales();
  }, [usuario, videos, suscritos, notifCreador, supabase, sonidoActivo]);

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
      {/* Emblema exclusivo RUTF Talentico (Radar Hexagonal de Pulso + Indicador Azul) */}
      <button
        type="button"
        onClick={() => {
          const abrir = !abierto;
          setAbierto(abrir);
          if (abrir && sonidoActivo) reproducirSonidoRUTF();
        }}
        title="Radar de Notificaciones RUTF"
        className={`relative p-2 rounded-xl border transition shadow-sm ${
          sinLeer > 0
            ? "bg-blue-50 border-blue-400 text-blue-600"
            : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700"
        }`}
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 21 7 21 17 12 22 3 17 3 7 12 2" />
          <circle cx="12" cy="12" r="3" className="fill-orange-500 stroke-orange-500" />
          <path d="M12 6v2M12 16v2M6 12h2M16 12h2" />
        </svg>
        {sinLeer > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-blue-600 ring-2 ring-white text-white text-[10px] font-black flex items-center justify-center shadow">
            {sinLeer}
          </span>
        )}
      </button>

      {abierto && (
        <div className="absolute right-0 top-11 z-50 w-80 max-w-[90vw] bg-white border border-blue-200 rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-orange-500 text-white px-3.5 py-2.5 flex items-center justify-between">
            <div>
              <p className="text-xs font-black">Radar RUTF Talentico</p>
              <p className="text-[10px] text-white/90">Suscriptores y nuevos talentos</p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  const nuevo = !sonidoActivo;
                  setSonidoActivo(nuevo);
                  if (nuevo) reproducirSonidoRUTF();
                }}
                title={sonidoActivo ? "Silenciar tono RUTF" : "Activar tono RUTF"}
                className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white"
              >
                {sonidoActivo ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>
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
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
            {items.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6 px-4">
                Aún no tienes notificaciones nuevas. Aquí verás tus nuevos suscriptores y los videos de tus canales favoritos.
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
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
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
