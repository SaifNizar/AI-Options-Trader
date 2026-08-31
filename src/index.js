export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // API
    if (url.pathname === "/api/options") {
      return getOptions(request, env);
    }

    // DASHBOARD
    return new Response(`
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>AI Options Trader</title>

<style>

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #071326;
  color: white;
}

.container {
  max-width: 1000px;
  margin: auto;
  padding: 20px;
}

h1 {
  margin: 0;
  font-size: 32px;
}

.subtitle {
  color: #94a3b8;
  margin-top: 6px;
  margin-bottom: 22px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.card {
  background: #17283d;
  border-radius: 16px;
  padding: 18px;
  margin-bottom: 14px;
}

.label {
  color: #94a3b8;
  font-size: 14px;
}

.value {
  font-size: 27px;
  font-weight: bold;
  margin-top: 8px;
}

.small {
  font-size: 14px;
  color: #94a3b8;
  margin-top: 8px;
}

.bullish {
  color: #22c55e;
}

.bearish {
  color: #ef4444;
}

.neutral {
  color: #facc15;
}

.bias-card {
  border: 1px solid #334155;
}

.bias {
  font-size: 34px;
  font-weight: bold;
  margin-top: 8px;
}

.confidence {
  margin-top: 10px;
  font-size: 15px;
  color: #cbd5e1;
}

.signal-box {
  margin-top: 15px;
  padding: 14px;
  background: #0f1d31;
  border-radius: 12px;
  line-height: 1.5;
}

.two {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
  font-size: 13px;
}

th {
  color: #94a3b8;
  font-weight: normal;
}

th,
td {
  padding: 10px 5px;
  text-align: right;
  border-bottom: 1px solid #334155;
}

th:first-child,
td:first-child {
  text-align: left;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #94a3b8;
}

.error {
  color: #ef4444;
  padding: 20px 0;
}

.refresh {
  text-align: center;
  color: #64748b;
  font-size: 13px;
  margin-top: 18px;
}

@media(max-width:600px) {

  .container {
    padding: 16px;
  }

  h1 {
    font-size: 28px;
  }

  .grid {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .two {
    grid-template-columns: 1fr;
  }

  .card {
    padding: 15px;
    border-radius: 14px;
  }

  .value {
    font-size: 22px;
  }

  .bias {
    font-size: 29px;
  }

  table {
    font-size: 11px;
  }

  th,
  td {
    padding: 8px 3px;
  }
}

</style>
</head>

<body>

<div class="container">

<h1>📊 AI Options Trader</h1>

<div class="subtitle">
NIFTY 50 • Live Option Chain • Rule-Based Market Intelligence
</div>

<div id="status" class="loading">
Loading market data...
</div>

<div id="dashboard" style="display:none">

<!-- AI BIAS -->

<div class="card bias-card">

<div class="label">
🤖 AI MARKET BIAS
</div>

<div id="bias" class="bias">
-
</div>

<div id="confidence" class="confidence">
-
</div>

<div id="signal" class="signal-box">
-
</div>

</div>


<!-- MAIN METRICS -->

<div class="grid">

<div class="card">
<div class="label">NIFTY 50</div>
<div id="spot" class="value">-</div>
</div>

<div class="card">
<div class="label">PCR</div>
<div id="pcr" class="value">-</div>
<div id="pcrText" class="small">-</div>
</div>

<div class="card">
<div class="label">MAX PAIN</div>
<div id="maxPain" class="value">-</div>
</div>

<div class="card">
<div class="label">EXPIRY</div>
<div id="expiry" class="value">-</div>
</div>

</div>


<!-- OI -->

<div class="two">

<div class="card">

<div class="label">
TOTAL CALL OI
</div>

<div id="callOI" class="value">
-
</div>

<div class="small">
Call open interest
</div>

</div>


<div class="card">

<div class="label">
TOTAL PUT OI
</div>

<div id="putOI" class="value">
-
</div>

<div class="small">
Put open interest
</div>

</div>

</div>


<!-- SUPPORT RESISTANCE -->

<div class="two">

<div class="card">

<div class="label">
🟢 SUPPORT
</div>

<div id="support" class="value bullish">
-
</div>

<div class="small">
Highest nearby Put OI
</div>

</div>


<div class="card">

<div class="label">
🔴 RESISTANCE
</div>

<div id="resistance" class="value bearish">
-
</div>

<div class="small">
Highest nearby Call OI
</div>

</div>

</div>


<!-- OPTIONS -->

<div class="card">

<h2>🎯 Nearby Strikes</h2>

<table>

<thead>

<tr>
<th>Strike</th>
<th>Call LTP</th>
<th>Call OI</th>
<th>Put OI</th>
<th>Put LTP</th>
</tr>

</thead>

<tbody id="options"></tbody>

</table>

<div class="refresh">
Data refreshes automatically every 30 seconds.
</div>

</div>

</div>

</div>


<script>

async function loadData() {

  try {

    const response = await fetch("/api/options");

    const data = await response.json();

    if (data.status !== "ok") {
      throw new Error(
        data.message || "Unable to load market data"
      );
    }

    const market = data.market;
    const analysis = data.analysis;

    document.getElementById("status").style.display =
      "none";

    document.getElementById("dashboard").style.display =
      "block";


    // SPOT

    document.getElementById("spot").textContent =
      Number(market.spot).toLocaleString("en-IN");


    // EXPIRY

    document.getElementById("expiry").textContent =
      market.expiry;


    // PCR

    document.getElementById("pcr").textContent =
      analysis.pcr ?? "-";

    document.getElementById("pcrText").textContent =
      analysis.pcr_signal || "-";


    // MAX PAIN

    document.getElementById("maxPain").textContent =
      analysis.max_pain ?? "-";


    // OI

    document.getElementById("callOI").textContent =
      Number(
        analysis.total_call_oi || 0
      ).toLocaleString("en-IN");


    document.getElementById("putOI").textContent =
      Number(
        analysis.total_put_oi || 0
      ).toLocaleString("en-IN");


    // SUPPORT

    document.getElementById("support").textContent =
      analysis.support ?? "-";


    // RESISTANCE

    document.getElementById("resistance").textContent =
      analysis.resistance ?? "-";


    // AI BIAS

    const bias =
      document.getElementById("bias");

    bias.textContent =
      analysis.ai_bias || "NEUTRAL";

    bias.className =
      "bias " +
      (
        analysis.ai_bias === "BULLISH"
          ? "bullish"
          : analysis.ai_bias === "BEARISH"
          ? "bearish"
          : "neutral"
      );


    document.getElementById("confidence").textContent =
      "Confidence: " +
      (analysis.confidence ?? 0) +
      "%";


    document.getElementById("signal").textContent =
      analysis.explanation ||
      "Market conditions are currently neutral.";


    // TABLE

    const table =
      document.getElementById("options");

    table.innerHTML = "";


    data.options.forEach(row => {

      const tr =
        document.createElement("tr");

      tr.innerHTML = `

        <td>${row.strike}</td>

        <td>
          ${row.call.ltp ?? "-"}
        </td>

        <td>
          ${Number(
            row.call.oi || 0
          ).toLocaleString("en-IN")}
        </td>

        <td>
          ${Number(
            row.put.oi || 0
          ).toLocaleString("en-IN")}
        </td>

        <td>
          ${row.put.ltp ?? "-"}
        </td>

      `;

      table.appendChild(tr);

    });

  }

  catch (error) {

    document.getElementById("status").innerHTML =
      '<div class="error">❌ ' +
      error.message +
      '</div>';

  }

}


// First load

loadData();


// Refresh every 30 seconds

setInterval(loadData, 30000);

</script>

</body>
</html>
`, {
      headers: {
        "Content-Type":
          "text/html;charset=UTF-8"
      }
    });
  }
};


