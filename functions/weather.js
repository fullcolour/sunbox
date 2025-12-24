export async function onRequest(context) {
  const url = new URL(context.request.url);

  const lat = url.searchParams.get("lat");
  const lon = url.searchParams.get("lon");
  const lang = url.searchParams.get("lang") || "en";

  if (!lat || !lon) {
    return new Response(
      JSON.stringify({ error: "Missing lat or lon" }),
      { status: 400 }
    );
  }

  const api = `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}` +
    `&longitude=${lon}` +
    `&current=temperature_2m,apparent_temperature,weathercode,wind_speed_10m` +
    `&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum` +
    `&timezone=auto` +
    `&language=${lang}`;

  const res = await fetch(api);
  const data = await res.json();

  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=600"
    }
  });
}
