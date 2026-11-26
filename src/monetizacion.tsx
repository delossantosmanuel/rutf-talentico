"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  DollarSign,
  CheckCircle2,
  Clock,
  Send,
  RefreshCw,
  Lock,
  Ban,
  HelpCircle,
  ChevronDown,
} from "lucide-react";

type Props = {
  supabase: any;
  usuario: {
    id: string;
    username: string;
    email: string;
    es_fundador?: boolean;
  } | null;
  seguidoresCanal: number;
  vistasCalificadas15s: number;
  onAbrirAuth: () => void;
  onRefrescarMetricas?: () => void;
  onCerrar?: () => void;
};

const META_SEGUIDORES = 100;
const META_VISTAS_16S = 1000;
const META_VIDEOS_ORIGINALES = 5;

const PREGUNTAS_FRECUENTES = [
  {
    pregunta: "¿Qué cuenta como una vista calificada (+16s)?",
    respuesta:
      "Únicamente las reproducciones orgánicas de usuarios reales que permanecen viendo tu video de forma continua durante más de 16 segundos.",
  },
  {
    pregunta: "¿Qué contenido se necesita para ser aprobado?",
    respuesta:
      "Debes contar con al menos 5 videos originales de tu propia creación o talento. No se acepta contenido copiado ni resubido sin autorización.",
  },
  {
    pregunta: "¿Cómo funcionan los pagos por PayPal?",
    respuesta:
      "Al alcanzar los 100 Fans reales, 1,000 vistas calificadas (+16s) y 5 videos originales, se desbloquea el botón para vincular tu correo de PayPal.",
  },
  {
    pregunta: "¿Cuánto tarda la revisión cuando cumplo los requisitos?",
    respuesta:
      "Nuestro equipo revisa la autenticidad de tu audiencia y tus videos en un plazo de 24 a 72 horas hábiles tras vincular tu cuenta.",
  },
  {
    pregunta: "¿Qué ocurre si se detectan bots o contenido resubido?",
    respuesta:
      "Cualquier manipulación artificial de Fans, vistas automatizadas o resubida de videos ajenos conlleva la suspensión permanente de la monetización.",
  },
];

