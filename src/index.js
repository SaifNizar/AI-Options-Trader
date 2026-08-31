export default {
  async fetch(request, env) {

    const url = new URL(request.url);

    // API
    if (url.pathname === "/api/options") {
      return getOptions(request, env);
    }

    // Dashboard
    return new Response(`
<!DOCTYPE html>
<html>

<head>

<meta name="viewport"
content="width=device-width, initial-scale=1">

<title>AI Options Trader</title>

<style>

body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #0f172a;
  color: white;
}

.container {
  max-width: 1000px;
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
  margin-bottom: 12px;
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

.small {
  font-size: 14px;
  margin-top: 6px;
  color: #cbd5e1;
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

.score {
  font-size: 32px;
  font-weight: bold;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  font-size: 11px;
}

th,
td {
  padding: 8px 3px;
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

.badge {
  display: inline-block;
  padding: 6px 10px;
  border-radius: 8px;
  background: #334155;
  font-size: 12px;
}

.green {
  color: #22c55e;
}

.red {
  color: #ef4444;
}

.yellow {
  color: #facc15;
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

  .score {
    font-size: 28px;
  }

  table {
    font-size: 10px;
  }

}

</style>

</head>


<body>

<div class="container">

<h1>📊 AI Options Trader</h1>

<div class="subtitle">
NIFTY 50 • Probability & Options Analysis
</div>


<div id="status" class="loading">
Loading market data...
</div>


<div id="dashboard"
style="display:none">


<!-- MARKET BIAS -->

<div class="card">

<div class="label">
AI MARKET BIAS
</div>

<div id="view"
class="value">
-
</div>

<div id="confidence"
class="small">
-
</div>

</div>


<!-- MAIN DATA -->

<div class="grid">


<div class="card">

<div class="label">
NIFTY 50
</div>

<div id="spot"
class="value">
-
</div>

</div>


<div class="card">

<div class="label">
PCR
</div>

<div id="pcr"
class="value">
-
</div>

</div>


<div class="card">

<div class="label">
MAX PAIN
</div>

<div id="maxPain"
class="value">
-
</div>

</div>


<div class="card">

<div class="label">
ATM STRIKE
</div>

<div id="atm"
class="value">
-
</div>

</div>


<div class="card">

<div class="label">
SUPPORT
</div>

<div id="support"
class="value bullish">
-
</div>

</div>


<div class="card">

<div class="label">
RESISTANCE
</div>

<div id="resistance"
class="value bearish">
-
</div>

</div>


</div>


<!-- OI -->

<div class="card">

<h3>📈 Open Interest</h3>

<div class="grid">


<div>

<div class="label">
TOTAL CALL OI
</div>

<div id="callOI"
class="value">
-
</div>

</div>


<div>

<div class="label">
TOTAL PUT OI
</div>

<div id="putOI"
class="value">
-
</div>

</div>


<div>

<div class="label">
CALL OI CHANGE
</div>

<div id="callChange"
class="value">
-
</div>

</div>


<div>

<div class="label">
PUT OI CHANGE
</div>

<div id="putChange"
class="value">
-
</div>

</div>


</div>

</div>


<!-- STRONGEST LEVELS -->

<div class="card">

<h3>🎯 Important Levels</h3>

<div class="grid">


<div>

<div class="label">
STRONGEST CALL OI
</div>

<div id="strongCall"
class="value">
-
</div>

</div>


<div>

<div class="label">
STRONGEST PUT OI
</div>

<div id="strongPut"
class="value">
-
</div>

</div>


<div>

<div class="label">
CALL POSITIONING
</div>

<div id="callPosition"
class="small">
-
</div>

</div>


<div>

<div class="label">
PUT POSITIONING
</div>

<div id="putPosition"
class="small">
-
</div>

</div>


</div>

</div>


<!-- TRADE ZONE -->

<div class="card">

<h3>🧭 Market Zone</h3>

<div id="zone"
class="value">
-
</div>

<div id="zoneText"
class="small">
-
</div>

</div>


<!-- OPTIONS -->

<div class="card">

<h3>🎯 Nearby Strikes</h3>

<table>

<thead>

<tr>

<th>Strike</th>

<th>CE</th>

<th>CE OI</th>

<th>Δ OI</th>

<th>CE IV</th>

<th>PE</th>

<th>PE OI</th>

<th>Δ OI</th>

<th>PE IV</th>

</tr>

</thead>


<tbody id="options">

</tbody>

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

    const response =
      await fetch("/api/options");

    const data =
      await response.json();


    if (data.status !== "ok") {

      throw new Error(
        data.message ||
        "Unable to load market data"
      );

    }


    const market =
      data.market;

    const analysis =
      data.analysis;


    document
      .getElementById("status")
      .style.display = "none";


    document
      .getElementById("dashboard")
      .style.display = "block";


    // SPOT

    document
      .getElementById("spot")
      .textContent =
      Number(
        market.spot
      ).toLocaleString("en-IN");


    // BIAS

    const view =
      document.getElementById("view");


    view.textContent =
      analysis.view;


    view.className =
      "value " +
      (
        analysis.view === "BULLISH"
          ? "bullish"
          : analysis.view === "BEARISH"
          ? "bearish"
          : "neutral"
      );


    document
      .getElementById("confidence")
      .textContent =
      "Confidence: " +
      analysis.confidence +
      "%";


    // PCR

    document
      .getElementById("pcr")
      .textContent =
      analysis.pcr ?? "-";


    // MAX PAIN

    document
      .getElementById("maxPain")
      .textContent =
      analysis.max_pain ?? "-";


    // ATM

    document
      .getElementById("atm")
      .textContent =
      analysis.atm ?? "-";


    // SUPPORT

    document
      .getElementById("support")
      .textContent =
      analysis.support ?? "-";


    // RESISTANCE

    document
      .getElementById("resistance")
      .textContent =
      analysis.resistance ?? "-";


    // OI

    document
      .getElementById("callOI")
      .textContent =
      Number(
        analysis.total_call_oi || 0
      ).toLocaleString("en-IN");


    document
      .getElementById("putOI")
      .textContent =
      Number(
        analysis.total_put_oi || 0
      ).toLocaleString("en-IN");


    document
      .getElementById("callChange")
      .textContent =
      Number(
        analysis.call_oi_change || 0
      ).toLocaleString("en-IN");


    document
      .getElementById("putChange")
      .textContent =
      Number(
        analysis.put_oi_change || 0
      ).toLocaleString("en-IN");


    // STRONGEST OI

    document
      .getElementById("strongCall")
      .textContent =
      analysis.strong_call_oi ?? "-";


    document
      .getElementById("strongPut")
      .textContent =
      analysis.strong_put_oi ?? "-";


    document
      .getElementById("callPosition")
      .textContent =
      analysis.call_positioning;


    document
      .getElementById("putPosition")
      .textContent =
      analysis.put_positioning;


    // ZONE

    document
      .getElementById("zone")
      .textContent =
      analysis.zone;


    document
      .getElementById("zoneText")
      .textContent =
      analysis.zone_description;


    // TABLE

    const table =
      document.getElementById("options");


    table.innerHTML = "";


    data.options.forEach(
      row => {

        const ce =
          row.call;


        const pe =
          row.put;


        table.innerHTML +=

          "<tr>" +

          "<td>" +
          row.strike +
          "</td>" +

          "<td>" +
          (ce.ltp ?? "-") +
          "</td>" +

          "<td>" +
          formatNumber(ce.oi) +
          "</td>" +

          "<td>" +
          formatNumber(ce.oi_change) +
          "</td>" +

          "<td>" +
          formatDecimal(ce.iv) +
          "</td>" +

          "<td>" +
          (pe.ltp ?? "-") +
          "</td>" +

          "<td>" +
          formatNumber(pe.oi) +
          "</td>" +

          "<td>" +
          formatNumber(pe.oi_change) +
          "</td>" +

          "<td>" +
          formatDecimal(pe.iv) +
          "</td>" +

          "</tr>";

      }
    );


  }

  catch (error) {

    document
      .getElementById("status")
      .innerHTML =
      '<div class="error">❌ ' +
      error.message +
      "</div>";

  }

}


function formatNumber(value) {

  return Number(
    value || 0
  ).toLocaleString("en-IN");

}


function formatDecimal(value) {

  if (
    value === null ||
    value === undefined
  ) {

    return "-";

  }

  return Number(value)
    .toFixed(2);

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


// ======================================================
// OPTIONS ENGINE
// ======================================================

async function getOptions(
  request,
  env
) {

  try {

    const url =
      new URL(request.url);


    /*
      Upstox supports relative expiry
      keywords such as current_week.

      We use current_week automatically.
    */

    let expiry =
      url.searchParams.get(
        "expiry"
      );


    if (!expiry) {

      expiry =
        "current_week";

    }


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

          status:
            "error",

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

          status:
            "error",

          message:
            "No option-chain data returned"

        },
        404
      );

    }


    // ==================================================
    // SPOT
    // ==================================================

    const spot =
      chain[0]
        .underlying_spot_price;


    // ==================================================
    // ACTUAL EXPIRY
    // ==================================================

    const actualExpiry =
      chain[0].expiry ||
      expiry;


    // ==================================================
    // TOTAL OI
    // ==================================================

    let totalCallOI = 0;

    let totalPutOI = 0;


    let callOIChange = 0;

    let putOIChange = 0;


    for (
      const row of chain
    ) {

      const call =
        row.call_options
        || {};


      const put =
        row.put_options
        || {};


      const callData =
        call.market_data
        || {};


      const putData =
        put.market_data
        || {};


      const callOI =
        callData.oi || 0;


      const putOI =
        putData.oi || 0;


      const callPrevOI =
        callData.prev_oi ||
        0;


      const putPrevOI =
        putData.prev_oi ||
        0;


      totalCallOI +=
        callOI;


      totalPutOI +=
        putOI;


      callOIChange +=
        callOI -
        callPrevOI;


      putOIChange +=
        putOI -
        putPrevOI;

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
    // ATM
    // ==================================================

    let atm =
      null;


    let atmDistance =
      Infinity;


    for (
      const row of chain
    ) {

      const distance =
        Math.abs(
          row.strike_price -
          spot
        );


      if (
        distance <
        atmDistance
      ) {

        atmDistance =
          distance;

        atm =
          row.strike_price;

      }

    }


    // ==================================================
    // SUPPORT / RESISTANCE
    // ==================================================

    let strongestPut =
      null;

    let strongestPutOI =
      0;


    let strongestCall =
      null;

    let strongestCallOI =
      0;


    for (
      const row of chain
    ) {

      const strike =
        row.strike_price;


      const putOI =
        row.put_options
          ?.market_data
          ?.oi || 0;


      const callOI =
        row.call_options
          ?.market_data
          ?.oi || 0;


      // Put OI below spot = support

      if (
        strike <= spot &&
        putOI >
        strongestPutOI
      ) {

        strongestPutOI =
          putOI;

        strongestPut =
          strike;

      }


      // Call OI above spot = resistance

      if (
        strike >= spot &&
        callOI >
        strongestCallOI
      ) {

        strongestCallOI =
          callOI;

        strongestCall =
          strike;

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
    // POSITIONING ANALYSIS
    // ==================================================

    let callWriting =
      0;

    let callBuying =
      0;

    let putWriting =
      0;

    let putBuying =
      0;


    for (
      const row of chain
    ) {

      const call =
        row.call_options
        || {};


      const put =
        row.put_options
        || {};


      const callData =
        call.market_data
        || {};


      const putData =
        put.market_data
        || {};


      const callOI =
        callData.oi || 0;


      const putOI =
        putData.oi || 0;


      const callPrevOI =
        callData.prev_oi ||
        callOI;


      const putPrevOI =
        putData.prev_oi ||
        putOI;


      const callPrice =
        callData.ltp || 0;


      const callClose =
        callData.close_price ||
        callPrice;


      const putPrice =
        putData.ltp || 0;


      const putClose =
        putData.close_price ||
        putPrice;


      const callChange =
        callOI -
        callPrevOI;


      const putChange =
        putOI -
        putPrevOI;


      /*
        Call:
        Price down + OI up
        = likely call writing
      */

      if (
        callChange > 0 &&
        callPrice <
        callClose
      ) {

        callWriting +=
          callChange;

      }


      /*
        Call:
        Price up + OI up
        = likely call buying
      */

      if (
        callChange > 0 &&
        callPrice >
        callClose
      ) {

        callBuying +=
          callChange;

      }


      /*
        Put:
        Price down + OI up
        = likely put writing
      */

      if (
        putChange > 0 &&
        putPrice <
        putClose
      ) {

        putWriting +=
          putChange;

      }


      /*
        Put:
        Price up + OI up
        = likely put buying
      */

      if (
        putChange > 0 &&
        putPrice >
        putClose
      ) {

        putBuying +=
          putChange;

      }

    }


    // ==================================================
    // POSITIONING LABELS
    // ==================================================

    let callPositioning =
      "Mixed";


    if (
      callWriting >
      callBuying
    ) {

      callPositioning =
        "Call Writing";

    }

    else if (
      callBuying >
      callWriting
    ) {

      callPositioning =
        "Call Buying";

    }


    let putPositioning =
      "Mixed";


    if (
      putWriting >
      putBuying
    ) {

      putPositioning =
        "Put Writing";

    }

    else if (
      putBuying >
      putWriting
    ) {

      putPositioning =
        "Put Buying";

    }


    // ==================================================
    // BIAS SCORE
    // ==================================================

    let score =
      0;


    /*
      PCR
    */

    if (
      pcr !== null
    ) {

      if (
        pcr >= 1.10
      ) {

        score += 2;

      }

      else if (
        pcr >= 0.95
      ) {

        score += 1;

      }

      else if (
        pcr <= 0.75
      ) {

        score -= 2;

      }

      else if (
        pcr <= 0.90
      ) {

        score -= 1;

      }

    }


    /*
      Put writing = bullish
    */

    if (
      putWriting >
      callWriting
    ) {

      score += 2;

    }


    /*
      Call writing = bearish
    */

    if (
      callWriting >
      putWriting
    ) {

      score -= 2;

    }


    /*
      Total OI change
    */

    if (
      putOIChange >
      Math.abs(callOIChange)
    ) {

      score += 1;

    }


    if (
      callOIChange >
      Math.abs(putOIChange)
    ) {

      score -= 1;

    }


    // ==================================================
    // FINAL VIEW
    // ==================================================

    let view =
      "NEUTRAL";


    if (
      score >= 3
    ) {

      view =
        "BULLISH";

    }

    else if (
      score <= -3
    ) {

      view =
        "BEARISH";

    }


    // ==================================================
    // CONFIDENCE
    // ==================================================

    const confidence =
      Math.min(
        95,
        50 +
        Math.abs(score) *
        8
      );


    // ==================================================
    // MARKET ZONE
    // ==================================================

    let zone =
      "NEUTRAL ZONE";


    let zoneDescription =
      "Market is between major support and resistance.";


    if (
      spot <= strongestPut
    ) {

      zone =
        "NEAR SUPPORT";

      zoneDescription =
        "Price is testing the major Put OI support zone.";

    }


    else if (
      spot >= strongestCall
    ) {

      zone =
        "NEAR RESISTANCE";

      zoneDescription =
        
