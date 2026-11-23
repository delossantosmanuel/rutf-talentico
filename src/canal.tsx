"use client";
import React, { useState, useRef } from "react";
import { Camera, Image as ImageIcon, Save, Trash2, Eye, Sparkles, CheckCircle2, Share2, Copy, Check, X, Play, Pencil, Tv, Monitor, Tablet, Smartphone, Sliders } from "lucide-react";
import { Share } from "@capacitor/share";

export type PerfilCanal = {
  id: string;
  username: string;
  email: string;
  es_fundador: boolean;
  nombre_canal?: string;
  bio?: string;
  avatar_url?: string;
  banner_url?: string;
  tema_banner?: string;
};

const TEMAS_BANNER = [
  { id: "from-blue-600 via-indigo-600 to-orange-500", nombre: "Oficial RUTF" },
  { id: "from-emerald-600 via-teal-600 to-cyan-600", nombre: "Esmeralda" },
  { id: "from-orange-500 via-rose-500 to-purple-600", nombre: "Atardecer" },
  { id: "from-slate-900 via-blue-900 to-slate-800", nombre: "Estudio Noche" },
];

function parseBanner(raw?: string) {
  if (!raw) return { url: "", posY: 50, zoom: 100 };
  const partes = raw.split("#");
  const url = partes.at(0) || "";
  const params = new URLSearchParams(partes.at(1) || "");
  return { url, posY: Number(params.get("y") || 50), zoom: Number(params.get("z") || 100) };
}

