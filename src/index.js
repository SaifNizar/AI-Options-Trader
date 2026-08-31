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
  padding: 18px;
}

h1 {
  margin: 0;
  font-size: 32px;
}

.subtitle {
  color: #94a3b8;
  margin-top: 6px;
  margin-bottom: 20px;
}

.card {
  background: #17283d;
  border-radius: 18px;
  padding: 18px;
  margin-bottom: 14px;
  border: 1px solid #223952;
}

.hero {
  padding: 22px;
}

.hero-title {
  color: #94a3b8;
  font-size: 14px;
  margin-bottom: 8px;
}

.bias {
  font-size: 32px;
  font-weight: bold;
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

.confidence {
  color: #cbd5e1;
  margin-top: 8px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.metric-label {
  color: #94a3b8;
  font-size: 14px;
}

.metric-value {
  font-size: 25px;
  font-weight: bold;
  margin-top: 7px;
}

.small {
  color: #94a3b8;
  font-size: 13px;
  margin-top: 7px;
}

.section-title {
  font-size: 21px;
  margin-top: 0;
}

.levels {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.level {
  background: #0e1d31;
  border-radius: 12px;
  padding: 14px;
  text-align: center;
}

.level-label {
  color: #94a3b8;
  font-size: 13px;
}

.level-value {
  font-size: 21px;
  font-weight: bold;
  margin-top: 6px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

th {
  color: #94a3b8;
  padding: 10px 5px;
  border-bottom: 1px solid #334155;
}

td {
  padding: 10px 5px;
  text-align: right;
  border-bottom: 1px solid #26384d;
}

th:first-child,
td:first-child {
  text-align: left;
}

.atm {
  background: #243a55;
  font-weight: bold;
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

.footer {
  color: #64748b;
  text-align: center;
  font-size: 12px;
  padding: 10px;
}

@media(max-width:600px) {

  .container {
    padding: 14px;
  }

  h1 {
    font-size: 27px;
  }

  .grid {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .metric-value {
    font-size: 20px;
  }

  .levels {
    grid-template-columns: 1fr 1fr 1fr;
  }

  .bias {
    font-size: 28px;
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
NIFTY 50 • Options Intelligence Dashboard
</div>

<div id="status" class="loading">
Loading live market data...
</div>

<div id="dashboard" style="display:none">

<!-- MARKET BIAS -->

<div class="card hero">

<div class="hero-title">
AI MARKET BIAS
</div>

<div id="bias" class="bias">
-
</div>

<div id="confidence" class="confidence">
Confidence: -
</div>

<div id="reason" class="small">
-
</div>

</div>


<!-- MAIN METRICS -->

<div class="grid">

<div class="card">

<div class="metric-label">
NIFTY 50
</div>

<div id="spot" class="metric-value">
-
</div>

<div id="expiry" class="small">
-
</div>

</div>


<div class="card">

<div class="metric-label">
PCR
</div>

<div id="pcr" class="metric-value">
-
</div>

<div class="small">
Put OI / Call OI
</div>

</div>


<div class="card">

<div class="metric-label">
MAX PAIN
</div>

<div id="maxPain" class="metric-value">
-
</div>

<div class="small">
Estimated expiry pressure
</div>

</div>


<div class="card">

<div class="metric-label">
ATM STRIKE
</div>

<div id="atm" class="metric-value">
-
</div>

<div class="small">
Closest strike to spot
</div>

</div>


<div class="card">

<div class="metric-label">
TOTAL CALL OI
</div>

<div id="callOI" class="metric-value">
-
</div>

</div>


<div class="card">

<div class="metric-label">
TOTAL PUT OI
</div>

<div id="putOI" class="metric-value">
-
</div>

</div>

</div>


<!-- SUPPORT RESISTANCE -->

<div class="card">

<h2 class="section-title">
🎯 Support / Resistance
</h2>

<div class="levels">

<div class="level">

<div class="level-label">
SUPPORT 2
</div>

<div id="support2" class="level-value bullish">
-
</div>

</div>


<div class="level">

<div class="level-label">
SUPPORT 1
</div>

<div id="support1" class="level-value bullish">
-
</div>

</div>


<div class="level">

<div class="level-label">
RESISTANCE 1
</div>

<div id="resistance1" class="level-value bearish">
-
</div>

</div>


</div>

<div style="height:10px"></div>

<div class="levels">

<div class="level">

<div class="level-label">
RESISTANCE 2
</div>

<div id="resistance2" class="level-value bearish">
-
</div>

</div>


<div class="level">

<div class="level-label">
CALL OI / PUT OI
</div>

<div id="oiRatio" class="level-value">
-
</div>

</div>


<div class="level">

<div class="level-label">
ATM IV
</div>

<div id="atmIV" class="level-value">
-
</div>

</div>

</div>

</div>


<!-- OPTIONS TABLE -->

<div class="card">

<h2 class="section-title">
📈 Nearby Strikes
</h2>

<div style="overflow-x:auto">

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

<tbody id="options">
</tbody>

</table>

</div>

</div>


<!-- ANALYSIS -->

<div class="card">

<h2 class="section-title">
🧠 Market Interpretation
</h2>

<div id="interpretation" class="small"
style="font-size:15px;line-height:1.7">
-
</div>

</div>


<div class="footer">
Data refreshes automatically every 30 seconds.
<br>
For analysis only — not financial advice.
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

    document.getElementById("status").style.display = "none";
    document.getElementById("dashboard").style.display = "block";


    // SPOT

    document.getElementById("spot").textContent =
      Number(market.spot).toLocaleString("en-IN");


    document.getElementById("expiry").textContent =
      "Expiry: " + market.expiry;


    // BIAS

    const bias = document.getElementById("bias");

    bias.textContent = analysis.view;

    bias.className = "bias " +
      (
        analysis.view === "BULLISH"
          ? "bullish"
          : analysis.view === "BEARISH"
          ? "bearish"
          : "neutral"
      );


    document.getElementById("confidence").textContent =
      "Confidence: " + analysis.confidence + "%";


    document.getElementById("reason").textContent =
      analysis.reason;


    // PCR

    document.getElementById("pcr").textContent =
      analysis.pcr !== null
        ? analysis.pcr
        : "-";


    // MAX PAIN

    document.getElementById("maxPain").textContent =
      analysis.max_pain ?? "-";


    // ATM

    document.getElementById("atm").textContent =
      analysis.atm ?? "-";


    // OI

    document.getElementById("callOI").textContent =
      Number(
        analysis.total_call_oi || 0
      ).toLocaleString("en-IN");


    document.getElementById("putOI").textContent =
      Number(
        analysis.total_put_oi || 0
      ).toLocaleString("en-IN");


    // SUPPORT / RESISTANCE

    document.getElementById("support1").textContent =
      analysis.support1 ?? "-";

    document.getElementById("support2").textContent =
      analysis.support2 ?? "-";

    document.getElementById("resistance1").textContent =
      analysis.resistance1 ?? "-";

    document.getElementById("resistance2").textContent =
      analysis.resistance2 ?? "-";


    // OI RATIO

    document.getElementById("oiRatio").textContent =
      analysis.oi_ratio ?? "-";


    // ATM IV

    document.getElementById("atmIV").textContent =
      analysis.atm_iv !== null
        ? analysis.atm_iv
        : "-";


    // INTERPRETATION

    document.getElementById("interpretation").textContent =
      analysis.interpretation;


    // TABLE

    const table =
      document.getElementById("options");

    table.innerHTML = "";


    data.options.forEach(function(row) {

      const tr =
        document.createElement("tr");


      if (row.strike === analysis.atm) {
        tr.className = "atm";
      }


      tr.innerHTML =
        "<td>" +
        row.strike +
        "</td>" +

        "<td>" +
        formatNumber(row.call.ltp) +
        "</td>" +

        "<td>" +
        formatOI(row.call.oi) +
        "</td>" +

        "<td>" +
        formatOI(row.put.oi) +
        "</td>" +

        "<td>" +
        formatNumber(row.put.ltp) +
        "</td>";


      table.appendChild(tr);

    });


  } catch (error) {

    document.getElementById("status").innerHTML =
      '<div class="error">❌ ' +
      error.message +
      '</div>';

  }

}


function formatNumber(value) {

  if (
    value === null ||
    value === undefined
  ) {
    return "-";
  }

  return Number(value).toLocaleString(
    "en-IN",
    {
      maximumFractionDigits: 2
    }
  );

}


function formatOI(value) {

  if (
    value === null ||
    value === undefined
  ) {
    return "-";
  }

  return Number(value).toLocaleString("en-IN");

}


loadData();

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


/* =====================================================
   OPTIONS API
   ===================================================== */

async function getOptions(request, env) {

  try {

    const url =
      new URL(request.url);


    /*
      Example:

      /api/options?expiry=2026-09-01

      If no expiry is supplied,
      automatically use the next Tuesday.
    */

    let expiry =
      url.searchParams.get("expiry");


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


    if (!chain.length) {

      return json(
        {
          status: "error",

          message:
            "No option-chain data returned",

          expiry
        },
        404
      );

    }


    /*
      UNDERLYING SPOT
    */

    const spot =
      Number(
        chain[0]
          .underlying_spot_price
      );


    /*
      TOTAL OI
    */

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


    /*
      PCR
    */

    const pcr =
      totalCallOI > 0
        ? totalPutOI / totalCallOI
        : null;


    /*
      ATM
    */

    const sortedByDistance =
      [...chain].sort(
        (a, b) =>
          Math.abs(
            Number(a.strike_price) -
            spot
          ) -
          Math.abs(
            Number(b.strike_price) -
            spot
          )
      );


    const atm =
      Number(
        sortedByDistance[0]
          .strike_price
      );


    /*
      ATM IV
    */

    const atmRow =
      chain.find(
        row =>
          Number(row.strike_price) === atm
      );


    const atmCallIV =
      Number(
        atmRow
          ?.call_options
          ?.option_greeks
          ?.iv || 0
      );


    const atmPutIV =
      Number(
        atmRow
          ?.put_options
          ?.option_greeks
          ?.iv || 0
      );


    const atmIV =
      atmCallIV > 0 &&
      atmPutIV > 0
        ? Number(
            (
              (atmCallIV +
                atmPutIV) / 2
            ).toFixed(2)
          )
        : (
            atmCallIV ||
            atmPutIV ||
            null
          );


    /*
      MAX PAIN
    */

    let maxPain = null;

    let lowestPain = Infinity;


    for (
      const candidate of chain
    ) {

      const candidateStrike =
        Number(
          candidate.strike_price
        );


      let pain = 0;


      for (
        const row of chain
      ) {

        const rowStrike =
          Number(
            row.strike_price
          );


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


        if (
          rowStrike >
          candidateStrike
        ) {

          pain +=
            (
              rowStrike -
              candidateStrike
            ) * callOI;

        }


        if (
          rowStrike <
          candidateStrike
        ) {

          pain +=
            (
              candidateStrike -
              rowStrike
            ) * putOI;

        }

      }


      if (
        pain <
        lowestPain
      ) {

        lowestPain = pain;

        maxPain =
          candidateStrike;

      }

    }


    /*
      SUPPORT / RESISTANCE

      Put OI is used as a rough
      support indicator.

      Call OI is used as a rough
      resistance indicator.
    */

    const belowSpot =
      chain
        .filter(
          row =>
            Number(row.strike_price) <
            spot
        )
        .sort(
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
        );


    const aboveSpot =
      chain
        .filter(
          row =>
            Number(row.strike_price) >
            spot
        )
        .sort(
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
        );


    const support1 =
      belowSpot[0]
        ? Number(
            belowSpot[0]
              .strike_price
          )
        : null;


    const support2 =
      belowSpot[1]
        ? Number(
            belowSpot[1]
              .strike_price
          )
        : null;


    const resistance1 =
      aboveSpot[0]
        ? Number(
            aboveSpot[0]
              .strike_price
          )
        : null;


    const resistance2 =
      aboveSpot[1]
        ? Number(
            aboveSpot[1]
              .strike_price
          )
        : null;


    /*
      OI RATIO
    */

    const oiRatio =
      totalCallOI > 0
        ? Number(
            (
              totalPutOI /
              totalCallOI
            ).toFixed(3)
          )
        : null;


    /*
      MARKET BIAS ENGINE

      This is deliberately simple.

      PCR:
      >= 1.20 = bullish
      <= 0.80 = bearish

      Spot vs Max Pain:
      above max pain = bullish point
      below max pain = bearish point

      Support / resistance:
      adds another point based
      on relative position.
    */

    let score = 0;


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


    if (
      maxPain !== null
    ) {

      if (
        spot >
        maxPain + 50
      ) {
        score += 1;
      }
      else if (
        spot <
        maxPain - 50
      ) {
        score -= 1;
      }

    }


    if (
      support1 !== null &&
      resistance1 !== null
    ) {

      const range =
        resistance1 -
        support1;


      if (range > 0) {

        const position =
          (
            spot -
            support1
          ) / range;


        if (position < 0.30) {
          score -= 1;
        }
        else if (
          position > 0.70
        ) {
          score += 1;
        }

      }

    }


    let view =
      "NEUTRAL";


    if (score >= 2) {
      view = "BULLISH";
    }
    else if (score <= -2) {
      view = "BEARISH";
    }


    /*
      CONFIDENCE

      This is a heuristic confidence
      score, NOT a probability that
      the market will actually move.
    */

    let confidence =
      50 +
      Math.abs(score) * 8;


    if (confidence > 90) {
      confidence = 90;
    }


    /*
      REASON
    */

    let reason = "";


    if (view === "BULLISH") {

      reason =
        "Put-side positioning is relatively stronger and the combined signals lean upward.";

    }
    else if (
      view === "BEARISH"
    ) {

      reason =
        "Call-side positioning is relatively stronger and the combined signals lean downward.";

    }
    else {

      reason =
        "The available option-chain signals are mixed, so the dashboard is avoiding a strong directional call.";

    }


    /*
      INTERPRETATION
    */

    let interpretation =
      "PCR is " +
      (
        pcr !== null
          ? pcr.toFixed(3)
          : "unavailable"
      ) +
      ". ";


    if (
      support1 !== null
    ) {

      interpretation +=
        "The strongest nearby put-OI support is around " +
        support1 +
        ". ";

    }


    if (
      resistance1 !== null
    ) {

      interpretation +=
        "The strongest nearby call-OI resistance is around " +
        resistance1 +
        ". ";

    }


    if (
      maxPain !== null
    ) {

      interpretation +=
        "Estimated max pain is " +
        maxPain +
        ". ";

    }


    interpretation +=
      "Treat these levels as positioning indicators rather than guaranteed support or resistance.";


    /*
      NEARBY STRIKES

      Show 15 strikes around spot.
    */

    const nearby =
      [...chain]
        .sort(
          (a, b) =>
            Math.abs(
              Number(
                a.strike_price
              ) -
              spot
            ) -
            Math.abs(
              Number(
                b.strike_price
              ) -
              spot
            )
        )
        .slice(0, 15)
        .sort(
          (a, b) =>
            Number(
              a.strike_price
            ) -
            Number(
              b.strike_price
            )
        );


    const options =
      nearby.map(
        row => {

          const call =
            row.call_options || {};


          const put =
            row.put_options || {};


          return {

            strike:
              Number(
                row.strike_price
              ),


            call: {

              ltp:
                call.market_data
                  ?.ltp ?? null,

              oi:
                call.market_data
   
