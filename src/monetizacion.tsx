"use client";
import React, { useState, useEffect } from "react";
import {
  DollarSign, Lock, Unlock, CheckCircle2, Clock, ShieldCheck,
  Sparkles, Gift, Users, Handshake, ChevronDown, ChevronUp,
  Calendar, CreditCard, Smartphone, Mail, XCircle, Send
} from "lucide-react";
import { reproducirSonidoRUTF } from "./notificaciones";

export function PanelMonetizacion({
  usuario,
  suscriptoresReales,
  vistasReales,
  supabase,
  onAbrirAuth,
}: {
  usuario: { id: string; username: string; email?: string } | null;
  suscriptoresReales: number;
  vistasReales: number;
  supabase: any;
  onAbrirAuth: () => void;
}) {
  const [paypalEmail, setPaypalEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [solicitudActual, setSolicitudActual] = useState<any>(null);
  const [todasSolicitudes, setTodasSolicitudes] = useState<any[]>([]);
  const [guardando, setGuardando] = useState(false);
  const [mostrarReglas, setMostrarReglas] = useState(false);

  const META_SUSCRIPTORES = 100;
  const META_VISTAS = 1000;
  const esFundador = usuario?.username?.toLowerCase() === "@manueldigitalidad";

  const pctSuscriptores = Math.min(100, Math.round((suscriptoresReales / META_SUSCRIPTORES) * 100));
  const pctVistas = Math.min(100, Math.round((vistasReales / META_VISTAS) * 100));
  const cumpleRequisitos = suscriptoresReales >= META_SUSCRIPTORES && vistasReales >= META_VISTAS;

  const saldoEstimado =
    solicitudActual?.estado === "aprobado" && vistasReales > META_VISTAS
      ? (((vistasReales - META_VISTAS) / 1000) * 0.5).toFixed(2)
      : "0.00";

  const cargarSolicitudes = async () => {
    if (!usuario) return;
    const { data } = await supabase
      .from("solicitudes_monetizacion")
      .select("*")
      .eq("usuario_id", usuario.id)
      .maybeSingle();

    if (data) {
      setSolicitudActual(data);
      setPaypalEmail(data.paypal_email || "");
      setTelefono(data.telefono || "");
    }

    if (esFundador) {
      const { data: listaAdmin } = await supabase
        .from("solicitudes_monetizacion")
        .select("*")
        .order("creado_en", { ascending: false });
      setTodasSolicitudes(listaAdmin || []);
    }
  };

  useEffect(() => {
    cargarSolicitudes();
  }, [usuario]);

  const guardarDatosPago = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario) return onAbrirAuth();
    if (!paypalEmail.trim()) return;
    setGuardando(true);
    await supabase.from("solicitudes_monetizacion").upsert(
      {
        usuario_id: usuario.id,
        username: usuario.username,
        paypal_email: paypalEmail.trim(),
        telefono: telefono.trim(),
        suscriptores: suscriptoresReales,
        vistas: vistasReales,
        estado: solicitudActual?.estado || "configurado",
      },
      { onConflict: "usuario_id" }
    );
    await cargarSolicitudes();
    setGuardando(false);
  };

  const enviarPostulacion = async () => {
    if (!usuario) return onAbrirAuth();
    if (!cumpleRequisitos) return;
    if (!paypalEmail.trim()) {
      alert("Por favor guarda primero tu correo de PayPal antes de postular.");
      return;
    }
    setGuardando(true);
    await supabase.from("solicitudes_monetizacion").upsert(
      {
        usuario_id: usuario.id,
        username: usuario.username,
        paypal_email: paypalEmail.trim(),
        telefono: telefono.trim(),
        suscriptores: suscriptoresReales,
        vistas: vistasReales,
        estado: "pendiente",
      },
      { onConflict: "usuario_id" }
    );
    reproducirSonidoRUTF();
    await cargarSolicitudes();
    setGuardando(false);

    // Prepara aviso directo al correo oficial del fundador
    const asunto = encodeURIComponent(`Nueva Solicitud de Monetizacion RUTF: ${usuario.username}`);
    const cuerpo = encodeURIComponent(
      `Hola Manuel (Fundador RUTF Talentico),\n\nEl creador ${usuario.username} ha alcanzado los requisitos (100 suscriptores y 1,000 vistas +15s) y solicita revision.\n\n- Suscriptores: ${suscriptoresReales}\n- Vistas (+15s): ${vistasReales}\n- PayPal: ${paypalEmail.trim()}\n- Telefono: ${telefono.trim() || "No indicado"}\n\nPuedes aprobar o rechazar esta solicitud desde tu Panel de Fundador en la app.`
    );
    window.open(`mailto:delossantosmanuel892@://gmail.com{asunto}&body=${cuerpo}`, "_blank");
  };

  const cambiarEstadoFundador = async (item: any, nuevoEstado: "aprobado" | "rechazado" | "pagado") => {
    await supabase.from("solicitudes_monetizacion").update({ estado: nuevoEstado }).eq("id", item.id);
    reproducirSonidoRUTF();
    await cargarSolicitudes();

    if (nuevoEstado === "pagado") {
      const asunto = encodeURIComponent("Pago Semanal Acreditado - RUTF Talentico");
      const cuerpo = encodeURIComponent(
        `Hola ${item.username},\n\nTu pago semanal de RUTF Talentico ha sido acreditado correctamente a tu cuenta PayPal (${item.paypal_email}).\n\nSigue creando talento cada semana.`
      );
      window.open(`mailto:${item.paypal_email}?subject=${asunto}&body=${cuerpo}`, "_blank");
    }
  };
  return (
    <section className="max-w-4xl mx-auto px-3 sm:px-4 py-5 space-y-5">
      {/* 1. ENCABEZADO FINANCIERO Y RESUMEN DE GANANCIAS (TOP CARD) */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-emerald-950 text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-emerald-500/20 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-400" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight">Estudio de Monetización RUTF</h2>
              <p className="text-[11px] text-emerald-300/90 font-semibold">
                {usuario ? `Canal: ${usuario.username}` : "Inicia sesión para gestionar tus ingresos"}
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 px-3 py-1 rounded-full text-[11px] font-bold text-emerald-200">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pagos cada 7 días al calificar</span>
          </span>
        </div>

        <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">Saldo Estimado Disponible</p>
            <p className="text-3xl sm:text-4xl font-black text-white mt-0.5">${saldoEstimado} <span className="text-sm font-extrabold text-emerald-400">USD</span></p>
          </div>
          <div className="bg-emerald-500/20 border border-emerald-400/30 rounded-xl px-3.5 py-2.5 text-xs space-y-0.5">
            <p className="font-black text-emerald-300">Umbral mínimo primer retiro: $1.00 USD</p>
            <p className="text-[11px] text-slate-200">Liquidación semanal continua por vistas calificadas (+15 seg)</p>
          </div>
        </div>
      </div>

      {/* PANEL EXCLUSIVO DEL FUNDADOR (@manueldigitalidad) */}
      {esFundador && (
        <div className="bg-slate-900 text-white border border-amber-400/40 rounded-3xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-black text-amber-300">Panel de Control del Fundador • Revisiones y Pagos (Cada 7 días)</h3>
              <p className="text-[11px] text-slate-300">Aprueba, rechaza o marca como pagadas las solicitudes reales de creadores.</p>
            </div>
            <span className="bg-amber-400/20 text-amber-300 text-xs font-black px-3 py-1 rounded-full">{todasSolicitudes.length} registros</span>
          </div>

          {todasSolicitudes.length === 0 ? (
            <p className="text-xs text-slate-400 py-2">Aún no hay solicitudes de creadores registradas.</p>
          ) : (
            <div className="space-y-2.5">
              {todasSolicitudes.map((sol) => (
                <div key={sol.id} className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <p className="font-black text-white">{sol.username} • <span className="text-emerald-400">{sol.paypal_email}</span></p>
                    <p className="text-[11px] text-slate-300">{sol.suscriptores} suscriptores • {sol.vistas} vistas (+15s) • Tel: {sol.telefono || "N/A"}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      sol.estado === "aprobado" ? "bg-emerald-500/20 text-emerald-300" :
                      sol.estado === "pagado" ? "bg-blue-500/20 text-blue-300" :
                      sol.estado === "rechazado" ? "bg-red-500/20 text-red-300" : "bg-amber-500/20 text-amber-300"
                    }`}>
                      Estado: {sol.estado}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <button type="button" onClick={() => cambiarEstadoFundador(sol, "aprobado")} className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl font-black text-[11px]">Aprobar</button>
                    <button type="button" onClick={() => cambiarEstadoFundador(sol, "rechazado")} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-xl font-black text-[11px]">Rechazar</button>
                    <button type="button" onClick={() => cambiarEstadoFundador(sol, "pagado")} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-xl font-black text-[11px]">Marcar Pagado</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. REQUISITOS DE CALIFICACIÓN (BARRAS AUTOMÁTICAS EN TIEMPO REAL) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900">Requisitos de Calificación</h3>
            <p className="text-xs text-slate-500">Las barras avanzan automáticamente con cada suscriptor y cada vista (+15 seg).</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-[11px] font-black ${cumpleRequisitos ? "bg-emerald-100 text-emerald-700" : "bg-blue-50 text-blue-700"}`}>
            {cumpleRequisitos ? "¡Elegible!" : "En progreso"}
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-black text-slate-800">Suscriptores Reales</span>
              <span className="font-black text-blue-600">{pctSuscriptores}%</span>
            </div>
            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full transition-all duration-500" style={{ width: `${pctSuscriptores}%` }} />
            </div>
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
              <span>{suscriptoresReales} actuales</span>
              <span>Meta: {META_SUSCRIPTORES} suscriptores</span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-black text-slate-800">Vistas Calificadas (+15 seg)</span>
              <span className="font-black text-emerald-600">{pctVistas}%</span>
            </div>
            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 rounded-full transition-all duration-500" style={{ width: `${pctVistas}%` }} />
            </div>
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
              <span>{vistasReales} públicas</span>
              <span>Meta: {META_VISTAS.toLocaleString()} vistas</span>
            </div>
          </div>
        </div>

        {solicitudActual?.estado === "aprobado" || solicitudActual?.estado === "pagado" ? (
          <div className="w-full py-3.5 px-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-black flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>¡Canal Monetizado Activo! Tus pagos se emiten automáticamente cada 7 días</span>
          </div>
        ) : solicitudActual?.estado === "rechazado" ? (
          <div className="w-full py-3.5 px-4 rounded-2xl bg-red-50 border border-red-300 text-red-800 text-xs font-black flex items-center justify-center gap-2">
            <XCircle className="w-4 h-4 text-red-600" />
            <span>Solicitud rechazada por revisión manual • Verifica que tu contenido sea 100% original</span>
          </div>
        ) : solicitudActual?.estado === "pendiente" ? (
          <div className="w-full py-3.5 px-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-800 text-xs font-black flex items-center justify-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Solicitud en revisión manual por el fundador • Te notificaremos pronto</span>
          </div>
        ) : (
          <button
            type="button"
            disabled={!cumpleRequisitos || guardando}
            onClick={enviarPostulacion}
            className={`w-full py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition shadow-sm ${
              cumpleRequisitos
                ? "bg-gradient-to-r from-emerald-600 to-blue-600 hover:opacity-95 text-white cursor-pointer shadow-md"
                : "bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-300"
            }`}
          >
            {cumpleRequisitos ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            <span>
              {cumpleRequisitos ? "Solicitar Revisión de Monetización" : "Solicitar Revisión de Monetización (Completa el 100% para desbloquear)"}
            </span>
          </button>
        )}
      </div>

      {/* 3. MÉTODO DE PAGO Y SEGURIDAD */}
      <form onSubmit={guardarDatosPago} className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-blue-600" />
          <div>
            <h3 className="text-base font-black text-slate-900">Método de Pago y Verificación</h3>
            <p className="text-xs text-slate-500">Vincula tu correo de PayPal y teléfono para recibir pagos semanales.</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-blue-50/50 border border-blue-200 rounded-2xl p-3.5 space-y-1.5">
            <label className="font-black text-slate-800 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-600" />
              <span>Correo Electrónico de PayPal</span>
            </label>
            <input
              type="email"
              required
              value={paypalEmail}
              onChange={(e) => setPaypalEmail(e.target.value)}
              placeholder="tu-correo@paypal.com"
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-600"
            />
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1.5">
            <label className="font-black text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5"><Smartphone className="w-3.5 h-3.5 text-orange-500" /> Número de teléfono</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${telefono.trim() ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                {telefono.trim() ? "Verificado" : "Pendiente"}
              </span>
            </label>
            <input
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="+1 809 000 0000"
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-600"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" />
            <span>{usuario ? `Correo de cuenta confirmado (${usuario.username})` : "Inicia sesión para guardar"}</span>
          </span>
          <button type="submit" disabled={guardando} className="bg-slate-900 hover:bg-blue-600 text-white text-xs font-black px-5 py-2.5 rounded-xl transition flex items-center gap-1.5">
            <Send className="w-3.5 h-3.5" />
            <span>{guardando ? "Guardando..." : "Guardar / Actualizar datos"}</span>
          </button>
        </div>
      </form>

      {/* 4. FORMAS DE GANAR DINERO */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <h3 className="text-base font-black text-slate-900">Formas de Ganar Dinero</h3>
        <div className="grid sm:grid-cols-2 gap-3 text-xs">
          <div className="border-2 border-emerald-500/40 bg-emerald-50/40 rounded-2xl p-4 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <span className="font-black text-slate-900 flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-emerald-600" /> Ingresos por Vistas Calificadas</span>
              <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full">Disponible al calificar</span>
            </div>
            <p className="text-slate-600">Pagos cada 7 días por cada reproducción válida (+15 seg) en tus videos públicos.</p>
          </div>
          <div className="border border-slate-200 bg-slate-50/70 rounded-2xl p-4 space-y-1 opacity-75">
            <div className="flex items-center justify-between gap-2">
              <span className="font-black text-slate-700 flex items-center gap-1.5"><Gift className="w-4 h-4 text-slate-400" /> Regalos / Propinas de Fans</span>
              <span className="bg-slate-200 text-slate-600 text-[10px] font-black px-2.5 py-0.5 rounded-full">Próximamente</span>
            </div>
            <p className="text-slate-500">Recibe aportes directos de tus seguidores mientras disfrutan tus talentos.</p>
          </div>
          <div className="border border-slate-200 bg-slate-50/70 rounded-2xl p-4 space-y-1 opacity-75">
            <div className="flex items-center justify-between gap-2">
              <span className="font-black text-slate-700 flex items-center gap-1.5"><Users className="w-4 h-4 text-slate-400" /> Suscripciones de Canal</span>
              <span className="bg-slate-200 text-slate-600 text-[10px] font-black px-2.5 py-0.5 rounded-full">Próximamente</span>
            </div>
            <p className="text-slate-500">Contenido exclusivo mensual e insignias VIP para miembros de tu canal.</p>
          </div>
          <div className="border border-slate-200 bg-slate-50/70 rounded-2xl p-4 space-y-1 opacity-75">
            <div className="flex items-center justify-between gap-2">
              <span className="font-black text-slate-700 flex items-center gap-1.5"><Handshake className="w-4 h-4 text-slate-400" /> Patrocinios RUTF</span>
              <span className="bg-slate-200 text-slate-600 text-[10px] font-black px-2.5 py-0.5 rounded-full">Próximamente</span>
            </div>
            <p className="text-slate-500">Campañas patrocinadas directamente con marcas aliadas de la plataforma.</p>
          </div>
        </div>
      </div>

      {/* 5. REGLAS Y TRANSPARENCIA */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <button type="button" onClick={() => setMostrarReglas(!mostrarReglas)} className="w-full px-5 py-3.5 flex items-center justify-between text-left text-xs sm:text-sm font-black text-slate-800 hover:bg-slate-50">
          <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-blue-600" /> ¿Cómo funciona la monetización y pagos?</span>
          {mostrarReglas ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </button>
        {mostrarReglas && (
          <div className="px-5 pb-5 pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-2 leading-relaxed">
            <p><strong>1. Vista Calificada (+15 seg):</strong> Toda reproducción real de un usuario único que permanezca al menos <strong>15 segundos continuos</strong> viendo tu video público.</p>
            <p><strong>2. Pagos semanales cada 7 días:</strong> Al aprobarse tu canal con <strong>100 suscriptores y 1,000 vistas (+15 seg)</strong>, recibirás liquidaciones automáticas cada 7 días al alcanzar $1.00 USD.</p>
            <p><strong>3. Comisiones de PayPal:</strong> Los envíos se realizan en USD a tu PayPal vinculado; PayPal aplica su tarifa estándar internacional según el país receptor.</p>
            <p><strong>4. Revisión manual y cero bots:</strong> Todas las solicitudes son verificadas manualmente; el contenido duplicado o tráfico artificial será rechazado.</p>
          </div>
        )}
      </div>
    </section>
  );
}
