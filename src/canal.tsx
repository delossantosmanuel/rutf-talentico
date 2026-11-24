"use client";

import { useState, useRef } from "react";
import {
  Camera,
  CheckCircle2,
  Play,
  Eye,
  Save,
  ArrowLeft,
  PlusCircle,
  MoreVertical,
  Edit3,
  Info,
  LogOut,
  X,
} from "lucide-react";

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
};

type VideoCanal = {
  id: string;
  titulo: string;
  video_url: string;
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
};

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

  const inputAvatarRef = useRef<HTMLInputElement>(null);
  const inputBannerRef = useRef<HTMLInputElement>(null);

  const vistasTotales = videos.reduce((acc, v) => acc + (v.vistas || 0), 0);

  const subirImagen = async (archivo: File, tipo: "avatar" | "banner") => {
    setSubiendoImg(tipo);
    try {
      const ext = archivo.name.split(".").pop() || "jpg";
      const ruta = `perfiles/${perfil.id}_${tipo}_${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("videos")
        .upload(ruta, archivo, { upsert: true });

      if (upErr) {
        alert("No se pudo subir la imagen: " + upErr.message);
        setSubiendoImg(null);
        return;
      }

      const { data: pub } = supabase.storage.from("videos").getPublicUrl(ruta);
      const urlPublica = pub.publicUrl;

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

      if (actualizado) {
        localStorage.setItem("rutf_sesion", JSON.stringify(actualizado));
        onActualizarPerfil(actualizado);
      }
    } finally {
      setSubiendoImg(null);
    }
  };

  const guardarCambios = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    try {
      const bioLimpia = bio.trim().slice(0, 160);
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

      <div className="sticky top-0 z-30 -mx-4 px-4 py-2.5 bg-white/95 backdrop-blur border-b border-slate-200 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {onVolver && (
            <button
              type="button"
              onClick={onVolver}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold transition shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver</span>
            </button>
          )}
          <span className="text-sm font-black text-slate-900 truncate">{perfil.username}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onAbrirSubir && (
            <button
              type="button"
              onClick={onAbrirSubir}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-sm transition"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Subir Video</span>
            </button>
          )}

          <div className="w-8 h-8 aspect-square rounded-full overflow-hidden bg-gradient-to-tr from-blue-600 to-orange-500 text-white font-black text-xs flex items-center justify-center shrink-0">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Cuenta" className="w-full h-full object-cover" />
            ) : (
              perfil.username.replace("@", "").charAt(0).toUpperCase()
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpciones(!menuOpciones)}
              aria-label="Opciones del canal"
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {menuOpciones && (
              <div className="absolute right-0 top-10 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 z-40 text-xs font-bold text-slate-700">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpciones(false);
                    setModalInfoCanal(true);
                  }}
                  className="w-full px-3.5 py-2.5 text-left hover:bg-slate-50 flex items-center gap-2"
                >
                  <Info className="w-4 h-4 text-blue-600" />
                  <span>Información del canal</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpciones(false);
                    setEditorAbierto(!editorAbierto);
                  }}
                  className="w-full px-3.5 py-2.5 text-left hover:bg-slate-50 flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4 text-slate-600" />
                  <span>{editorAbierto ? "Cerrar edición" : "Editar canal"}</span>
                </button>
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

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="relative h-36 sm:h-48 bg-gradient-to-r from-blue-950 via-blue-800 to-slate-900">
          {bannerUrl && (
            <img src={bannerUrl} alt="Banner del canal" className="w-full h-full object-cover" />
          )}

          <input
            ref={inputBannerRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) subirImagen(f, "banner");
            }}
          />

          <button
            type="button"
            onClick={() => inputBannerRef.current?.click()}
            disabled={subiendoImg === "banner"}
            className="absolute bottom-3 right-3 px-3.5 py-1.5 rounded-full bg-slate-950/75 hover:bg-slate-950 text-white text-xs font-extrabold backdrop-blur inline-flex items-center gap-1.5 shadow transition"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{subiendoImg === "banner" ? "Subiendo..." : "Cambiar Banner"}</span>
          </button>
        </div>

        <div className="px-5 sm:px-6 pb-6">
          <div className="flex items-end justify-between gap-3 -mt-10 relative z-10">
            <input
              ref={inputAvatarRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) subirImagen(f, "avatar");
              }}
            />

                    <div
              onClick={() => inputAvatarRef.current?.click()}
              title="Cambiar foto de perfil"
              className="relative w-20 h-20 aspect-square rounded-full border-4 border-white shadow-md overflow-hidden bg-gradient-to-tr from-blue-600 to-orange-500 text-white font-black text-xl flex items-center justify-center cursor-pointer group shrink-0"
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                perfil.username.replace("@", "").slice(0, 2).toUpperCase()
              )}
              <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setEditorAbierto(!editorAbierto)}
              className="px-4 py-2 rounded-full border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-extrabold inline-flex items-center gap-1.5 transition"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{editorAbierto ? "Cancelar" : "Editar Canal"}</span>
            </button>
          </div>

          <div className="mt-3 space-y-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h2 className="text-xl font-black text-slate-900 truncate">
                {nombreCanal || perfil.username}
              </h2>
              {perfil.username.toLowerCase() === "@rutf_talentico" && (
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
              )}
            </div>

            <p className="text-xs font-bold text-slate-500">
              {perfil.username} • {seguidores.toLocaleString()}{" "}
              {seguidores === 1 ? "suscriptor" : "suscriptores"}
            </p>

             {perfil.bio && (
  <p className="text-xs sm:text-sm text-slate-700 pt-1.5 leading-relaxed line-clamp-2">
    {perfil.bio}
  </p>
)}


            <div className="pt-1">
              <button
                type="button"
                onClick={() => setModalInfoCanal(true)}
                className="text-xs font-extrabold text-blue-600 hover:text-blue-700 inline-flex items-center gap-0.5 transition"
              >
                <span>Información del canal ›</span>
              </button>
            </div>
          </div>

          {editorAbierto && (
            <form
              onSubmit={guardarCambios}
              className="mt-5 pt-5 border-t border-slate-200 space-y-4"
            >
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Nombre visible del Canal
                </label>
                <input
                  type="text"
                  required
                  maxLength={40}
                  value={nombreCanal}
                  onChange={(e) => setNombreCanal(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-extrabold text-slate-700">
                    Descripción / Biografía del Canal
                  </label>
                  <span className="text-[11px] font-bold text-slate-400">
                    {bio.length}/160
                  </span>
                </div>
                <textarea
                  rows={3}
                  maxLength={160}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Cuéntale a tu comunidad qué talento compartes..."
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={guardando}
                className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-black inline-flex items-center gap-2 shadow transition disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{guardando ? "Guardando..." : "Guardar Cambios"}</span>
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <h3 className="text-base font-black text-slate-900">
          Mis Videos Publicados ({videos.length})
        </h3>

        {videos.length === 0 ? (
          <p className="text-xs sm:text-sm text-slate-500 py-4">
            Aún no has subido videos en este canal. Toca el botón superior{" "}
            <strong className="text-slate-700">Subir Video</strong> para publicar tu primer talento.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {videos.map((v) => (
              <div
                key={v.id}
                onClick={() => onAbrirVideo(v)}
                className="group border border-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:shadow-md transition bg-slate-50"
              >
                <div className="relative aspect-video bg-slate-950">
                  <video
                    src={v.video_url}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition"
                    muted
                    playsInline
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                    <div className="w-10 h-10 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs font-extrabold text-slate-900 line-clamp-1">{v.titulo}</p>
                  <p className="text-[11px] font-bold text-slate-500 mt-1 flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{(v.vistas || 0).toLocaleString()} visualizaciones</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalInfoCanal && (
        <div
          onClick={() => setModalInfoCanal(false)}
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 space-y-5"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Información del canal</h3>
              <button
                type="button"
                onClick={() => setModalInfoCanal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-sm text-slate-700">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-semibold">Fecha de creación</span>
                <span className="font-extrabold text-slate-900">
                  Se unió el{" "}
                  {perfil.created_at
                    ? new Date(perfil.created_at).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "24 de noviembre de 2026"}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-semibold">Suscriptores totales</span>
                <span className="font-extrabold text-slate-900">
                  {seguidores.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-500 font-semibold">Visualizaciones totales</span>
                <span className="font-extrabold text-slate-900">
                  {vistasTotales.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setModalInfoCanal(false)}
              className="w-full py-2.5 rounded-full bg-slate-900 text-white text-xs font-black"
            >
              Cerrar
            </button>
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
  const url = `https://vercel.app{videoId}`;
  const copiar = () => {
    navigator.clipboard?.writeText(url);
    alert("Enlace copiado al portapapeles");
    onCerrar();
  };

  return (
    <div
      onClick={onCerrar}
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-white rounded-3xl border border-slate-200 shadow-2xl p-5 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-900">Compartir talento</h3>
          <button
            type="button"
            onClick={onCerrar}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-slate-600 line-clamp-2">{titulo}</p>
        <div className="p-2.5 bg-slate-100 rounded-xl text-[11px] font-mono text-slate-700 truncate">
          {url}
        </div>
        <button
          type="button"
          onClick={copiar}
          className="w-full py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-black"
        >
          Copiar enlace para compartir
        </button>
      </div>
    </div>
  );
}

 