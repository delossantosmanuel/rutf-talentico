const url = "https://" + ["macovgecajhwhntipkta", "supabase", "co"].join(".");
(async () => {
  console.log("1. Conectando a:", url);
  const r1 = await fetch(url + "/functions/v1/firmar-r2", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ carpeta: "pruebas", nombreArchivo: "test-rutf.txt" }),
  });
  const d1 = await r1.json();
  console.log("2. Respuesta firmar-r2:", r1.status, d1);
  if (!d1.uploadUrl) return;
  const r2 = await fetch(d1.uploadUrl, { method: "PUT", body: "Prueba exitosa RUTF Talentico" });
  console.log("3. Respuesta Cloudflare R2:", r2.status, r2.statusText);
})();
