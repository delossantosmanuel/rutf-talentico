"use client";
import React, { useState } from "react";
import { Upload, Hash, Tag, FileText, Type, AlertCircle, CheckCircle2, Image as ImageIcon, Sparkles } from "lucide-react";

async function comprimirAWebP(fuente: HTMLImageElement | HTMLVideoElement, esVertical: boolean): Promise<Blob | null> {
  const anchoObj = esVertical ? 540 : 960;
  const altoObj = esVertical ? 960 : 540;
  const canvas = document.createElement("canvas");
  canvas.width = anchoObj;
  canvas.height = altoObj;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const wOrig = fuente instanceof HTMLVideoElement ? fuente.videoWidth : fuente.naturalWidth;
  const hOrig = fuente instanceof HTMLVideoElement ? fuente.videoHeight : fuente.naturalHeight;
  if (!wOrig || !hOrig) return null;

  const ratioOrigen = wOrig / hOrig;
  const ratioDestino = anchoObj / altoObj;
  let sx = 0, sy = 0, sw = wOrig, sh = hOrig;
  if (ratioOrigen > ratioDestino) {
    sw = hOrig * ratioDestino;
    sx = (wOrig - sw) / 2;
  } else {
    sh = wOrig / ratioDestino;
    sy = (hOrig - sh) / 2;
  }

  ctx.drawImage(fuente, sx, sy, sw, sh, 0, 0, anchoObj, altoObj);
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/webp", 0.78));
}

async function extraerMejorFotograma(file: File, esVertical: boolean): Promise<{ blob: Blob; preview: string } | null> {
  return new Promise((resolve) => {
    const urlTemp = URL.createObjectURL(file);
    const vid = document.createElement("video");
    vid.src = urlTemp;
    vid.muted = true;
    vid.playsInline = true;
    vid.preload = "auto";

    vid.onloadedmetadata = async () => {
      const dur = vid.duration && isFinite(vid.duration) ? vid.duration : 2;
      const puntos = [Math.min(0.6, dur * 0.15), dur * 0.35, dur * 0.65];
      let mejorPuntaje = -1;
      let mejorBlob: Blob | null = null;

      const testCanvas = document.createElement("canvas");
      testCanvas.width = 64;
      testCanvas.height = 64;
      const testCtx = testCanvas.getContext("2d");

      for (const t of puntos) {
        await new Promise<void>((resSeek) => {
          vid.currentTime = Math.max(0.1, Math.min(t, Math.max(0.2, dur - 0.1)));
          vid.onseeked = () => resSeek();
          setTimeout(() => resSeek(), 900);
        });

        let puntaje = 1;
        if (testCtx) {
          testCtx.drawImage(vid, 0, 0, 64, 64);
          const data = testCtx.getImageData(0, 0, 64, 64).data;
          let sumaBrillo = 0;
          let variacion = 0;
          for (let i = 0; i < data.length; i += 16) {
            const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
            sumaBrillo += lum;
            if (i >= 16) variacion += Math.abs(lum - (data[i - 16] + data[i - 15] + data[i - 14]) / 3);
          }
          const brilloMedio = sumaBrillo / (data.length / 16);
          if (brilloMedio > 18 && brilloMedio < 245) {
            puntaje = variacion + brilloMedio * 0.3;
          }
        }

        if (puntaje > mejorPuntaje) {
          const blob = await comprimirAWebP(vid, esVertical);
          if (blob) {
            mejorPuntaje = puntaje;
            mejorBlob = blob;
          }
        }
      }

      URL.revokeObjectURL(urlTemp);
      if (mejorBlob) {
        resolve({ blob: mejorBlob, preview: URL.createObjectURL(mejorBlob) });
      } else {
        resolve(null);
      }
    };

    vid.onerror = () => {
      URL.revokeObjectURL(urlTemp);
      resolve(null);
    };
  });
}


const ESENCIAS_RUTF = [
  "Ritmo y Voz",
  "Arte Visual",
  "Escena y Humor",
  "Acción y Deporte",
  "Mente e Innovación",
  "Saber y Guía",
  "Mundo y Vida",
];

