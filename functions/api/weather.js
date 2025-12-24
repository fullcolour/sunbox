export async function onRequest(context) {
  const url = new URL(context.request.url);
  const target = url.searchParams.get("target");

  if (!target) {
    return new Response(JSON.stringify({ error: "Missing target" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  const apiUrl = decodeURIComponent(target);

  const res = await fetch(apiUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  });

  return new Response(res.body, {
    status: res.status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
