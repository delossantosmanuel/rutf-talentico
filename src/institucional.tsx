"use client";

import { useState } from "react";
import { Shield, FileText, Trash2, HeartHandshake, Sparkles, X } from "lucide-react";

export function BarraInstitucional({
  usuario,
  onAbrirAuth,
}: {
  usuario: any;
  onAbrirAuth: () => void;
}) {
  const [modalAbierto, setModalAbierto] = useState<"fundacion" | "pro" | null>(null);

  return (
    <>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 pt-2 flex items-center justify-end gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => setModalAbierto("fundacion")}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-[11px] font-extrabold transition"
        >
          <HeartHandshake className="w-3.5 h-3.5 text-amber-600" />
          <span>Fundación</span>
        </button>

        <button
          type="button"
          onClick={() => setModalAbierto("pro")}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 text-[11px] font-extrabold transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>RUTF Pro</span>
        </button>
      </div>

      {modalAbierto && (
        <div
          onClick={() => setModalAbierto(null)}
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">
                {modalAbierto === "fundacion"
                  ? "Fundación RUTF Talentico"
                  : "Programa RUTF Pro"}
              </h3>
              <button
                type="button"
                onClick={() => setModalAbierto(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {modalAbierto === "fundacion" ? (
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Apoyamos a nuevos talentos independientes brindándoles visibilidad gratuita,
                herramientas de difusión y oportunidades reales de crecimiento creativo sin
                barreras económicas.
              </p>
            ) : (
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Los creadores verificados con contenido 100 % original acceden a posicionamiento
                destacado y participación en ingresos publicitarios al completar los requisitos
                del programa.
              </p>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              {!usuario && (
                <button
                  type="button"
                  onClick={() => {
                    setModalAbierto(null);
                    onAbrirAuth();
                  }}
                  className="px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-black"
                >
                  Crear Canal Gratis
                </button>
              )}
              <button
                type="button"
                onClick={() => setModalAbierto(null)}
                className="px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-black"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function PieLegal({
  usuario,
  supabase,
  onCuentaEliminada,
}: {
  usuario: any;
  supabase: any;
  onCuentaEliminada: () => void;
}) {
  const [docActivo, setDocActivo] = useState<"privacidad" | "terminos" | null>(null);
  const [eliminando, setEliminando] = useState(false);

  const eliminarCuenta = async () => {
    if (!usuario) {
      alert("Inicia sesión en la cuenta que deseas eliminar.");
      return;
    }
    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar permanentemente tu cuenta ${usuario.username} y todos tus datos? Esta acción no se puede deshacer.`
    );
    if (!confirmar) return;

    setEliminando(true);
    try {
      await supabase.from("suscripciones_usuarios").delete().eq("usuario_id", usuario.id);
      await supabase.from("videos").delete().eq("creador", usuario.username);
      await supabase.from("usuarios_rutf").delete().eq("id", usuario.id);
      localStorage.removeItem("rutf_sesion");
      onCuentaEliminada();
    } finally {
      setEliminando(false);
    }
  };

  return (
    <>
      <footer className="max-w-7xl mx-auto px-4 py-8 mt-8 border-t border-slate-200 text-center space-y-2.5">
        <p className="text-xs font-extrabold text-slate-600">
          RUTF Talentico © 2026 • Plataforma Global de Talento Original
        </p>

        <div className="flex items-center justify-center gap-3 flex-wrap text-xs font-bold">
          <button
            type="button"
            onClick={() => setDocActivo("privacidad")}
            className="text-blue-600 hover:underline inline-flex items-center gap-1"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Política de Privacidad</span>
          </button>

          <span className="text-slate-300">•</span>

          <button
            type="button"
            onClick={() => setDocActivo("terminos")}
            className="text-blue-600 hover:underline inline-flex items-center gap-1"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Términos de Uso</span>
          </button>

          <span className="text-slate-300">•</span>

          <button
            type="button"
            onClick={eliminarCuenta}
            disabled={eliminando}
            className="text-red-600 hover:underline inline-flex items-center gap-1 disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{eliminando ? "Eliminando..." : "Eliminar Cuenta"}</span>
          </button>
        </div>
      </footer>

      {docActivo && (
        <div
          onClick={() => setDocActivo(null)}
          className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[85vh] bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                {docActivo === "privacidad"
                  ? "Política de Privacidad • RUTF Talentico"
                  : "Términos y Condiciones de Uso • RUTF Talentico"}
              </h3>
              <button
                type="button"
                onClick={() => setDocActivo(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed text-left">
              {docActivo === "privacidad" ? (
                <>
                  <p>
                    <strong>1. Datos recopilados y finalidad:</strong> RUTF Talentico recopila
                    únicamente los datos esenciales para crear y gestionar tu canal de creador
                    (nombre de usuario, correo electrónico, foto de perfil, banner y videos
                    publicados voluntariamente).
                  </p>
                  <p>
                    <strong>2. Publicidad y servicios de terceros (Google AdMob):</strong> Esta
                    aplicación utiliza Google AdMob para mostrar anuncios que permiten mantener la
                    plataforma gratuita. Google puede emplear identificadores publicitarios del
                    dispositivo conforme a sus políticas de privacidad y consentimiento.
                  </p>
                  <p>
                    <strong>3. Protección y no comercialización de datos:</strong> Nunca vendemos,
                    alquilamos ni cedemos tu información personal a terceros con fines comerciales.
                    Toda la transmisión se realiza mediante conexiones cifradas HTTPS.
                  </p>
                  <p>
                    <strong>4. Seguridad infantil y contenido apto:</strong> RUTF Talentico prohíbe
                    estrictamente cualquier contenido que vulnere la seguridad de menores, incitación
                    al odio, violencia gráfica o material sexual explícito.
                  </p>
                  <p>
                    <strong>5. Control total y eliminación de cuenta:</strong> Puedes editar tu
                    perfil o solicitar la eliminación definitiva e inmediata de tu cuenta y todos
                    tus archivos en cualquier momento desde la opción <em>Eliminar Cuenta</em>.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong>1. Aceptación del servicio:</strong> Al registrarte o utilizar RUTF
                    Talentico aceptas cumplir estas normas comunitarias y condiciones de uso.
                  </p>
                  <p>
                    <strong>2. Propiedad intelectual y contenido original:</strong> Solo puedes
                    subir videos de tu propia autoría o sobre los cuales poseas derechos legítimos
                    de difusión. Queda prohibida la resubida de material protegido sin autorización.
                  </p>
                  <p>
                    <strong>3. Programa de Monetización y métricas auténticas:</strong> La
                    elegibilidad requiere alcanzar los umbrales de suscriptores reales y
                    visualizaciones calificadas mínimas de 15 segundos continuos. Cualquier intento
                    de manipulación artificial, bots o tráfico inválido conlleva la descalificación
                    inmediata.
                  </p>
                  <p>
                    <strong>4. Moderación y cumplimiento:</strong> RUTF Talentico se reserva el
                    derecho de retirar publicaciones o suspender cuentas que infrinjan las políticas
                    de seguridad, derechos de autor o estándares de anunciantes.
                  </p>
                </>
              )}
            </div>

            <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => setDocActivo(null)}
                className="px-6 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
