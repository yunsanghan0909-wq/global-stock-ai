export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": "https://yunsanghan0909-wq.github.io",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    const url = new URL(request.url);
    const path = url.pathname;
    let endpoint;
    let params = {};

    if (path === "/quote") {
      const symbol = url.searchParams.get("symbol");
      if (!symbol || !/^[A-Za-z0-9.:-]{1,20}$/.test(symbol)) {
        return Response.json({ error: "Invalid symbol" }, {
          status: 400, headers: cors
        });
      }
      endpoint = "quote";
      params.symbol = symbol;

    } else if (path === "/search") {
      const query = url.searchParams.get("query");
      if (!query || !/^[A-Za-z0-9 .&-]{1,40}$/.test(query)) {
        return Response.json({ error: "Invalid search query" }, {
          status: 400, headers: cors
        });
      }
      endpoint = "symbol_search";
      params.symbol = query;

    } else {
      return Response.json({ error: "Unknown endpoint" }, {
        status: 404, headers: cors
      });
    }

    const apiUrl = new URL(
      `https://api.twelvedata.com/${endpoint}`
    );

    for (const [key, value] of Object.entries(params)) {
      apiUrl.searchParams.set(key, value);
    }

    apiUrl.searchParams.set("apikey", env.TWELVE_DATA_API_KEY);

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      return Response.json(data, {
        status: response.ok ? 200 : response.status,
        headers: cors
      });
    } catch {
      return Response.json({ error: "Market data request failed" }, {
        status: 502, headers: cors
      });
    }
  }
};
