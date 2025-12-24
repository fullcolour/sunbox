export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const lat = url.searchParams.get("lat");
  const lon = url.searchParams.get("lon");
  const lang = url.searchParams.get("lang") || "en";

  if (!lat || !lon) {
    return new Response(JSON.stringify({ error: "Missing lat/lon" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const cacheKey = `weather:${lat},${lon},${lang}`;

  // ===== KV Cache（可选，但强烈推荐）=====
  if (env.WEATHER_KV) {
    const cached = await env.WEATHER_KV.get(cacheKey);
    if (cached) {
      return new Response(cached, {
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  const api = `https://api.open-meteo.com/v1/forecast?
latitude=${lat}
&longitude=${lon}
&current_weather=true
&daily=weathercode,temperature_2m_max,temperature_2m_min
&timezone=auto
&language=${lang}`.replace(/\s+/g, "");

  const res = await fetch(api);
  const data = await res.json();

  if (env.WEATHER_KV) {
    await env.WEATHER_KV.put(cacheKey, JSON.stringify(data), {
      expirationTtl: 600,
    });
  }

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
