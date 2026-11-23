"use client";
import React, { useState } from "react";
import { ShieldCheck, Sparkles, HeartHandshake, ExternalLink, CheckCircle2, ArrowLeft } from "lucide-react";

type SeccionInstitucional = "fundacion" | "pro" | "legal" | null;

export function BarraInstitucional({
  usuario,
  onAbrirAuth,
}: {
  usuario: { id: string; username: string; email?: string } | null;
  onAbrirAuth: () => void;
}) {
  const [seccionActiva, setSeccionActiva] = useState<SeccionInstitucional>(null);
  const [planSeleccionado, setPlanSeleccionado] = useState<"mensual" | "anual">("mensual");
  const [solicitudEnviada, setSolicitudEnviada] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 pt-3">
      {/* 3 Botones Horizontales Cortos y Profesionales */}
      <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2">
        <button
          type="button"
          onClick={() => setSeccionActiva(seccionActiva === "fundacion" ? null : "fundacion")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black border transition shadow-sm ${
            seccionActiva === "fundacion"
              ? "bg-orange-500 text-white border-orange-600"
              : "bg-white text-slate-700 border-slate-200 hover:border-orange-400 hover:text-orange-600"
          }`}
        >
          <HeartHandshake className="w-3.5 h-3.5 text-orange-500" />
          <span>Fundación</span>
        </button>

        <button
          type="button"
          onClick={() => setSeccionActiva(seccionActiva === "pro" ? null : "pro")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black border transition shadow-sm ${
            seccionActiva === "pro"
              ? "bg-gradient-to-r from-blue-600 to-orange-500 text-white border-transparent"
              : "bg-white text-slate-800 border-blue-200 hover:border-blue-500"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>RUTF Pro</span>
        </button>

        <button
          type="button"
          onClick={() => setSeccionActiva(seccionActiva === "legal" ? null : "legal")}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black border transition shadow-sm ${
            seccionActiva === "legal"
              ? "bg-slate-900 text-white border-slate-900"
              : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Legal &amp; Términos</span>
        </button>
      </div>

      {/* Panel Desplegable Funcional */}
      {seccionActiva && (
        <div className="mt-3 bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              {seccionActiva === "fundacion" && "Fundación RUTF Talentico • Impulso Social y Cultural"}
              {seccionActiva === "pro" && "RUTF Talentico Pro • Membresía Oficial de Creadores"}
              {seccionActiva === "legal" && "Términos, Condiciones y Política de Privacidad del Fundador"}
            </h2>
            <button
              type="button"
              onClick={() => setSeccionActiva(null)}
              className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900 px-3 py-1 rounded-full bg-slate-100"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Cerrar</span>
            </button>
          </div>

          {seccionActiva === "fundacion" && (
            <div className="grid md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <div className="bg-orange-50/70 border border-orange-200 rounded-2xl p-4 space-y-2">
                <p className="font-black text-orange-700">Nuestra Misión como Fundación</p>
                <p>
                  La <strong>Fundación RUTF Talentico</strong> nace en República Dominicana para descubrir, formar y respaldar a jóvenes creadores, músicos, deportistas y emprendedores digitales sin barreras económicas.
                </p>
                <p>
                  Destinamos parte del crecimiento de la plataforma a becas de equipamiento audiovisual, talleres de producción digital y programas comunitarios.
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <p className="font-black text-slate-800">Alianzas y Apoyo Institucional</p>
                  <p>¿Deseas colaborar como patrocinador, mentor o institución aliada de la Fundación RUTF Talentico?</p>
                </div>
                <a
                  href="mailto:delossantosmanuel892@://gmail.com"
                  className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs px-4 py-2.5 rounded-xl transition"
                >
                  <span>Contactar a la Fundación</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {seccionActiva === "pro" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-blue-600 to-orange-500 text-white rounded-2xl p-4">
                <div>
                  <p className="text-sm sm:text-base font-black">Lleva tu canal al siguiente nivel con RUTF Pro</p>
                  <p className="text-xs text-white/90">Insignia verificada, mayor alcance en recomendaciones y experiencia sin anuncios.</p>
                </div>
                <div className="flex bg-black/20 p-1 rounded-xl text-xs font-black">
                  <button
                    type="button"
                    onClick={() => setPlanSeleccionado("mensual")}
                    className={`px-3 py-1 rounded-lg transition ${planSeleccionado === "mensual" ? "bg-white text-slate-900" : "text-white"}`}
                  >
                    Mensual ($4.99)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlanSeleccionado("anual")}
                    className={`px-3 py-1 rounded-lg transition ${planSeleccionado === "anual" ? "bg-white text-slate-900" : "text-white"}`}
                  >
                    Anual ($49.99)
                  </button>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3 text-xs">
                <div className="border border-slate-200 rounded-2xl p-3.5 space-y-1">
                  <div className="flex items-center gap-1.5 font-black text-blue-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Distintivo Oficial Pro</span>
                  </div>
                  <p className="text-slate-600">Insignia destacada en tu canal, videos largos, verticales y comentarios.</p>
                </div>
                <div className="border border-slate-200 rounded-2xl p-3.5 space-y-1">
                  <div className="flex items-center gap-1.5 font-black text-orange-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Impulso de Algoritmo</span>
                  </div>
                  <p className="text-slate-600">Prioridad de descubrimiento en la pestaña Para Ti y Talentos Verticales.</p>
                </div>
                <div className="border border-slate-200 rounded-2xl p-3.5 space-y-1">
                  <div className="flex items-center gap-1.5 font-black text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Navegación Sin Cortes</span>
                  </div>
                  <p className="text-slate-600">Disfruta de toda la plataforma libre de anuncios publicitarios.</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <span className="text-xs text-slate-500">
                  {usuario ? `Cuenta vinculada: ${usuario.username}` : "Inicia sesión para vincular la membresía a tu canal."}
                </span>
                {solicitudEnviada ? (
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-4 py-2 rounded-xl">
                    ✓ Solicitud RUTF Pro ({planSeleccionado === "mensual" ? "$4.99/mes" : "$49.99/año"}) registrada para {usuario?.username}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (!usuario) return onAbrirAuth();
                      setSolicitudEnviada(true);
                    }}
                    className="bg-slate-900 hover:bg-blue-600 text-white text-xs font-black px-5 py-2.5 rounded-xl transition shadow"
                  >
                    {usuario ? `Activar RUTF Pro (${planSeleccionado === "mensual" ? "$4.99/mes" : "$49.99/año"})` : "Iniciar sesión para adquirir Pro"}
                  </button>
                )}
              </div>
            </div>
          )}

          {seccionActiva === "legal" && (
            <div className="space-y-3 text-xs text-slate-600 leading-relaxed max-h-72 overflow-y-auto pr-1">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1">
                <p className="font-black text-slate-900">1. Propiedad Intelectual y Dirección de la Plataforma</p>
                <p>
                  <strong>RUTF Talentico</strong> es una plataforma digital fundada y dirigida por <strong>Manuel De Los Santos</strong>. La marca, diseño, arquitectura tecnológica y algoritmos son propiedad exclusiva de su fundador.
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1">
                <p className="font-black text-slate-900">2. Derechos y Responsabilidad de los Creadores</p>
                <p>
                  Cada creador conserva la titularidad de sus obras audiovisuales y garantiza poseer los derechos de imagen, audio y música publicados. Queda estrictamente prohibido el contenido violento, explícito, fraudulento o que vulnere derechos de terceros.
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1">
                <p className="font-black text-slate-900">3. Monetización, Publicidad y Pagos</p>
                <p>
                  Los ingresos generados mediante Google AdMob y suscripciones RUTF Pro se distribuyen conforme a los requisitos vigentes de vistas calificadas, cumplimiento de políticas publicitarias y verificación de identidad del creador.
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1">
                <p className="font-black text-slate-900">4. Privacidad y Control Total de Datos (Google Play Policy)</p>
                <p>
                  Solo recopilamos los datos esenciales para operar tu canal (nombre de usuario, correo electrónico y contenido publicado). Nunca vendemos datos personales a terceros y puedes eliminar permanentemente tu cuenta y todos tus datos desde el botón &ldquo;Eliminar Cuenta&rdquo; en el pie de página.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
