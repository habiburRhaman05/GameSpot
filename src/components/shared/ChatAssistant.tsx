/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "motion/react";
import { BotMessageSquare, X, Send, Loader2 } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import Link from "next/link";

type SearchCourt = { id: string; slug: string; name: string; type: string; price: number; location: string };
type SearchResult = { success?: boolean; message?: string; courts?: SearchCourt[] };

export function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, sendMessage, status, error } = useChat();
  const [input, setInput] = useState("");
  const isLoading = status === "submitted" || status === "streaming";
  const lastSentRef = useRef<{ text: string; time: number } | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [isFirstOpen, setIsFirstOpen] = useState(true);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  useEffect(() => {
    if (isOpen && isFirstOpen) {
      setIsFirstOpen(false);
    }
  }, [isOpen, isFirstOpen]);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    const normalized = trimmed.replace(/\s+/g, " ").toLowerCase();
    const now = Date.now();
    if (lastSentRef.current && lastSentRef.current.text === normalized && now - lastSentRef.current.time < 5000) return;
    lastSentRef.current = { text: normalized, time: now };
    sendMessage({ text: trimmed });
    setInput("");
  };

  if (!isOpen) {
    return (
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-fg shadow-lg shadow-primary/20 transition-shadow hover:shadow-primary/30"
      >
        <BotMessageSquare size={24} />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="fixed bottom-6 right-6 z-50 flex h-[500px] w-[350px] flex-col overflow-hidden rounded-2xl border border-border/60 bg-surface-glass backdrop-blur-xl shadow-2xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-primary px-4 py-3 text-primary-fg">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-fg/20">
            <BotMessageSquare size={16} />
          </div>
          <div>
            <p className="text-sm font-semibold">CourtBot AI</p>
            <p className="text-[10px] opacity-70">Online</p>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="rounded-lg p-1.5 opacity-70 hover:opacity-100 hover:bg-white/10 transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-3 bg-background/50 text-sm">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center text-text-tertiary px-4">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
              <BotMessageSquare className="h-6 w-6 text-primary" />
            </div>
            <p className="font-medium text-foreground">Hi! I'm CourtBot</p>
            <p className="mt-1 text-xs">Ask me to find courts or help with your bookings.</p>
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[88%] rounded-2xl px-4 py-2.5 ${
                m.role === "user"
                  ? "bg-primary text-primary-fg rounded-tr-none"
                  : "bg-card border border-border/60 text-foreground rounded-tl-none"
              }`}
            >
              <div className="prose prose-sm dark:prose-invert w-full max-w-none [&>p]:my-0 [&>ul]:my-1 [&_a]:text-blue-500 [&_a]:underline">
                <ReactMarkdown
                  components={{
                    a: ({ href, children }) =>
                      href?.startsWith("/") ? <Link href={href} className="font-medium">{children}</Link>
                        : <a href={href!} target="_blank" rel="noopener noreferrer" className="font-medium">{children}</a>,
                  }}
                >
                  {m.parts?.filter((p) => p.type === "text").map((p) => p.text).join("") || ""}
                </ReactMarkdown>
              </div>

              {/* {m.parts?.filter((p) => p.type === "tool-invocation" && p.toolCallId.toolName === "searchCourts").map((p) => {
                const ti = (p as any).toolInvocation;
                const payload = ti?.state === "result" ? ti?.result as SearchResult : null;
                const isResolved = ti?.state === "result";
                return (
                  <div key={ti?.toolCallId} className="mt-2">
                    {!isResolved && (
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-2 py-1 text-[10px] font-medium text-primary">
                        <Loader2 size={10} className="animate-spin" /> Searching courts...
                      </span>
                    )}
                    {isResolved && payload?.success && payload?.courts?.length && (
                      <div className="mt-2 space-y-1.5">
                        {payload.courts.map((court) => (
                          <Link key={court.id} href={`/venues/${court.slug}`}
                            className="group flex items-center justify-between rounded-xl border border-border/60 bg-surface-2/30 p-2.5 transition-colors hover:border-primary/30">
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-foreground truncate">{court.name}</p>
                              <p className="text-[10px] text-text-tertiary">{court.type} · {court.location}</p>
                            </div>
                            <span className="shrink-0 text-xs font-semibold text-primary">${court.price}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                    {isResolved && payload?.success === false && (
                      <p className="mt-1 text-[11px] text-destructive">{payload.message}</p>
                    )}
                  </div>
                );
              })} */}
            </div>
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-tl-none bg-card border border-border/60 px-4 py-3">
              <span className="flex items-center gap-1.5 text-xs text-text-tertiary">
                <span className="flex gap-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-text-tertiary animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-text-tertiary animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-text-tertiary animate-bounce" style={{ animationDelay: "300ms" }} />
                </span>
              </span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-border/60 bg-card p-3">
        <div className="flex items-center gap-2 rounded-xl border border-input bg-background/50 px-3 py-2 transition-colors focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            disabled={isLoading}
            className="flex-1 bg-transparent text-sm text-foreground outline-none border-0 placeholder:text-text-tertiary"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-fg transition-all hover:bg-primary-hover disabled:opacity-50"
          >
            <Send size={12} />
          </button>
        </div>
      </form>
    </motion.div>
  );
}
