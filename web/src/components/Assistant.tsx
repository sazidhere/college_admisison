"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button, Container, PageIntro } from "./Page";
import { ArrowRight } from "./icons";
import { chatStore, useChat, useHydrated, useProfile, type ChatMessage } from "@/lib/store";

const suggestions = [
  "Review my profile. What are my two biggest gaps, and how can I fix them this year?",
  "Explain need-blind vs need-aware, and which matters for me.",
  "Help me brainstorm topics for my personal essay. Ask me questions first.",
  "Make me a 3-month SAT study plan using free resources.",
  "Should I apply Early Decision if my family needs full aid?",
];

export function Assistant({ ask }: { ask?: "profile" }) {
  const hydrated = useHydrated();
  const [profile] = useProfile();
  const [messages, setMessages] = useChat();
  const [input, setInput] = useState(ask === "profile" ? suggestions[0] : "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || busy) return;
    setError("");
    setInput("");
    const history: ChatMessage[] = [...chatStore.get(), { role: "user", content }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setBusy(true);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, profile }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let reply = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        setMessages([...history, { role: "assistant", content: reply }]);
      }
      if (!reply) throw new Error("The assistant didn't reply. Please try again.");
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        setError((e as Error).message);
        setMessages(history.slice(0, -1));
        setInput(content);
      }
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  };

  return (
    <>
      <PageIntro
        kicker="Assistant"
        title="Ask anything about applying"
        lead={
          hydrated && profile ? (
            <>The assistant can see your profile, so advice fits you. <Link href="/profile" className="prose-link">Keep it up to date</Link>.</>
          ) : (
            <>Works without a profile, but <Link href="/signup" className="prose-link">creating one</Link> makes the advice specific to you.</>
          )
        }
      >
        {hydrated && messages.length > 0 && (
          <Button variant="outline" onClick={() => { abortRef.current?.abort(); setMessages([]); }}>
            New conversation
          </Button>
        )}
      </PageIntro>

      <Container className="py-10 max-w-4xl">
        {hydrated && messages.length === 0 && (
          <div>
            <p className="text-muted mb-4">Try one of these:</p>
            <ul className="border-t-4 border-ink">
              {suggestions.map((s) => (
                <li key={s} className="border-b border-line">
                  <button onClick={() => send(s)} className="group w-full text-left py-5 flex items-center justify-between gap-6 font-serif text-xl sm:text-2xl hover:underline underline-offset-4">
                    {s}
                    <ArrowRight className="size-5 shrink-0 transition-transform group-hover:translate-x-1" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-6" aria-live="polite">
          {messages.map((m, i) =>
            m.role === "user" ? (
              <div key={i} className="ml-auto max-w-[85%] bg-ink text-paper px-5 py-4 whitespace-pre-wrap">{m.content}</div>
            ) : (
              <div key={i} className="max-w-[92%] border border-line bg-mist px-5 py-4 leading-relaxed">
                {m.content ? <Rendered text={m.content} /> : <span className="text-muted">Thinking…</span>}
              </div>
            ),
          )}
          <div ref={endRef} />
        </div>

        <div className="mt-8 sticky bottom-4">
          {error && <p role="alert" className="mb-2 bg-paper border border-signal/40 text-signal px-4 py-3">{error}</p>}
          <form
            className="bg-paper border border-ink flex items-end"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <label htmlFor="msg" className="sr-only">Message</label>
            <textarea
              id="msg"
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Ask in English or বাংলা…"
              className="flex-1 resize-none px-4 py-3 outline-none bg-transparent"
            />
            <button type="submit" disabled={busy || !input.trim()} aria-label="Send" className="m-2 grid place-items-center size-11 rounded-full bg-ink text-paper disabled:bg-muted">
              <ArrowRight className="size-5" />
            </button>
          </form>
        </div>
        <p className="mt-3 text-xs text-muted">
          The assistant can be wrong. Check deadlines and policies on official college websites. Don&apos;t share passwords or ID numbers.
        </p>
      </Container>
    </>
  );
}

// Minimal formatting for model replies: paragraphs, bullet lists and **bold**.
function Rendered({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/);
  return (
    <div className="space-y-3">
      {blocks.map((b, i) => {
        const lines = b.split("\n");
        if (lines.every((l) => /^\s*([-*•]|\d+\.)\s+/.test(l))) {
          return (
            <ul key={i} className="list-disc pl-5 space-y-1">
              {lines.map((l, j) => <li key={j}>{inline(l.replace(/^\s*([-*•]|\d+\.)\s+/, ""))}</li>)}
            </ul>
          );
        }
        if (/^#{1,4}\s/.test(b)) return <p key={i} className="font-semibold">{inline(b.replace(/^#+\s/, ""))}</p>;
        return <p key={i} className="whitespace-pre-wrap">{inline(b)}</p>;
      })}
    </div>
  );
}

function inline(s: string) {
  return s.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? <strong key={i}>{part.slice(2, -2)}</strong> : part,
  );
}
