export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);

      const expiry = url.searchParams.get("expiry") || "current_week";

      const apiUrl =
        `https://api.upstox.com/v2/option/chain` +
        `?instrument_key=NSE_INDEX%7CNifty%2050` +
        `&expiry_date=${encodeURIComponent(expiry)}`;

      const response = await fetch(apiUrl, {
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${env.UPSTOX_TOKEN}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        return json({
          status: "error",
          upstox_status: response.status,
          error: result
        }, response.status);
      }

      const chain = result.data || [];

      if (!chain.length) {
        return json({
          status: "error",
          message: "No option-chain data returned"
        }, 404);
      }

      const spot = chain[0].underlying_spot_price;

      let totalCallOI = 0;
      let totalPutOI = 0;

      let maxPain = null;
      let lowestPain = Infinity;

      for (const row of chain) {
        const callOI = row.call_options?.market_data?.oi || 0;
        const putOI = row.put_options?.market_data?.oi || 0;

        totalCallOI += callOI;
        totalPutOI += putOI;

        let pain = 0;

        for (const x of chain) {
          const cOI = x.call_options?.market_data?.oi || 0;
          const pOI = x.put_options?.market_data?.oi || 0;
          const strike = x.strike_price;

          pain += Math.max(0, strike - row.strike_price) * cOI;
          pain += Math.max(0, row.strike_price - strike) * pOI;
        }

        if (pain < lowestPain) {
          lowestPain = pain;
          maxPain = row.strike_price;
        }
      }

      const pcr =
        totalCallOI > 0
          ? totalPutOI / totalCallOI
          : null;

      let view = "NEUTRAL";

      if (pcr !== null) {
        if (pcr >= 1.2) {
          view = "BULLISH";
        } else if (pcr <= 0.8) {
          view = "BEARISH";
        }
      }

      const nearest = [...chain]
        .sort(
          (a, b) =>
            Math.abs(a.strike_price - spot) -
            Math.abs(b.strike_price - spot)
        )
        .slice(0, 11);

      const options = nearest.map(row => ({
        strike: row.strike_price,

        call: {
          ltp: row.call_options?.market_data?.ltp ?? null,
          oi: row.call_options?.market_data?.oi ?? null,
          volume: row.call_options?.market_data?.volume ?? null,
          iv: row.call_options?.option_greeks?.iv ?? null,
          delta: row.call_options?.option_greeks?.delta ?? null,
          theta: row.call_options?.option_greeks?.theta ?? null
        },

        put: {
          ltp: row.put_options?.market_data?.ltp ?? null,
          oi: row.put_options?.market_data?.oi ?? null,
          volume: row.put_options?.market_data?.volume ?? null,
          iv: row.put_options?.option_greeks?.iv ?? null,
          delta: row.put_options?.option_greeks?.delta ?? null,
          theta: row.put_options?.option_greeks?.theta ?? null
        }
      }));

      return json({
        status: "ok",

        market: {
          underlying: "NIFTY 50",
          spot,
          expiry: chain[0].expiry
        },

        analysis: {
          view,
          pcr: Number(pcr?.toFixed(3)),
          total_call_oi: totalCallOI,
          total_put_oi: totalPutOI,
          max_pain: maxPain
        },

        options
      });

    } catch (error) {
      return json({
        status: "error",
        message: error.message
      }, 500);
    }
  }
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
