"use client";
import React, { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { Play, ThumbsUp, ThumbsDown, Flame, PlusCircle, Award, Users, Eye, DollarSign, CheckCircle2, Sparkles, ShieldAlert, MessageSquare, Send, Hash, Search, Share2, Scissors, UserPlus, Settings, Check, X, LogIn, LogOut, LayoutDashboard } from "lucide-react";
import SubirVideoForm from "../subir";
import AuthModal from "../auth";
import EstudioCanal, { ModalCompartir, PerfilCanal } from "../canal";

const SUPABASE_URL = "https://" + "macovqecajhwhntlpkta" + ".supabase.co";
const SUPABASE_KEY = "sb_publishable_OuFfTHlGkS0jKmCkwh7axw_eDS0JXh7";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

type Video = { id: string; titulo: string; descripcion?: string; etiquetas?: string; hashtags?: string; creador: string; nivel: string; tipo: "largo" | "vertical"; video_url: string; vistas: number; likes: number; dislikes?: number; creado_en?: string; };
type Comentario = { id: string; usuario: string; texto: string; creado_en: string; };

export default function Home() {
  const [tab, setTab] = useState("inicio");
  const [lista, setLista] = useState<Video[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [usuario, setUsuario] = useState<PerfilCanal | null>(null);
  const [mostrarAuth, setMostrarAuth] = useState(false);
  const [videoCompartir, setVideoCompartir] = useState<Video | null>(null);
  const [votos, setVotos] = useState<Record<string, "like" | "dislike">>({});
  const [suscritos, setSuscritos] = useState<Record<string, boolean>>({});
  const [notifCreador, setNotifCreador] = useState<Record<string, "todas" | "ninguna">>({});
  const [menuEngranaje, setMenuEngranaje] = useState<string | null>(null);
  const [conteoSeguidores, setConteoSeguidores] = useState<Record<string, number>>({});
  const [videoActivo, setVideoActivo] = useState<Video | null>(null);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
    const [indiceShort, setIndiceShort] = useState(0);
  const [mostrarGuiaSwipe, setMostrarGuiaSwipe] = useState(true);
  const [toqueInicioY, setToqueInicioY] = useState<number | null>(null);

  const [nuevoCom, setNuevoCom] = useState("");
  const vistaContadaRef = useRef<Record<string, boolean>>({});

    const cargarDatos = async () => {
    const { data: vids } = await supabase.from("videos").select("*").order("creado_en", { ascending: false });
    if (vids) {
      setLista(vids);
      if (typeof window !== "undefined") {
        const videoParam = new URLSearchParams(window.location.search).get("v");
        if (videoParam) {
          const encontrado = vids.find((item: Video) => String(item.id) === String(videoParam));
          if (encontrado) abrirVideo(encontrado);
        }
      }
    }
    const { data: subs } = await supabase.from("suscripciones_usuarios").select("canal");
    if (subs) {
      const mapa: Record<string, number> = {};
      subs.forEach((s: { canal: string }) => { mapa[s.canal] = (mapa[s.canal] || 0) + 1; });
      setConteoSeguidores(mapa);
    }
  };


  const cargarActividadUsuario = async (uid: string) => {
    const { data: misSubs } = await supabase.from("suscripciones_usuarios").select("canal, notificaciones").eq("usuario_id", uid);
    if (misSubs) {
      const sMap: Record<string, boolean> = {};
      const nMap: Record<string, "todas" | "ninguna"> = {};
      misSubs.forEach((s: { canal: string; notificaciones: string }) => {
        sMap[s.canal] = true;
        nMap[s.canal] = s.notificaciones === "ninguna" ? "ninguna" : "todas";
      });
      setSuscritos(sMap);
      setNotifCreador(nMap);
    }
    const { data: misVotos } = await supabase.from("votos_usuarios").select("video_id, tipo").eq("usuario_id", uid);
    if (misVotos) {
      const vMap: Record<string, "like" | "dislike"> = {};
      misVotos.forEach((v: { video_id: string; tipo: "like" | "dislike" }) => { vMap[v.video_id] = v.tipo; });
      setVotos(vMap);
    }
  };

  useEffect(() => {
    cargarDatos();
    const iniciarSesion = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user?.email) {
        const emailGoogle = authData.user.email.toLowerCase();
        const { data: existente } = await supabase.from("usuarios_rutf").select("*").eq("email", emailGoogle).maybeSingle();
        if (existente) {
          localStorage.setItem("rutf_sesion", JSON.stringify(existente));
          setUsuario(existente);
          cargarActividadUsuario(existente.id);
          return;
        } else {
          const base = emailGoogle.split("@").at(0)?.replace(/[^a-zA-Z0-9_]/g, "") || "Talento";
          let handle = `@${base}`;
          if (handle.toLowerCase() === "@rutf_talentico") handle = `@${base}_rd`;
          const { data: creado } = await supabase.from("usuarios_rutf").insert([{
            username: handle,
            username_lower: handle.toLowerCase(),
            email: emailGoogle,
            password_hash: "google_oauth",
            es_fundador: false,
          }]).select("*").single();
          if (creado) {
            localStorage.setItem("rutf_sesion", JSON.stringify(creado));
            setUsuario(creado);
            cargarActividadUsuario(creado.id);
            return;
          }
        }
      }
      const sesion = localStorage.getItem("rutf_sesion");
      if (sesion) {
        const u = JSON.parse(sesion);
        setUsuario(u);
        cargarActividadUsuario(u.id);
      }
    };
    iniciarSesion();
  }, []);
  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("rutf_sesion");
    setUsuario(null);
    setSuscritos({});
    setVotos({});
    if (tab === "subir" || tab === "canal") setTab("inicio");
  };

  const abrirSubir = () => {
    if (!usuario) return setMostrarAuth(true);
    setTab("subir");
    setVideoActivo(null);
  };

  const toggleSuscripcion = async (canal: string) => {
    if (!usuario) return setMostrarAuth(true);
    if (usuario.username.toLowerCase() === canal.toLowerCase()) return;

    const yaSuscrito = !!suscritos[canal];
    if (yaSuscrito) {
      setSuscritos({ ...suscritos, [canal]: false });
      setMenuEngranaje(null);
      await supabase.from("suscripciones_usuarios").delete().eq("usuario_id", usuario.id).eq("canal", canal);
    } else {
      setSuscritos({ ...suscritos, [canal]: true });
      setNotifCreador({ ...notifCreador, [canal]: "todas" });
      await supabase.from("suscripciones_usuarios").upsert({ usuario_id: usuario.id, canal, notificaciones: "todas" }, { onConflict: "usuario_id,canal" });
    }
    cargarDatos();
  };

  const cambiarNotificacion = async (canal: string, opcion: "todas" | "ninguna") => {
    if (!usuario) return setMostrarAuth(true);
    setNotifCreador({ ...notifCreador, [canal]: opcion });
    setMenuEngranaje(null);
    await supabase.from("suscripciones_usuarios").update({ notificaciones: opcion }).eq("usuario_id", usuario.id).eq("canal", canal);
  };

  const cargarComentarios = async (videoId: string) => {
    const { data } = await supabase.from("comentarios").select("*").eq("video_id", videoId).order("creado_en", { ascending: false });
    if (data) setComentarios(data);
  };

  const abrirVideo = (v: Video) => {
    setVideoActivo(v);
    cargarComentarios(v.id);
  };

  const registrarVistaCalificada = async (v: Video, segundosVistos: number) => {
    if (segundosVistos < 6 || vistaContadaRef.current[v.id]) return;
    vistaContadaRef.current[v.id] = true;
    const nuevasVistas = (v.vistas || 0) + 1;
    setVideoActivo((prev) => (prev && prev.id === v.id ? { ...prev, vistas: nuevasVistas } : prev));
    await supabase.from("videos").update({ vistas: nuevasVistas }).eq("id", v.id);
    cargarDatos();
  };

   const reaccionar = async (v: Video, tipoReaccion: "like" | "dislike") => {
    if (!usuario) return setMostrarAuth(true);
    if (vistaContadaRef.current[`votando_${v.id}`]) return;
    vistaContadaRef.current[`votando_${v.id}`] = true;
    try {
      const votoActual = votos[v.id];
      let nuevosLikes = v.likes || 0;
      let nuevosDislikes = v.dislikes || 0;

      if (votoActual === tipoReaccion) {
        if (tipoReaccion === "like") nuevosLikes = Math.max(0, nuevosLikes - 1);
        else nuevosDislikes = Math.max(0, nuevosDislikes - 1);
        const copiaVotos = { ...votos };
        delete copiaVotos[v.id];
        setVotos(copiaVotos);
        await supabase.from("votos_usuarios").delete().eq("usuario_id", usuario.id).eq("video_id", v.id);
      } else {
        if (tipoReaccion === "like") {
          nuevosLikes += 1;
          if (votoActual === "dislike") nuevosDislikes = Math.max(0, nuevosDislikes - 1);
        } else {
          nuevosDislikes += 1;
          if (votoActual === "like") nuevosLikes = Math.max(0, nuevosLikes - 1);
        }
        setVotos({ ...votos, [v.id]: tipoReaccion });
        await supabase.from("votos_usuarios").upsert({ usuario_id: usuario.id, video_id: v.id, tipo: tipoReaccion });
      }

      await supabase.from("videos").update({ likes: nuevosLikes, dislikes: nuevosDislikes }).eq("id", v.id);
      if (videoActivo && videoActivo.id === v.id) setVideoActivo({ ...videoActivo, likes: nuevosLikes, dislikes: nuevosDislikes });
      await cargarDatos();
    } finally {
      vistaContadaRef.current[`votando_${v.id}`] = false;
    }
  };


  const enviarComentario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario) return setMostrarAuth(true);
    if (!videoActivo || !nuevoCom.trim()) return;
    await supabase.from("comentarios").insert([{ video_id: videoActivo.id, usuario: usuario.username, texto: nuevoCom.trim() }]);
    setNuevoCom("");
    cargarComentarios(videoActivo.id);
  };

  const renderCreador = (nombre: string) => (
    <span className="inline-flex items-center gap-1 text-blue-600 font-bold">
      {nombre}
      {nombre.toLowerCase() === "@rutf_talentico" && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 fill-blue-100" />}
    </span>
  );

  const esMiCanal = (creador: string) => !!usuario && usuario.username.toLowerCase() === creador.toLowerCase();

  const puntajeAlgoritmo = (v: Video) => {
    const horas = v.creado_en ? (Date.now() - new Date(v.creado_en).getTime()) / 3600000 : 72;
    const impulsoNuevo = horas < 48 ? 25 : 0;
    const suscriptoresCanal = conteoSeguidores[v.creador] || 0;
    return (v.vistas || 0) * 2 + (v.likes || 0) * 5 + suscriptoresCanal * 3 - (v.dislikes || 0) * 2 + impulsoNuevo;
  };

  const recomendados = [...lista]
    .filter((v) => {
      const q = busqueda.toLowerCase().trim();
      if (!q) return true;
      return [v.titulo, v.creador, v.etiquetas, v.hashtags, v.descripcion].some((c) => c?.toLowerCase().includes(q));
    })
    .sort((a, b) => puntajeAlgoritmo(b) - puntajeAlgoritmo(a));
const esVerticalAuto = (v: Video) => v.tipo === "vertical" || v.titulo?.toLowerCase().includes("alex") || v.titulo?.toLowerCase().includes("short");
  const listaShorts = recomendados.filter(esVerticalAuto);
  const vistasTotales = lista.reduce((a, b) => a + (b.vistas || 0), 0);
  const seguidoresTotales = Object.values(conteoSeguidores).reduce((a, b) => a + (b || 0), 0);
  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900">
      {mostrarAuth && (
        <AuthModal
          supabase={supabase}
          onLogin={(u) => { setUsuario(u); setMostrarAuth(false); cargarActividadUsuario(u.id); }}
          onCerrar={() => setMostrarAuth(false)}
        />
      )}

      {videoCompartir && (
        <ModalCompartir titulo={videoCompartir.titulo} videoId={videoCompartir.id} onCerrar={() => setVideoCompartir(null)} />
      )}

      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div onClick={() => { setTab("inicio"); setVideoActivo(null); }} className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-orange-500 flex items-center justify-center text-white font-black text-lg shadow-sm">RT</div>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold leading-none"><span className="text-blue-600">RUTF</span> <span className="text-orange-500">TALENTICO</span></h1>
              <p className="text-[11px] text-slate-500">Tu talento vale, paso a paso</p>
            </div>
          </div>

          <div className="order-3 lg:order-2 w-full lg:w-80 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar talento, #hashtag o @canal..." className="w-full bg-slate-100 focus:bg-white border border-slate-200 focus:border-blue-600 rounded-full pl-9 pr-4 py-1.5 text-xs outline-none transition" />
          </div>

          <div className="order-2 lg:order-3 flex items-center gap-2">
            <button onClick={() => setTab("monetizar")} className="hidden sm:flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer"><DollarSign className="w-3.5 h-3.5" /> $0.00</button>
            <button onClick={abrirSubir} className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-orange-500 text-white px-3.5 py-2 rounded-full text-xs font-bold shadow-sm cursor-pointer"><PlusCircle className="w-4 h-4" /> Subir Video</button>
            {usuario ? (
              <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 px-2.5 py-1.5 rounded-full text-xs">
                <button onClick={() => { setTab("canal"); setVideoActivo(null); }} className="flex items-center gap-1 font-extrabold text-blue-700 hover:underline cursor-pointer">
                  <LayoutDashboard className="w-3.5 h-3.5" /> Mi Canal ({usuario.username})
                </button>
                <button onClick={cerrarSesion} title="Cerrar sesión" className="text-slate-500 hover:text-rose-600 ml-1 cursor-pointer"><LogOut className="w-3.5 h-3.5" /></button>
              </div>
            ) : (
              <button onClick={() => setMostrarAuth(true)} className="flex items-center gap-1 bg-slate-900 text-white px-3.5 py-2 rounded-full text-xs font-bold cursor-pointer"><LogIn className="w-3.5 h-3.5" /> Entrar / Crear Canal</button>
            )}
          </div>
        </div>
        <nav className="max-w-6xl mx-auto flex gap-2 mt-3 overflow-x-auto">
          {[{ id: "inicio", label: "Para Ti (Recomendados)", icon: Flame }, { id: "shorts", label: "Verticales", icon: Play }, { id: "monetizar", label: "Monetización", icon: Award }, ...(usuario ? [{ id: "canal", label: "Diseño de mi Canal", icon: LayoutDashboard }] : [])].map((t) => (
            <button key={t.id} onClick={() => { setTab(t.id); setVideoActivo(null); }} className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer whitespace-nowrap ${tab === t.id ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}><t.icon className="w-3.5 h-3.5" /> {t.label}</button>
          ))}
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {videoActivo && (
          <div className="mb-8 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-lg">
            <div className="bg-slate-950">
              <video src={videoActivo.video_url} controls autoPlay onTimeUpdate={(e) => registrarVistaCalificada(videoActivo, e.currentTarget.currentTime)} className="w-full max-h-[520px] mx-auto" />
            </div>
            <div className="p-5 sm:p-6 space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-2">
                  <h2 className="font-black text-lg sm:text-xl text-slate-900">{videoActivo.titulo}</h2>
                  <div className="flex flex-wrap items-center gap-2.5 text-xs">
                    {renderCreador(videoActivo.creador)}
                    <span className="text-slate-500 font-bold">• {conteoSeguidores[videoActivo.creador] || 0} suscriptores • {videoActivo.vistas} {videoActivo.vistas === 1 ? "vista calificada" : "vistas calificadas"}</span>
                    {esMiCanal(videoActivo.creador) ? (
                      <span className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-xs font-extrabold">Tu Canal</span>
                    ) : (
                      <div className="relative inline-flex items-center gap-1.5">
                        <button onClick={() => toggleSuscripcion(videoActivo.creador)} className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black cursor-pointer transition shadow-sm ${suscritos[videoActivo.creador] ? "bg-slate-900 text-white" : "bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:opacity-95"}`}>
                          <UserPlus className="w-3.5 h-3.5" /> {suscritos[videoActivo.creador] ? "Suscrito âœ“" : "Si te gusta, suscríbete"}
                        </button>
                        {suscritos[videoActivo.creador] && (
                          <button onClick={() => setMenuEngranaje(menuEngranaje === videoActivo.creador ? null : videoActivo.creador)} title="Ajustes de notificaciones" className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 cursor-pointer transition">
                            <Settings className="w-4 h-4 text-blue-600" />
                          </button>
                        )}
                        {menuEngranaje === videoActivo.creador && (
                          <div className="absolute left-0 top-10 z-30 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 space-y-1">
                            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 py-1">Alertas de {videoActivo.creador}</p>
                            <button onClick={() => cambiarNotificacion(videoActivo.creador, "todas")} className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold cursor-pointer ${notifCreador[videoActivo.creador] !== "ninguna" ? "bg-blue-50 text-blue-700" : "hover:bg-slate-50 text-slate-700"}`}>
                              <span>Recibir todas las notificaciones</span>
                              {notifCreador[videoActivo.creador] !== "ninguna" && <Check className="w-4 h-4 text-blue-600" />}
                            </button>
                            <button onClick={() => cambiarNotificacion(videoActivo.creador, "ninguna")} className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold cursor-pointer ${notifCreador[videoActivo.creador] === "ninguna" ? "bg-rose-50 text-rose-700" : "hover:bg-slate-50 text-slate-700"}`}>
                              <span>No recibir ninguna notificación del creador</span>
                              {notifCreador[videoActivo.creador] === "ninguna" && <X className="w-4 h-4 text-rose-600" />}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button onClick={() => reaccionar(videoActivo, "like")} className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold cursor-pointer transition border ${votos[videoActivo.id] === "like" ? "bg-blue-600 text-white border-blue-600" : "bg-blue-50 text-blue-700 border-blue-200"}`}>
                    <Sparkles className="w-4 h-4" /> Esto me gustó ({videoActivo.likes || 0})
                  </button>
                  <button onClick={() => reaccionar(videoActivo, "dislike")} className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold cursor-pointer transition border ${votos[videoActivo.id] === "dislike" ? "bg-orange-600 text-white border-orange-600" : "bg-orange-50 text-orange-700 border-orange-200"}`}>
                    <ShieldAlert className="w-4 h-4" /> No me gustó ({videoActivo.dislikes || 0})
                  </button>
                  <button onClick={() => setVideoCompartir(videoActivo)} className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer"><Share2 className="w-4 h-4 text-blue-600" /> Compartir</button>
                  <button onClick={abrirSubir} className="flex items-center gap-1.5 bg-orange-50 text-orange-700 border border-orange-200 px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer"><Scissors className="w-4 h-4" /> Recrear Vertical</button>
                  <button onClick={() => setVideoActivo(null)} className="text-xs font-bold bg-slate-100 text-slate-500 px-3 py-2 rounded-xl cursor-pointer">Cerrar</button>
                                  </div>
              </div>

              {(videoActivo.descripcion || videoActivo.hashtags) && (
                <div className="bg-slate-50 rounded-2xl p-4 space-y-2 text-xs">
                  {videoActivo.descripcion && <p className="text-slate-700 whitespace-pre-line leading-relaxed">{videoActivo.descripcion}</p>}
                  {videoActivo.hashtags && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {videoActivo.hashtags.split(" ").map((tag, i) => (
                        <button key={i} onClick={() => setBusqueda(tag)} className="inline-flex items-center gap-0.5 bg-blue-100/70 text-blue-700 font-bold px-2.5 py-0.5 rounded-full cursor-pointer"><Hash className="w-3 h-3" />{tag.replace("#", "")}</button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="pt-2 space-y-4">
                <h3 className="font-extrabold text-sm flex items-center gap-1.5 text-slate-800"><MessageSquare className="w-4 h-4 text-blue-600" /> Comentarios ({comentarios.length})</h3>
                <form onSubmit={enviarComentario} className="flex flex-col sm:flex-row gap-2">
                  <input required value={nuevoCom} onChange={(e) => setNuevoCom(e.target.value)} placeholder={usuario ? `Comentar como ${usuario.username}...` : "Inicia sesión para comentar..."} className="flex-1 border border-slate-300 rounded-xl px-3.5 py-2 text-xs" />
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"><Send className="w-3.5 h-3.5" /> {usuario ? "Comentar" : "Entrar para comentar"}</button>
                </form>
                <div className="space-y-2.5 max-h-60 overflow-y-auto">
                  {comentarios.length === 0 ? <p className="text-xs text-slate-400">Sé el primero en comentar este video.</p> : comentarios.map((c) => (
                    <div key={c.id} className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs">
                      <div className="flex justify-between items-center mb-1"><span className="font-bold text-blue-600">{c.usuario}</span><span className="text-[10px] text-slate-400">{new Date(c.creado_en).toLocaleDateString()}</span></div>
                      <p className="text-slate-700">{c.texto}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
    )}

        {tab === "inicio" && (
          <div className="space-y-8">
            <section>
              <h3 className="font-extrabold mb-3 text-blue-600">Recomendados para Ti</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {recomendados.filter(v => v.tipo === "largo").map(v => (
                  <div key={v.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <div onClick={() => abrirVideo(v)} className="relative aspect-video bg-slate-900 flex items-center justify-center cursor-pointer">
                      <video src={v.video_url} className="w-full h-full object-cover opacity-85" />
                      <Play className="absolute w-12 h-12 text-white fill-white drop-shadow" />
                    </div>
                    <div className="p-4 space-y-2">
                      <h4 onClick={() => abrirVideo(v)} className="font-bold text-sm line-clamp-1 cursor-pointer hover:text-blue-600">{v.titulo}</h4>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        {renderCreador(v.creador)}
                        {esMiCanal(v.creador) ? <span className="text-[11px] font-bold text-blue-600">Tu Canal</span> : <button onClick={() => toggleSuscripcion(v.creador)} className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold cursor-pointer ${suscritos[v.creador] ? "bg-slate-900 text-white" : "bg-orange-500 text-white"}`}>{suscritos[v.creador] ? "Suscrito âœ“" : "Si te gusta, suscríbete"}</button>}
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <div className="flex gap-1.5">
                          <button onClick={() => reaccionar(v, "like")} className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${votos[v.id] === "like" ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-700"}`}><Sparkles className="w-3.5 h-3.5" /> ({v.likes || 0})</button>
                          <button onClick={() => reaccionar(v, "dislike")} className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${votos[v.id] === "dislike" ? "bg-orange-600 text-white" : "bg-orange-50 text-orange-700"}`}><ShieldAlert className="w-3.5 h-3.5" /> ({v.dislikes || 0})</button>
                          <button onClick={() => setVideoCompartir(v)} title="Compartir" className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer"><Share2 className="w-3.5 h-3.5" /></button>
                        </div>
                        <span className="text-[11px] text-slate-400 font-bold">{v.vistas || 0} vistas</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            <section className="bg-slate-900/5 border border-slate-200/80 rounded-3xl p-4 sm:p-5"><div className="flex items-center justify-between mb-3"><h3 className="font-black text-base text-slate-900 flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />Verticales / Shorts</h3><button type="button" onClick={() => { setIndiceShort(0); setTab("shorts"); }} className="text-xs font-extrabold text-blue-600 hover:underline">Ver pantalla completa ?</button></div><div className="flex gap-3.5 overflow-x-auto pb-2 snap-x snap-mandatory"><button type="button" onClick={() => (usuario ? setTab("subir") : setMostrarAuth(true))} className="snap-start shrink-0 w-36 sm:w-44 aspect-[9/16] rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-700 to-orange-500 text-white p-4 flex flex-col items-center justify-center text-center gap-2.5 shadow-lg hover:scale-[1.02] transition-transform cursor-pointer border border-white/20"><span className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl font-black shadow-inner">+</span><span className="text-xs font-black leading-tight">Crear Short Vertical</span><span className="text-[10px] text-white/85 font-medium">Publica tu talento en 9:16</span></button>{listaShorts.map((v, idx) => (<div key={v.id} onClick={() => { setIndiceShort(idx); setTab("shorts"); }} className="snap-start shrink-0 w-36 sm:w-44 aspect-[9/16] relative rounded-2xl overflow-hidden bg-slate-950 shadow-md cursor-pointer group border border-slate-800/40"><video src={v.video_url} muted playsInline preload="metadata" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /><div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-transparent p-3 flex flex-col justify-between text-white"><span className="self-start bg-black/55 backdrop-blur-sm text-[10px] font-bold px-2 py-0.5 rounded-full">{v.vistas || 0} vistas</span><div className="space-y-0.5"><p className="text-xs font-extrabold line-clamp-2 leading-snug">{v.titulo}</p><p className="text-[10px] text-slate-300 font-semibold truncate">{v.creador}</p></div></div></div>))}</div></section>
          </div>
        )}

                {tab === "shorts" && (
          <div className="max-w-md mx-auto space-y-3">
            <div className="flex items-center justify-between bg-white border border-slate-200/90 rounded-2xl px-4 py-2.5 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-xs font-black text-slate-800">Talentos Verticales</span>
              </div>
              <button type="button" onClick={abrirSubir} className="bg-gradient-to-r from-blue-600 to-orange-500 text-white text-xs font-black px-3.5 py-1.5 rounded-full shadow-md hover:opacity-95 transition flex items-center gap-1.5">
                <span>+</span>
                <span>Crear Short</span>
              </button>
            </div>

            {listaShorts.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-3">
                <p className="text-sm font-bold text-slate-600">¡Crea tu primer Short y hazte viral en RUTF Talentico!</p>
                <button type="button" onClick={abrirSubir} className="bg-gradient-to-r from-blue-600 to-orange-500 text-white text-xs font-black px-5 py-2.5 rounded-full shadow-md">
                  + Publicar Talento Vertical
                </button>
              </div>
            ) : (() => {
              const actual = listaShorts[Math.min(indiceShort, listaShorts.length - 1)];
              const irSiguiente = () => {
                setMostrarGuiaSwipe(false);
                setIndiceShort((prev) => (prev + 1 < listaShorts.length ? prev + 1 : 0));
              };
              const irAnterior = () => {
                setMostrarGuiaSwipe(false);
                setIndiceShort((prev) => (prev - 1 >= 0 ? prev - 1 : listaShorts.length - 1));
              };
              const estaSuscrito = !!suscritos[actual.creador];
              return (
                <div
                  onTouchStart={(e) => setToqueInicioY(e.touches[0].clientX)}
                  onTouchEnd={(e) => {
                    if (toqueInicioY === null) return;
                    const diff = toqueInicioY - e.changedTouches[0].clientX;
                    if (diff > 45) irSiguiente();
                    else if (diff < -45) irAnterior();
                    setToqueInicioY(null);
                  }}
                  className="relative aspect-[9/16] max-h-[78vh] mx-auto rounded-3xl bg-slate-950 overflow-hidden shadow-2xl border border-slate-800 select-none"
                >
                  <video
                    key={actual.id}
                    src={actual.video_url}
                    autoPlay
                    playsInline
                    controls
                    onEnded={() => setMostrarGuiaSwipe(true)}
                    onTimeUpdate={(e) => registrarVistaCalificada(actual, e.currentTarget.currentTime)}
                    className="w-full h-full object-cover"
                  />

                                   {mostrarGuiaSwipe && (
                    <div onClick={irSiguiente} className="absolute inset-x-0 top-4 z-20 flex justify-center cursor-pointer">
                      <div className="bg-gradient-to-r from-blue-600/95 via-slate-900/95 to-orange-500/95 backdrop-blur-md text-white border border-white/30 px-4 py-2 rounded-full text-[11px] font-extrabold flex items-center gap-2 shadow-xl animate-bounce">
                        <span>Desliza a la derecha para más talentos</span>
                        <span className="text-sm font-black">→</span>
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={irSiguiente}
                    title="Siguiente talento"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-orange-500 text-white border border-white/30 flex items-center justify-center text-lg font-black shadow-xl hover:scale-105 transition animate-pulse"
                  >
                    →
                  </button>

                  {listaShorts.length > 1 && (
                    <button
                      type="button"
                      onClick={irAnterior}
                      title="Anterior talento"
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/55 backdrop-blur-md text-white border border-white/25 flex items-center justify-center text-lg font-black hover:bg-black/75 transition"
                    >
                      ←
                    </button>
                  )}

                  <div className="absolute inset-x-0 bottom-12 bg-gradient-to-t from-black/95 via-black/75 to-transparent p-4 text-white space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-xs font-black text-orange-400 truncate">
                          {actual.creador} • {conteoSeguidores[actual.creador] || 0} suscriptores
                        </div>
                        <p className="text-sm font-black line-clamp-2 leading-snug">{actual.titulo}</p>
                      </div>
                                           {esMiCanal(actual.creador) ? (
                        <button
                          type="button"
                          onClick={() => setTab("canal")}
                          className="shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-black bg-white/20 hover:bg-white/30 text-white border border-white/30 transition"
                        >
                          Mi Canal
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => toggleSuscripcion(actual.creador)}
                          className={`shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-black transition shadow ${estaSuscrito ? "bg-white/20 text-white border border-white/30" : "bg-red-600 hover:bg-red-700 text-white animate-pulse"}`}
                        >
                          {estaSuscrito ? "Suscrito" : "Suscripción"}
                        </button>
                      )}

                    </div>

                    <div className="flex items-center gap-2 pt-0.5">
                      <button
                        type="button"
                        onClick={() => reaccionar(actual, "like")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold border transition ${votos[actual.id] === "like" ? "bg-blue-600 border-blue-400 text-white" : "bg-white/15 border-white/20 text-white hover:bg-white/25"}`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{actual.likes || 0}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => reaccionar(actual, "dislike")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold border transition ${votos[actual.id] === "dislike" ? "bg-red-600 border-red-400 text-white" : "bg-white/15 border-white/20 text-white hover:bg-white/25"}`}
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                        <span>{actual.dislikes || 0}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setVideoCompartir(actual)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold bg-white/15 border border-white/20 text-white hover:bg-white/25"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Compartir</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}


        {tab === "monetizar" && (
          <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 space-y-5 shadow-sm">
            <div><h2 className="text-xl font-black">Requisitos Reales de Monetización</h2><p className="text-xs text-slate-500 mt-1">Comienzas desde cero y avanzas con cada vista calificada (+6 seg) y suscriptor real.</p></div>
            <div><div className="flex justify-between text-xs font-bold mb-1"><span className="flex items-center gap-1"><Users className="w-4 h-4 text-blue-600" /> Suscriptores Reales</span><span>{seguidoresTotales} / 500</span></div><div className="h-3 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${Math.min(100, (seguidoresTotales / 500) * 100)}%` }} /></div></div>
            <div><div className="flex justify-between text-xs font-bold mb-1"><span className="flex items-center gap-1"><Eye className="w-4 h-4 text-orange-500" /> Vistas Calificadas (+6 seg)</span><span>{vistasTotales} / 5,000</span></div><div className="h-3 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-orange-500 rounded-full transition-all" style={{ width: `${Math.min(100, (vistasTotales / 5000) * 100)}%` }} /></div></div>
          </div>
        )}

        {tab === "canal" && usuario && (
          <EstudioCanal
            supabase={supabase}
            perfil={usuario}
            videosCanal={lista.filter((v) => v.creador.toLowerCase() === usuario.username.toLowerCase())}
            seguidores={conteoSeguidores[usuario.username] || 0}
            onActualizarPerfil={(p) => setUsuario(p)}
            onAbrirVideo={(v) => { setTab("inicio"); abrirVideo(v); }}
            onRecargar={cargarDatos}
          />
        )}

        {tab === "subir" && usuario && (
          <SubirVideoForm supabase={supabase} canalActual={usuario.username} onPublicado={async () => { await cargarDatos(); setTab("inicio"); }} />
        )}
      </main>

            <footer className="max-w-7xl mx-auto px-4 pt-8 pb-24 text-center text-[11px] text-slate-400 space-y-2 border-t border-slate-200 mt-12">
        <p className="font-bold text-slate-500">RUTF Talentico © 2026 • República Dominicana y el Mundo</p>
        <div className="flex flex-wrap items-center justify-center gap-4 font-semibold text-blue-600">
          <button type="button" onClick={() => alert("POLÍTICA DE PRIVACIDAD • RUTF TALENTICO:\n\n1. Recopilamos datos básicos de perfil (nombre de usuario, correo y contenido publicado) para operar tu canal.\n2. Usamos Google AdMob y análisis técnico para mantener la plataforma gratuita.\n3. No vendemos tus datos personales a terceros.\n4. Puedes solicitar la eliminación total de tus datos en cualquier momento desde el botón 'Eliminar Cuenta'.")} className="hover:underline">Política de Privacidad</button>
          <span>•</span>
          <button type="button" onClick={() => alert("TÉRMINOS Y CONDICIONES DE USO • RUTF TALENTICO:\n\n1. Al publicar videos confirmas que eres titular de los derechos del contenido.\n2. Está prohibido el contenido violento, explícito, fraudulento o que infrinja derechos de autor.\n3. Los ingresos por monetización están sujetos a revisión de cumplimiento y políticas publicitarias.")} className="hover:underline">Términos de Uso</button>
          <span>•</span>
          <button type="button" onClick={async () => {
            if (!usuario) return alert("Inicia sesión en tu canal primero para eliminar tu cuenta y todos tus datos.");
            if (confirm(`¿Estás seguro de eliminar permanentemente el canal ${usuario.username} y todos sus datos? Esta acción no se puede deshacer.`)) {
              await supabase.from("usuarios_rutf").delete().eq("id", usuario.id);
              await cerrarSesion();
              alert("Tu cuenta y datos personales han sido eliminados correctamente.");
            }
          }} className="text-red-500 hover:underline">Eliminar Cuenta</button>
        </div>
      </footer>

    </div>
  );
}