// ======================================================
// OPTIONS API
// ======================================================

async function getOptions(request, env) {

  try {

    const url =
      new URL(request.url);


    // Use supplied expiry if available

    let expiry =
      url.searchParams.get("expiry");


    // Otherwise calculate next Tuesday

    if (!expiry) {
      expiry = getNextTuesday();
    }


    const apiUrl =
      "https://api.upstox.com/v2/option/chain" +
      "?instrument_key=" +
      encodeURIComponent(
        "NSE_INDEX|Nifty 50"
      ) +
      "&expiry_date=" +
      encodeURIComponent(expiry);


    const response =
      await fetch(apiUrl, {

        headers: {

          "Accept":
            "application/json",

          "Authorization":
            "Bearer " +
            env.UPSTOX_TOKEN

        }

      });


    const result =
      await response.json();


    if (!response.ok) {

      return json({

        status: "error",

        upstox_status:
          response.status,

        message: result

      }, response.status);

    }


    const chain =
      result.data || [];


    if (!chain.length) {

      return json({

        status: "error",

        message:
          "No option-chain data returned",

        expiry

      }, 404);

    }


    // ==================================================
    // SPOT
    // ==================================================

    const spot =
      chain[0].underlying_spot_price;


    // ==================================================
    // TOTAL OI
    // ==================================================

    let totalCallOI = 0;

    let totalPutOI = 0;


    for (const row of chain) {

      const callOI =
        Number(
          row.call_options
            ?.market_data
            ?.oi || 0
        );


      const putOI =
        Number(
          row.put_options
            ?.market_data
            ?.oi || 0
        );


      totalCallOI += callOI;

      totalPutOI += putOI;

    }


    // ==================================================
    // PCR
    // ==================================================

    const pcr =
      totalCallOI > 0
        ? totalPutOI / totalCallOI
        : null;


    let pcrSignal =
      "Neutral PCR";


    if (pcr !== null) {

      if (pcr >= 1.20) {

        pcrSignal =
          "Strong Put OI → bullish pressure";

      }

      else if (pcr >= 1.00) {

        pcrSignal =
          "Put OI slightly stronger";

      }

      else if (pcr <= 0.80) {

        pcrSignal =
          "Strong Call OI → bearish pressure";

      }

      else {

        pcrSignal =
          "Balanced Call/Put OI";

      }

    }


    // ==================================================
    // MAX PAIN
    // ==================================================

    let maxPain = null;

    let lowestPain = Infinity;


    for (const candidate of chain) {

      const strike =
        Number(candidate.strike_price);


      let pain = 0;


      for (const row of chain) {

        const rowStrike =
          Number(row.strike_price);


        const callOI =
          Number(
            row.call_options
              ?.market_data
              ?.oi || 0
          );


        const putOI =
          Number(
            row.put_options
              ?.market_data
              ?.oi || 0
          );


        if (rowStrike > strike) {

          pain +=
            (rowStrike - strike) *
            callOI;

        }


        if (rowStrike < strike) {

          pain +=
            (strike - rowStrike) *
            putOI;

        }

      }


      if (pain < lowestPain) {

        lowestPain = pain;

        maxPain = strike;

      }

    }


    // ==================================================
    // SUPPORT / RESISTANCE
    // ==================================================

    const belowSpot =
      chain.filter(
        row =>
          Number(row.strike_price) <=
          Number(spot)
      );


    const aboveSpot =
      chain.filter(
        row =>
          Number(row.strike_price) >=
          Number(spot)
      );


    let support = null;

    let resistance = null;


    if (belowSpot.length) {

      const supportRow =
        [...belowSpot].sort(
          (a, b) =>
            Number(
              b.put_options
                ?.market_data
                ?.oi || 0
            ) -
            Number(
              a.put_options
                ?.market_data
                ?.oi || 0
            )
        )[0];


      support =
        supportRow.strike_price;

    }


    if (aboveSpot.length) {

      const resistanceRow =
        [...aboveSpot].sort(
          (a, b) =>
            Number(
              b.call_options
                ?.market_data
                ?.oi || 0
            ) -
            Number(
              a.call_options
                ?.market_data
                ?.oi || 0
            )
        )[0];


      resistance =
        resistanceRow.strike_price;

    }


    // ==================================================
    // AI-STYLE MARKET BIAS
    // ==================================================

    let score = 0;


    // PCR signal

    if (pcr !== null) {

      if (pcr >= 1.20) {

        score += 2;

      }

      else if (pcr >= 1.00) {

        score += 1;

      }

      else if (pcr <= 0.80) {

        score -= 2;

      }

      else if (pcr < 1.00) {

        score -= 1;

      }

    }


    // Distance from max pain

    if (
      maxPain !== null &&
      spot !== null
    ) {

      const distance =
        Number(spot) -
        Number(maxPain);


      // Above max pain

      if (distance > 100) {

        score -= 1;

      }

      // Below max pain

      else if (distance < -100) {

        score += 1;

      }

    }


    // Support / resistance relationship

    if (
      support !== null &&
      resistance !== null
    ) {

      const supportDistance =
        Number(spot) -
        Number(support);


      const resistanceDistance =
        Number(resistance) -
        Number(spot);


      // Close to strong support

      if (
        supportDistance >= 0 &&
        supportDistance <= 100
      ) {

        score += 1;

      }


      // Close to strong resistance

      if (
        resistanceDistance >= 0 &&
        resistanceDistance <= 100
      ) {

        score -= 1;

      }

    }


    // ==================================================
    // FINAL BIAS
    // ==================================================

    let aiBias =
      "NEUTRAL";


    if (score >= 3) {

      aiBias =
        "BULLISH";

    }

    else if (score <= -3) {

      aiBias =
        "BEARISH";

    }


    // ==================================================
    // CONFIDENCE
    // ==================================================

    let confidence =
      50 + Math.abs(score) * 10;


    if (confidence > 90) {
      confidence = 90;
    }


    // ==================================================
    // EXPLANATION
    // ==================================================

    let explanation =
      "";


    if (aiBias === "BULLISH") {

      explanation =
        "Options positioning is showing a bullish bias. " +
        "Put-side positioning is relatively stronger, " +
        "although price action should still confirm the move.";

    }

    else if (aiBias === "BEARISH") {

      explanation =
        "Options positioning is showing a bearish bias. " +
        "Call-side positioning is relatively stronger, " +
        "although price action should still confirm the move.";

    }

    else {

      explanation =
        "Options positioning is mixed. " +
        "There is no strong directional edge from the current " +
        "PCR, OI and max-pain structure.";

    }


    // ==================================================
    // NEARBY STRIKES
    // ==================================================

    const nearby =
      [...chain]
        .sort(
          (a, b) =>
            Math.abs(
              Number(a.strike_price) -
              Number(spot)
            ) -
            Math.abs(
              Number(b.strike_price) -
              Number(spot)
            )
        )
        .slice(0, 11);


    const options =
      nearby.map(row => {

        const call =
          row.call_options || {};


        const put =
          row.put_options || {};


        return {

          strike:
            row.strike_price,


          call: {

            ltp:
              call.market_data
                ?.ltp ?? null,

            oi:
              call.market_data
                ?.oi ?? null,

            volume:
              call.market_data
                ?.volume ?? null,

            iv:
              call.option_greeks
                ?.iv ?? null,

            delta:
              call.option_greeks
                ?.delta ?? null,

            theta:
              call.option_greeks
                ?.theta ?? null

          },


          put: {

            ltp:
              put.market_data
                ?.ltp ?? null,

            oi:
              put.market_data
                ?.oi ?? null,

            volume:
              put.market_data
                ?.volume ?? null,

            iv:
              put.option_greeks
                ?.iv ?? null,

            delta:
              put.option_greeks
                ?.delta ?? null,

            theta:
              put.option_greeks
                ?.theta ?? null

          }

        };

      });


    // ==================================================
    // FINAL RESPONSE
    // ==================================================

    return json({

      status: "ok",


      market: {

        underlying:
          "NIFTY 50",

        spot,

        expiry

      },


      analysis: {

        ai_bias:
          aiBias,

        confidence,

        score,

        explanation,

        pcr:
          pcr !== null
            ? Number(
                pcr.toFixed(3)
              )
            : null,

        pcr_signal:
          pcrSignal,

        total_call_oi:
          totalCallOI,

        total_put_oi:
          totalPutOI,

        max_pain:
          maxPain,

        support,

        resistance

      },


      options

    });


  }

  catch (error) {

    return json({

      status: "error",

      message:
        error.message

    }, 500);

  }

}


// ======================================================
// NEXT TUESDAY
// ======================================================

function getNextTuesday() {

  const now =
    new Date();


  const day =
    now.getUTCDay();


  let days =
    (2 - day + 7) % 7;


  if (days === 0) {
    days = 7;
  }


  const date =
    new Date(
      now.getTime() +
      days * 86400000
    );


  return date
    .toISOString()
    .slice(0, 10);

}


// ======================================================
// JSON HELPER
// ======================================================

function json(
  data,
  status = 200
) {

  return new Response(

    JSON.stringify(
      data,
      null,
      2
    ),

    {

      status,

      headers: {

        "Content-Type":
          "application/json",

        "Access-Control-Allow-Origin":
          "*"

      }

    }

  );

}
