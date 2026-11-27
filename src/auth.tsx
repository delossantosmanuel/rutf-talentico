"use client";
import React, { useState } from "react";
import { UserCheck, Lock, Mail, AtSign, ShieldCheck, X } from "lucide-react";
import { Capacitor } from "@capacitor/core";
import { Browser } from "@capacitor/browser";

export type UsuarioRUTF = {
  id: string;
  username: string;
  email: string;
  es_fundador: boolean;
};

type Props = {
  supabase: any;
 onLogin: (u: UsuarioRUTF, esNuevo?: boolean) => void;

  onCerrar: () => void;
  googleNuevo?: { id: string; email: string; nombreSugerido: string } | null;
};

export default function AuthModal({ supabase, onLogin, onCerrar, googleNuevo }: Props) {
  const [modo, setModo] = useState<"login" | "registro">("registro");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [claveFundador, setClaveFundador] = useState("");
  const [cargando, setCargando] = useState(false);

  const [nombreVisible, setNombreVisible] = useState(googleNuevo?.nombreSugerido || "");
  const [handleDisponible, setHandleDisponible] = useState<"idle" | "verificando" | "disponible" | "ocupado">("idle");

  const limpiarHandle = (raw: string) => {
    const limpio = raw.trim().replace(/[^a-zA-Z0-9_]/g, "");
    return limpio ? `@${limpio}` : "";
  };

  const entrarConGoogle = async () => {
    setCargando(true);
    const esNativo = Capacitor.isNativePlatform();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: esNativo
          ? "https://vercel.app"
          : (typeof window !== "undefined" ? window.location.origin : undefined),
        skipBrowserRedirect: esNativo,
      },
    });
    if (error) {
      alert("Error al iniciar con Google: " + error.message);
      setCargando(false);
      return;
    }
    if (esNativo && data?.url) {
      await Browser.open({ url: data.url });
      setCargando(false);
    }
  };


  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    try {
      if (modo === "registro") {
        const handle = limpiarHandle(username);
        if (handle.length < 4) throw new Error("El usuario debe tener al menos 3 letras o números.");
        const lower = handle.toLowerCase();

              if (lower === "@rutftalentico" && claveFundador !== "RUTF2026") {
        throw new Error("El canal @RUTFTalentico está reservado para el fundador oficial.");
      }


        const { data: existe } = await supabase
          .from("usuarios_rutf")
          .select("id")
          .or(`username_lower.eq.${lower},email.eq.${email.trim().toLowerCase()}`)
          .maybeSingle();

        if (existe) {
          throw new Error("Este @usuario o correo ya está registrado. Nadie puede repetir un nombre existente.");
        }

        const esFundador = lower === "@rutftalentico" && claveFundador === "RUTF2026";
        const { data, error } = await supabase
          .from("usuarios_rutf")
          .insert([{
            username: handle,
            username_lower: lower,
            email: email.trim().toLowerCase(),
            password_hash: btoa(password),
            es_fundador: esFundador,
          }])
                  .select("id, username, email, es_fundador, avatar_url, banner_url, nombre_canal, creado_en")

          .single();

        if (error) throw new Error("Ese nombre de usuario ya fue tomado por otra persona.");
        localStorage.setItem("rutf_sesion", JSON.stringify(data));
        onLogin(data, true);

      } else {
        const { data, error } = await supabase
          .from("usuarios_rutf")
                  .select("id, username, email, es_fundador, avatar_url, banner_url, nombre_canal, creado_en, password_hash")

          .eq("email", email.trim().toLowerCase())
          .maybeSingle();

        if (error || !data || data.password_hash !== btoa(password)) {
          throw new Error("Correo o contraseña incorrectos.");
        }

        const sesion: UsuarioRUTF = { id: data.id, username: data.username, email: data.email, es_fundador: data.es_fundador };
        localStorage.setItem("rutf_sesion", JSON.stringify(sesion));
        onLogin(sesion);
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error de autenticación");
    } finally {
      setCargando(false);
    }
  };
  const verificarDisponibilidadHandle = async (valor: string) => {
    setUsername(valor);
    const limpio = limpiarHandle(valor);
    if (limpio.length < 4) {
      setHandleDisponible("idle");
      return;
    }
    setHandleDisponible("verificando");
    const { data } = await supabase
      .from("usuarios_rutf")
      .select("id")
      .ilike("username", limpio)
      .maybeSingle();
    setHandleDisponible(data ? "ocupado" : "disponible");
  };

  const guardarCanalNuevoGoogle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleNuevo) return;
    const handleFinal = limpiarHandle(username);
    if (handleFinal.length < 4) {
      alert("El @usuario debe tener al menos 3 letras o números.");
      return;
    }
    if (handleDisponible === "ocupado") {
      alert("Ese @usuario ya está en uso. Elige otro.");
      return;
    }
    setCargando(true);
    const { data: dup } = await supabase
      .from("usuarios_rutf")
      .select("id")
      .ilike("username", handleFinal)
      .maybeSingle();
    if (dup) {
      setHandleDisponible("ocupado");
      setCargando(false);
      return;
    }
    const esFundador = googleNuevo.email.toLowerCase() === "delossantosmanuel892@gmail.com";
           const nuevoPerfil = {
      id: googleNuevo.id,
      username: handleFinal,
      username_lower: handleFinal.toLowerCase(),
      nombre_canal: nombreVisible.trim() || handleFinal.replace("@", ""),
      email: googleNuevo.email.toLowerCase(),
      password_hash: "google_oauth_verificado",
      es_fundador: esFundador,
    };


    const { data: guardado, error } = await supabase
      .from("usuarios_rutf")
            .insert(nuevoPerfil)

      .select("*")
      .single();
    if (error) {
      alert("No se pudo guardar tu canal: " + error.message);
      setCargando(false);
      return;
    }
    if (nombreVisible.trim()) {
      await supabase.auth.updateUser({ data: { full_name: nombreVisible.trim() } });
    }
    localStorage.setItem("rutf_sesion", JSON.stringify(guardado));
    setCargando(false);
   onLogin(guardado, true);

    onCerrar();
  };

    return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#162032] border border-[#2A3A54] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative space-y-4">
        <button onClick={onCerrar} className="absolute right-4 top-4 p-2 rounded-full bg-[#0B1120] hover:bg-slate-200 text-[#94A3B8] cursor-pointer"><X className="w-4 h-4" /></button>
        {googleNuevo ? (
          <form onSubmit={guardarCanalNuevoGoogle} className="space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-blue-600 to-orange-500 text-white font-black flex items-center justify-center text-base shadow">
                RT
              </div>
              <h2 className="text-xl font-black text-[#F8FAFC]">Completa tu Canal Único</h2>
              <p className="text-xs text-[#94A3B8]">Elige tu identidad única para publicar y monetizar en RUTF Talentico.</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#CBD5E1]">Nombre de Canal Único (@Usuario)</label>
              <div className="relative flex items-center">
                <AtSign className="w-4 h-4 text-[#94A3B8] absolute left-3" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => verificarDisponibilidadHandle(e.target.value)}
                  placeholder="Ej: RUTF_Talentico o TuNombre"
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600"
                />
              </div>
              {handleDisponible === "verificando" && (
                <p className="text-[11px] text-[#94A3B8] font-semibold">Verificando disponibilidad...</p>
              )}
              {handleDisponible === "disponible" && (
                <p className="text-[11px] text-emerald-600 font-bold">✓ {limpiarHandle(username)} está disponible</p>
              )}
              {handleDisponible === "ocupado" && (
                <p className="text-[11px] text-red-600 font-bold">✕ Ese @usuario ya está ocupado</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#CBD5E1]">Nombre visible de tu canal</label>
              <input
                type="text"
                required
                value={nombreVisible}
                onChange={(e) => setNombreVisible(e.target.value)}
                placeholder="Tu nombre o nombre artístico"
                className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600"
              />
            </div>

            <button
              type="submit"
              disabled={cargando || handleDisponible === "ocupado"}
              className="w-full py-3 rounded-xl text-sm font-black text-white bg-gradient-to-r from-blue-600 to-orange-500 shadow-md disabled:opacity-50"
            >
              {cargando ? "Guardando canal..." : "Guardar y Entrar a mi Canal"}
            </button>
          </form>
        ) : (
          <>

        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-orange-500 text-white font-black text-xl flex items-center justify-center mx-auto shadow-sm">RT</div>
          <h2 className="text-xl font-black text-[#F8FAFC]">{modo === "registro" ? "Crea tu Canal Único" : "Inicia Sesión en RUTF"}</h2>
          <p className="text-xs text-[#94A3B8]">Cada @usuario es único e irrepetible en toda la plataforma.</p>
        </div>

        <button type="button" onClick={entrarConGoogle} disabled={cargando} className="w-full flex items-center justify-center gap-2.5 bg-[#0B1120] hover:bg-[#1E293B] text-[#F8FAFC] text-[#F8FAFC] border border-slate-300 font-bold py-2.5 rounded-xl text-xs shadow-2xs cursor-pointer transition">
                       <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z" />
                <path fill="#FBBC05" d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z" />
              </svg>
              Continuar con Google
       

        </button>

        <div className="flex items-center gap-2 text-[11px] text-[#94A3B8]">
          <div className="flex-1 h-px bg-slate-200" /><span>o con tu correo y @usuario</span><div className="flex-1 h-px bg-slate-200" />
        </div>

        <div className="grid grid-cols-2 bg-[#0B1120] p-1 rounded-xl text-xs font-bold">
          <button type="button" onClick={() => setModo("registro")} className={`py-2 rounded-lg cursor-pointer transition ${modo === "registro" ? "bg-[#162032] text-blue-600 shadow-2xs" : "text-[#94A3B8]"}`}>Crear Cuenta</button>
          <button type="button" onClick={() => setModo("login")} className={`py-2 rounded-lg cursor-pointer transition ${modo === "login" ? "bg-[#162032] text-blue-600 shadow-2xs" : "text-[#94A3B8]"}`}>Iniciar Sesión</button>
        </div>

        <form onSubmit={manejarEnvio} className="space-y-3">
          {modo === "registro" && (
            <div>
              <label className="text-xs font-bold text-[#CBD5E1] mb-1 block">Nombre de Canal Único (@Usuario)</label>
              <div className="relative">
                <AtSign className="w-4 h-4 text-blue-600 absolute left-3 top-3" />
                <input required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Ej: RUTF_Talentico o TuNombre" className="w-full border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none focus:border-blue-600" />
              </div>
              {username.trim().toLowerCase().replace(/^@/, "") === "rutf_talentico" && (
                <div className="mt-2 bg-blue-50 border border-blue-200 rounded-xl p-2.5">
                  <label className="text-[11px] font-extrabold text-blue-800 flex items-center gap-1 mb-1"><ShieldCheck className="w-3.5 h-3.5" /> Clave Oficial del Fundador</label>
                  <input required type="password" value={claveFundador} onChange={(e) => setClaveFundador(e.target.value)} placeholder="Escribe RUTF2026" className="w-full bg-[#162032] border border-blue-300 rounded-lg px-2.5 py-1.5 text-xs" />
                </div>
              )}
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-[#CBD5E1] mb-1 block">Correo Electrónico</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" className="w-full border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none focus:border-blue-600" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#CBD5E1] mb-1 block">Contraseña</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
              <input required minLength={6} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" className="w-full border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none focus:border-blue-600" />
            </div>
          </div>

          <button disabled={cargando} type="submit" className="w-full bg-gradient-to-r from-blue-600 to-orange-500 text-white font-extrabold py-3 rounded-xl text-sm shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50">
            <UserCheck className="w-4 h-4" /> {cargando ? "Verificando..." : modo === "registro" ? "Registrar mi Canal Único" : "Entrar a mi Cuenta"}
          </button>
        </form>
                  </>
        )}

      </div>
    </div>
  );
}



