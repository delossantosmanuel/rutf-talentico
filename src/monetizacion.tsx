"use client";

import { useState, useEffect } from "react";
import {
  DollarSign,
  Users,
  Eye,
  CheckCircle2,
  ShieldCheck,
  Lock,
  Send,
  X,
  RefreshCw,
  Clock,
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
const META_VISTAS_15S = 1000;

const PREGUNTAS_FRECUENTES = [
  {
    pregunta: "¿Qué cuenta como una vista calificada de 15 segundos?",
    respuesta:
      "Únicamente las reproducciones orgánicas de usuarios reales que permanecen viendo tu video de forma continua durante al menos 15 segundos. Las vistas rápidas de pocos segundos no suman para el umbral de monetización.",
  },
  {
    pregunta: "¿Qué contenido se necesita para ser aprobado?",
    respuesta:
      "Tus videos deben ser de tu propia creación o talento original (música, arte, comedia, deporte, tutoriales, cocina o entretenimiento apto para todo público), sin marcas de agua de otras redes ni material con derechos de autor de terceros.",
  },
  {
    pregunta: "¿Cómo funcionan los pagos por PayPal?",
    respuesta:
      "Al alcanzar los 100 Fans reales y las 1,000 vistas calificadas de 15 segundos, se desbloquea el formulario para vincular tu correo de PayPal, tu nombre completo y tu número de teléfono de contacto. Los pagos se procesan de forma mensual una vez superado el mínimo de retiro.",
  },
  {
    pregunta: "¿Cuánto tarda la revisión cuando cumplo los requisitos?",
    respuesta:
      "Nuestro equipo editorial revisa la autenticidad de tu audiencia y la originalidad de tus videos en un plazo habitual de 48 a 72 horas hábiles tras enviar tu solicitud.",
  },
  {
    pregunta: "¿Qué ocurre si se detectan bots o contenido resubido?",
    respuesta:
      "Cualquier intento de manipulación artificial de Fans, vistas automatizadas o resubida de videos ajenos conlleva el rechazo o suspensión permanente del programa de monetización.",
  },
];

export default function PanelMonetizacion({
  supabase,
  usuario,
  seguidoresCanal,
  vistasCalificadas15s,
  onAbrirAuth,
  onRefrescarMetricas,
  onCerrar,
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

  const pctSeguidores = Math.min(100, Math.round((seguidoresCanal / META_SEGUIDORES) * 100));
  const pctVistas = Math.min(100, Math.round((vistasCalificadas15s / META_VISTAS_15S) * 100));
  const cumpleRequisitos =
    seguidoresCanal >= META_SEGUIDORES && vistasCalificadas15s >= META_VISTAS_15S;

  const manejarActualizar = () => {
    setActualizando(true);
    setActualizadoOk(false);
    onRefrescarMetricas?.();
    setTimeout(() => {
      setActualizando(false);
      setActualizadoOk(true);
      setTimeout(() => setActualizadoOk(false), 2000);
    }, 550);
  };

  useEffect(() => {
    if (!usuario) return;
    onRefrescarMetricas?.();
    const intervalo = setInterval(() => {
      onRefrescarMetricas?.();
    }, 30 * 60 * 1000);

    const verificar = async () => {
      setCargandoEstado(true);
      try {
        const { data } = await supabase
          .from("solicitudes_monetizacion")
          .select("*")
          .eq("usuario_id", usuario.id)
          .order("creado_en", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (data) setSolicitudExistente(data);
      } finally {
        setCargandoEstado(false);
      }
    };
    verificar();
    return () => clearInterval(intervalo);
  }, [usuario]);

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
          seguidores_al_solicitar: seguidoresCanal,
          vistas_al_solicitar: vistasCalificadas15s,
          estado: "en_revision",
        })
        .select("*")
        .single();

      if (error) {
        alert("No se pudo enviar la solicitud: " + error.message);
        return;
      }
      setSolicitudExistente(data);
    } finally {
      setEnviando(false);
    }
  };
  return (
    <div className="max-w-3xl mx-auto pb-16 space-y-6">
      <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-blue-900/40 relative">
        {onCerrar && (
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar monetización"
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider mb-2">
          <DollarSign className="w-4 h-4" />
          <span>Programa de Creadores RUTF Talentico</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black leading-tight">
          Monetiza tu talento original y genera ingresos reales
        </h2>
        <p className="text-xs sm:text-sm text-blue-100/80 mt-2 leading-relaxed">
          Al alcanzar los requisitos de audiencia orgánica, activamos tus pagos directos por
          PayPal por los anuncios reproducidos en tus videos originales.
        </p>
      </div>

      {/* Requisitos en tiempo real */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <span>Progreso de Elegibilidad del Canal</span>
          </h3>

          {onRefrescarMetricas && (
            <button
              type="button"
              onClick={manejarActualizar}
              disabled={actualizando}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold transition ${
                actualizadoOk
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              <RefreshCw className={`w-3 h-3 ${actualizando ? "animate-spin" : ""}`} />
              <span>{actualizadoOk ? "Actualizado" : "Actualizar"}</span>
            </button>
          )}
        </div>

        {/* Barra 1: Fans reales */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-extrabold">
            <span className="flex items-center gap-1.5 text-slate-700">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Fans reales del canal</span>
            </span>
            <span className="text-slate-900">
              {seguidoresCanal.toLocaleString()} / {META_SEGUIDORES.toLocaleString()} ({pctSeguidores}%)
            </span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${pctSeguidores}%` }}
            />
          </div>
        </div>

        {/* Barra 2: Vistas calificadas >= 15 segundos */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-extrabold">
            <span className="flex items-center gap-1.5 text-slate-700">
              <Eye className="w-4 h-4 text-emerald-600" />
              <span>Vistas calificadas (≥ 15 segundos)</span>
            </span>
            <span className="text-slate-900">
              {vistasCalificadas15s.toLocaleString()} / {META_VISTAS_15S.toLocaleString()} ({pctVistas}%)
            </span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-500"
              style={{ width: `${pctVistas}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Solo las reproducciones reales que superan los <strong>15 segundos continuos</strong> suman para el programa de monetización.
          </p>
        </div>
      </div>

      {/* Sección de Pagos PayPal */}
      {!usuario ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 text-center space-y-3 shadow-sm">
          <p className="text-sm font-bold text-slate-700">
            Inicia sesión con tu canal para consultar tu progreso y habilitar tus pagos por PayPal.
          </p>
          <button
            type="button"
            onClick={onAbrirAuth}
            className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow"
          >
            Iniciar Sesión / Crear Canal
          </button>
        </div>
      ) : cargandoEstado ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 text-center text-xs font-bold text-slate-500">
          Verificando estado de monetización...
        </div>
      ) : solicitudExistente ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 space-y-2">
          <div className="flex items-center gap-2 text-emerald-800 font-black text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Cuenta PayPal Registrada para Pagos</span>
          </div>
          <p className="text-xs text-emerald-900/80 leading-relaxed">
            Tu canal <strong>{usuario.username}</strong> está en revisión editorial para verificar
            originalidad y cumplimiento de políticas. Correo PayPal vinculado:{" "}
            <strong>{solicitudExistente.cuenta_pago}</strong>.
          </p>
        </div>
      ) : cumpleRequisitos ? (
        <form
          onSubmit={enviarSolicitud}
          className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900">
              Configurar Pagos por PayPal
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black">
              Habilitado
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1">
                Nombre completo del titular
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Juan Pérez"
                value={nombreReal}
                onChange={(e) => setNombreReal(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1">
                Número de teléfono (con código de país)
              </label>
              <input
                type="tel"
                required
                placeholder="Ej. +1 809 555 1234"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1">
              Correo electrónico de PayPal
            </label>
            <input
              type="email"
              required
              placeholder="tu-correo@paypal.com"
              value={correoPaypal}
              onChange={(e) => setCorreoPaypal(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl"
            />
          </div>

          <button
            type="submit"
            disabled={enviando}
            className="w-full py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-black inline-flex items-center justify-center gap-2 shadow"
          >
            <Send className="w-4 h-4" />
            <span>{enviando ? "Guardando..." : "Vincular PayPal y Activar Pagos"}</span>
          </button>
        </form>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-3 text-center">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-500">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Revisión y activación automática al completar la meta</span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed max-w-lg mx-auto">
            Sigue publicando videos originales y compartiendo tu canal. Al alcanzar{" "}
            <strong>100 Fans reales</strong> y{" "}
            <strong>1,000 vistas calificadas (≥ 15s)</strong>, se desbloqueará tu formulario de cobro.
          </p>

          <div>
            <button
              type="button"
              disabled
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-slate-100 border border-slate-200 text-slate-500 text-xs font-extrabold cursor-not-allowed"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Pagos PayPal • Se habilitan al cumplir con los requisitos</span>
            </button>
          </div>
        </div>
      )}

      {/* Preguntas Frecuentes (bien separadas abajo) */}
      <div className="pt-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-black text-slate-900">
              Preguntas Frecuentes sobre Monetización y Pagos
            </h3>
          </div>

          <div className="divide-y divide-slate-100">
            {PREGUNTAS_FRECUENTES.map((item, idx) => {
              const abierta = faqAbierta === idx;
              return (
                <div key={idx} className="py-3 first:pt-1 last:pb-1">
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
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed">
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
