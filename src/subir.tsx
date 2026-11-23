"use client";
import React, { useState } from "react";
import { Upload, Hash, Tag, FileText, Type, AlertCircle, CheckCircle2 } from "lucide-react";

type Props = {
  supabase: any;
  canalActual: string;
  onPublicado: () => void;
};

export default function SubirVideoForm({ supabase, canalActual, onPublicado }: Props) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [etiquetas, setEtiquetas] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [tipo, setTipo] = useState<"largo" | "vertical">("largo");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [progreso, setProgreso] = useState(0);

  const seleccionarArchivo = (file: File | null) => {
    if (!file) return;
    if (file.size / (1024 * 1024) > 50) {
      alert("Por ahora aceptamos videos de hasta 50 MB mientras seguimos creciendo.");
      return;
    }
    setArchivo(file);
    const urlTemp = URL.createObjectURL(file);
    const vid = document.createElement("video");
    vid.preload = "metadata";
    vid.onloadedmetadata = () => {
      if (vid.videoHeight > vid.videoWidth) setTipo("vertical");
      else setTipo("largo");
      URL.revokeObjectURL(urlTemp);
    };
    vid.src = urlTemp;
  };

  const publicar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (titulo.trim().length < 10) return alert("El título debe tener al menos 10 caracteres.");
    if (descripcion.trim().length < 20) return alert("La descripción debe tener al menos 20 caracteres.");
    if (!archivo) return alert("Selecciona un archivo de video (.mp4)");

    setSubiendo(true);
    setProgreso(12);
    const intervalo = setInterval(() => setProgreso((p) => (p < 88 ? p + 7 : p)), 350);

    try {
      const nombre = `${Date.now()}-${archivo.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const { error: upErr } = await supabase.storage.from("videos-rutf").upload(nombre, archivo);
      clearInterval(intervalo);
      if (upErr) throw new Error(upErr.message);

      setProgreso(95);
      const { data: pubData } = supabase.storage.from("videos-rutf").getPublicUrl(nombre);

      const tagsLimpios = hashtags
        .split(/\s+/)
        .filter(Boolean)
        .map((h) => (h.startsWith("#") ? h : `#${h}`))
        .join(" ");

      const { error: dbErr } = await supabase.from("videos").insert([{
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        etiquetas: etiquetas.trim(),
        hashtags: tagsLimpios,
        creador: canalActual,
        nivel: "Semilla",
        tipo,
        video_url: pubData.publicUrl,
        vistas: 0,
        likes: 0,
        dislikes: 0,
      }]);
      if (dbErr) throw new Error(dbErr.message);

      setProgreso(100);
      setTimeout(() => {
        setSubiendo(false);
        setProgreso(0);
        onPublicado();
      }, 600);
    } catch (err: unknown) {
      clearInterval(intervalo);
      alert("Error al publicar: " + (err instanceof Error ? err.message : "Error de red"));
      setSubiendo(false);
      setProgreso(0);
    }
  };

    return (
    <form onSubmit={publicar} className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
      <div className="border-b border-slate-100 pb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-black text-slate-900">Publicar en RUTF Talentico</h2>
          <p className="text-xs text-slate-500 mt-0.5">Publicando como canal único protegido</p>
        </div>
        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-full text-xs font-extrabold">
          {canalActual}
          {canalActual.toLowerCase() === "@rutf_talentico" && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
        </span>
      </div>

      <div>
        <label className="text-xs font-bold text-slate-700 mb-1 block">Formato del Video</label>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => setTipo("largo")} className={`py-2.5 rounded-xl text-xs font-bold border cursor-pointer ${tipo === "largo" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600"}`}>Largo (16:9)</button>
          <button type="button" onClick={() => setTipo("vertical")} className={`py-2.5 rounded-xl text-xs font-bold border cursor-pointer ${tipo === "vertical" ? "border-orange-500 bg-orange-50 text-orange-700" : "border-slate-200 text-slate-600"}`}>Vertical (9:16)</button>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-xs font-bold mb-1">
          <span className="flex items-center gap-1 text-slate-700"><Type className="w-3.5 h-3.5 text-blue-600" /> Título del Video (Mín. 10 / Máx. 80)</span>
          <span className={titulo.length < 10 ? "text-orange-500" : "text-emerald-600"}>{titulo.length} / 80</span>
        </div>
        <input required minLength={10} maxLength={80} value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ej: Mi presentación acústica en vivo..." className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-blue-600" />
      </div>

      <div>
        <div className="flex justify-between text-xs font-bold mb-1">
          <span className="flex items-center gap-1 text-slate-700"><FileText className="w-3.5 h-3.5 text-blue-600" /> Descripción Detallada (Mín. 20 / Máx. 1,000)</span>
          <span className={descripcion.length < 20 ? "text-orange-500" : "text-emerald-600"}>{descripcion.length} / 1,000</span>
        </div>
        <textarea required minLength={20} maxLength={1000} rows={3} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Cuenta de qué trata tu video, créditos o historia..." className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-blue-600 resize-none" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-1 text-xs font-bold text-slate-700 mb-1"><Tag className="w-3.5 h-3.5 text-orange-500" /> Etiquetas (separadas por coma)</label>
          <input maxLength={200} value={etiquetas} onChange={(e) => setEtiquetas(e.target.value)} placeholder="música, talento, en vivo" className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-blue-600" />
        </div>
        <div>
          <label className="flex items-center gap-1 text-xs font-bold text-slate-700 mb-1"><Hash className="w-3.5 h-3.5 text-blue-600" /> Hashtags Oficiales</label>
          <input maxLength={150} value={hashtags} onChange={(e) => setHashtags(e.target.value)} placeholder="#RUTFTalentico #TalentoRD" className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-blue-600" />
        </div>
      </div>

      <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-5 cursor-pointer transition ${archivo ? "border-emerald-500 bg-emerald-50/50" : "border-slate-300 hover:bg-slate-50"}`}>
        <Upload className={`w-7 h-7 mb-1.5 ${archivo ? "text-emerald-600" : "text-blue-600"}`} />
        <span className="text-xs font-extrabold text-slate-800 text-center">{archivo ? `Video listo: ${archivo.name} (${(archivo.size / (1024 * 1024)).toFixed(1)} MB)` : "Seleccionar archivo de video (.mp4 máx. 50 MB)"}</span>
        <span className="text-[11px] text-slate-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Límite actual de lanzamiento: 50 MB por archivo</span>
        <input type="file" accept="video/*" required onChange={(e) => seleccionarArchivo(e.target.files ? e.target.files[0] : null)} className="hidden" />
      </label>

      {subiendo && (
        <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <div className={`flex justify-between text-xs font-extrabold ${progreso > 50 ? "text-emerald-600" : "text-blue-600"}`}>
            <span>{progreso > 50 ? "¡Ya casi listo! Publicando en RUTF Talentico..." : "Subiendo video a la nube..."}</span>
            <span>{progreso}%</span>
          </div>
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div className={`h-full transition-all duration-300 rounded-full ${progreso > 50 ? "bg-emerald-500" : "bg-blue-600"}`} style={{ width: `${progreso}%` }} />
          </div>
        </div>
      )}

      <button disabled={subiendo} type="submit" className="w-full bg-gradient-to-r from-blue-600 to-orange-500 text-white font-extrabold py-3 rounded-xl text-sm shadow-sm cursor-pointer disabled:opacity-50">
        {subiendo ? `Subiendo video (${progreso}%)...` : archivo ? "Publicar Video Ahora" : "Selecciona un video para publicar"}
      </button>
    </form>
  );
}
