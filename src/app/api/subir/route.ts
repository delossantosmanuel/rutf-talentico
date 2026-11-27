import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
});

export async function POST(req: Request) {
  try {
    const { carpeta = "videos", nombreArchivo, tipoContenido } = await req.json();
    if (!nombreArchivo || !tipoContenido) {
      return NextResponse.json({ error: "Faltan datos del archivo" }, { status: 400 });
    }

    const limpio = String(nombreArchivo).replace(/[^a-zA-Z0-9._-]/g, "_");
    const ruta = `${carpeta}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${limpio}`;

    const comando = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME || "rutf-talentico",
      Key: ruta,
      ContentType: tipoContenido,
    });

    const uploadUrl = await getSignedUrl(r2, comando, { expiresIn: 3600 });
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${ruta}`;

    return NextResponse.json({ uploadUrl, publicUrl, ruta });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error interno R2";
    console.error("Error firmando subida R2:", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
