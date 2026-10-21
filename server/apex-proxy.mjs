const ORIGIN = "https://apexapp-backend.onrender.com";

/** @param {Request} request */
export async function proxyApex(request) {
  const url = new URL(request.url);
  const suffix = url.pathname.replace(/^\/api\/apex/, "") + url.search;
  const headers = new Headers();
  const auth = request.headers.get("authorization");
  const type = request.headers.get("content-type");
  if (auth) headers.set("authorization", auth);
  if (type) headers.set("content-type", type);
  headers.set("accept", "application/json");
  const method = request.method || "GET";
  const hasBody = method !== "GET" && method !== "HEAD";
  try {
    const upstream = await fetch(ORIGIN + suffix, {
      method,
      headers,
      body: hasBody ? await request.arrayBuffer() : undefined,
      signal: AbortSignal.timeout(90000),
    });
    const out = new Headers();
    const contentType = upstream.headers.get("content-type");
    if (contentType) out.set("content-type", contentType);
    return new Response(upstream.body, { status: upstream.status, headers: out });
  } catch {
    return new Response(
      JSON.stringify({
        message:
          "Сервер Апекс не ответил. Если он спал, первый запрос занимает около минуты — попробуйте ещё раз.",
      }),
      { status: 502, headers: { "content-type": "application/json" } },
    );
  }
}
