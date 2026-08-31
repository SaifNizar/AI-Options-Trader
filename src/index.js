export default {
  async fetch(request, env) {
    try {
      const response = await fetch(
        "https://api.upstox.com/v2/market-quote/quotes?instrument_key=NSE_INDEX%7CNifty%2050",
        {
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${env.UPSTOX_TOKEN}`
          }
        }
      );

      const data = await response.json();

      return new Response(
        JSON.stringify({
          status: response.ok ? "ok" : "error",
          upstox_status: response.status,
          data: data
        }),
        {
          status: response.ok ? 200 : response.status,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

    } catch (error) {
      return new Response(
        JSON.stringify({
          status: "error",
          message: error.message
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }
  }
};
