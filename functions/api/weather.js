export async function onRequest(context) {
  const city = context.request.url.match(/city=([^&]+)/);
  if (!city) {
    return json({ error: '缺少 city 參數' });
  }

  const name = decodeURIComponent(city[1]);

  // 用 Open-Meteo 的地理搜尋
  const geo = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1`
  ).then(r => r.json());

  if (!geo.results || !geo.results.length) {
    return json({ error: '找不到城市' });
  }

  const { latitude, longitude, name: cityName } = geo.results[0];

  const weather = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
  ).then(r => r.json());

  const w = weather.current_weather;

  return json({
    city: cityName,
    temperature: w.temperature,
    wind: w.windspeed,
    time: w.time
  });
}

function json(data) {
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
}