export default function PanelMonetizacion({
  supabase,
  usuario,
  seguidoresCanal,
  vistasCalificadas15s,
  onAbrirAuth,
  onRefrescarMetricas,
}: Props) {
  const [nombreReal, setNombreReal] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correoPaypal, setCorreoPaypal] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [actualizando, setActualizando] = useState(false);
  const [actualizadoOk, setActualizadoOk] = useState(false);
  const [avisoBloqueado, setAvisoBloqueado] = useState(false);
  const [animarEntrada, setAnimarEntrada] = useState(false);
  const [solicitudExistente, setSolicitudExistente] = useState<any>(null);
  const [cargandoEstado, setCargandoEstado] = useState(false);
  const [faqAbierta, setFaqAbierta] = useState<number | null>(0);
  const [mostrarFormularioPaypal, setMostrarFormularioPaypal] = useState(false);

  const [fansReales, setFansReales] = useState<number>(seguidoresCanal || 0);
  const [vistasReales, setVistasReales] = useState<number>(vistasCalificadas15s || 0);
  const [videosOriginales, setVideosOriginales] = useState<number>(0);

  const refrescarRef = useRef(onRefrescarMetricas);
  refrescarRef.current = onRefrescarMetricas;

  useEffect(() => {
    const t = setTimeout(() => setAnimarEntrada(true), 40);
    return () => clearTimeout(t);
  }, []);

  const cargarMetricasReales = useCallback(async () => {
    if (!usuario) {
      setFansReales(0);
      setVistasReales(0);
      setVideosOriginales(0);
      return;
    }

    try {
      const [{ count: totalFans }, { data: videosUsuario }, { count: totalVistasTabla }] =
        await Promise.all([
          supabase
            .from("suscripciones_canal")
            .select("*", { count: "exact", head: true })
            .ilike("canal_username", usuario.username),
          supabase
            .from("videos")
            .select("id,vistas")
            .ilike("autor", usuario.username),
          supabase
            .from("vistas_calificadas")
            .select("*", { count: "exact", head: true })
            .ilike("autor_canal", usuario.username),
        ]);

      const cantVideos = Array.isArray(videosUsuario) ? videosUsuario.length : 0;
      const sumaVistasVideos = Array.isArray(videosUsuario)
        ? videosUsuario.reduce((acc: number, v: any) => acc + Number(v.vistas || 0), 0)
        : 0;

      setFansReales(Number(totalFans ?? seguidoresCanal ?? 0));
      setVistasReales(
        Math.max(Number(totalVistasTabla || 0), sumaVistasVideos, Number(vistasCalificadas15s || 0))
      );
      setVideosOriginales(cantVideos);
    } catch {}
  }, [supabase, usuario, seguidoresCanal, vistasCalificadas15s]);

  const fansCompletado = fansReales >= META_SEGUIDORES;
  const vistasCompletado = vistasReales >= META_VISTAS_16S;
  const videosCompletado = videosOriginales >= META_VIDEOS_ORIGINALES;
  const cumpleRequisitos = fansCompletado && vistasCompletado && videosCompletado;

  const manejarActualizar = async () => {
    if (actualizando) return;
    setActualizando(true);
    setActualizadoOk(false);
    try {
      refrescarRef.current?.();
      await Promise.all([
        cargarMetricasReales(),
        new Promise((resolve) => setTimeout(resolve, 8000)),
      ]);
    } finally {
      setActualizando(false);
      setActualizadoOk(true);
      setTimeout(() => setActualizadoOk(false), 3000);
    }
  };

  useEffect(() => {
    if (!usuario) return;
    cargarMetricasReales();

    const canalRealtime = supabase
      .channel(`monetizacion-rt-${usuario.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "suscripciones_canal" },
        () => cargarMetricasReales()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "vistas_calificadas" },
        () => cargarMetricasReales()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "videos" },
        () => cargarMetricasReales()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canalRealtime);
    };
  }, [usuario, supabase, cargarMetricasReales]);

  useEffect(() => {
    if (!usuario) {
      setSolicitudExistente(null);
      return;
    }
    setCargandoEstado(true);
    supabase
      .from("solicitudes_monetizacion")
      .select("*")
      .eq("usuario_id", usuario.id)
      .order("creado_en", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }: any) => {
        if (data) setSolicitudExistente(data);
        setCargandoEstado(false);
      });
  }, [usuario, supabase]);

  const enviarSolicitud = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario) {
      onAbrirAuth();
      return;
    }
    if (!cumpleRequisitos) return;

    setEnviando(true);
    try {
      const { data, error } = await supabase
        .from("solicitudes_monetizacion")
        .insert({
          usuario_id: usuario.id,
          username: usuario.username,
          email: usuario.email,
          nombre_real: nombreReal.trim(),
          pais: telefono.trim(),
          metodo_pago: "PayPal",
          cuenta_pago: correoPaypal.trim(),
          seguidores_al_solicitar: fansReales,
          vistas_al_solicitar: vistasReales,
          estado: "en_revision",
        })
        .select("*")
        .single();

      if (error) {
        alert("No se pudo enviar la solicitud: " + error.message);
        return;
      }
      setSolicitudExistente(data);
      setMostrarFormularioPaypal(false);
    } finally {
      setEnviando(false);
    }
  };
  const tarjetasRequisitos = [
    {
      numero: 1,
      titulo: "Fans reales",
      actual: fansReales,
      meta: META_SEGUIDORES,
      completado: fansCompletado,
      claseBase: fansCompletado ? "bg-blue-100/90 border-blue-400" : "bg-blue-50/70 border-blue-200/80",
      badgeNumero: fansCompletado ? "bg-blue-600 text-white border-blue-600" : "bg-blue-100 text-blue-800 border-blue-200",
      claseColumna: "col-span-1",
    },
    {
      numero: 2,
      titulo: "Vistas calificadas (+16s)",
      actual: vistasReales,
      meta: META_VISTAS_16S,
      completado: vistasCompletado,
      claseBase: vistasCompletado ? "bg-amber-100/90 border-amber-400" : "bg-amber-50/75 border-amber-200/80",
      badgeNumero: vistasCompletado ? "bg-amber-500 text-white border-amber-500" : "bg-amber-100 text-amber-800 border-amber-200",
      claseColumna: "col-span-1",
    },
    {
      numero: 3,
      titulo: "Videos originales",
      actual: videosOriginales,
      meta: META_VIDEOS_ORIGINALES,
      completado: videosCompletado,
      claseBase: videosCompletado ? "bg-emerald-100/90 border-emerald-400" : "bg-emerald-50/75 border-emerald-200/80",
      badgeNumero: videosCompletado ? "bg-[#16A34A] text-white border-[#16A34A]" : "bg-emerald-100 text-emerald-800 border-emerald-200",
      claseColumna: "col-span-2 sm:col-span-1",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto pb-16 space-y-3.5 sm:space-y-5">
      <style>{`
        @keyframes rutfShimmerOnce {
          0% { transform: translateX(-140%) skewX(-20deg); opacity: 0; }
          30% { opacity: 0.55; }
          100% { transform: translateX(240%) skewX(-20deg); opacity: 0; }
        }
        .rutf-shimmer-once { animation: rutfShimmerOnce 1.25s ease-out 0.25s 1 forwards; }
      `}</style>

      <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg">
        <div className="flex items-center gap-1.5 text-amber-400 text-[10px] sm:text-xs font-black uppercase tracking-wider mb-1">
          <DollarSign className="w-3.5 h-3.5" />
          <span>Programa de Creadores RUTF Talentico</span>
        </div>
        <h2 className="text-lg sm:text-2xl font-black leading-snug">Monetiza tu talento original y genera ingresos reales</h2>
        <p className="text-[11px] sm:text-sm text-blue-100/80 mt-1 leading-relaxed">Al completar los 3 requisitos del canal, activamos tus pagos directos por PayPal.</p>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-2 px-0.5">
          <h3 className="text-sm sm:text-base font-black text-slate-900">Requisitos de Elegibilidad en Tiempo Real</h3>
          <button
            type="button"
            onClick={manejarActualizar}
            disabled={actualizando}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold transition ${
              actualizando ? "bg-blue-50 text-blue-700 border border-blue-200" : actualizadoOk ? "bg-emerald-100 text-[#16A34A] border border-emerald-200" : "bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-2xs"
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${actualizando ? "animate-spin" : ""}`} />
            <span>{actualizando ? "Actualizando..." : actualizadoOk ? "Actualizado" : "Actualizar"}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
          {tarjetasRequisitos.map((item, idx) => (
            <div
              key={item.numero}
              style={{ transitionDelay: `${idx * 90}ms` }}
              className={`relative overflow-hidden border rounded-2xl p-3.5 sm:p-5 shadow-2xs flex flex-col justify-between gap-3 transition-all duration-500 ${item.claseColumna} ${item.claseBase} ${animarEntrada ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
            >
              <div className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/70 to-transparent rutf-shimmer-once" />
              <div className="flex items-center justify-between gap-1.5">
                <span className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg border text-xs font-black flex items-center justify-center shrink-0 ${item.badgeNumero}`}>{item.numero}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold border ${item.completado ? "bg-[#16A34A] text-white border-[#16A34A]" : "bg-white/90 text-slate-600 border-slate-200"}`}>
                  {item.completado ? "Completado" : "En progreso"}
                </span>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs sm:text-sm font-extrabold text-slate-700 leading-tight">{item.titulo}</p>
                <p className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                  <span className="text-[#16A34A]">{item.actual.toLocaleString()}</span>
                  <span className="text-slate-400 font-bold text-base sm:text-lg mx-1">/</span>
                  <span className="text-slate-800 text-base sm:text-xl">{item.meta.toLocaleString()}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {!usuario ? (
        <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-center space-y-2.5 shadow-2xs">
          <p className="text-xs sm:text-sm font-bold text-slate-700">Inicia sesión con tu canal para sincronizar tus requisitos y habilitar tus pagos por PayPal.</p>
          <button type="button" onClick={onAbrirAuth} className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow">Iniciar Sesión / Crear Canal</button>
        </div>
      ) : cargandoEstado ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center text-xs font-bold text-slate-500">Verificando estado de monetización...</div>
      ) : solicitudExistente ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-1.5">
          <div className="flex items-center gap-2 text-emerald-800 font-black text-xs sm:text-sm"><CheckCircle2 className="w-4 h-4 text-emerald-600" /><span>Cuenta PayPal Registrada para Pagos</span></div>
          <p className="text-[11px] sm:text-xs text-emerald-900/80 leading-relaxed">Tu canal <strong>{usuario.username}</strong> está en revisión editorial. Correo PayPal vinculado: <strong>{solicitudExistente.cuenta_pago}</strong>.</p>
        </div>
      ) : cumpleRequisitos && mostrarFormularioPaypal ? (
        <form onSubmit={enviarSolicitud} className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="text-sm sm:text-base font-black text-slate-900">Configurar Pagos por PayPal</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#16A34A] text-[10px] font-black">Habilitado</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div><label className="block text-[11px] font-extrabold text-slate-700 mb-1">Nombre completo del titular</label><input type="text" required placeholder="Ej. Juan Pérez" value={nombreReal} onChange={(e) => setNombreReal(e.target.value)} className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl" /></div>
            <div><label className="block text-[11px] font-extrabold text-slate-700 mb-1">Número de teléfono (con código de país)</label><input type="tel" required placeholder="Ej. +1 809 555 1234" value={telefono} onChange={(e) => setTelefono(e.target.value)} className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl" /></div>
          </div>
          <div><label className="block text-[11px] font-extrabold text-slate-700 mb-1">Correo electrónico de PayPal</label><input type="email" required placeholder="tu-correo@paypal.com" value={correoPaypal} onChange={(e) => setCorreoPaypal(e.target.value)} className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl" /></div>
          <button type="submit" disabled={enviando} className="w-full py-2.5 rounded-full bg-[#16A34A] hover:bg-emerald-700 text-white text-xs font-black inline-flex items-center justify-center gap-2 shadow transition"><Send className="w-3.5 h-3.5" /><span>{enviando ? "Guardando..." : "Vincular PayPal y Activar Pagos"}</span></button>
        </form>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-2xs text-center space-y-2.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-500">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>{cumpleRequisitos ? "¡Felicidades! Cumples los 3 requisitos del Programa de Creadores" : "Completa los 3 requisitos para activar tus pagos"}</span>
          </div>
          <div>
            <button
              type="button"
              aria-disabled={!cumpleRequisitos}
              onClick={() => { if (cumpleRequisitos) setMostrarFormularioPaypal(true); else { setAvisoBloqueado(true); setTimeout(() => setAvisoBloqueado(false), 2600); } }}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-black transition ${cumpleRequisitos ? "bg-[#16A34A] hover:bg-emerald-700 text-white shadow-md cursor-pointer" : avisoBloqueado ? "bg-rose-50 border border-rose-300 text-rose-600 cursor-not-allowed" : "bg-slate-100 border border-slate-200 text-slate-500 cursor-not-allowed"}`}
            >
              {cumpleRequisitos ? <CheckCircle2 className="w-4 h-4" /> : avisoBloqueado ? <Ban className="w-4 h-4 text-rose-600" /> : <Lock className="w-3.5 h-3.5" />}
              <span>Desbloquear Monetización (Pagos vía PayPal)</span>
            </button>
          </div>
          {avisoBloqueado && !cumpleRequisitos && <p className="text-[11px] font-bold text-rose-600">Aún debes completar los 3 requisitos (100 Fans, 1,000 vistas +16s y 5 videos originales).</p>}
        </div>
      )}

      <div className="pt-1">
        <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xs space-y-2.5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5"><HelpCircle className="w-4 h-4 text-blue-600" /><h3 className="text-sm sm:text-base font-black text-slate-900">Preguntas Frecuentes sobre Monetización y Pagos</h3></div>
          <div className="divide-y divide-slate-100">
            {PREGUNTAS_FRECUENTES.map((item, idx) => {
              const abierta = faqAbierta === idx;
              return (
                <div key={idx} className="py-2.5 first:pt-1 last:pb-1">
                  <button type="button" onClick={() => setFaqAbierta(abierta ? null : idx)} className="w-full flex items-center justify-between gap-3 text-left text-xs sm:text-sm font-extrabold text-slate-800 hover:text-blue-600 transition">
                    <span>{item.pregunta}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${abierta ? "rotate-180 text-blue-600" : ""}`} />
                  </button>
                  {abierta && <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">{item.respuesta}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
