// =====================================================
// Harry's AI Proxy — Cloudflare Worker
// Deploy karo: https://workers.cloudflare.com
// Apni API key neeche daalo
// =====================================================

const ANTHROPIC_API_KEY = "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"; // 👈 yahan daalo

export default {
  async fetch(request, env) {

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (request.method !== "POST") {
      return new Response("Only POST allowed", { status: 405 });
    }

    try {
      const body = await request.json();

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001", // Fast + cheap model
          max_tokens: 1000,
          messages: body.messages,
        }),
      });

      const data = await response.json();

      return new Response(JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  },
};
