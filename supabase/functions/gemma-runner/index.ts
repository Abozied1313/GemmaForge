import { corsHeaders } from "../_shared/cors.ts";

const GEMMA_MODEL_MAP: Record<string, string> = {
  "gemma-4-27b": "google/gemma-3-27b-it",
  "gemma-4-12b": "google/gemma-3-12b-it",
  "gemma-2-27b": "google/gemma-2-27b-it",
  "gemma-2-9b": "google/gemma-2-9b-it",
  "gemma-2-2b": "google/gemma-2-2b-it",
  "gemma-7b": "google/gemma-7b-it",
  "gemma-2b": "google/gemma-2b-it",
};

function estimateTokens(text: string): number {
  return Math.max(1, Math.ceil(text.length / 3.5));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, model } = await req.json();

    if (!prompt || !model) {
      return new Response(
        JSON.stringify({ error: "Missing prompt or model" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiKey = Deno.env.get("ONSPACE_AI_API_KEY");
    const baseUrl = Deno.env.get("ONSPACE_AI_BASE_URL");

    if (!apiKey || !baseUrl) {
      return new Response(
        JSON.stringify({ error: "OnSpace AI not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const resolvedModel = GEMMA_MODEL_MAP[model] ?? "google/gemma-3-12b-it";

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: resolvedModel,
        messages: [
          {
            role: "system",
            content:
              "You are a helpful AI assistant powered by Google Gemma. Respond clearly and concisely.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return new Response(
        JSON.stringify({ error: `OnSpace AI error: ${response.status} — ${errText}` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const output = data.choices?.[0]?.message?.content ?? "";
    const usage = data.usage ?? {};

    const inputTokens = usage.prompt_tokens ?? estimateTokens(prompt);
    const outputTokens = usage.completion_tokens ?? estimateTokens(output);
    const totalTokens = usage.total_tokens ?? inputTokens + outputTokens;

    return new Response(
      JSON.stringify({ output, inputTokens, outputTokens, totalTokens, model: resolvedModel }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("gemma-runner error:", err);
    return new Response(
      JSON.stringify({ error: err?.message ?? "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
