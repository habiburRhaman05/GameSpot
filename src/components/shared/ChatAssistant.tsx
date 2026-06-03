/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "motion/react";
import { BotMessageSquare, X, Send, Sparkles } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import Link from "next/link";

import { cn } from "@/lib/utils";

export function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState("");
  const isLoading = status === "submitted" || status === "streaming";
  const lastSentRef = useRef<{ text: string; time: number } | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    const normalized = trimmed.replace(/\s+/g, " ").toLowerCase();
    const now = Date.now();
    if (
      lastSentRef.current &&
      lastSentRef.current.text === normalized &&
      now - lastSentRef.current.time < 5000
    )
      return;
    lastSentRef.current = { text: normalized, time: now };
    sendMessage({ text: trimmed });
    setInput("");
  };

  return (
    <AnimatePresence mode="wait">
      {!isOpen ? (
        <motion.button
          key="fab"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setIsOpen(true)}
          aria-label="Open AI assistant"
          className="group/fab fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-accent text-white shadow-[0_12px_32px_-8px_rgba(0,102,255,0.55)] transition-shadow duration-300 hover:shadow-[0_16px_40px_-8px_rgba(0,102,255,0.7)] sm:bottom-6 sm:right-6"
        >
          {/* Inner gradient highlight */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent"
          />
          {/* Pulse ring */}
          <span
            aria-hidden
            className="absolute inset-0 rounded-2xl ring-2 ring-primary/40 animate-pulse-soft"
          />
          <BotMessageSquare size={22} strokeWidth={2.2} className="relative z-10" />
          {/* Live dot */}
          <span
            aria-hidden
            className="absolute right-2 top-2 z-10 inline-flex h-2 w-2 rounded-full bg-accent shadow-[0_0_6px_var(--accent)]"
          />
        </motion.button>
      ) : (
        <motion.div
          key="panel"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-5 right-5 z-50 flex h-[520px] w-[360px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-3xl border border-border-strong/60 bg-surface-glass shadow-[0_24px_64px_-12px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:bottom-6 sm:right-6"
        >
          {/* Header — gradient sports band */}
          <div className="relative flex items-center justify-between overflow-hidden bg-gradient-to-br from-primary via-primary to-accent px-4 py-3.5 text-white">
            {/* Animated gradient orbs */}
            <span
              aria-hidden
              className="pointer-events-none absolute -top-10 -left-10 h-24 w-24 rounded-full bg-white/10 blur-2xl"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-10 -right-10 h-24 w-24 rounded-full bg-accent/30 blur-2xl"
            />

            <div className="relative flex items-center gap-2.5">
              <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md ring-1 ring-white/20">
                <Sparkles size={16} strokeWidth={2.2} />
              </span>
              <div className="flex flex-col leading-tight">
                <p className="font-display text-[14px] font-bold tracking-tight">
                  CourtBot AI
                </p>
                <p className="flex items-center gap-1.5 text-[10px] font-medium opacity-85">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_6px_var(--accent)]" />
                  Online · Ready to assist
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close assistant"
              className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg text-white/80 transition-all duration-200 hover:bg-white/15 hover:text-white active:scale-95"
            >
              <X size={16} strokeWidth={2.2} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto bg-background/40 p-4 text-sm">
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-soft to-accent/20 ring-1 ring-primary/20">
                  <BotMessageSquare className="h-7 w-7 text-primary" strokeWidth={2} />
                </div>
                <p className="font-display text-base font-bold text-foreground">
                  Hi! I'm CourtBot
                </p>
                <p className="mt-1.5 max-w-[15rem] text-[12px] leading-relaxed text-text-secondary">
                  Ask me to find courts, suggest venues, or help with your bookings.
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                  {["Find tennis courts", "Best venues nearby", "How to book?"].map(
                    (q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => setInput(q)}
                        className="rounded-full border border-border bg-surface/50 px-2.5 py-1 text-[10.5px] font-medium text-text-secondary transition-all duration-200 hover:border-primary/30 hover:bg-primary-soft hover:text-primary"
                      >
                        {q}
                      </button>
                    ),
                  )}
                </div>
              </div>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex",
                  m.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed shadow-sm",
                    m.role === "user"
                      ? "rounded-tr-md bg-gradient-to-br from-primary to-primary-hover text-primary-foreground"
                      : "rounded-tl-md border border-border/60 bg-card text-foreground",
                  )}
                >
                  <div className="prose prose-sm dark:prose-invert w-full max-w-none [&>p]:my-0 [&>ul]:my-1 [&_a]:underline">
                    <ReactMarkdown
                      components={{
                        a: ({ href, children }) =>
                          href?.startsWith("/") ? (
                            <Link href={href} className="font-medium">
                              {children}
                            </Link>
                          ) : (
                            <a
                              href={href!}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium"
                            >
                              {children}
                            </a>
                          ),
                      }}
                    >
                      {m.parts
                        ?.filter((p) => p.type === "text")
                        .map((p) => p.text)
                        .join("") || ""}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}

            {isLoading &&
              messages[messages.length - 1]?.role === "user" && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-tl-md border border-border/60 bg-card px-4 py-3 shadow-sm">
                    <span className="flex items-center gap-1">
                      <span
                        className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-bounce"
                        style={{ animationDelay: "120ms" }}
                      />
                      <span
                        className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-bounce"
                        style={{ animationDelay: "240ms" }}
                      />
                    </span>
                  </div>
                </div>
              )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-border/60 bg-card/80 p-3 backdrop-blur-md"
          >
            <div className="flex items-center gap-2 rounded-2xl border border-border bg-background/60 px-3 py-1.5 transition-all duration-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about courts..."
                disabled={isLoading}
                className="flex-1 border-0 bg-transparent text-[13px] text-foreground outline-none placeholder:text-text-tertiary"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                aria-label="Send"
                className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-[0_4px_12px_-4px_rgba(0,102,255,0.45)] transition-all duration-200 hover:shadow-[0_6px_16px_-4px_rgba(0,102,255,0.6)] active:scale-95 disabled:opacity-40 disabled:shadow-none"
              >
                <Send size={13} strokeWidth={2.2} />
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
