"use client";

import { useState, useRef, useEffect } from "react";
import {
  Camera,
  CheckCircle2,
  Play,
  Eye,
  Save,
  ArrowLeft,
  Video,
  MoreVertical,
  Edit3,
  Info,
   LogOut,
  X,
  Tv,
  Monitor,
  Smartphone,
    Trash2,
  Share2,

} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Share } from "@capacitor/share";
import { Capacitor } from "@capacitor/core";


export type PerfilCanal = {
  id: string;
  username: string;
  email: string;
  es_fundador?: boolean;
  nombre_canal?: string;
  bio?: string;
  avatar_url?: string;
  banner_url?: string;
  tema_banner?: string;
  created_at?: string;
    creado_en?: string;

};

type VideoCanal = {
  id: string;
  titulo: string;
  video_url: string;
  miniatura_url?: string | null;
  tipo?: string;
  vistas?: number;
  likes?: number;
  creado_en?: string;
};

type Props = {
  supabase: any;
  perfil: PerfilCanal;
  videos: VideoCanal[];
  seguidores: number;
  onActualizarPerfil: (p: PerfilCanal) => void;
  onAbrirVideo: (v: VideoCanal) => void;
  onRecargar: () => void;
  onVolver?: () => void;
  onAbrirSubir?: () => void;
  onCerrarSesion?: () => void;
  soloLectura?: boolean;
  esFan?: boolean;
onToggleFan?: () => void;


};

async function comprimirImagen(archivo: File, maxAncho: number, calidad = 0.84, encuadreBanner?: { x: number; y: number }): Promise<Blob> {

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(archivo);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let ancho = img.width;
      let alto = img.height;
      if (ancho > maxAncho) {
        alto = Math.round((alto * maxAncho) / ancho);
        ancho = maxAncho;
      }
      const canvas = document.createElement("canvas");
      canvas.width = ancho;
      canvas.height = alto;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(archivo);
        return;
      }
      ctx.drawImage(img, 0, 0, ancho, alto);
      canvas.toBlob(
        (blob) => {
          resolve(blob || archivo);
        },
        "image/jpeg",
        calidad
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(archivo);
    };
    img.src = url;
  });
}

