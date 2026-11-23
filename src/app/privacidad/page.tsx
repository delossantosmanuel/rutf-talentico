import Link from "next/link";

export default function PrivacidadPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Política de Privacidad y Términos de Uso</h1>
            <p className="text-xs font-bold text-blue-600 mt-1">RUTF Talentico • Plataforma Oficial • Fundada en 2026</p>
          </div>
          <Link href="/" className="bg-slate-900 text-white text-xs font-black px-4 py-2 rounded-full hover:bg-blue-600 transition">
            Volver a la App
          </Link>
        </div>

        <section className="space-y-2 text-sm leading-relaxed text-slate-600">
          <h2 className="text-base font-black text-slate-900">1. Identidad del Fundador y Contacto Oficial</h2>
          <p>
            <strong>RUTF Talentico</strong> es una plataforma digital de descubrimiento de talentos y contenido audiovisual fundada y administrada por <strong>Manuel De Los Santos</strong> desde República Dominicana. Para soporte, consultas legales o derechos de privacidad, puedes escribir directamente a <strong>delossantosmanuel892@gmail.com</strong>.
          </p>
        </section>

        <section className="space-y-2 text-sm leading-relaxed text-slate-600">
          <h2 className="text-base font-black text-slate-900">2. Datos que Recopilamos y Edad Mínima</h2>
          <p>
            El uso de RUTF Talentico está dirigido a personas mayores de <strong>13 años</strong>. Para crear y administrar tu canal recopilamos únicamente tu nombre de usuario, correo electrónico, inicial o foto de perfil y los videos, comentarios o interacciones que decidas publicar voluntariamente.
          </p>
        </section>

        <section className="space-y-2 text-sm leading-relaxed text-slate-600">
          <h2 className="text-base font-black text-slate-900">3. Publicidad (Google AdMob) y Servicios Técnicos</h2>
          <p>
            Utilizamos servicios seguros de almacenamiento en la nube (Supabase) y <strong>Google AdMob</strong> para mostrar anuncios que permiten mantener la plataforma gratuita y financiar el programa de monetización para creadores. No vendemos ni alquilamos tus datos personales a terceros.
          </p>
        </section>

        <section className="space-y-2 text-sm leading-relaxed text-slate-600">
          <h2 className="text-base font-black text-slate-900">4. Términos de Contenido, Moderación y Propiedad Intelectual</h2>
          <p>
            Al publicar videos en RUTF Talentico declaras ser titular o contar con autorización sobre el material audiovisual. Está estrictamente prohibido el contenido violento, explícito, fraudulento, de explotación o que infrinja derechos de autor; cualquier publicación que incumpla estas normas será eliminada.
          </p>
        </section>

        <section className="space-y-2 text-sm leading-relaxed text-slate-600">
          <h2 className="text-base font-black text-slate-900">5. Eliminación de Cuenta y Derechos del Usuario</h2>
          <p>
            Puedes eliminar permanentemente tu cuenta y todos tus datos asociados en cualquier momento desde el botón <strong>&ldquo;Eliminar Cuenta&rdquo;</strong> ubicado al pie de la aplicación principal o enviando una solicitud a <strong>delossantosmanuel892@gmail.com</strong>.
          </p>
        </section>
      </div>
    </main>
  );
}
