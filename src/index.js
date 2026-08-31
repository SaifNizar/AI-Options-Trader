export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Health check
    if (request.method === "GET" && url.pathname === "/") {
      return json({
        status: "ok",
        service: "AI Options Trader",
        message: "Worker is running",
        version: "1.0"
      });
    }

    // Options analysis endpoint
    if (request.method === "POST" && url.pathname === "/analyze") {
      try {
        const body = await request.json();

        const {
          index = "NIFTY",
          currentPrice,
          timeframe,
          optionData,
          marketContext,
          bias
        } = body;

        if (!currentPrice) {
          return json({
            status: "error",
            message: "currentPrice is required"
          }, 400);
        }

        return json({
          status: "ok",
          service: "AI Options Trader",
          analysis: {
            index,
            currentPrice,
            timeframe: timeframe || "not provided",
            bias: bias || "neutral",
            optionData: optionData || "not provided",
            marketContext: marketContext || "not provided",

            verdict: "NO TRADE",
            probability: "Not enough data",
            reason:
              "The analysis engine needs reliable option-chain and market data before giving a CALL or PUT decision.",

            riskPlan: {
              entry: "Not available",
              stopLoss: "Not available",
              target: "Not available",
              maxLoss: "Do not enter until sufficient data is available"
            }
          }
        });

      } catch (error) {
        return json({
          status: "error",
          message: "Invalid JSON request",
          details: error.message
        }, 400);
      }
    }

    return json({
      status: "error",
      message: "Endpoint not found"
    }, 404);
  }
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json"
    }
  });
}
