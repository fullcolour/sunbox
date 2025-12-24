export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname !== "/proxy") {
      return new Response("Not Found", { status: 404 });
    }

    const target = url.searchParams.get("url");
    if (!target) {
      return new Response("Missing url", { status: 400 });
    }

    const res = await fetch(target, {
      headers: {
        "User-Agent": "AppleWeatherPro/1.0",
        "Accept": "application/json",
      },
    });

    return new Response(res.body, {
      status: res.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=300",
      },
    });
  },
};
