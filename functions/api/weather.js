export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  const lat = url.searchParams.get("lat");
  const lon = url.searchParams.get("lon");

  if (!lat || !lon) {
    return new Response(JSON.stringify({ error: "Missing lat/lon" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  const apiUrl = `https://api.open-meteo.com/v1/forecast
    ?latitude=${lat}
    &longitude=${lon}
    &current_weather=true
    &daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_probability_max
    &forecast_days=7
    &timezone=auto
  `.replace(/\s+/g, "");

  const res = await fetch(apiUrl);
  const data = await res.json();

  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
