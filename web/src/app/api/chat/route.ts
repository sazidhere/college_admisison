import { configuredProviders } from "@/lib/ai/providers";
import { systemPrompt } from "@/lib/ai/prompt";
import { site } from "@/lib/site";
import type { Profile } from "@/lib/types";

type Msg = { role: "user" | "assistant"; content: string };

const MAX_MESSAGES = 16;
const MAX_CHARS = 6000;

// Best-effort per-IP limit so one person can't use up the shared free quota.
// In-memory, so it resets when the server restarts; good enough for v1.
const hits = new Map<string, number[]>();
const LIMIT = 30;
const WINDOW_MS = 60 * 60 * 1000;
function allowed(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= LIMIT) return false;
  recent.push(now);
  hits.set(ip, recent);
  return true;
}

export async function POST(request: Request) {
  const providers = configuredProviders();
  if (providers.length === 0) {
    return Response.json(
      { error: "The assistant isn't switched on yet. The site owner needs to add a free AI API key (see web/.env.example)." },
      { status: 503 },
    );
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (!allowed(ip)) {
    return Response.json({ error: "You've sent a lot of messages this hour. Please try again a little later." }, { status: 429 });
  }

  let body: { messages?: Msg[]; profile?: Profile | null };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Bad request." }, { status: 400 });
  }
  const messages = (body.messages ?? [])
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return Response.json({ error: "Bad request." }, { status: 400 });
  }

  const payloadMessages = [{ role: "system", content: systemPrompt(body.profile ?? null, site.name) }, ...messages];

  for (const p of providers) {
    let upstream: Response;
    try {
      upstream = await fetch(p.url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${p.key}` },
        body: JSON.stringify({ model: p.model, messages: payloadMessages, stream: true, temperature: 0.6, max_tokens: 1200 }),
        signal: request.signal,
      });
    } catch {
      continue;
    }
    if (!upstream.ok || !upstream.body) {
      // Rate limits, outages and bad keys: try the next provider.
      console.warn(`[chat] ${p.id} failed with ${upstream.status}`);
      continue;
    }
    return new Response(toTextStream(upstream.body), {
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "X-AI-Provider": p.id },
    });
  }

  return Response.json({ error: "The assistant is busy right now (free daily limits reached). Please try again later." }, { status: 503 });
}

// Turns an OpenAI-style SSE stream into a plain stream of text deltas.
function toTextStream(sse: ReadableStream<Uint8Array>) {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";
  return sse.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          const data = line.trim().replace(/^data:\s*/, "");
          if (!line.trim().startsWith("data:") || data === "[DONE]") continue;
          try {
            const delta = JSON.parse(data).choices?.[0]?.delta?.content;
            if (delta) controller.enqueue(encoder.encode(delta));
          } catch {
            // Partial or non-JSON line (e.g. keep-alive comment); ignore.
          }
        }
      },
    }),
  );
}