export function ModalCompartir({ titulo, videoId, onCerrar }: { titulo: string; videoId: string; onCerrar: () => void }) {
  const [copiado, setCopiado] = useState(false);
  const baseUrl = "https://vercel.app";
  const enlaceDirecto = `${baseUrl}/?v=${videoId}`;
  const texto = encodeURIComponent(`Mira "${titulo}" en RUTF Talentico: ${enlaceDirecto}`);
  const linkCodificado = encodeURIComponent(enlaceDirecto);

  const copiar = () => {
    navigator.clipboard?.writeText(`${titulo} - Mira este talento en RUTF Talentico: ${enlaceDirecto}`);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };
  const compartirNativo = async () => {
    try {
      await Share.share({
        title: titulo,
        text: `Mira "${titulo}" en RUTF Talentico`,
        url: enlaceDirecto,
        dialogTitle: "Compartir talento en...",
      });
    } catch {
      if (typeof navigator !== "undefined" && navigator.share) {
        navigator.share({ title: titulo, text: `Mira "${titulo}" en RUTF Talentico`, url: enlaceDirecto }).catch(() => copiar());
      } else {
        copiar();
      }
    }
  };

  const abrirRedSocial = async (url: string) => {
    const esMovil = typeof navigator !== "undefined" && /Android|iPhone|iPad/i.test(navigator.userAgent);
    if (esMovil) {
      await compartirNativo();
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };


  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 relative">
        <button onClick={onCerrar} className="absolute right-4 top-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200"><X className="w-4 h-4" /></button>
        <div>
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2"><Share2 className="w-5 h-5 text-blue-600" /> Compartir Talento</h3>
          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{titulo}</p>
        </div>
        <div className="grid grid-cols-2 gap-2.5 text-xs font-extrabold">
                  <button type="button" onClick={() => abrirRedSocial(`https://whatsapp.com{texto}`)} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600">WhatsApp</button>
          <button type="button" onClick={() => abrirRedSocial(`https://facebook.com{linkCodificado}`)} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700">Facebook</button>
          <button type="button" onClick={() => abrirRedSocial(`https://twitter.com{texto}`)} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800">X / Twitter</button>
          <button type="button" onClick={() => abrirRedSocial(`https://t.me{linkCodificado}&text=${texto}`)} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-sky-500 text-white hover:bg-sky-600">Telegram</button>

        </div>
        <button type="button" onClick={compartirNativo} className="w-full bg-gradient-to-r from-blue-600 to-orange-500 text-white font-black py-3 rounded-xl text-xs shadow-md hover:opacity-95">Instagram / Más apps del teléfono</button>
        <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-xl border border-slate-200">
          <input readOnly value={enlaceDirecto} className="bg-transparent text-[11px] text-slate-600 flex-1 outline-none" />
          <button type="button" onClick={copiar} className="flex items-center gap-1 bg-white border border-slate-300 px-3 py-1.5 rounded-lg text-[11px] font-bold hover:bg-slate-50">
            {copiado ? <><Check className="w-3.5 h-3.5 text-emerald-600" /> Copiado</> : <><Copy className="w-3.5 h-3.5" /> Copiar</>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EstudioCanal({ supabase, perfil, videosCanal, seguidores, onActualizarPerfil, onAbrirVideo, onRecargar }: {
  supabase: any; perfil: PerfilCanal; videosCanal: any[]; seguidores: number;
  onActualizarPerfil: (p: PerfilCanal) => void; onAbrirVideo: (v: any) => void; onRecargar: () => void;
}) {
  const inicial = parseBanner(perfil.banner_url);
  const [nombreCanal, setNombreCanal] = useState(perfil.nombre_canal || perfil.username.replace("@", ""));
  const [bio, setBio] = useState(perfil.bio || "");
  const [tema, setTema] = useState(perfil.tema_banner || TEMAS_BANNER.at(0)?.id || "from-blue-600 via-indigo-600 to-orange-500");
  const [avatarUrl, setAvatarUrl] = useState(perfil.avatar_url || "");
  const [bannerBaseUrl, setBannerBaseUrl] = useState(inicial.url);
  const [posY, setPosY] = useState(inicial.posY);
  const [zoom, setZoom] = useState(inicial.zoom);
  const [abrirEditorBanner, setAbrirEditorBanner] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [editandoVideo, setEditandoVideo] = useState<any | null>(null);
  const inputAvatarRef = useRef<HTMLInputElement>(null);
  const inputBannerRef = useRef<HTMLInputElement>(null);
  const bannerCompletoUrl = bannerBaseUrl ? `${bannerBaseUrl}#y=${posY}&z=${zoom}` : "";

  const subirImagen = async (e: React.ChangeEvent<HTMLInputElement>, tipo: "avatar" | "banner") => {
    const file = Array.from(e.target.files || []).at(0);
    if (!file) return;
    if (file.size / (1024 * 1024) > 5) return alert("La imagen debe pesar menos de 5 MB.");
    setGuardando(true);
    const ext = file.name.split(".").pop() || "jpg";
    const ruta = `${perfil.id}-${tipo}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("perfiles-rutf").upload(ruta, file);
    if (error) { alert("Error subiendo imagen: " + error.message); setGuardando(false); return; }
    const { data } = supabase.storage.from("perfiles-rutf").getPublicUrl(ruta);
    const nuevaUrl = data.publicUrl;
    if (tipo === "avatar") {
      setAvatarUrl(nuevaUrl);
      await supabase.from("usuarios_rutf").update({ avatar_url: nuevaUrl }).eq("id", perfil.id);
      const act = { ...perfil, avatar_url: nuevaUrl };
      localStorage.setItem("rutf_sesion", JSON.stringify(act));
      onActualizarPerfil(act);
    } else {
      setBannerBaseUrl(nuevaUrl); setPosY(50); setZoom(100); setAbrirEditorBanner(true);
    }
    setGuardando(false);
    e.target.value = "";
  };

  const guardarCambios = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setGuardando(true);
    const actualizado: PerfilCanal = { ...perfil, nombre_canal: nombreCanal.trim(), bio: bio.trim(), tema_banner: tema, avatar_url: avatarUrl, banner_url: bannerCompletoUrl };
    const { error } = await supabase.from("usuarios_rutf").update({ nombre_canal: actualizado.nombre_canal, bio: actualizado.bio, tema_banner: actualizado.tema_banner, avatar_url: actualizado.avatar_url, banner_url: actualizado.banner_url }).eq("id", perfil.id);
    setGuardando(false);
    if (error) return alert("No se pudo guardar: " + error.message);
    localStorage.setItem("rutf_sesion", JSON.stringify(actualizado));
    onActualizarPerfil(actualizado);
    setAbrirEditorBanner(false);
    alert("¡Diseño y encuadre de tu canal guardados con éxito!");
  };

  const guardarEdicionVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editandoVideo) return;
    if (editandoVideo.titulo.trim().length < 10) return alert("El título debe tener al menos 10 caracteres.");
    setGuardando(true);
    const tagsLimpios = (editandoVideo.hashtags || "").split(/\s+/).filter(Boolean).map((h: string) => (h.startsWith("#") ? h : `#${h}`)).join(" ");
    const { error } = await supabase.from("videos").update({ titulo: editandoVideo.titulo.trim(), descripcion: (editandoVideo.descripcion || "").trim(), etiquetas: (editandoVideo.etiquetas || "").trim(), hashtags: tagsLimpios }).eq("id", editandoVideo.id);
    setGuardando(false);
    if (error) return alert("Error al actualizar video: " + error.message);
    setEditandoVideo(null);
    onRecargar();
    alert("¡Video actualizado con éxito!");
  };

  const borrarVideo = async (videoId: string) => {
    if (!confirm("¿Seguro que deseas eliminar este video de tu canal?")) return;
    await supabase.from("videos").delete().eq("id", videoId);
    onRecargar();
  };

  const vistasCanal = videosCanal.reduce((a, b) => a + (b.vistas || 0), 0);
    return (
    <div className="max-w-4xl mx-auto space-y-6">
      <input id="input-banner-rutf" type="file" accept="image/*" onChange={(e) => subirImagen(e, "banner")} className="hidden" />
      <input id="input-avatar-rutf" type="file" accept="image/*" onChange={(e) => subirImagen(e, "avatar")} className="hidden" />

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className={`h-40 sm:h-52 relative overflow-hidden bg-gradient-to-r ${tema}`}>
          {bannerBaseUrl && <img src={bannerBaseUrl} alt="Banner" style={{ objectPosition: `50% ${posY}%`, transform: `scale(${zoom / 100})` }} className="w-full h-full object-cover transition-transform" />}
          <div className="absolute right-4 bottom-4 z-20 flex items-center gap-2">
            {bannerBaseUrl && (
              <button type="button" onClick={() => setAbrirEditorBanner(!abrirEditorBanner)} className="bg-white/95 hover:bg-white text-slate-900 px-3 py-2 rounded-full text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-md">
                <Sliders className="w-3.5 h-3.5 text-blue-600" /> Ajustar Vista TV / Móvil
              </button>
            )}
            <label htmlFor="input-banner-rutf" className="bg-black/80 hover:bg-black text-white px-4 py-2 rounded-full text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-md">
              <ImageIcon className="w-4 h-4" /> Cambiar Banner
            </label>
          </div>
        </div>


        {abrirEditorBanner && bannerBaseUrl && (
          <div className="bg-slate-900 text-white p-5 space-y-4 border-b border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-black flex items-center gap-1.5"><Sliders className="w-4 h-4 text-orange-400" /> Encuadre y Vista Previa Multidispositivo</h4>
                <p className="text-[11px] text-slate-400">Ajusta la altura y el zoom para comprobar cómo se ve en cada pantalla.</p>
              </div>
              <button type="button" onClick={() => guardarCambios()} className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-1.5 rounded-full text-xs font-extrabold cursor-pointer">Aplicar y Guardar Banner</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-800/70 p-3.5 rounded-2xl text-xs">
              <div>
                <div className="flex justify-between mb-1 font-bold"><span>Posición Vertical (Arriba / Abajo)</span><span>{posY}%</span></div>
                <input type="range" min={0} max={100} value={posY} onChange={(e) => setPosY(Number(e.target.value))} className="w-full accent-orange-500 cursor-pointer" />
              </div>
              <div>
                <div className="flex justify-between mb-1 font-bold"><span>Acercamiento (Zoom)</span><span>{zoom}%</span></div>
                <input type="range" min={100} max={180} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="w-full accent-blue-500 cursor-pointer" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[11px]">
              {[
                { label: "Televisor (TV)", icon: Tv, aspect: "aspect-[16/5]" },
                { label: "Computadora (PC)", icon: Monitor, aspect: "aspect-[16/4]" },
                { label: "Tablet", icon: Tablet, aspect: "aspect-[16/5]" },
                { label: "Teléfono Móvil", icon: Smartphone, aspect: "aspect-[16/7]" },
              ].map((d) => (
                <div key={d.label} className="bg-slate-800 rounded-xl p-2 space-y-1.5 border border-slate-700">
                  <div className="flex items-center gap-1 font-bold text-slate-300"><d.icon className="w-3.5 h-3.5 text-blue-400" /> {d.label}</div>
                  <div className={`w-full ${d.aspect} rounded-lg overflow-hidden bg-slate-950 relative`}>
                    <img src={bannerBaseUrl} alt={d.label} style={{ objectPosition: `50% ${posY}%`, transform: `scale(${zoom / 100})` }} className="w-full h-full object-cover" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 relative z-10">
            <div className="flex items-end gap-4">
              <div onClick={() => inputAvatarRef.current?.click()} title="Cambiar foto de perfil" className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 to-orange-500 border-4 border-white shadow-md overflow-hidden flex items-center justify-center text-white font-black text-2xl cursor-pointer group">
                {avatarUrl ? <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : perfil.username.replace("@", "").slice(0, 2).toUpperCase()}
                <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition"><Camera className="w-6 h-6" /></div>
              </div>
              <div className="pb-1">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-1.5">
                  {nombreCanal || perfil.username}
                  {perfil.username.toLowerCase() === "@rutf_talentico" && <CheckCircle2 className="w-5 h-5 text-blue-600 fill-blue-100" />}
                </h2>
                <p className="text-xs font-bold text-blue-600">{perfil.username} • <span className="text-slate-500">{seguidores} suscriptores • {vistasCanal} vistas</span></p>
              </div>
            </div>
          </div>

          <form onSubmit={guardarCambios} className="mt-6 pt-5 border-t border-slate-100 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-black text-slate-800">Personalizar Diseño de mi Canal</h3>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-500 font-bold mr-1">Color de Banner:</span>
                {TEMAS_BANNER.map((t) => (
                  <button key={t.id} type="button" onClick={() => { setTema(t.id); setBannerBaseUrl(""); setAbrirEditorBanner(false); }} title={t.nombre} className={`w-6 h-6 rounded-full bg-gradient-to-r ${t.id} border-2 cursor-pointer ${tema === t.id && !bannerBaseUrl ? "border-slate-900 scale-110" : "border-white"}`} />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Nombre visible del Canal</label>
                <input maxLength={50} value={nombreCanal} onChange={(e) => setNombreCanal(e.target.value)} placeholder="Ej: Manuel Digitalidad" className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-blue-600" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Descripción / Biografía del Canal</label>
                <input maxLength={160} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Cuéntale a tu comunidad qué talento compartes..." className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-blue-600" />
              </div>
            </div>
            <button disabled={guardando} type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"><Save className="w-4 h-4" /> {guardando ? "Guardando..." : "Guardar Diseño del Canal"}</button>
          </form>
        </div>
      </div>

      {editandoVideo && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={guardarEdicionVideo} className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-base text-slate-900">Editar Video Publicado</h3>
              <button type="button" onClick={() => setEditandoVideo(null)} className="p-1.5 rounded-full bg-slate-100 text-slate-600 cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <div><label className="text-xs font-bold text-slate-700 mb-1 block">Título (Mín. 10 / Máx. 80)</label><input required minLength={10} maxLength={80} value={editandoVideo.titulo} onChange={(e) => setEditandoVideo({ ...editandoVideo, titulo: e.target.value })} className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-xs" /></div>
            <div><label className="text-xs font-bold text-slate-700 mb-1 block">Descripción</label><textarea rows={3} maxLength={1000} value={editandoVideo.descripcion || ""} onChange={(e) => setEditandoVideo({ ...editandoVideo, descripcion: e.target.value })} className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-xs resize-none" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs font-bold text-slate-700 mb-1 block">Etiquetas</label><input value={editandoVideo.etiquetas || ""} onChange={(e) => setEditandoVideo({ ...editandoVideo, etiquetas: e.target.value })} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs" /></div>
              <div><label className="text-xs font-bold text-slate-700 mb-1 block">Hashtags</label><input value={editandoVideo.hashtags || ""} onChange={(e) => setEditandoVideo({ ...editandoVideo, hashtags: e.target.value })} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs" /></div>
            </div>
            <button disabled={guardando} type="submit" className="w-full bg-gradient-to-r from-blue-600 to-orange-500 text-white font-extrabold py-2.5 rounded-xl text-xs cursor-pointer">{guardando ? "Guardando cambios..." : "Guardar Cambios del Video"}</button>
          </form>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
        <h3 className="font-black text-base text-slate-900">Mis Videos Publicados ({videosCanal.length})</h3>
        {videosCanal.length === 0 ? (
          <p className="text-xs text-slate-500">Aún no has subido videos en este canal. Toca el botón superior <strong>Subir Video</strong> para publicar tu primer talento.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {videosCanal.map((v) => (
              <div key={v.id} className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50">
                <div onClick={() => onAbrirVideo(v)} className="relative aspect-video bg-slate-900 flex items-center justify-center cursor-pointer">
                  <video src={v.video_url} className="w-full h-full object-cover opacity-85" />
                  <Play className="absolute w-9 h-9 text-white fill-white" />
                </div>
                <div className="p-3 space-y-2">
                  <p className="font-bold text-xs line-clamp-1">{v.titulo}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {v.vistas || 0} • <Sparkles className="w-3.5 h-3.5 text-blue-600" /> {v.likes || 0}</span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setEditandoVideo(v)} title="Editar video" className="text-blue-600 hover:bg-blue-50 p-1 rounded-lg cursor-pointer"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => borrarVideo(v.id)} title="Eliminar video" className="text-rose-600 hover:bg-rose-50 p-1 rounded-lg cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
