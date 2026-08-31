export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // API endpoint
    if (url.pathname === "/api/options") {
      return getOptions(request, env);
    }

    // Dashboard
    return new Response(`
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>AI Options Trader</title>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #0f172a;
  color: white;
}

.container {
  max-width: 900px;
  margin: auto;
  padding: 16px;
}

h1 {
  margin-bottom: 4px;
}

.subtitle {
  color: #94a3b8;
  margin-bottom: 20px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.card {
  background: #1e293b;
  border-radius: 14px;
  padding: 16px;
}

.label {
  color: #94a3b8;
  font-size: 13px;
}

.value {
  font-size: 24px;
  font-weight: bold;
  margin-top: 6px;
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

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  font-size: 12px;
}

th, td {
  padding: 8px 4px;
  text-align: right;
  border-bottom: 1px solid #334155;
}

th {
  color: #94a3b8;
}

.loading {
  text-align: center;
  padding: 30px;
  color: #94a3b8;
}

.error {
  color: #ef4444;
  padding: 20px 0;
}

.refresh {
  color: #94a3b8;
  font-size: 12px;
  margin-top: 15px;
}

@media(max-width:600px) {
  .grid {
    grid-template-columns: 1fr 1fr;
  }

  .value {
    font-size: 20px;
  }

  table {
    font-size: 11px;
  }

  th, td {
    padding: 7px 3px;
  }
}
</style>
</head>

<body>

<div class="container">

<h1>📊 AI Options Trader</h1>

<div class="subtitle">
NIFTY 50 • Live Option Chain
</div>

<div id="status" class="loading">
Loading market data...
</div>

<div id="dashboard" style="display:none">

<div class="grid">

<div class="card">
<div class="label">NIFTY 50</div>
<div id="spot" class="value">-</div>
</div>

<div class="card">
<div class="label">Market View</div>
<div id="view" class="value">-</div>
</div>

<div class="card">
<div class="label">PCR</div>
<div id="pcr" class="value">-</div>
</div>

<div class="card">
<div class="label">Max Pain</div>
<div id="maxPain" class="value">-</div>
</div>

<div class="card">
<div class="label">Total Call OI</div>
<div id="callOI" class="value">-</div>
</div>

<div class="card">
<div class="label">Total Put OI</div>
<div id="putOI" class="value">-</div>
</div>

</div>

<br>

<div class="card">

<h3>🎯 Nearby Strikes</h3>

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

    // Hide loading message
    document.getElementById("status").style.display = "none";

    // Show dashboard
    document.getElementById("dashboard").style.display = "block";

    // NIFTY spot
    document.getElementById("spot").textContent =
      Number(market.spot).toLocaleString("en-IN");

    // Market view
    const viewElement =
      document.getElementById("view");

    viewElement.textContent =
      analysis.view;

    viewElement.className =
      "value " +
      (
        analysis.view === "BULLISH"
          ? "bullish"
          : analysis.view === "BEARISH"
          ? "bearish"
          : "neutral"
      );

    // PCR
    document.getElementById("pcr").textContent =
      analysis.pcr ?? "-";

    // Max pain
    document.getElementById("maxPain").textContent =
      analysis.max_pain ?? "-";

    // Call OI
    document.getElementById("callOI").textContent =
      Number(
        analysis.total_call_oi || 0
      ).toLocaleString("en-IN");

    // Put OI
    document.getElementById("putOI").textContent =
      Number(
        analysis.total_put_oi || 0
      ).toLocaleString("en-IN");

    // Options table
    const table =
      document.getElementById("options");

    table.innerHTML = "";

    data.options.forEach(row => {

      table.innerHTML +=
        "<tr>" +
          "<td>" +
            row.strike +
          "</td>" +

          "<td>" +
            (row.call.ltp ?? "-") +
          "</td>" +

          "<td>" +
            Number(
              row.call.oi || 0
            ).toLocaleString("en-IN") +
          "</td>" +

          "<td>" +
            Number(
              row.put.oi || 0
            ).toLocaleString("en-IN") +
          "</td>" +

          "<td>" +
            (row.put.ltp ?? "-") +
          "</td>" +

        "</tr>";

    });

  } catch (error) {

    document.getElementById("status").innerHTML =
      '<div class="error">❌ ' +
      error.message +
      "</div>";

  }

}


// Load immediately
loadData();


// Refresh every 30 seconds
setInterval(
  loadData,
  30000
);

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
// UPSTOX OPTION CHAIN
// ======================================================

async function getOptions(request, env) {

  try {

    const url =
      new URL(request.url);

    /*
      You can manually specify expiry:

      /api/options?expiry=2026-09-01

      If no expiry is supplied,
      the worker automatically finds
      the next Tuesday.
    */

    let expiry =
      url.searchParams.get("expiry");


    if (!expiry) {

      expiry =
        getNextTuesday();

    }


    // Upstox API URL
    const apiUrl =
      "https://api.upstox.com/v2/option/chain" +
      "?instrument_key=" +
      encodeURIComponent(
        "NSE_INDEX|Nifty 50"
      ) +
      "&expiry_date=" +
      encodeURIComponent(
        expiry
      );


    // Call Upstox
    const response =
      await fetch(
        apiUrl,
        {
          headers: {

            "Accept":
              "application/json",

            "Authorization":
              "Bearer " +
              env.UPSTOX_TOKEN

          }
        }
      );


    const result =
      await response.json();


    // Handle Upstox errors
    if (!response.ok) {

      return json(
        {
          status: "error",

          upstox_status:
            response.status,

          message:
            result

        },
        response.status
      );

    }


    const chain =
      result.data || [];


    // No option chain
    if (!chain.length) {

      return json(
        {
          status: "error",

          message:
            "No option-chain data returned",

          expiry:
            expiry
        },
        404
      );

    }


    // NIFTY spot
    const spot =
      chain[0].underlying_spot_price;


    // ==================================================
    // TOTAL OPEN INTEREST
    // ==================================================

    let totalCallOI = 0;

    let totalPutOI = 0;


    for (
      const row of chain
    ) {

      const callOI =
        row.call_options
          ?.market_data
          ?.oi || 0;


      const putOI =
        row.put_options
          ?.market_data
          ?.oi || 0;


      totalCallOI +=
        callOI;

      totalPutOI +=
        putOI;

    }


    // ==================================================
    // PCR
    // ==================================================

    const pcr =
      totalCallOI > 0
        ? totalPutOI /
          totalCallOI
        : null;


    // ==================================================
    // MARKET VIEW
    // ==================================================

    let view =
      "NEUTRAL";


    if (pcr !== null) {

      if (pcr >= 1.2) {

        view =
          "BULLISH";

      }

      else if (pcr <= 0.8) {

        view =
          "BEARISH";

      }

    }


    // ==================================================
    // MAX PAIN
    // ==================================================

    let maxPain =
      null;

    let lowestPain =
      Infinity;


    for (
      const candidate of chain
    ) {

      const strike =
        candidate.strike_price;


      let pain =
        0;


      for (
        const row of chain
      ) {

        const rowStrike =
          row.strike_price;


        const callOI =
          row.call_options
            ?.market_data
            ?.oi || 0;


        const putOI =
          row.put_options
            ?.market_data
            ?.oi || 0;


        // Call pain
        if (
          rowStrike >
          strike
        ) {

          pain +=
            (
              rowStrike -
              strike
            ) *
            callOI;

        }


        // Put pain
        if (
          rowStrike <
          strike
        ) {

          pain +=
            (
              strike -
              rowStrike
            ) *
            putOI;

        }

      }


      if (
        pain <
        lowestPain
      ) {

        lowestPain =
          pain;

        maxPain =
          strike;

      }

    }


    // ==================================================
    // NEARBY STRIKES
    // ==================================================

    const nearby =
      [...chain]
        .sort(
          (a, b) =>
            Math.abs(
              a.strike_price -
              spot
            ) -
            Math.abs(
              b.strike_price -
              spot
            )
        )
        .slice(0, 11);


    // ==================================================
    // FORMAT OPTIONS
    // ==================================================

    const options =
      nearby.map(
        row => {

          const call =
            row.call_options ||
            {};

          const put =
            row.put_options ||
            {};


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

        }
      );


    // ==================================================
    // FINAL RESPONSE
    // ==================================================

    return json({

      status:
        "ok",


      market: {

        underlying:
          "NIFTY 50",

        spot:
          spot,

        expiry:
          expiry

      },


      analysis: {

        view:
          view,

        pcr:
          pcr !== null
            ? Number(
                pcr.toFixed(3)
              )
            : null,

        total_call_oi:
          totalCallOI,

        total_put_oi:
          totalPutOI,

        max_pain:
          maxPain

      },


      options:
        options

    });


  }

  catch (error) {

    return json(
      {
        status:
          "error",

        message:
          error.message
      },
      500
    );

  }

}


// ======================================================
// FIND NEXT TUESDAY
// ======================================================

function getNextTuesday() {

  const now =
    new Date();


  const day =
    now.getUTCDay();


  let days =
    (2 - day + 7) % 7;


  // If today is Tuesday,
  // use next Tuesday.
  if (days === 0) {

    days = 7;

  }


  const date =
    new Date(
      now.getTime() +
      days *
      86400000
    );


  return date
    .toISOString()
    .slice(0, 10);

}


// ======================================================
// JSON RESPONSE HELPER
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

      status:

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
