export default {
  async fetch(request) {
    return new Response(
      JSON.stringify({
        status: "ok",
        service: "AI Options Trader",
        message: "Worker is running"
      }),
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
};
