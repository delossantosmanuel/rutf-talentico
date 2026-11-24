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
  onLogin: (u: UsuarioRUTF) => void;
  onCerrar: () => void;
};

export default function AuthModal({ supabase, onLogin, onCerrar }: Props) {
  const [modo, setModo] = useState<"login" | "registro">("registro");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [claveFundador, setClaveFundador] = useState("");
  const [cargando, setCargando] = useState(false);

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
          ? "com.rutftalentico.app://login-callback"
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

        if (lower === "@rutf_talentico" && claveFundador !== "RUTF2026") {
          throw new Error("El canal @RUTF_Talentico está reservado para el fundador. Ingresa la clave de fundador o elige otro @usuario.");
        }

        const { data: existe } = await supabase
          .from("usuarios_rutf")
          .select("id")
          .or(`username_lower.eq.${lower},email.eq.${email.trim().toLowerCase()}`)
          .maybeSingle();

        if (existe) {
          throw new Error("Este @usuario o correo ya está registrado. Nadie puede repetir un nombre existente.");
        }

        const esFundador = lower === "@rutf_talentico" && claveFundador === "RUTF2026";
        const { data, error } = await supabase
          .from("usuarios_rutf")
          .insert([{
            username: handle,
            username_lower: lower,
            email: email.trim().toLowerCase(),
            password_hash: btoa(password),
            es_fundador: esFundador,
          }])
          .select("id, username, email, es_fundador")
          .single();

        if (error) throw new Error("Ese nombre de usuario ya fue tomado por otra persona.");
        localStorage.setItem("rutf_sesion", JSON.stringify(data));
        onLogin(data);
      } else {
        const { data, error } = await supabase
          .from("usuarios_rutf")
          .select("id, username, email, es_fundador, password_hash")
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

    return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative space-y-4">
        <button onClick={onCerrar} className="absolute right-4 top-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"><X className="w-4 h-4" /></button>

        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-orange-500 text-white font-black text-xl flex items-center justify-center mx-auto shadow-sm">RT</div>
          <h2 className="text-xl font-black text-slate-900">{modo === "registro" ? "Crea tu Canal Único" : "Inicia Sesión en RUTF"}</h2>
          <p className="text-xs text-slate-500">Cada @usuario es único e irrepetible en toda la plataforma.</p>
        </div>

        <button type="button" onClick={entrarConGoogle} disabled={cargando} className="w-full flex items-center justify-center gap-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold py-2.5 rounded-xl text-xs shadow-2xs cursor-pointer transition">
          <span className="font-black text-sm text-blue-600">G</span> Continuar con Google
        </button>

        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <div className="flex-1 h-px bg-slate-200" /><span>o con tu correo y @usuario</span><div className="flex-1 h-px bg-slate-200" />
        </div>

        <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button type="button" onClick={() => setModo("registro")} className={`py-2 rounded-lg cursor-pointer transition ${modo === "registro" ? "bg-white text-blue-600 shadow-2xs" : "text-slate-600"}`}>Crear Cuenta</button>
          <button type="button" onClick={() => setModo("login")} className={`py-2 rounded-lg cursor-pointer transition ${modo === "login" ? "bg-white text-blue-600 shadow-2xs" : "text-slate-600"}`}>Iniciar Sesión</button>
        </div>

        <form onSubmit={manejarEnvio} className="space-y-3">
          {modo === "registro" && (
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Nombre de Canal Único (@Usuario)</label>
              <div className="relative">
                <AtSign className="w-4 h-4 text-blue-600 absolute left-3 top-3" />
                <input required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Ej: RUTF_Talentico o TuNombre" className="w-full border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none focus:border-blue-600" />
              </div>
              {username.trim().toLowerCase().replace(/^@/, "") === "rutf_talentico" && (
                <div className="mt-2 bg-blue-50 border border-blue-200 rounded-xl p-2.5">
                  <label className="text-[11px] font-extrabold text-blue-800 flex items-center gap-1 mb-1"><ShieldCheck className="w-3.5 h-3.5" /> Clave Oficial del Fundador</label>
                  <input required type="password" value={claveFundador} onChange={(e) => setClaveFundador(e.target.value)} placeholder="Escribe RUTF2026" className="w-full bg-white border border-blue-300 rounded-lg px-2.5 py-1.5 text-xs" />
                </div>
              )}
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-700 mb-1 block">Correo Electrónico</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" className="w-full border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none focus:border-blue-600" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 mb-1 block">Contraseña</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input required minLength={6} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" className="w-full border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none focus:border-blue-600" />
            </div>
          </div>

          <button disabled={cargando} type="submit" className="w-full bg-gradient-to-r from-blue-600 to-orange-500 text-white font-extrabold py-3 rounded-xl text-sm shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50">
            <UserCheck className="w-4 h-4" /> {cargando ? "Verificando..." : modo === "registro" ? "Registrar mi Canal Único" : "Entrar a mi Cuenta"}
          </button>
        </form>
      </div>
    </div>
  );
}
