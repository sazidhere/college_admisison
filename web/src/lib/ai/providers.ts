// Free-tier LLM providers that all speak the OpenAI chat-completions format.
// The route tries them in order and moves on when one is rate-limited, so
// stacking several free tiers raises the daily limit without paying.

export type Provider = { id: string; url: string; key: string; model: string };

const catalog = [
  {
    id: "gemini",
    url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    keyVar: "GEMINI_API_KEY",
    modelVar: "GEMINI_MODEL",
    defaultModel: "gemini-flash-latest",
  },
  {
    id: "groq",
    url: "https://api.groq.com/openai/v1/chat/completions",
    keyVar: "GROQ_API_KEY",
    modelVar: "GROQ_MODEL",
    defaultModel: "openai/gpt-oss-120b",
  },
  {
    id: "openrouter",
    url: "https://openrouter.ai/api/v1/chat/completions",
    keyVar: "OPENROUTER_API_KEY",
    modelVar: "OPENROUTER_MODEL",
    defaultModel: "", // free model IDs change often; set OPENROUTER_MODEL to one ending in ":free"
  },
] as const;

export function configuredProviders(): Provider[] {
  const order = (process.env.AI_PROVIDER_ORDER ?? "gemini,groq,openrouter,custom").split(",").map((s) => s.trim());
  return order.flatMap((id) => {
    // Any other OpenAI-compatible endpoint (Cloudflare Workers AI, GitHub Models, a local model).
    if (id === "custom") {
      const { AI_CUSTOM_URL: url, AI_CUSTOM_KEY: key, AI_CUSTOM_MODEL: model } = process.env;
      return url && key && model ? [{ id, url, key, model }] : [];
    }
    const c = catalog.find((x) => x.id === id);
    const key = c && process.env[c.keyVar];
    const model = c && (process.env[c.modelVar] || c.defaultModel);
    return c && key && model ? [{ id: c.id, url: c.url, key, model }] : [];
  });
}
