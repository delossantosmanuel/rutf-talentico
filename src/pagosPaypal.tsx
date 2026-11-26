"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  DollarSign,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  Clock,
  XCircle,
  Send,
  Wallet,
  Lock,
  AlertCircle,
} from "lucide-react";

type Props = {
  supabase: any;
  usuario: {
    id: string;
    username: string;
    email: string;
  };
  onVolver: () => void;
};

const PAISES_INTERNACIONALES = [
  { codigo: "+1", nombre: "República Dominicana / EE. UU. / Canadá" },
  { codigo: "+52", nombre: "México" },
  { codigo: "+34", nombre: "España" },
  { codigo: "+57", nombre: "Colombia" },
  { codigo: "+54", nombre: "Argentina" },
  { codigo: "+56", nombre: "Chile" },
  { codigo: "+51", nombre: "Perú" },
  { codigo: "+58", nombre: "Venezuela" },
  { codigo: "+593", nombre: "Ecuador" },
  { codigo: "+502", nombre: "Guatemala" },
  { codigo: "+503", nombre: "El Salvador" },
  { codigo: "+504", nombre: "Honduras" },
  { codigo: "+505", nombre: "Nicaragua" },
  { codigo: "+506", nombre: "Costa Rica" },
  { codigo: "+507", nombre: "Panamá" },
  { codigo: "+591", nombre: "Bolivia" },
  { codigo: "+595", nombre: "Paraguay" },
  { codigo: "+598", nombre: "Uruguay" },
  { codigo: "+55", nombre: "Brasil" },
  { codigo: "+44", nombre: "Reino Unido" },
  { codigo: "+33", nombre: "Francia" },
  { codigo: "+39", nombre: "Italia" },
  { codigo: "+49", nombre: "Alemania" },
];

const MONTO_MINIMO_RETIRO = 10.0;

