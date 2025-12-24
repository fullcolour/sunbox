export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const target = url.searchParams.get('url');

  if (!target) {
    return new Response(
      JSON.stringify({ error: 'Missing url parameter' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const resp = await fetch(target, {
      headers: {
        'User-Agent': 'AppleWeatherPro/1.0',
        'Accept': 'application/json',
      },
    });

    const data = await resp.text();

    return new Response(data, {
      status: resp.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=600',
      },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
