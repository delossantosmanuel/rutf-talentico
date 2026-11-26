"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  DollarSign,
  CheckCircle2,
  Clock,
  Send,
  RefreshCw,
  Lock,
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
    setFansReales((prev) => Math.max(prev, seguidoresCanal || 0));
  }, [seguidoresCanal]);

  useEffect(() => {
    setVistasReales((prev) => Math.max(prev, vistasCalificadas15s || 0));
  }, [vistasCalificadas15s]);

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

      setFansReales((prev) => Math.max(prev, Number(totalFans || 0)));
      setVistasReales((prev) =>
        Math.max(prev, Number(totalVistasTabla || 0), sumaVistasVideos)
      );
      setVideosOriginales(cantVideos);
    } catch {}
  }, [supabase, usuario]);

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
      await cargarMetricasReales();
    } finally {
      setActualizando(false);
      setActualizadoOk(true);
      setTimeout(() => setActualizadoOk(false), 2200);
    }
  };

  useEffect(() => {
    if (!usuario) return;
    cargarMetricasReales();
    const intervalo = setInterval(() => {
      cargarMetricasReales();
    }, 60000);
    return () => clearInterval(intervalo);
  }, [usuario, cargarMetricasReales]);

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
    { numero: 1, titulo: "Fans reales", actual: fansReales, meta: META_SEGUIDORES, completado: fansCompletado },
    { numero: 2, titulo: "Vistas calificadas (+16s)", actual: vistasReales, meta: META_VISTAS_16S, completado: vistasCompletado },
    { numero: 3, titulo: "Videos originales", actual: videosOriginales, meta: META_VIDEOS_ORIGINALES, completado: videosCompletado },
  ];

  return (
    <div className="max-w-3xl mx-auto pb-16 space-y-3 sm:space-y-5">
      <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg">
        <div className="flex items-center gap-1.5 text-amber-400 text-[10px] sm:text-xs font-black uppercase tracking-wider mb-1">
          <DollarSign className="w-3.5 h-3.5" />
          <span>Programa de Creadores RUTF Talentico</span>
        </div>

        <h2 className="text-lg sm:text-2xl font-black leading-snug">
          Monetiza tu talento original y genera ingresos reales
        </h2>
        <p className="text-[11px] sm:text-sm text-blue-100/80 mt-1 leading-relaxed">
          Al completar los 3 requisitos del canal, activamos tus pagos directos por PayPal.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2 px-0.5">
          <h3 className="text-xs sm:text-base font-black text-slate-900">
            Requisitos de Elegibilidad
          </h3>
          <button
            type="button"
            onClick={manejarActualizar}
            disabled={actualizando}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold transition ${
              actualizando
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : actualizadoOk
                ? "bg-emerald-100 text-[#16A34A] border border-emerald-200"
                : "bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-2xs"
            }`}
          >
            <RefreshCw className={`w-3 h-3 ${actualizando ? "animate-spin" : ""}`} />
            <span>
              {actualizando ? "Actualizando..." : actualizadoOk ? "Actualizado" : "Actualizar"}
            </span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3.5">
          {tarjetasRequisitos.map((item) => (
            <div
              key={item.numero}
              className="bg-white border border-slate-200/90 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 shadow-2xs flex flex-col justify-between gap-2 sm:gap-3"
            >
              <div className="flex items-center justify-between gap-1">
                <span className="w-5 h-5 sm:w-7 sm:h-7 rounded-md sm:rounded-lg bg-slate-100 border border-slate-200/80 text-slate-800 text-[10px] sm:text-xs font-black flex items-center justify-center shrink-0">
                  {item.numero}
                </span>

                <span
                  className={`px-1.5 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[11px] font-extrabold border truncate ${
                    item.completado
                      ? "bg-emerald-50 text-[#16A34A] border-emerald-200"
                      : "bg-slate-50 text-slate-500 border-slate-200"
                  }`}
                >
                  {item.completado ? "Completado" : "En progreso"}
                </span>
              </div>

              <div className="space-y-0.5">
                <p className="text-[10px] sm:text-xs font-bold text-slate-500 leading-tight line-clamp-2">
                  {item.titulo}
                </p>
                <p className="text-base sm:text-2xl font-black tracking-tight text-slate-900">
                  <span className="text-[#16A34A]">{item.actual.toLocaleString()}</span>
                  <span className="text-slate-400 font-bold text-xs sm:text-lg mx-0.5">/</span>
                  <span className="text-slate-800 text-xs sm:text-xl">{item.meta.toLocaleString()}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {!usuario ? (
        <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-center space-y-2.5 shadow-2xs">
          <p className="text-xs sm:text-sm font-bold text-slate-700">
            Inicia sesión con tu canal para sincronizar tus requisitos y habilitar tus pagos por PayPal.
          </p>
          <button type="button" onClick={onAbrirAuth} className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow">
            Iniciar Sesión / Crear Canal
          </button>
        </div>
      ) : cargandoEstado ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center text-xs font-bold text-slate-500">
          Verificando estado de monetización...
        </div>
      ) : solicitudExistente ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-1.5">
          <div className="flex items-center gap-2 text-emerald-800 font-black text-xs sm:text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Cuenta PayPal Registrada para Pagos</span>
          </div>
          <p className="text-[11px] sm:text-xs text-emerald-900/80 leading-relaxed">
            Tu canal <strong>{usuario.username}</strong> está en revisión editorial. Correo PayPal vinculado: <strong>{solicitudExistente.cuenta_pago}</strong>.
          </p>
        </div>
      ) : cumpleRequisitos && mostrarFormularioPaypal ? (
        <form onSubmit={enviarSolicitud} className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="text-sm sm:text-base font-black text-slate-900">Configurar Pagos por PayPal</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#16A34A] text-[10px] font-black">Habilitado</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Nombre completo del titular</label>
              <input type="text" required placeholder="Ej. Juan Pérez" value={nombreReal} onChange={(e) => setNombreReal(e.target.value)} className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl" />
            </div>
            <div>
              <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Número de teléfono (con código de país)</label>
              <input type="tel" required placeholder="Ej. +1 809 555 1234" value={telefono} onChange={(e) => setTelefono(e.target.value)} className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl" />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-extrabold text-slate-700 mb-1">Correo electrónico de PayPal</label>
            <input type="email" required placeholder="tu-correo@paypal.com" value={correoPaypal} onChange={(e) => setCorreoPaypal(e.target.value)} className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl" />
          </div>
          <button type="submit" disabled={enviando} className="w-full py-2.5 rounded-full bg-[#16A34A] hover:bg-emerald-700 text-white text-xs font-black inline-flex items-center justify-center gap-2 shadow transition">
            <Send className="w-3.5 h-3.5" />
            <span>{enviando ? "Guardando..." : "Vincular PayPal y Activar Pagos"}</span>
          </button>
        </form>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-2xs text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-extrabold text-slate-500">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>{cumpleRequisitos ? "¡Felicidades! Cumples los 3 requisitos del Programa de Creadores" : "Completa los 3 requisitos para activar tus pagos"}</span>
          </div>
          <div>
            <button
              type="button"
              disabled={!cumpleRequisitos}
              onClick={() => cumpleRequisitos && setMostrarFormularioPaypal(true)}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition ${
                cumpleRequisitos ? "bg-[#16A34A] hover:bg-emerald-700 text-white shadow-md cursor-pointer" : "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              {cumpleRequisitos ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-3.5 h-3.5" />}
              <span>Desbloquear Monetización (Pagos vía PayPal)</span>
            </button>
          </div>
        </div>
      )}
      <div className="pt-1">
        <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xs space-y-2.5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm sm:text-base font-black text-slate-900">
              Preguntas Frecuentes sobre Monetización y Pagos
            </h3>
          </div>

          <div className="divide-y divide-slate-100">
            {PREGUNTAS_FRECUENTES.map((item, idx) => {
              const abierta = faqAbierta === idx;
              return (
                <div key={idx} className="py-2.5 first:pt-1 last:pb-1">
                  <button
                    type="button"
                    onClick={() => setFaqAbierta(abierta ? null : idx)}
                    className="w-full flex items-center justify-between gap-3 text-left text-xs sm:text-sm font-extrabold text-slate-800 hover:text-blue-600 transition"
                  >
                    <span>{item.pregunta}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        abierta ? "rotate-180 text-blue-600" : ""
                      }`}
                    />
                  </button>
                  {abierta && (
                    <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                      {item.respuesta}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