export default function PantallaPagosPaypal({ supabase, usuario, onVolver }: Props) {
  const [paisCodigo, setPaisCodigo] = useState("+1");
  const [telefono, setTelefono] = useState("");
  const [codigoSmsIngresado, setCodigoSmsIngresado] = useState("");
  const [smsEnviado, setSmsEnviado] = useState(false);
  const [enviandoSms, setEnviandoSms] = useState(false);
  const [validandoSms, setValidandoSms] = useState(false);
  const [telefonoVerificado, setTelefonoVerificado] = useState(false);

  const [nombreTitular, setNombreTitular] = useState("");
  const [correoPaypal, setCorreoPaypal] = useState("");
  const [confirmarPaypal, setConfirmarPaypal] = useState("");
  const [aceptoPoliticas, setAceptoPoliticas] = useState(false);

  const [saldoDisponible, setSaldoDisponible] = useState(0);
  const [saldoPendiente, setSaldoPendiente] = useState(0);
  const [historialRetiros, setHistorialRetiros] = useState<any[]>([]);

  const [guardandoConfig, setGuardandoConfig] = useState(false);
  const [solicitandoRetiro, setSolicitandoRetiro] = useState(false);
  const [mensajeSistema, setMensajeSistema] = useState<{ tipo: "ok" | "error"; texto: string } | null>(null);

  const paisActual = PAISES_INTERNACIONALES.find((p) => p.codigo === paisCodigo) || PAISES_INTERNACIONALES[0];
  const telefonoCompleto = `${paisCodigo}${telefono.replace(/\D/g, "")}`;

  const cargarDatosPagos = useCallback(async () => {
    const [{ data: config }, { data: retiros }] = await Promise.all([
      supabase.from("configuracion_pagos_rutf").select("*").eq("usuario_id", usuario.id).maybeSingle(),
      supabase.from("retiros_paypal_rutf").select("*").eq("usuario_id", usuario.id).order("creado_en", { ascending: false }),
    ]);
    if (config) {
      setPaisCodigo(config.pais_codigo || "+1");
      setTelefono(config.telefono || "");
      setTelefonoVerificado(Boolean(config.telefono_verificado));
      setNombreTitular(config.nombre_titular || "");
      setCorreoPaypal(config.correo_paypal || "");
      setConfirmarPaypal(config.correo_paypal || "");
      setAceptoPoliticas(Boolean(config.acepto_politicas));
      setSaldoDisponible(Number(config.saldo_disponible || 0));
      setSaldoPendiente(Number(config.saldo_pendiente || 0));
    }
    if (Array.isArray(retiros)) setHistorialRetiros(retiros);
  }, [supabase, usuario.id]);

   useEffect(() => {
    cargarDatosPagos();
    const canal = supabase
      .channel(`pagos-creador-${usuario.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "retiros_paypal_rutf", filter: `usuario_id=eq.${usuario.id}` },
        () => cargarDatosPagos()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "configuracion_pagos_rutf", filter: `usuario_id=eq.${usuario.id}` },
        () => cargarDatosPagos()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(canal);
    };
  }, [cargarDatosPagos, supabase, usuario.id]);

  const enviarCodigoSms = async () => {
    setMensajeSistema(null);
    const limpio = telefono.replace(/\D/g, "");
    if (limpio.length < 7) {
      setMensajeSistema({ tipo: "error", texto: "Ingresa un número de teléfono móvil válido." });
      return;
    }
    setEnviandoSms(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({ phone: telefonoCompleto });
      if (error) {
        setMensajeSistema({
          tipo: "error",
          texto: "Servicio SMS pendiente de activación en Supabase (" + error.message + ").",
        });
        return;
      }
      setSmsEnviado(true);
      setMensajeSistema({
        tipo: "ok",
        texto: `Código SMS enviado a ${telefonoCompleto}. Revisa tus mensajes.`,
      });
    } finally {
      setEnviandoSms(false);
    }
  };

  const validarCodigoSms = async () => {
    setMensajeSistema(null);
    if (codigoSmsIngresado.trim().length < 4) {
      setMensajeSistema({ tipo: "error", texto: "Ingresa el código SMS recibido." });
      return;
    }
    setValidandoSms(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: telefonoCompleto,
        token: codigoSmsIngresado.trim(),
        type: "sms",
      });
      if (error) {
        setMensajeSistema({ tipo: "error", texto: "Código incorrecto o expirado: " + error.message });
        return;
      }
      setTelefonoVerificado(true);
      setSmsEnviado(false);
      setCodigoSmsIngresado("");
      setMensajeSistema({ tipo: "ok", texto: "Teléfono verificado correctamente." });
    } finally {
      setValidandoSms(false);
    }
  };

  const guardarConfiguracionPaypal = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensajeSistema(null);
    if (!nombreTitular.trim() || !correoPaypal.trim()) {
      setMensajeSistema({ tipo: "error", texto: "Completa tu nombre completo y correo PayPal." });
      return;
    }
    if (correoPaypal.trim().toLowerCase() !== confirmarPaypal.trim().toLowerCase()) {
      setMensajeSistema({ tipo: "error", texto: "Los correos de PayPal no coinciden." });
      return;
    }
    if (!aceptoPoliticas) {
      setMensajeSistema({
        tipo: "error",
        texto: "Debes aceptar los Términos de Uso y Políticas de Monetización.",
      });
      return;
    }
    setGuardandoConfig(true);
    try {
      const { error } = await supabase.from("configuracion_pagos_rutf").upsert(
        {
          usuario_id: usuario.id,
          username: usuario.username,
          pais_codigo: paisCodigo,
          pais_nombre: paisActual.nombre,
          telefono: telefono.replace(/\D/g, ""),
          telefono_verificado: telefonoVerificado,
          nombre_titular: nombreTitular.trim(),
          correo_paypal: correoPaypal.trim().toLowerCase(),
          acepto_politicas: true,
          actualizado_en: new Date().toISOString(),
        },
        { onConflict: "usuario_id" }
      );
      if (error) {
        setMensajeSistema({ tipo: "error", texto: "Error al guardar: " + error.message });
        return;
      }
      setMensajeSistema({ tipo: "ok", texto: "Configuración de pagos PayPal guardada correctamente." });
    } finally {
      setGuardandoConfig(false);
    }
  };

  const puedeSolicitarRetiro =
    telefonoVerificado &&
    Boolean(correoPaypal.trim()) &&
    Boolean(nombreTitular.trim()) &&
    aceptoPoliticas &&
    saldoDisponible >= MONTO_MINIMO_RETIRO;

  const solicitarRetiroPaypal = async () => {
    if (!puedeSolicitarRetiro || solicitandoRetiro) return;
    setSolicitandoRetiro(true);
    setMensajeSistema(null);
    try {
      const monto = saldoDisponible;
      const { error } = await supabase.from("retiros_paypal_rutf").insert({
        usuario_id: usuario.id,
        username: usuario.username,
        correo_paypal: correoPaypal.trim().toLowerCase(),
        nombre_titular: nombreTitular.trim(),
        pais_nombre: paisActual.nombre,
        monto_usd: monto,
        estado: "en_revision",
      });
      if (error) {
        setMensajeSistema({ tipo: "error", texto: "No se pudo solicitar el retiro: " + error.message });
        return;
      }
      await supabase
        .from("configuracion_pagos_rutf")
        .update({ saldo_disponible: 0, saldo_pendiente: saldoPendiente + monto })
        .eq("usuario_id", usuario.id);
      await cargarDatosPagos();
      setMensajeSistema({
        tipo: "ok",
        texto: `Solicitud de retiro por $${monto.toFixed(2)} USD enviada a revisión.`,
      });
    } finally {
      setSolicitandoRetiro(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 bg-slate-50 overflow-y-auto">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-slate-200 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onVolver}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver</span>
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black">
            <DollarSign className="w-3.5 h-3.5 text-amber-600" />
            <span>Monetización • Pagos y Retiros PayPal</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-5 pb-16 space-y-5">
        {mensajeSistema && (
          <div
            className={`rounded-2xl p-3.5 text-xs font-bold flex items-center gap-2 border ${
              mensajeSistema.tipo === "ok"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-rose-50 border-rose-200 text-rose-700"
            }`}
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{mensajeSistema.texto}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-slate-500">
              <Wallet className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Saldo Disponible</span>
            </div>
            <p className="text-2xl font-black text-[#16A34A]">${saldoDisponible.toFixed(2)} USD</p>
            <p className="text-[10px] text-slate-400 font-semibold">Mínimo retiro: $10.00 USD</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-slate-500">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Pendiente de Validación</span>
            </div>
            <p className="text-2xl font-black text-slate-800">${saldoPendiente.toFixed(2)} USD</p>
            <p className="text-[10px] text-slate-400 font-semibold">Auditoría antifraude</p>
          </div>
        </div>

        <form onSubmit={guardarConfiguracionPaypal} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm sm:text-base font-black text-slate-900">Verificación y Cuenta PayPal</h2>
            </div>
            {telefonoVerificado && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#16A34A] text-[10px] font-black">
                Teléfono Verificado
              </span>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1">País de Residencia Fiscal</label>
              <select
                value={paisCodigo}
                onChange={(e) => { setPaisCodigo(e.target.value); setTelefonoVerificado(false); }}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl bg-white"
              >
                {PAISES_INTERNACIONALES.map((p) => (
                  <option key={p.codigo} value={p.codigo}>
                    {p.nombre} ({p.codigo})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1">Número Móvil + Verificación SMS (OTP)</label>
              <div className="flex gap-2">
                <span className="px-3 py-2.5 rounded-xl bg-slate-100 border border-slate-300 text-xs font-black text-slate-700 shrink-0">
                  {paisCodigo}
                </span>
                <input
                  type="tel"
                  required
                  placeholder="Número móvil sin código"
                  value={telefono}
                  onChange={(e) => { setTelefono(e.target.value); setTelefonoVerificado(false); }}
                  className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl"
                />
                <button
                  type="button"
                  onClick={enviarCodigoSms}
                  disabled={enviandoSms || telefonoVerificado}
                  className="px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-black shrink-0 inline-flex items-center gap-1"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>{enviandoSms ? "Enviando..." : "Enviar código"}</span>
                </button>
              </div>

              {smsEnviado && !telefonoVerificado && (
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Código SMS de 6 dígitos"
                    value={codigoSmsIngresado}
                    onChange={(e) => setCodigoSmsIngresado(e.target.value)}
                    className="flex-1 px-3.5 py-2 text-xs border border-blue-300 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={validarCodigoSms}
                    disabled={validandoSms}
                    className="px-4 py-2 rounded-xl bg-[#16A34A] text-white text-xs font-black"
                  >
                    {validandoSms ? "Validando..." : "Confirmar"}
                  </button>
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1">Nombre Completo del Titular</label>
              <input
                type="text"
                required
                placeholder="Como aparece en tu cuenta bancaria o PayPal"
                value={nombreTitular}
                onChange={(e) => setNombreTitular(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Correo Electrónico de PayPal</label>
                <input
                  type="email"
                  required
                  placeholder="tu-correo@paypal.com"
                  value={correoPaypal}
                  onChange={(e) => setCorreoPaypal(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Confirmar Correo de PayPal</label>
                <input
                  type="email"
                  required
                  placeholder="Repite tu correo PayPal"
                  value={confirmarPaypal}
                  onChange={(e) => setConfirmarPaypal(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            <label className="flex items-start gap-2.5 pt-1 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={aceptoPoliticas}
                onChange={(e) => setAceptoPoliticas(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600"
              />
              <span className="text-xs text-slate-600 leading-relaxed">
                He leído y acepto los{" "}
                <Link href="/terminos" target="_blank" className="text-blue-600 font-extrabold underline">
                  Términos de Uso
                </Link>{" "}
                y las{" "}
                <Link href="/privacidad" target="_blank" className="text-blue-600 font-extrabold underline">
                  Políticas de Monetización de RUTF Talentico
                </Link>
                , confirmando que soy mayor de 18 años.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={guardandoConfig}
            className="w-full py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition"
          >
            {guardandoConfig ? "Guardando..." : "Guardar Cuenta PayPal y Configuración"}
          </button>
        </form>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-black text-slate-900">Solicitar Retiro vía PayPal</h3>
            <span className="text-[11px] font-bold text-slate-500">Mínimo $10.00 USD</span>
          </div>

          <button
            type="button"
            disabled={!puedeSolicitarRetiro || solicitandoRetiro}
            onClick={solicitarRetiroPaypal}
            className={`w-full py-3 rounded-full text-xs font-black inline-flex items-center justify-center gap-2 transition ${
              puedeSolicitarRetiro
                ? "bg-[#16A34A] hover:bg-emerald-700 text-white shadow cursor-pointer"
                : "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            {puedeSolicitarRetiro ? <Send className="w-4 h-4" /> : <Lock className="w-3.5 h-3.5" />}
            <span>
              {solicitandoRetiro
                ? "Procesando solicitud..."
                : `Solicitar Retiro vía PayPal ($${saldoDisponible.toFixed(2)} USD)`}
            </span>
          </button>

          {!telefonoVerificado && (
            <p className="text-[11px] text-amber-700 font-semibold text-center">
              Verifica tu teléfono móvil por SMS (OTP) y guarda tu cuenta PayPal para habilitar los retiros.
            </p>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-3">
          <h3 className="text-sm sm:text-base font-black text-slate-900">Historial de Retiros</h3>
          {historialRetiros.length === 0 ? (
            <p className="text-xs text-slate-500 py-3 text-center">Aún no has realizado solicitudes de retiro.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {historialRetiros.map((r) => (
                                <div key={r.id} className="py-3 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-black text-slate-900">${Number(r.monto_usd).toFixed(2)} USD</p>
                      <p className="text-[11px] text-slate-500">
                        {r.correo_paypal} • {new Date(r.creado_en).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black inline-flex items-center gap-1 ${
                        r.estado === "pagado"
                          ? "bg-emerald-50 text-[#16A34A]"
                          : r.estado === "revisada"
                          ? "bg-blue-50 text-blue-700"
                          : r.estado === "rechazado"
                          ? "bg-rose-50 text-rose-600"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {r.estado === "pagado" ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : r.estado === "rechazado" ? (
                        <XCircle className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      <span>
                        {r.estado === "pagado"
                          ? "Pagado"
                          : r.estado === "revisada"
                          ? "Revisada y Aceptada"
                          : r.estado === "rechazado"
                          ? "Rechazado"
                          : "En revisión"}
                      </span>
                    </span>
                  </div>
                  {r.plazo_estimado && (
                    <p className="text-[11px] font-bold text-slate-600">Plazo: {r.plazo_estimado}</p>
                  )}
                  {r.motivo_admin && (
                    <p className="text-[11px] text-slate-600 bg-slate-50 border border-slate-200/80 rounded-xl px-2.5 py-1.5">
                      {r.motivo_admin}
                    </p>
                  )}
                </div>

              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
