import { NextResponse } from "next/server";

const SUPABASE_URL = "https://supabase.co";
const SUPABASE_KEY = "sb_publishable_OuFfTHlGkS0jKmCkwh7axw_eDS0JXh7";

export async function POST(req: Request) {
  try {
    const { filename } = await req.json();
    const nombre = `${Date.now()}-${String(filename || "video.mp4").replace(/[^a-zA-Z0-9._-]/g, "_")}`;

    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/upload/sign/videos-rutf/${nombre}`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    const data = await res.json();
    if (!res.ok) return NextResponse.json({ error: data.message || "Error firmando subida" }, { status: 500 });

    const signedUrl = `${SUPABASE_URL}/storage/v1${data.url}`;
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/videos-rutf/${nombre}`;
    return NextResponse.json({ signedUrl, publicUrl });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Error" }, { status: 500 });
  }
}
