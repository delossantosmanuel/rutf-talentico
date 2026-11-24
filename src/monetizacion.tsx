"use client";

import { useState, useEffect } from "react";
import {
  DollarSign,
  Users,
  Eye,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Send,
  X,
  RefreshCw,
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

const META_SEGUIDORES = 500;
const META_VISTAS_15S = 1000;

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
  const [pais, setPais] = useState("");
  const [metodoPago, setMetodoPago] = useState("PayPal");
  const [cuentaPago, setCuentaPago] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [solicitudExistente, setSolicitudExistente] = useState<any>(null);
  const [cargandoEstado, setCargandoEstado] = useState(false);

  const pctSeguidores = Math.min(100, Math.round((seguidoresCanal / META_SEGUIDORES) * 100));
  const pctVistas = Math.min(100, Math.round((vistasCalificadas15s / META_VISTAS_15S) * 100));
  const cumpleRequisitos =
    seguidoresCanal >= META_SEGUIDORES && vistasCalificadas15s >= META_VISTAS_15S;

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
          pais: pais.trim(),
          metodo_pago: metodoPago,
          cuenta_pago: cuentaPago.trim(),
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
    <div className="max-w-3xl mx-auto pb-16 space-y-5">
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
          Al alcanzar los requisitos de audiencia orgánica, activamos el reparto de ingresos por
          anuncios reproducidos en tus videos originales.
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
              onClick={onRefrescarMetricas}
              title="Actualizar conteo"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-extrabold transition"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Actualizar</span>
            </button>
          )}
        </div>

        {/* Barra 1: Suscriptores reales */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-extrabold">
            <span className="flex items-center gap-1.5 text-slate-700">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Suscriptores reales del canal</span>
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

      {/* Estado de solicitud o formulario */}
      {!usuario ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 text-center space-y-3 shadow-sm">
          <p className="text-sm font-bold text-slate-700">
            Inicia sesión con tu canal para consultar tu progreso y solicitar la monetización.
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
            <span>Solicitud de Monetización Registrada</span>
          </div>
          <p className="text-xs text-emerald-900/80 leading-relaxed">
            Tu canal <strong>{usuario.username}</strong> está en revisión editorial para verificar
            originalidad y cumplimiento de políticas de anunciantes. Método registrado:{" "}
            <strong>{solicitudExistente.metodo_pago}</strong>.
          </p>
        </div>
      ) : cumpleRequisitos ? (
        <form
          onSubmit={enviarSolicitud}
          className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4"
        >
          <h3 className="text-base font-black text-slate-900">
            Solicitar Activación de Pagos
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1">
                Nombre completo del titular
              </label>
              <input
                type="text"
                required
                value={nombreReal}
                onChange={(e) => setNombreReal(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1">
                País de residencia
              </label>
              <input
                type="text"
                required
                value={pais}
                onChange={(e) => setPais(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1">
                Método de cobro
              </label>
              <select
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl bg-white"
              >
                <option value="PayPal">PayPal</option>
                <option value="Transferencia Bancaria">Transferencia Bancaria Internacional</option>
                <option value="Payoneer">Payoneer</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1">
                Correo de PayPal o cuenta bancaria
              </label>
              <input
                type="text"
                required
                value={cuentaPago}
                onChange={(e) => setCuentaPago(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={enviando}
            className="w-full py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black inline-flex items-center justify-center gap-2 shadow"
          >
            <Send className="w-4 h-4" />
            <span>{enviando ? "Enviando solicitud..." : "Enviar Solicitud de Monetización"}</span>
          </button>
        </form>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 flex items-start gap-3">
          <Clock className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-600 leading-relaxed">
            Sigue publicando videos originales y compartiendo tu canal. Cuando alcances los{" "}
            <strong>500 suscriptores reales</strong> y las{" "}
            <strong>1,000 vistas calificadas de 15 segundos</strong>, se habilitará aquí mismo el
            formulario oficial de cobro.
          </p>
        </div>
      )}
    </div>
  );
}
