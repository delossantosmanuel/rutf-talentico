"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  Eye,
  RefreshCw,
  Mail,
} from "lucide-react";

export const CORREO_ADMIN_OFICIAL = "delossantosmanuel892@gmail.com";

type Props = {
  supabase: any;
  usuario: {
    id: string;
    username: string;
    email: string;
  } | null;
  onVolver: () => void;
};

export default function PanelAdminPagos({ supabase: supabaseProp, usuario, onVolver }: Props) {
  const esAdmin =
    Boolean(usuario?.email) &&
    usuario!.email.trim().toLowerCase() === CORREO_ADMIN_OFICIAL;

  const [retiros, setRetiros] = useState<any[]>([]);
  const [cuentasConfig, setCuentasConfig] = useState<Record<string, any>>({});
  const [cargando, setCargando] = useState(true);
  const [procesandoId, setProcesandoId] = useState<string | null>(null);
  const [motivosPorId, setMotivosPorId] = useState<Record<string, string>>({});
    const [canalAcreditar, setCanalAcreditar] = useState("");
  const [montoAcreditar, setMontoAcreditar] = useState("");
  const [notaAcreditar, setNotaAcreditar] = useState("");
  const [acreditando, setAcreditando] = useState(false);

 const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { "x-rutf-admin": usuario?.email || "" } } }
  );

  const cargarSolicitudes = useCallback(async () => {
    if (!esAdmin) return;
    setCargando(true);
    try {
      const [{ data: listaRetiros }, { data: listaConfigs }] = await Promise.all([
        supabase
          .from("retiros_paypal_rutf")
          .select("*")
          .order("creado_en", { ascending: false }),
        supabase.from("configuracion_pagos_rutf").select("*"),
      ]);

      if (Array.isArray(listaRetiros)) setRetiros(listaRetiros);
      if (Array.isArray(listaConfigs)) {
        const mapa: Record<string, any> = {};
        listaConfigs.forEach((c: any) => {
          mapa[c.usuario_id] = c;
        });
        setCuentasConfig(mapa);
      }
    } finally {
      setCargando(false);
    }
  }, [esAdmin, supabase]);

  useEffect(() => {
    if (!esAdmin) return;
    cargarSolicitudes();

    const canal = supabase
      .channel("admin-retiros-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "retiros_paypal_rutf" },
        () => cargarSolicitudes()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, [esAdmin, supabase, cargarSolicitudes]);

  if (!esAdmin) {
    return null;
  }

  const actualizarEstadoRetiro = async (
    retiro: any,
    nuevoEstado: "revisada" | "pagado" | "rechazado"
  ) => {
    setProcesandoId(retiro.id);
    try {
      const motivoPersonalizado = (motivosPorId[retiro.id] || "").trim();
      const mensajeFinal =
        motivoPersonalizado ||
        (nuevoEstado === "revisada"
          ? "Solicitud revisada y aceptada. Tu transferencia PayPal se emitirá en un plazo máximo de 3 a 5 días hábiles."
          : nuevoEstado === "pagado"
          ? `Pago de $${Number(retiro.monto_usd).toFixed(2)} USD enviado a tu cuenta PayPal (${retiro.correo_paypal}). ¡Sigue creando contenido para tu próximo retiro!`
          : "Solicitud rechazada tras auditoría de seguridad (actividad no válida o incumplimiento de políticas).");

      const plazoNuevo =
        nuevoEstado === "revisada"
          ? "Emisión PayPal: 3 a 5 días hábiles"
          : nuevoEstado === "pagado"
          ? "Pago completado vía PayPal"
          : "Solicitud rechazada";
   const codigoRecibo =
     retiro.codigo_comprobante ||
     (nuevoEstado === "pagado"
       ? `RUTF-PAY-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
       : "");

      const { error } = await supabase
        .from("retiros_paypal_rutf")
        .update({
          estado: nuevoEstado,
          motivo_admin: mensajeFinal,
          plazo_estimado: plazoNuevo,
                 ...(codigoRecibo ? { codigo_comprobante: codigoRecibo } : {}),

          ...(nuevoEstado === "pagado" ? { pagado_en: new Date().toISOString() } : {}),
        })
        .eq("id", retiro.id);

      if (error) {
        alert("Error al actualizar estado: " + error.message);
        return;
      }

      const cfg = cuentasConfig[retiro.usuario_id];
      if (cfg && (nuevoEstado === "pagado" || nuevoEstado === "rechazado")) {
        const pendienteActual = Number(cfg.saldo_pendiente || 0);
        const nuevoPendiente = Math.max(0, pendienteActual - Number(retiro.monto_usd || 0));
        await supabase
          .from("configuracion_pagos_rutf")
          .update({ saldo_pendiente: nuevoPendiente })
          .eq("usuario_id", retiro.usuario_id);
      }

      await supabase.from("notificaciones").insert({
        destinatario_username: retiro.username,
        actor_username: "RUTF Talentico Pagos",
        tipo: "monetizacion",
        mensaje: mensajeFinal,
        leida: false,
      });

      await cargarSolicitudes();
    } finally {
      setProcesandoId(null);
    }
  };
         const acreditarSaldoCreador = async (e: React.FormEvent) => {
    e.preventDefault();
    const usernameLimpio = canalAcreditar.trim().replace(/^@/, "");
    const montoNum = Number(montoAcreditar);
    if (!usernameLimpio || isNaN(montoNum) || montoNum <= 0) {
      alert("Ingresa un @usuario válido y un monto mayor a $0.00 USD.");
      return;
    }

    setAcreditando(true);
    try {
        const { data: perfil } = await supabase
     .from("perfiles")
     .select("id,username,email")
     .or(`username.ilike.${usernameLimpio},email.ilike.${usernameLimpio}`)
     .maybeSingle();

      if (!perfil) {
        alert(`No se encontró ningún canal con el usuario @${usernameLimpio}.`);
        return;
      }

      const { data: cfgActual } = await supabase
        .from("configuracion_pagos_rutf")
        .select("*")
        .eq("usuario_id", perfil.id)
        .maybeSingle();

      const saldoPrevio = Number(cfgActual?.saldo_disponible || 0);
      const nuevoSaldo = Number((saldoPrevio + montoNum).toFixed(2));

      const { error } = await supabase.from("configuracion_pagos_rutf").upsert(
        {
          usuario_id: perfil.id,
          username: perfil.username,
          pais_codigo: cfgActual?.pais_codigo || "+1",
          pais_nombre: cfgActual?.pais_nombre || "Internacional",
          telefono: cfgActual?.telefono || "",
          telefono_verificado: Boolean(cfgActual?.telefono_verificado),
          nombre_titular: cfgActual?.nombre_titular || perfil.username,
          correo_paypal: cfgActual?.correo_paypal || "",
          saldo_disponible: nuevoSaldo,
          saldo_pendiente: Number(cfgActual?.saldo_pendiente || 0),
          acepto_politicas: Boolean(cfgActual?.acepto_politicas),
          actualizado_en: new Date().toISOString(),
        },
        { onConflict: "usuario_id" }
      );

      if (error) {
        alert("No se pudo acreditar el saldo: " + error.message);
        return;
      }

      const detalle =
        notaAcreditar.trim() ||
        `Se han acreditado $${montoNum.toFixed(2)} USD a tu Saldo Disponible por ingresos publicitarios de tus videos originales.`;

      await supabase.from("notificaciones").insert({
        destinatario_username: perfil.username,
        actor_username: "RUTF Talentico Pagos",
        tipo: "monetizacion",
        mensaje: detalle,
        leida: false,
      });

      setCanalAcreditar("");
      setMontoAcreditar("");
      setNotaAcreditar("");
      await cargarSolicitudes();
      alert(`¡Listo! Se acreditaron $${montoNum.toFixed(2)} USD a @${perfil.username}.`);
    } finally {
      setAcreditando(false);
    }
  };


  return (
    <div className="fixed inset-0 z-50 bg-slate-50 overflow-y-auto">
      <div className="sticky top-0 z-10 bg-slate-950 text-white border-b border-slate-800 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onVolver}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver</span>
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Panel Oficial de Pagos • RUTF Talentico</span>
          </div>

          <button
            type="button"
            onClick={cargarSolicitudes}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${cargando ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-5 pb-16 space-y-4">
             <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
       <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs">
         <p className="text-[10px] sm:text-xs font-extrabold text-slate-500">Saldo Creadores</p>
         <p className="text-base sm:text-xl font-black text-blue-700 mt-0.5">
           ${Object.values(cuentasConfig).reduce((a: number, c: any) => a + Number(c?.saldo_disponible || 0), 0).toFixed(2)}
         </p>
       </div>
       <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs">
         <p className="text-[10px] sm:text-xs font-extrabold text-slate-500">Pendiente Pago</p>
         <p className="text-base sm:text-xl font-black text-amber-600 mt-0.5">
           ${retiros.filter((x) => x.estado === "en_revision" || x.estado === "revisada").reduce((a, x) => a + Number(x.monto_usd || 0), 0).toFixed(2)}
         </p>
       </div>
       <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs">
         <p className="text-[10px] sm:text-xs font-extrabold text-slate-500">Total Pagado</p>
         <p className="text-base sm:text-xl font-black text-[#16A34A] mt-0.5">
           ${retiros.filter((x) => x.estado === "pagado").reduce((a, x) => a + Number(x.monto_usd || 0), 0).toFixed(2)}
         </p>
       </div>
     </div>

             <form onSubmit={acreditarSaldoCreador} className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h2 className="text-sm sm:text-base font-black text-slate-900">Acreditar Ganancias a Creador ($ USD)</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#16A34A] text-[10px] font-black">Liquidación Oficial</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <input
              type="text"
              required
             placeholder="@usuario o correo del creador"
              value={canalAcreditar}
              onChange={(e) => setCanalAcreditar(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-300 rounded-xl"
            />
            <input
              type="number"
              step="0.01"
              min="0.50"
              required
              placeholder="Monto USD (ej. 15.00)"
              value={montoAcreditar}
              onChange={(e) => setMontoAcreditar(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-300 rounded-xl"
            />
            <input
              type="text"
              placeholder="Concepto (ej. Ingresos AdMob Noviembre)"
              value={notaAcreditar}
              onChange={(e) => setNotaAcreditar(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-300 rounded-xl"
            />
          </div>
          <button
            type="submit"
            disabled={acreditando}
            className="px-5 py-2 rounded-full bg-[#16A34A] hover:bg-emerald-700 text-white text-xs font-black transition"
          >
            {acreditando ? "Acreditando..." : "Acreditar Saldo Disponible ($ USD)"}
          </button>
        </form>

        {cargando && retiros.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center text-xs font-bold text-slate-500">
            Cargando solicitudes de creadores...
          </div>
        ) : retiros.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-1">
            <p className="text-sm font-black text-slate-800">No hay solicitudes de retiro pendientes</p>
            <p className="text-xs text-slate-500">Cuando un creador alcance los requisitos y solicite su retiro PayPal aparecerá aquí en tiempo real.</p>
          </div>
        ) : (
          retiros.map((r) => {
            const cfg = cuentasConfig[r.usuario_id];
            const ocupado = procesandoId === r.id;
            return (
              <div key={r.id} className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-2xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-slate-900">@{r.username}</span>
                      <span className="text-xs font-bold text-slate-500">({r.nombre_titular})</span>
                    </div>
                    <p className="text-xs text-blue-600 font-extrabold mt-0.5">PayPal: {r.correo_paypal}</p>
                    <p className="text-[11px] text-slate-500">
                      País: <strong>{r.pais_nombre}</strong> • Teléfono:{" "}
                      <strong>{cfg ? `${cfg.pais_codigo} ${cfg.telefono}` : "No registrado"}</strong>{" "}
                      {cfg?.telefono_verificado ? "(SMS Verificado)" : "(Sin verificar SMS)"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-black text-[#16A34A] flex items-center justify-end gap-0.5">
                      <DollarSign className="w-4 h-4" />
                      <span>{Number(r.monto_usd).toFixed(2)} USD</span>
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black mt-1 ${
                        r.estado === "pagado"
                          ? "bg-emerald-50 text-[#16A34A]"
                          : r.estado === "revisada"
                          ? "bg-blue-50 text-blue-700"
                          : r.estado === "rechazado"
                          ? "bg-rose-50 text-rose-600"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {r.estado === "pagado" ? <CheckCircle2 className="w-3 h-3" /> : r.estado === "revisada" ? <Eye className="w-3 h-3" /> : r.estado === "rechazado" ? <XCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      <span>
                        {r.estado === "pagado"
                          ? "Pagado"
                          : r.estado === "revisada"
                          ? "Revisada y Aceptada"
                          : r.estado === "rechazado"
                          ? "Rechazada"
                          : "En revisión"}
                      </span>
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-slate-600 mb-1">
                    Mensaje o motivo para el creador (opcional — se envía automático a su notificación):
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Pago verificado, transferencia PayPal en curso (3 a 5 días hábiles)..."
                    value={motivosPorId[r.id] ?? r.motivo_admin ?? ""}
                    onChange={(e) => setMotivosPorId((prev) => ({ ...prev, [r.id]: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    disabled={ocupado || r.estado === "pagado"}
                    onClick={() => actualizarEstadoRetiro(r, "revisada")}
                    className="px-3.5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 text-white text-xs font-black inline-flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Revisada y Aceptar</span>
                  </button>

                  <button
                    type="button"
                    disabled={ocupado || r.estado === "pagado"}
                    onClick={() => actualizarEstadoRetiro(r, "pagado")}
                    className="px-3.5 py-2 rounded-full bg-[#16A34A] hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 text-white text-xs font-black inline-flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Marcar como Pagado</span>
                  </button>

                  <button
                    type="button"
                    disabled={ocupado || r.estado === "pagado"}
                    onClick={() => actualizarEstadoRetiro(r, "rechazado")}
                    className="px-3.5 py-2 rounded-full bg-rose-600 hover:bg-rose-700 disabled:bg-slate-100 disabled:text-slate-400 text-white text-xs font-black inline-flex items-center gap-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Rechazar Solicitud</span>
                  </button>
                                 {r.estado === "pagado" && (
                 <a
                   href={`mailto:${r.correo_paypal}?subject=${encodeURIComponent(
                     `Comprobante Oficial de Pago RUTF Talentico (${r.codigo_comprobante || "RUTF-PAY"})`
                   )}&body=${encodeURIComponent(
                     `CERTIFICADO OFICIAL DE PAGO - RUTF TALENTICO\n` +
                       `--------------------------------------------------\n` +
                       `Comprobante N°: ${r.codigo_comprobante || "RUTF-PAY-OFICIAL"}\n` +
                       `Fecha de emisión: ${new Date(r.pagado_en || r.creado_en).toLocaleString()}\n` +
                       `Titular receptor: ${r.nombre_titular} (@${r.username})\n` +
                       `Cuenta PayPal destino: ${r.correo_paypal}\n` +
                       `País fiscal: ${r.pais_nombre}\n` +
                       `Monto liquidado: $${Number(r.monto_usd).toFixed(2)} USD\n` +
                       `Estado: PAGADO Y VERIFICADO\n` +
                       `--------------------------------------------------\n` +
                       `Emitido y firmado digitalmente por:\n` +
                       `Administración Oficial RUTF Talentico (${CORREO_ADMIN_OFICIAL})`
                   )}`}
                   className="px-3.5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-black inline-flex items-center gap-1.5"
                 >
                   <Mail className="w-3.5 h-3.5" />
                   <span>Enviar Copia por Correo ({r.codigo_comprobante || "Recibo"})</span>
                 </a>
               )}

                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
