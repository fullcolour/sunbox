export async function onRequest(context) {
  const url = new URL(context.request.url);

  const lat = url.searchParams.get("lat");
  const lon = url.searchParams.get("lon");
  const lang = url.searchParams.get("lang") || "en";

  if (!lat || !lon) {
    return new Response(
      JSON.stringify({ error: "Missing lat or lon" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  }

  const api =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}` +
    `&longitude=${lon}` +
    `&current=temperature_2m,weathercode,wind_speed_10m` +
    `&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum` +
    `&timezone=auto` +
    `&language=${lang}`;

  try {
    const res = await fetch(api);
    const data = await res.json();

    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=600"
      }
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch weather" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  }
}