export default function EstudioCanal({
  supabase,
  perfil,
  videos,
  seguidores,
  onActualizarPerfil,
  onAbrirVideo,
  onRecargar,
  onVolver,
  onAbrirSubir,
  onCerrarSesion,
  soloLectura = false,
  esFan = false,
onToggleFan,


}: Props) {
  const [nombreCanal, setNombreCanal] = useState(
    perfil.nombre_canal || perfil.username.replace("@", "")
  );
  const [bio, setBio] = useState(perfil.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(perfil.avatar_url || "");
  const [bannerUrl, setBannerUrl] = useState(perfil.banner_url || "");
  const [guardando, setGuardando] = useState(false);
  const [subiendoImg, setSubiendoImg] = useState<"avatar" | "banner" | null>(null);
  const [barraActualizada, setBarraActualizada] = useState(false);
  const [editorAbierto, setEditorAbierto] = useState(false);
  const [menuOpciones, setMenuOpciones] = useState(false);
  const [modalInfoCanal, setModalInfoCanal] = useState(false);
    const [menuVideoId, setMenuVideoId] = useState<string | null>(null);
  const [videoAEliminar, setVideoAEliminar] = useState<VideoCanal | null>(null);
  const [eliminandoVideo, setEliminandoVideo] = useState(false);

  const [bannerPendiente, setBannerPendiente] = useState<{ archivo: File; preview: string } | null>(null);
  const [vistaDispositivo, setVistaDispositivo] = useState<"tv" | "pc" | "movil">("movil");
  const [bannerOffset, setBannerOffset] = useState({ x: 50, y: 50 });
  const arrastreRef = useRef<{ activo: boolean; startX: number; startY: number; origX: number; origY: number }>({
    activo: false,
    startX: 0,
    startY: 0,
    origX: 50,
    origY: 50,
  });

  const inputAvatarRef = useRef<HTMLInputElement>(null);
  const inputBannerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (perfil.avatar_url !== undefined) setAvatarUrl(perfil.avatar_url || "");
    if (perfil.banner_url !== undefined) setBannerUrl(perfil.banner_url || "");
  }, [perfil.avatar_url, perfil.banner_url]);

  const inicialesCanal = perfil.username.replace("@", "").slice(0, 2).toUpperCase();
  const vistasTotales = videos.reduce((acc, v) => acc + (v.vistas || 0), 0);

  const subirImagen = async (archivo: File, tipo: "avatar" | "banner") => {
    setSubiendoImg(tipo);
    try {
      const optimizado = await comprimirImagen(archivo, tipo === "avatar" ? 512 : 1400, 0.84);
      const { data: dataR2, error: errR2 } = await supabase.functions.invoke("firmar-r2", {
        body: { carpeta: tipo === "avatar" ? "avatares" : "banners", nombreArchivo: `${perfil.id}_${tipo}_${Date.now()}.jpg` },
      });
      if (errR2 || !dataR2?.uploadUrl) {
        alert("No se pudo preparar la imagen: " + (errR2?.message || dataR2?.error || "Error R2"));
        return;
      }
      const putR2 = await fetch(dataR2.uploadUrl, { method: "PUT", body: await optimizado.arrayBuffer() });
      if (!putR2.ok) {
        alert(`No se pudo subir la imagen a R2 (${putR2.status}).`);
        return;
      }
      const urlPublica = `${dataR2.publicUrl}?t=${Date.now()}`;

      if (tipo === "avatar") {
        setAvatarUrl(urlPublica);
      } else {
        setBannerUrl(urlPublica);
      }

      const campo = tipo === "avatar" ? { avatar_url: urlPublica } : { banner_url: urlPublica };
      const { data: actualizado } = await supabase
        .from("usuarios_rutf")
        .update(campo)
        .eq("id", perfil.id)
        .select("*")
        .single();

      const perfilFinal = actualizado || { ...perfil, ...campo };
      localStorage.setItem("rutf_sesion", JSON.stringify(perfilFinal));
      onActualizarPerfil(perfilFinal);

      setBarraActualizada(true);
      setTimeout(() => setBarraActualizada(false), 3000);
    } finally {
      setSubiendoImg(null);
    }
  };

  const guardarCambios = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    try {
      const bioLimpia = bio.trim().slice(0, 1000);
      const nombreLimpio = nombreCanal.trim() || perfil.username.replace("@", "");
      const { data: actualizado, error } = await supabase
        .from("usuarios_rutf")
        .update({
          nombre_canal: nombreLimpio,
          bio: bioLimpia,
        })
        .eq("id", perfil.id)
        .select("*")
        .single();

      if (error) {
        alert("Error al guardar cambios: " + error.message);
        return;
      }

      if (actualizado) {
        localStorage.setItem("rutf_sesion", JSON.stringify(actualizado));
        onActualizarPerfil(actualizado);
      }
      setEditorAbierto(false);
      setBarraActualizada(true);
      setTimeout(() => setBarraActualizada(false), 3500);
      onRecargar();
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-16 space-y-5">
      {barraActualizada && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-emerald-600 text-white text-xs font-black py-2 px-4 text-center shadow-lg">
          Cambios guardados correctamente
        </div>
      )}

      <div className="sticky top-0 z-30 -mx-4 px-4 py-2.5 bg-[#0B1120]/95 backdrop-blur-md border-b border-[#2A3A54] space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {onVolver && (
              <button
                type="button"
                onClick={onVolver}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1E293B] hover:bg-slate-200 text-[#F8FAFC] text-xs font-extrabold transition shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0"><div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpciones(!menuOpciones)}
                aria-label="Opciones del canal"
                className="p-1.5 rounded-full hover:bg-[#1E293B] text-[#CBD5E1] transition"
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {menuOpciones && (
                <div className="absolute right-0 top-10 w-52 bg-[#162032] border border-[#2A3A54] text-[#F8FAFC] rounded-2xl shadow-xl py-1.5 z-40 text-xs font-bold text-[#CBD5E1]">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpciones(false);
                      setModalInfoCanal(true);
                    }}
                    className="w-full px-3.5 py-2.5 text-left hover:bg-[#0B1120] flex items-center gap-2"
                  >
                    <Info className="w-4 h-4 text-blue-600" />
                    <span>Información del canal</span>
                 

                  </button>
                  {!soloLectura && (

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpciones(false);
                      setEditorAbierto(!editorAbierto);
                    }}
                    className="w-full px-3.5 py-2.5 text-left hover:bg-[#0B1120] flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4 text-[#94A3B8]" />
                    <span>{editorAbierto ? "Cerrar edición" : "Editar canal"}</span>
                  </button>
                  )}

                  {onCerrarSesion && (
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpciones(false);
                        onCerrarSesion();
                      }}
                      className="w-full px-3.5 py-2.5 text-left hover:bg-red-50 text-red-600 flex items-center gap-2 border-t border-slate-100"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Cerrar sesión</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        </div>

               <div className="relative rounded-[18px] p-[1.5px] bg-gradient-to-r from-[#2563EB] via-[#2A3A54] to-[#FF6B00] shadow-xl">
        <div className="bg-[#162032] rounded-[17px] p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="relative shrink-0">
              <div
                onClick={() => !soloLectura && inputAvatarRef.current?.click()}
                className={"relative w-24 h-24 sm:w-28 sm:h-28 aspect-square rounded-full p-[3px] bg-gradient-to-tr from-[#2563EB] to-[#FF6B00] shadow-lg " + (!soloLectura ? "cursor-pointer group" : "")}
              >
                <div className="w-full h-full rounded-full overflow-hidden bg-[#0B1120] text-[#F8FAFC] font-black text-2xl flex items-center justify-center relative">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt=""
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                  <span>{inicialesCanal}</span>
                  {!soloLectura && (
                    <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              </div>
              {perfil.es_fundador && (
                <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#0B1120] border border-[#2A3A54] flex items-center justify-center shadow-md">
                  <CheckCircle2 className="w-4 h-4 text-[#2563EB] fill-[#2563EB]/20" />
                </span>
              )}
              {!soloLectura && (
                <input
                  ref={inputAvatarRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) subirImagen(f, "avatar");
                    e.target.value = "";
                  }}
                />
              )}
            </div>

            <div className="flex-1 min-w-0 text-center sm:text-left space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black text-[#F8FAFC] tracking-tight truncate">
                    {nombreCanal}
                  </h2>
                  {perfil.es_fundador && (
                    <span className="px-2 py-0.5 rounded-full bg-[#2563EB]/20 border border-[#2563EB]/40 text-[#60A5FA] text-[10px] font-black uppercase tracking-wider">
                      Oficial
                    </span>
                  )}
                </div>
                <p className="text-xs font-bold text-[#94A3B8]">
                  {perfil.username} • {seguidores} {seguidores === 1 ? "Fan" : "Fans"}
                </p>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
                {soloLectura ? (
                  <button
                    type="button"
                    onClick={toggleSuscripcion}
                    disabled={procesandoSub}
                    className={"px-5 py-2 rounded-full text-xs font-black transition cursor-pointer " + (suscrito ? "bg-[#0B1120] text-[#F8FAFC] border border-[#2A3A54] hover:border-[#FF6B00]" : "bg-gradient-to-r from-[#2563EB] to-[#FF6B00] hover:opacity-95 text-white shadow-md")}
                  >
                    {suscrito ? "Eres Fan ✓" : "Hazte Fan"}
                  </button>
                ) : (
                  <>
                    {onAbrirSubir && (
                      <button
                        type="button"
                        onClick={onAbrirSubir}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#2563EB] to-[#FF6B00] hover:opacity-95 text-white text-xs font-black shadow-md transition cursor-pointer"
                      >
                        <Video className="w-3.5 h-3.5" strokeWidth={2} />
                        <span>Subir Video</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setEditorAbierto(!editorAbierto)}
                      className="px-4 py-2 rounded-full bg-[#0B1120] border border-[#2A3A54] hover:border-[#2563EB] text-[#F8FAFC] text-xs font-extrabold inline-flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#FF6B00]" />
                      <span>{editorAbierto ? "Cancelar" : "Editar Canal"}</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 divide-x divide-[#2A3A54] rounded-[14px] bg-[#0B1120]/80 border border-[#2A3A54] py-3 text-center">
            <div className="px-2">
              <p className="text-base sm:text-lg font-black text-[#F8FAFC]">{videos.length}</p>
              <p className="text-[10px] sm:text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Videos</p>
            </div>
            <div className="px-2">
              <p className="text-base sm:text-lg font-black text-[#FF6B00]">{seguidores}</p>
              <p className="text-[10px] sm:text-xs font-bold text-[#94A3B8] uppercase tracking-wider">{seguidores === 1 ? "Fan" : "Fans"}</p>
            </div>
            <div className="px-2">
              <p className="text-base sm:text-lg font-black text-[#60A5FA]">
                {videos.reduce((acc, item) => acc + (item.vistas || 0), 0)}
              </p>
              <p className="text-[10px] sm:text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Vistas Calificadas</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
            {bio || "Creador oficial en RUTF Talentico."}
          </p>
        </div>
      </div>

      <div className="bg-[#162032] border border-[#2A3A54] text-[#F8FAFC] rounded-[18px] p-5 sm:p-6 shadow-sm space-y-4">
        <h3 className="text-base font-black text-[#F8FAFC]">
          {soloLectura ? "Videos Publicados (" + videos.length + ")" : "Mis Videos Publicados (" + videos.length + ")"}
        </h3>

        {videos.length === 0 ? (
              <div className="py-3 flex flex-col items-center text-center gap-2.5">
                <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed max-w-sm">
                  Sube tu primer video y empieza a monetizar tu talento
                </p>
                {!soloLectura && onAbrirSubir && (
                  <button
                    type="button"
                    onClick={onAbrirSubir}
                    className="group relative overflow-hidden inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-extrabold shadow-sm hover:opacity-95 transition"
                  >
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                    <PlusCircle className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-90" />
                    <span>Subir</span>
                  </button>
                )}
              </div>
            ) : (


          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {videos.map((v) => (
                           <div
                key={v.id}
                className="group relative border border-[#2A3A54] rounded-2xl overflow-visible hover:shadow-md transition bg-[#0B1120]"
              >
                <div
                  onClick={() => onAbrirVideo(v)}
                  className="relative aspect-video bg-gradient-to-br from-[#1E293B] via-[#2563EB]/30 to-[#FF6B00]/25 rounded-t-2xl overflow-hidden cursor-pointer group"
                >
                  {v.miniatura_url ? (
                    <img
                      src={v.miniatura_url}
                      alt={v.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <video
                      src={`${v.video_url}#t=0.5`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      preload="metadata"
                      muted
                      playsInline
                    />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                    <div className="w-10 h-10 rounded-full bg-white/90 text-[#F8FAFC] flex items-center justify-center shadow">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                <div className="p-3 flex items-start justify-between gap-2">
                  <div onClick={() => onAbrirVideo(v)} className="min-w-0 flex-1 cursor-pointer">
                    <p className="text-xs font-extrabold text-[#F8FAFC] line-clamp-1">{v.titulo}</p>
                    <p className="text-[11px] font-bold text-[#94A3B8] mt-1 flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{(v.vistas || 0).toLocaleString()} visualizaciones</span>
                    </p>
                  </div>
{!soloLectura && (
                  <div className="relative shrink-0">
                    <button
                      type="button"
                      aria-label="Opciones del video"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuVideoId(menuVideoId === v.id ? null : v.id);
                      }}
                      className="p-1.5 rounded-full hover:bg-slate-200 text-[#94A3B8] transition"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {menuVideoId === v.id && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 bottom-8 w-44 bg-[#162032] border border-[#2A3A54] text-[#F8FAFC] rounded-xl shadow-xl py-1 z-30"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setMenuVideoId(null);
                            setVideoAEliminar(v);
                          }}
                          className="w-full px-3 py-2 text-left text-xs font-extrabold text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Eliminar video</span>
                        </button>
                                                </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}





           {modalInfoCanal && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto flex flex-col">
          <div className="sticky top-0 z-10 bg-[#0B1120]/95 backdrop-blur-md border-b border-[#2A3A54] px-4 py-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setModalInfoCanal(false)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1E293B] hover:bg-slate-200 text-[#F8FAFC] text-xs font-extrabold transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver</span>
            </button>
            <span className="text-xs font-black text-[#94A3B8] uppercase tracking-wider">
              Información del canal
            </span>
            <div className="w-16" />
          </div>

          <div className="w-full max-w-2xl mx-auto px-5 py-6 flex-1 space-y-6">
            <div>
              <h3 className="text-xl font-black text-[#F8FAFC]">
                {nombreCanal || perfil.username}
              </h3>
              <p className="text-xs font-bold text-[#334155] mt-0.5">{perfil.username}</p>
            </div>

            <div className="space-y-2 border-b border-[#2A3A54] pb-5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">
                Descripción del canal
              </span>
              {bio || perfil.bio ? (
                <p className="text-sm text-[#F8FAFC] leading-relaxed whitespace-pre-line break-words">
                  {bio || perfil.bio}
                </p>
              ) : (
                <p className="text-sm text-slate-400 italic">
                  Este canal aún no ha agregado una descripción.
                </p>
              )}
            </div>

            <div className="space-y-3 text-sm text-[#CBD5E1]">
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-[#94A3B8] font-semibold">Fecha de creación</span>
                <span className="font-extrabold text-[#F8FAFC] text-right">
                  {perfil.username.toLowerCase() === "@rutftalentico"
                    ? "Miembro fundador"
                    : `Se unió el ${new Date(
                        (perfil.creado_en || perfil.created_at || new Date().toISOString()) as string
                      ).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}`}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-[#94A3B8] font-semibold">Fans totales</span>
                <span className="font-extrabold text-[#F8FAFC]">
                  {seguidores.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-[#94A3B8] font-semibold">Visualizaciones totales</span>
                <span className="font-extrabold text-[#F8FAFC]">
                  {vistasTotales.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <footer className="w-full max-w-2xl mx-auto px-5 py-6 border-t border-slate-100 text-center space-y-2">
            <p className="text-[11px] font-bold text-slate-400">
              RUTF Talentico © 2026 • Plataforma Global de Talento Original
            </p>
            <div className="flex items-center justify-center gap-3 text-xs font-extrabold text-blue-600">
              <a href="/privacidad" target="_blank" rel="noreferrer" className="hover:underline">
                Política de Privacidad
              </a>
              <span className="text-slate-300">•</span>
              <a href="/terminos" target="_blank" rel="noreferrer" className="hover:underline">
                Términos de Uso
              </a>
            </div>
          </footer>
        </div>
      )}

            {videoAEliminar && (
        <div
          onClick={() => !eliminandoVideo && setVideoAEliminar(null)}
          className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-[#162032] rounded-[18px] border border-[#2A3A54] text-[#F8FAFC] shadow-2xl p-6 space-y-4"
          >
            <div className="flex items-center gap-2.5 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-[#F8FAFC]">¿Eliminar video?</h3>
            </div>

            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Estás a punto de eliminar <strong>“{videoAEliminar.titulo}”</strong> de forma permanente.
              Se borrarán también sus comentarios, likes y el archivo de video de nuestros servidores.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                disabled={eliminandoVideo}
                onClick={() => setVideoAEliminar(null)}
                className="px-4 py-2 rounded-full border border-[#2A3A54] text-[#CBD5E1] text-xs font-extrabold hover:bg-[#0B1120]"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={eliminandoVideo}
                onClick={async () => {
                  setEliminandoVideo(true);
                  try {
                    await supabase.from("comentarios").delete().eq("video_id", videoAEliminar.id);
                    await supabase.from("votos_usuarios").delete().eq("video_id", videoAEliminar.id);
                    const { error } = await supabase.from("videos").delete().eq("id", videoAEliminar.id);
                    if (error) {
                      alert("No se pudo eliminar el video: " + error.message);
                      return;
                    }
                                      const partes = videoAEliminar.video_url.split("/videos/");
                    const segundo = partes.at(1);
                    if (segundo) {
                      const rutaArchivo = decodeURIComponent(segundo.split("?").at(0) || "");
                      if (rutaArchivo) await supabase.storage.from("videos").remove([rutaArchivo]);
                    }

                    setVideoAEliminar(null);
                    onRecargar();
                  } finally {
                    setEliminandoVideo(false);
                  }
                }}
                className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow"
              >
                {eliminandoVideo ? "Eliminando..." : "Aceptar y Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}

            {bannerPendiente && (
        <div
          onClick={() => {
            URL.revokeObjectURL(bannerPendiente.preview);
            setBannerPendiente(null);
          }}
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#162032] rounded-[18px] border border-[#2A3A54] text-[#F8FAFC] shadow-2xl p-5 sm:p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-[#F8FAFC]">Vista previa del banner</h3>
              <button
                type="button"
                onClick={() => {
                  URL.revokeObjectURL(bannerPendiente.preview);
                  setBannerPendiente(null);
                }}
                className="p-1.5 rounded-full hover:bg-[#1E293B] text-[#94A3B8]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

                        <div
              onPointerDown={(e) => {
                (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                arrastreRef.current = {
                  activo: true,
                  startX: e.clientX,
                  startY: e.clientY,
                  origX: bannerOffset.x,
                  origY: bannerOffset.y,
                };
              }}
              onPointerMove={(e) => {
                if (!arrastreRef.current.activo) return;
                const dx = ((e.clientX - arrastreRef.current.startX) / 220) * 100;
                const dy = ((e.clientY - arrastreRef.current.startY) / 140) * 100;
                const nx = Math.max(0, Math.min(100, Math.round(arrastreRef.current.origX - dx)));
                const ny = Math.max(0, Math.min(100, Math.round(arrastreRef.current.origY - dy)));
                setBannerOffset({ x: nx, y: ny });
              }}
              onPointerUp={() => {
                arrastreRef.current.activo = false;
              }}
              className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-[#2A3A54] touch-none select-none cursor-grab active:cursor-grabbing"
            >
              <img
                src={bannerPendiente.preview}
                alt="Vista previa banner"
                draggable={false}
                style={{ objectPosition: `${bannerOffset.x}% ${bannerOffset.y}%` }}
                className="w-full h-full object-cover pointer-events-none"
              />

              <div
                className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-200 ${
                  vistaDispositivo === "tv"
                    ? "border-2 border-red-500 bg-red-500/10"
                    : "bg-black/25"
                }`}
              >
                <div
                  className={`transition-all duration-200 flex items-center justify-center ${
                    vistaDispositivo === "movil"
                      ? "w-3/5 h-24 border-2 border-red-500 bg-red-500/15 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]"
                      : vistaDispositivo === "pc"
                      ? "w-full h-24 border-2 border-red-500 bg-red-500/15 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]"
                      : "w-full h-full"
                  }`}
                >
                  <span className="px-2.5 py-0.5 rounded-full bg-red-600/90 text-white text-[10px] font-black shadow">
                    {vistaDispositivo === "movil"
                      ? "Área visible en Móvil"
                      : vistaDispositivo === "pc"
                      ? "Área visible en Escritorio"
                      : "Área visible en TV (16:9)"}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-center text-[11px] font-bold text-[#94A3B8]">
              Desliza la imagen con tu dedo para encuadrarla y toca un dispositivo para ver el recorte en rojo
            </p>

            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setVistaDispositivo("tv")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-extrabold border transition ${
                  vistaDispositivo === "tv"
                    ? "bg-red-600 text-white border-red-600 shadow-xs"
                    : "bg-[#0B1120] text-[#94A3B8] border-[#2A3A54] hover:bg-[#1E293B]"
                }`}
              >
                <Tv className="w-3.5 h-3.5" /> TV (16:9)
              </button>
              <button
                type="button"
                onClick={() => setVistaDispositivo("pc")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-extrabold border transition ${
                  vistaDispositivo === "pc"
                    ? "bg-red-600 text-white border-red-600 shadow-xs"
                    : "bg-[#0B1120] text-[#94A3B8] border-[#2A3A54] hover:bg-[#1E293B]"
                }`}
              >
                <Monitor className="w-3.5 h-3.5" /> Escritorio
              </button>
              <button
                type="button"
                onClick={() => setVistaDispositivo("movil")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-extrabold border transition ${
                  vistaDispositivo === "movil"
                    ? "bg-red-600 text-white border-red-600 shadow-xs"
                    : "bg-[#0B1120] text-[#94A3B8] border-[#2A3A54] hover:bg-[#1E293B]"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" /> Móvil
              </button>
            </div>


            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  URL.revokeObjectURL(bannerPendiente.preview);
                  setBannerPendiente(null);
                }}
                className="px-4 py-2 rounded-full border border-[#2A3A54] text-[#CBD5E1] text-xs font-extrabold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={async () => {
                  const { archivo, preview } = bannerPendiente;
                  setBannerPendiente(null);
                  await subirImagen(archivo, "banner");
                  URL.revokeObjectURL(preview);
                }}
                className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow"
              >
                Guardar Banner
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export function ModalCompartir({
  titulo,
  videoId,
  onCerrar,
}: {
  titulo: string;
  videoId: string;
  onCerrar: () => void;
}) {
  const [copiado, setCopiado] = useState(false);
  const [preparando, setPreparando] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setPreparando(false), 750);
    return () => clearTimeout(t);
  }, [videoId]);

 const url = ["https://", "rutf-talentico", ".vercel.app/", "?v=", videoId].join("");

  const texto = `Mira "${titulo}" en RUTF Talentico:`;
  const waHref = "https://wa.me" + "?text=" + encodeURIComponent(`${texto} ${url}`);
  const fbHref = "https://facebook.com" + "/sharer/sharer.php" + "?u=" + encodeURIComponent(url);
  const twHref = "https://twitter.com" + "/intent/tweet" + "?text=" + encodeURIComponent(texto) + "&url=" + encodeURIComponent(url);
  const tgHref = "https://t.me" + "/share/url" + "?url=" + encodeURIComponent(url) + "&text=" + encodeURIComponent(texto);

  const copiar = () => {
    navigator.clipboard?.writeText(url);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2200);
  };

  const compartirNativo = async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        await Share.share({
          title: titulo,
          text: texto,
          url,
          dialogTitle: "Compartir talento en RUTF Talentico",
        });
        return;
      }
      if (navigator.share) {
        await navigator.share({ title: titulo, text: texto, url });
        return;
      }
    } catch {}
    copiar();
  };

  const abrirRed = (e: React.MouseEvent, href: string) => {
    if (Capacitor.isNativePlatform()) {
      e.preventDefault();
      compartirNativo();
      return;
    }
    window.open(href, "_blank", "noopener,noreferrer");
    e.preventDefault();
  };

  return (
    <div
      onClick={onCerrar}
      className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#162032] rounded-[18px] border border-[#2A3A54] text-[#F8FAFC] shadow-2xl p-6 space-y-4"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-black text-[#F8FAFC]">Compartir talento</h3>
          <button
            type="button"
            onClick={onCerrar}
            className="p-1.5 rounded-full hover:bg-[#1E293B] text-[#94A3B8]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs font-bold text-[#CBD5E1] line-clamp-2">{titulo}</p>

        {preparando ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3 bg-[#0B1120] rounded-2xl border border-[#2A3A54]/80">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-extrabold text-[#CBD5E1]">
              Generando enlace directo del video y código QR...
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center p-4 bg-[#0B1120] rounded-2xl border border-[#2A3A54]/80">
              <div className="p-2.5 bg-white rounded-2xl border border-[#2A3A54] shadow-xs">
                <QRCodeSVG value={url} size={136} bgColor="#ffffff" fgColor="#0f172a" level="M" />
              </div>
              <span className="text-[11px] font-bold text-[#94A3B8] mt-2 text-center">
                Escanea con tu cámara para abrir este video al instante
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[11px] font-extrabold">
              <a
                href={waHref}
                onClick={(e) => abrirRed(e, waHref)}
                className="py-2 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-center transition"
              >
                WhatsApp
              </a>
              <a
                href={fbHref}
                onClick={(e) => abrirRed(e, fbHref)}
                className="py-2 px-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-center transition"
              >
                Facebook
              </a>
              <a
                href={twHref}
                onClick={(e) => abrirRed(e, twHref)}
                className="py-2 px-2 rounded-xl bg-[#1E293B] hover:bg-slate-200 text-[#F8FAFC] border border-[#2A3A54] text-center transition"
              >
                X / Twitter
              </a>
              <a
                href={tgHref}
                onClick={(e) => abrirRed(e, tgHref)}
                className="py-2 px-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-center transition"
              >
                Telegram
              </a>
              <button
                type="button"
                onClick={compartirNativo}
                className="col-span-2 py-2 px-2 rounded-xl bg-gradient-to-r from-pink-50 to-orange-50 hover:from-pink-100 hover:to-orange-100 text-pink-800 border border-pink-200 inline-flex items-center justify-center gap-1.5 transition"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Instagram / Más apps</span>
              </button>
            </div>

            <div className="flex items-center gap-2 p-2 bg-[#1E293B] rounded-xl border border-[#2A3A54]">
              <span className="text-[11px] font-mono text-[#CBD5E1] truncate flex-1 px-1">{url}</span>
              <button
                type="button"
                onClick={copiar}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-black text-white shrink-0 transition ${
                  copiado ? "bg-emerald-600" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {copiado ? "Copiado ✓" : "Copiar"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

















