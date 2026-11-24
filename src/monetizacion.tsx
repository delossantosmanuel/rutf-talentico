"use client";
import React, { useState, useEffect } from "react";
import {
  Lock, Unlock, CheckCircle2, Clock, ShieldCheck,
  Sparkles, Gift, Users, Handshake, ChevronDown, ChevronUp,
  CreditCard, Smartphone, Mail, XCircle, Send
} from "lucide-react";
import { reproducirSonidoRUTF } from "./notificaciones";

function AnilloProgreso({
  porcentaje,
  actual,
  meta,
  titulo,
  colorHex,
}: {
  porcentaje: number;
  actual: string;
  meta: string;
  titulo: string;
  colorHex: string;
}) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-black text-slate-900">{titulo}</p>
        <span
          className="text-xs font-black px-2 py-0.5 rounded-full text-white"
          style={{ backgroundColor: colorHex }}
        >
          {porcentaje}%
        </span>
      </div>

      <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${porcentaje}%`, backgroundColor: colorHex }}
        />
      </div>

      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
        <span className="text-slate-700">{actual}</span>
        <span>{meta}</span>
      </div>
    </div>
  );
}


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
  const [codigoPais, setCodigoPais] = useState("+1");
  const [telefono, setTelefono] = useState("");
  const [solicitudActual, setSolicitudActual] = useState<any>(null);
  const [todasSolicitudes, setTodasSolicitudes] = useState<any[]>([]);
  const [guardando, setGuardando] = useState(false);
  const [faqAbierta, setFaqAbierta] = useState<number | null>(0);
  const [toquesFundador, setToquesFundador] = useState(0);
  const [adminVisible, setAdminVisible] = useState(false);

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
    const telCompleto = telefono.trim()
      ? (telefono.trim().startsWith("+") ? telefono.trim() : `${codigoPais} ${telefono.trim()}`)
      : "";
    await supabase.from("solicitudes_monetizacion").upsert(
      {
        usuario_id: usuario.id,
        username: usuario.username,
        paypal_email: paypalEmail.trim(),
        telefono: telCompleto,
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
      alert("Por favor guarda primero tu correo de PayPal en la sección de Método de Pago.");
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
  };

  const cambiarEstadoFundador = async (item: any, nuevoEstado: "aprobado" | "rechazado" | "pagado") => {
    await supabase.from("solicitudes_monetizacion").update({ estado: nuevoEstado }).eq("id", item.id);
    reproducirSonidoRUTF();
    await cargarSolicitudes();

    if (nuevoEstado === "pagado") {
      const asunto = encodeURIComponent("Pago Acreditado - RUTF Talentico");
      const cuerpo = encodeURIComponent(
        `Hola ${item.username},\n\nTu retiro de RUTF Talentico ha sido acreditado correctamente a tu cuenta PayPal (${item.paypal_email}).\n\nGracias por crear talento en RUTF Talentico.`
      );
      window.open(`mailto:${item.paypal_email}?subject=${asunto}&body=${cuerpo}`, "_blank");
    }
  };

  const preguntasFrecuentes = [
    {
      pregunta: "¿Cómo funciona la monetización y los pagos?",
      respuesta:
        "Una vez que tu canal alcanza 100 suscriptores reales y 1,000 vistas calificadas (+15 segundos continuos) y es aprobado, comienzas a generar ingresos por tus reproducciones válidas. Al acumular el umbral mínimo de $10.00 USD, puedes recibir tu retiro en PayPal en ciclos semanales de 7 días.",
    },
    {
      pregunta: "¿Qué tiempo toma en aceptarse mi solicitud de canal?",
      respuesta:
        "Cada solicitud pasa por una revisión manual de calidad y originalidad que toma entre 24 y 72 horas hábiles. Verás el cambio de estado directamente en este panel.",
    },
    {
      pregunta: "¿Qué tiempo duran los pagos en procesarse?",
      respuesta:
        "Una vez emitido el pago semanal tras alcanzar el mínimo de $10.00 USD, la transferencia a tu correo de PayPal suele acreditarse en un plazo de 24 a 48 horas. Ten en cuenta que PayPal aplica su comisión estándar por recepción internacional según tu país.",
    },
    {
      pregunta: "¿Cómo veo mis ingresos y vistas calificadas?",
      respuesta:
        "En la parte superior de este panel visualizas en tiempo real tu progreso hacia las metas, tus vistas calificadas (+15 seg) y tu saldo estimado disponible una vez aprobado tu canal.",
    },
    {
      pregunta: "¿Qué contenido no califica para monetizar?",
      respuesta:
        "Videos resubidos de terceros sin derechos, contenido duplicado o reproducciones generadas mediante bots o intercambio artificial no suman y conllevan el rechazo de la solicitud.",
    },
  ];
  return (
    <section className="max-w-4xl mx-auto px-3 sm:px-4 py-5 space-y-5">
      {/* 1. ENCABEZADO EDITORIAL LIMPIO (Toque secreto x5 para el Fundador) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
                    <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Monetización
            </h2>
            {esFundador && (
              <button
                type="button"
                onClick={() => setAdminVisible(!adminVisible)}
                className="inline-flex items-center gap-1 bg-slate-900 text-amber-300 text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm"
              >
                <ShieldCheck className="w-3 h-3" />
                <span>Control Fundador ({todasSolicitudes.length})</span>
              </button>
            )}
          </div>

       
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Convierte tu talento y constancia en ingresos reales en RUTF Talentico.
          </p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-2.5 text-left sm:text-right shrink-0">
          <p className="text-[10px] font-black uppercase tracking-wider text-emerald-700">Saldo Estimado</p>
          <p className="text-xl font-black text-slate-900">${saldoEstimado} <span className="text-xs text-emerald-600">USD</span></p>
          <p className="text-[10px] text-slate-500">Retiro mínimo: $10.00 USD • PayPal</p>
        </div>
      </div>

      {/* PANEL PRIVADO DEL FUNDADOR (Oculto por defecto, solo visible al tocar 5 veces "Monetización" con @manueldigitalidad) */}
      {esFundador && adminVisible && (
        <div className="bg-slate-900 text-white border border-slate-700 rounded-3xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-black text-emerald-400">Gestión Privada de Solicitudes ({todasSolicitudes.length})</p>
            <button type="button" onClick={() => setAdminVisible(false)} className="text-[11px] text-slate-400 hover:text-white">Ocultar</button>
          </div>
          {todasSolicitudes.length === 0 ? (
            <p className="text-xs text-slate-400">No hay solicitudes registradas aún.</p>
          ) : (
            <div className="space-y-2">
              {todasSolicitudes.map((sol) => (
                <div key={sol.id} className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <p className="font-black text-white">{sol.username} • <span className="text-emerald-400">{sol.paypal_email}</span></p>
                    <p className="text-[11px] text-slate-300">{sol.suscriptores} subs • {sol.vistas} vistas (+15s) • Tel: {sol.telefono || "N/A"} • Estado: <strong>{sol.estado}</strong></p>
                  </div>
                  <div className="flex gap-1.5">
                    <button type="button" onClick={() => cambiarEstadoFundador(sol, "aprobado")} className="bg-emerald-600 text-white px-2.5 py-1 rounded-lg font-black text-[11px]">Aprobar</button>
                    <button type="button" onClick={() => cambiarEstadoFundador(sol, "rechazado")} className="bg-red-600 text-white px-2.5 py-1 rounded-lg font-black text-[11px]">Rechazar</button>
                    <button type="button" onClick={() => cambiarEstadoFundador(sol, "pagado")} className="bg-blue-600 text-white px-2.5 py-1 rounded-lg font-black text-[11px]">Pagado</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. REQUISITOS DE CALIFICACIÓN CON ANILLOS CIRCULARES (ORILLAS DE UN CERO) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900">Requisitos de Calificación</h3>
            <p className="text-xs text-slate-500">Los círculos avanzan automáticamente con cada suscriptor y vista (+15 seg).</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-[11px] font-black ${cumpleRequisitos ? "bg-emerald-100 text-emerald-700" : "bg-blue-50 text-blue-700"}`}>
            {cumpleRequisitos ? "¡Listo para revisar!" : "En progreso"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <AnilloProgreso
            porcentaje={pctSuscriptores}
            actual={`${suscriptoresReales} actuales`}
            meta={`Meta: ${META_SUSCRIPTORES} suscriptores`}
            titulo="Suscriptores Reales"
            colorHex="#2563eb"
          />
          <AnilloProgreso
            porcentaje={pctVistas}
            actual={`${vistasReales} públicas`}
            meta={`Meta: ${META_VISTAS.toLocaleString()} vistas (+15s)`}
            titulo="Vistas Calificadas"
            colorHex="#059669"
          />
        </div>

                 {solicitudActual?.estado === "aprobado" || solicitudActual?.estado === "pagado" ? (
          <div className="w-full py-3.5 px-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-black flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Canal Monetizado Activo • Retiros a PayPal desde $10.00 USD cada 7 días</span>
          </div>
        ) : solicitudActual?.estado === "rechazado" ? (
          <div className="w-full py-3.5 px-4 rounded-2xl bg-red-50 border border-red-300 text-red-800 text-xs font-black flex items-center justify-center gap-2">
            <XCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>Solicitud rechazada • Asegúrate de publicar contenido 100% original</span>
          </div>
        ) : solicitudActual?.estado === "pendiente" ? (
          <div className="w-full py-3.5 px-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-800 text-xs font-black flex items-center justify-center gap-2">
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Solicitud enviada • En revisión de calidad (24 a 72 horas)</span>
          </div>
        ) : cumpleRequisitos ? (
          <button
            type="button"
            disabled={guardando}
            onClick={enviarPostulacion}
            className="w-full py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white shadow-md cursor-pointer"
          >
            <Unlock className="w-4 h-4 shrink-0" />
            <span>{guardando ? "Enviando solicitud..." : "Solicitar Revisión de Monetización"}</span>
          </button>
        ) : (
          <div className="w-full py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 bg-slate-100 text-slate-600 border border-slate-200">
            <Lock className="w-4 h-4 text-slate-500 shrink-0" />
            <span>Solicitar Revisión de Monetización (Completa el 100%)</span>
          </div>
        )}



      </div>

      {/* 3. FORMAS DE GANAR DINERO (CUADRÍCULA 2x2 COMPACTA) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-3.5">
        <h3 className="text-base font-black text-slate-900">Formas de Ganar Dinero</h3>
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 text-xs">
                    <div className="border border-emerald-300 bg-emerald-50 rounded-2xl p-3.5 space-y-1.5">
            <span className="inline-block bg-emerald-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full">Disponible al calificar</span>
            <p className="font-black text-slate-900 flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Vistas Calificadas</p>
            <p className="text-[11px] text-slate-600 leading-snug">Ingresos semanales por vistas (+15 seg) en tus videos públicos.</p>
          </div>

          <div className="border border-slate-200 bg-slate-50 rounded-2xl p-3.5 space-y-1.5">
            <span className="inline-block bg-slate-200 text-slate-600 text-[9px] font-black px-2 py-0.5 rounded-full">Próximamente</span>
            <p className="font-black text-slate-700 flex items-center gap-1"><Gift className="w-3.5 h-3.5 text-slate-400 shrink-0" /> Propinas de Fans</p>
            <p className="text-[11px] text-slate-500 leading-snug">Aportes directos de tus seguidores mientras ven tus talentos.</p>
          </div>

          <div className="border border-slate-200 bg-slate-50 rounded-2xl p-3.5 space-y-1.5">
            <span className="inline-block bg-slate-200 text-slate-600 text-[9px] font-black px-2 py-0.5 rounded-full">Próximamente</span>
            <p className="font-black text-slate-700 flex items-center gap-1"><Users className="w-3.5 h-3.5 text-slate-400 shrink-0" /> Suscripciones VIP</p>
            <p className="text-[11px] text-slate-500 leading-snug">Contenido exclusivo mensual para miembros de tu canal.</p>
          </div>

          <div className="border border-slate-200 bg-slate-50 rounded-2xl p-3.5 space-y-1.5">
            <span className="inline-block bg-slate-200 text-slate-600 text-[9px] font-black px-2 py-0.5 rounded-full">Próximamente</span>
            <p className="font-black text-slate-700 flex items-center gap-1"><Handshake className="w-3.5 h-3.5 text-slate-400 shrink-0" /> Patrocinios RUTF</p>
            <p className="text-[11px] text-slate-500 leading-snug">Campañas directas con marcas aliadas de la plataforma.</p>
          </div>

        </div>
      </div>

      {/* 4. MÉTODO DE PAGO Y VERIFICACIÓN (PAYPAL + TELÉFONO INTERNACIONAL) */}
      <form onSubmit={guardarDatosPago} className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-blue-600" />
          <div>
            <h3 className="text-base font-black text-slate-900">Método de Pago y Verificación</h3>
            <p className="text-xs text-slate-500">Vincula tu correo de PayPal (retiro mínimo $10.00 USD) y teléfono.</p>
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
              <span className="flex items-center gap-1.5"><Smartphone className="w-3.5 h-3.5 text-orange-500" /> Teléfono (Cualquier país)</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${telefono.trim() ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                {telefono.trim() ? "Verificado" : "Pendiente"}
              </span>
            </label>
            <div className="flex gap-1.5">
              <select
                value={codigoPais}
                onChange={(e) => setCodigoPais(e.target.value)}
                className="bg-white border border-slate-300 rounded-xl px-2 py-2 text-xs font-bold text-slate-800 outline-none"
              >
                <option value="+1">+1 RD/US</option>
                <option value="+52">+52 MX</option>
                <option value="+57">+57 CO</option>
                <option value="+34">+34 ES</option>
                <option value="+54">+54 AR</option>
                <option value="+51">+51 PE</option>
                <option value="+56">+56 CL</option>
                <option value="+58">+58 VE</option>
                <option value="+593">+593 EC</option>
                <option value="+502">+502 GT</option>
                <option value="+">Otro (+)</option>
              </select>
              <input
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="809 000 0000"
                className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-600"
              />
            </div>
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

      {/* 5. PREGUNTAS FRECUENTES Y TRANSPARENCIA */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-2.5">
        <h3 className="text-base font-black text-slate-900 mb-2">Preguntas Frecuentes sobre Pagos y Monetización</h3>
        {preguntasFrecuentes.map((item, idx) => (
          <div key={idx} className="border border-slate-200/80 rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => setFaqAbierta(faqAbierta === idx ? null : idx)}
              className="w-full px-4 py-3 flex items-center justify-between text-left text-xs font-black text-slate-800 hover:bg-slate-50"
            >
              <span>{item.pregunta}</span>
              {faqAbierta === idx ? <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />}
            </button>
            {faqAbierta === idx && (
              <div className="px-4 pb-3.5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/40">
                {item.respuesta}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