type Props = {
  supabase: any;
  canalActual: string;
  onPublicado: () => void;
};

export default function SubirVideoForm({ supabase, canalActual, onPublicado }: Props) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [etiquetas, setEtiquetas] = useState<string>(() => (typeof window !== "undefined" ? localStorage.getItem("rutf_esencia_" + canalActual.toLowerCase()) || "Mente e Innovación" : "Mente e Innovación"));
  const [hashtags, setHashtags] = useState("");
  const [tipo, setTipo] = useState<"largo" | "vertical">("largo");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [miniaturaBlob, setMiniaturaBlob] = useState<Blob | null>(null);
  const [miniaturaPreview, setMiniaturaPreview] = useState<string>("");
  const [miniaturaManual, setMiniaturaManual] = useState(false);
  const [analizandoFrame, setAnalizandoFrame] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [detalleSubida, setDetalleSubida] = useState("");
  const [aceptaCopyright, setAceptaCopyright] = useState(false);

  const seleccionarArchivo = (file: File | null) => {
    if (!file) return;
    if (file.size / (1024 * 1024) > 500) {
      alert("Por ahora aceptamos videos de hasta 500 MB mientras seguimos creciendo.");
      return;
    }
    setArchivo(file);
    const urlTemp = URL.createObjectURL(file);
    const vid = document.createElement("video");
    vid.preload = "metadata";
    vid.onloadedmetadata = async () => {
      const esVert = vid.videoHeight > vid.videoWidth;
      setTipo(esVert ? "vertical" : "largo");
      URL.revokeObjectURL(urlTemp);

      if (!miniaturaManual) {
        setAnalizandoFrame(true);
        const auto = await extraerMejorFotograma(file, esVert);
        setAnalizandoFrame(false);
        if (auto) {
          setMiniaturaBlob(auto.blob);
          setMiniaturaPreview(auto.preview);
        }
      }
    };
    vid.src = urlTemp;
  };

  const seleccionarMiniaturaManual = (file: File | null) => {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      alert("Formato no válido. Usa JPG, PNG o WebP.");
      return;
    }
    if (file.size / (1024 * 1024) > 5) {
      alert("La imagen de miniatura no debe superar los 5 MB.");
      return;
    }
    const urlTemp = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = async () => {
      const esVert = tipo === "vertical";
      if (!esVert && img.naturalHeight > img.naturalWidth) {
        URL.revokeObjectURL(urlTemp);
        alert("Para un Video Horizontal (16:9), la miniatura debe ser horizontal (más ancha que alta).");
        return;
      }
      if (esVert && img.naturalWidth > img.naturalHeight) {
        URL.revokeObjectURL(urlTemp);
        alert("Para un Short Vertical (9:16), la miniatura debe ser vertical (más alta que ancha).");
        return;
      }
      const comprimida = await comprimirAWebP(img, esVert);
      URL.revokeObjectURL(urlTemp);
      if (comprimida) {
        setMiniaturaBlob(comprimida);
        setMiniaturaPreview(URL.createObjectURL(comprimida));
        setMiniaturaManual(true);
      }
    };
    img.src = urlTemp;
  };

  const publicar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (titulo.trim().length < 10) return alert("El título debe tener al menos 10 caracteres.");
    if (descripcion.trim().length < 20) return alert("La descripción debe tener al menos 20 caracteres.");
    if (!archivo) return alert("Selecciona un archivo de video (.mp4)");
    if (!aceptaCopyright) return alert("Debes confirmar que este video es original y no infringe derechos de autor.");

    setSubiendo(true);
    setProgreso(12);
    const intervalo = setInterval(() => setProgreso((p) => (p < 88 ? p + 7 : p)), 350);

    try {
      let miniaturaUrlFinal: string | null = null;
      let blobFinal = miniaturaBlob;
      if (!blobFinal) {
        const auto = await extraerMejorFotograma(archivo, tipo === "vertical");
        if (auto) blobFinal = auto.blob;
      }

      if (blobFinal) {
        setDetalleSubida("Preparando portada...");
        const { data: dataMin, error: errMin } = await supabase.functions.invoke("firmar-r2", {
          body: { carpeta: "miniaturas", nombreArchivo: `miniatura-${Date.now()}.webp` },
        });
        if (errMin || !dataMin?.uploadUrl) throw new Error(errMin?.message || dataMin?.error || "Error firmando miniatura");
        const putMin = await fetch(dataMin.uploadUrl, { method: "PUT", body: await blobFinal.arrayBuffer() });
        if (!putMin.ok) throw new Error(`Error subiendo miniatura a R2 (${putMin.status})`);
        miniaturaUrlFinal = dataMin.publicUrl;
      }

      clearInterval(intervalo);
      const totalMB = (archivo.size / (1024 * 1024)).toFixed(1);
      const { data: dataVid, error: errVid } = await supabase.functions.invoke("firmar-r2", {
        body: { carpeta: "videos", nombreArchivo: archivo.name },
      });
      if (errVid || !dataVid?.uploadUrl) throw new Error(errVid?.message || dataVid?.error || "Error firmando video");

      const urlVideoFinal = await new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", dataVid.uploadUrl, true);
        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable) {
            const subidoMB = (ev.loaded / (1024 * 1024)).toFixed(1);
            const pct = Math.min(95, Math.max(5, Math.round((ev.loaded / ev.total) * 95)));
            setProgreso(pct);
            setDetalleSubida(`${subidoMB} MB de ${totalMB} MB (${pct}%)`);
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setProgreso(97);
            setDetalleSubida(`${totalMB} MB completados (97%)`);
            resolve(dataVid.publicUrl);
          } else {
            reject(new Error(`Error R2 (${xhr.status}): ${xhr.responseText || xhr.statusText}`));
          }
        };
        xhr.onerror = () => reject(new Error("Error de red al enviar directo a Cloudflare R2"));
        xhr.send(archivo.slice(0, archivo.size, "application/octet-stream"));
      });

      const tagsLimpios = hashtags
        .split(/\s+/)
        .filter(Boolean)
        .map((h) => (h.startsWith("#") ? h : `#${h}`))
        .join(" ");

      const { error: dbErr } = await supabase.from("videos").insert([
        {
          titulo: titulo.trim(),
          descripcion: descripcion.trim(),
          etiquetas: etiquetas.trim(),
          hashtags: tagsLimpios,
          creador: canalActual,
          nivel: "Semilla",
          tipo,
          video_url: urlVideoFinal,
          miniatura_url: miniaturaUrlFinal,
          vistas: 0,
          likes: 0,
          dislikes: 0,
        },
      ]);
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
    <form onSubmit={publicar} className="max-w-2xl mx-auto bg-[#162032] border border-[#2A3A54] text-[#F8FAFC] rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
      <div className="border-b border-[#2A3A54] pb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-black text-[#F8FAFC]">Publicar en RUTF Talentico</h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">Publicando como canal único protegido</p>
        </div>
        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-xs font-extrabold">
          {canalActual}
          {canalActual.toLowerCase() === "@rutftalentico" && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
        </span>
      </div>

      <div>
        <label className="text-xs font-bold text-[#CBD5E1] mb-1 block">Formato del Video</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setTipo("largo")}
            className={`py-2.5 rounded-xl text-xs font-bold border ${
              tipo === "largo" ? "bg-blue-600 text-white border-blue-600" : "bg-[#0B1120] text-[#CBD5E1] border-[#2A3A54]"
            }`}
          >
            Video Horizontal (16:9)
          </button>
          <button
            type="button"
            onClick={() => setTipo("vertical")}
            className={`py-2.5 rounded-xl text-xs font-bold border ${
              tipo === "vertical" ? "bg-orange-500 text-white border-orange-500" : "bg-[#0B1120] text-[#CBD5E1] border-[#2A3A54]"
            }`}
          >
            Short Vertical (9:16)
          </button>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-xs font-bold mb-1">
          <span className="flex items-center gap-1 text-[#CBD5E1]">
            <Type className="w-3.5 h-3.5 text-blue-600" /> Título del Talento
          </span>
          
        </div>
        <input
          required
          minLength={10}
          maxLength={80}
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ej: Mi presentación acústica en vivo..."
          className="w-full px-4 py-2.5 rounded-xl bg-[#0B1120] border border-[#2A3A54] text-sm text-[#F8FAFC] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#FF6B00]"
        />
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <div>
            {titulo.trim().length >= 15 && titulo.trim().length <= 65 ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#10B981]/15 border border-[#10B981]/40 text-[#34D399] text-[11px] font-extrabold">
                ✓ ¡Excelente! Título optimizado
              </span>
            ) : (
              <span className="text-[11px] font-semibold text-amber-400">
                Falta contexto — escribe entre 15 y 65 letras
              </span>
            )}
          </div>
          <span className={"text-[11px] font-bold shrink-0 " + (titulo.trim().length >= 15 && titulo.trim().length <= 65 ? "text-[#10B981]" : "text-[#94A3B8]")}>
            {titulo.length}/80
          </span>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-xs font-bold mb-1">
          <span className="flex items-center gap-1 text-[#CBD5E1]">
            <FileText className="w-3.5 h-3.5 text-[#FF6B00]" /> Historia y Contexto del Talento
          </span>
          
        </div>
        <textarea
          required
          minLength={20}
          maxLength={1000}
          rows={3}
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Cuenta la historia de tu talento, quién participa y qué lo hace único..."
          className="w-full px-4 py-2.5 rounded-xl bg-[#0B1120] border border-[#2A3A54] text-sm text-[#F8FAFC] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#FF6B00]"
        />
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <div>
            {descripcion.trim().length > 30 ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#10B981]/15 border border-[#10B981]/40 text-[#34D399] text-[11px] font-extrabold">
                ✓ Ficha completa — presentación profesional
              </span>
            ) : (
              <span className="text-[11px] text-[#94A3B8]">Mínimo 20 caracteres</span>
            )}
          </div>
          <span className={"text-[11px] font-bold shrink-0 " + (descripcion.trim().length > 30 ? "text-[#10B981]" : "text-[#94A3B8]")}>
            {descripcion.length}/1000
          </span>
        </div>
      </div>

      <div className="space-y-2 p-4 rounded-2xl bg-[#0B1120] border border-[#2A3A54]">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <label className="text-xs font-black text-[#F8FAFC] block">Esencia de este Video</label>
            <span className="text-[11px] text-[#94A3B8]">Selecciona el talento principal de esta publicación</span>
          </div>
          {etiquetas && (
            <span className="text-[11px] font-extrabold text-[#10B981]">✓ {etiquetas}</span>
          )}
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar">
          {ESENCIAS_RUTF.map((item) => {
            const activa = etiquetas === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setEtiquetas(item)}
                className={"shrink-0 px-3.5 py-1.5 rounded-full text-xs font-extrabold border transition cursor-pointer inline-flex items-center gap-1.5 " + (activa ? "bg-[#10B981] border-[#10B981] text-white shadow-md shadow-[#10B981]/30" : "bg-[#162032] border-[#2A3A54] text-[#CBD5E1] hover:border-[#10B981]/60")}
              >
                {activa && <span>✓</span>}
                <span>{item}</span>
              </button>
            );
          })}
        </div>
      </div>

      <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-5 cursor-pointer hover:bg-[#0B1120] border-slate-300 transition">
        <Upload className={`w-7 h-7 mb-1.5 ${archivo ? "text-emerald-600" : "text-blue-600"}`} />
        <span className="text-xs font-extrabold text-[#F8FAFC] text-center">
          {archivo ? `Video listo: ${archivo.name}` : "Toca aquí para elegir tu video (.mp4 / .mov)"}
        </span>
        <span className="text-[11px] text-[#94A3B8] mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3 text-blue-500" /> Máximo 500 MB • Alta definición recomendada
        </span>
        <input
          type="file"
          accept="video/*"
          required
        onChange={(e) => seleccionarArchivo(e.target.files?.item(0) ?? null)}



          className="hidden"
        />
      </label>

      <div className="p-4 rounded-2xl bg-[#0B1120] border border-[#2A3A54] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-extrabold text-[#F8FAFC] inline-flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-blue-600" />
            Miniatura / Portada del Video (Opcional)
          </span>
          <span className="text-[11px] font-bold text-blue-700 inline-flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            {miniaturaManual ? "Miniatura personalizada lista" : "Auto-selección inteligente de mejor escena"}
          </span>
        </div>

        <p className="text-[11px] text-[#94A3B8] leading-relaxed">
          <strong>Requisitos:</strong> JPG, PNG o WebP (máx. 5 MB) con orientación{" "}
          <strong>{tipo === "largo" ? "Horizontal 16:9 (1280×720)" : "Vertical 9:16 (720×1280)"}</strong>. Se optimiza
          automáticamente a menos de 120 KB. Si no subes una, RUTF Talentico analiza tu video y elige la mejor escena.
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <label className="px-3.5 py-2 rounded-xl bg-[#0B1120] hover:bg-[#1E293B] text-blue-700 border border-blue-200 text-xs font-extrabold cursor-pointer transition">
            Elegir Portada de Escenario
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
            onChange={(e) => seleccionarMiniaturaManual(e.target.files?.item(0) ?? null)}



              className="hidden"
            />
          </label>

          {miniaturaManual && archivo && (
            <button
              type="button"
              onClick={async () => {
                setMiniaturaManual(false);
                setAnalizandoFrame(true);
                const auto = await extraerMejorFotograma(archivo, tipo === "vertical");
                setAnalizandoFrame(false);
                if (auto) {
                  setMiniaturaBlob(auto.blob);
                  setMiniaturaPreview(auto.preview);
                }
              }}
              className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-[#F8FAFC] text-xs font-bold transition"
            >
              Usar mejor escena automática
            </button>
          )}
        </div>

        {analizandoFrame && (
          <p className="text-xs font-bold text-blue-600 animate-pulse">
            Analizando escenas del video para capturar la mejor portada...
          </p>
        )}

        {miniaturaPreview && !analizandoFrame && (
          <div className="pt-1">
            <img
              src={miniaturaPreview}
              alt="Vista previa de miniatura"
              className={`rounded-xl border border-slate-300 shadow-xs object-cover ${
                tipo === "vertical" ? "w-28 h-48" : "w-56 h-32"
              }`}
            />
          </div>
        )}
      </div>

      {subiendo && (
        <div className="space-y-1.5 bg-[#0B1120] p-3.5 rounded-xl border border-[#2A3A54]">
          <div className={`flex justify-between text-xs font-extrabold ${progreso > 50 ? "text-emerald-600" : "text-blue-600"}`}>
            <span>{progreso >= 97 ? "¡Talento listo! Estrenando en RUTF..." : "Impulsando tu talento..."}</span>
            <span>{progreso}%</span>
          </div>
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div
              style={{ width: `${progreso}%` }}
              className={`h-full transition-all duration-300 rounded-full ${progreso > 50 ? "bg-emerald-500" : "bg-blue-600"}`}
            />
          </div>
        </div>
      )}

      <label className="flex items-start gap-2.5 p-3 rounded-xl bg-[#0B1120] border border-[#2A3A54] cursor-pointer">
        <input
          type="checkbox"
          checked={aceptaCopyright}
          onChange={(e) => setAceptaCopyright(e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 shrink-0"
        />
        <span className="text-xs text-[#CBD5E1] leading-relaxed">
          Declaro que este video y su audio son de mi <strong>autoría original</strong> (o cuento con derechos legales
          de uso) y no infringen normas de derechos de autor de terceros.
        </span>
      </label></div>

      <button
        disabled={subiendo || !aceptaCopyright}
        type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 disabled:opacity-50 text-white font-black py-3.5 rounded-2xl shadow-md hover:opacity-95 transition text-sm"
      >
        {subiendo ? `${detalleSubida || `Subiendo video (${progreso}%)...`}` : archivo ? "Publicar Video Ahora" : "Selecciona un video para publicar"}
      </button>
    </form>
  );
}




















