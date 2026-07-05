"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Message, Persona } from "@/lib/types";
import MessageBubble from "./MessageBubble";
import Avatar from "./Avatar";

interface ChatInterfaceProps {
  persona: Persona;
}

function createMessage(
  role: Message["role"],
  content: string
): Message {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    timestamp: new Date(),
  };
}

export default function ChatInterface({ persona }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    setError(null);
    setInput("");
    setMessages((prev) => [...prev, createMessage("user", trimmed)]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona: persona.id,
          userMessage: trimmed,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setMessages((prev) => [
        ...prev,
        createMessage("assistant", data.reply),
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message.");
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="flex h-dvh flex-col bg-[#e5ddd5]">
      {/* Header */}
      <header
        className="flex items-center gap-3 px-4 py-3 text-white shadow-md"
        style={{ backgroundColor: persona.headerColor }}
      >
        <Link
          href="/"
          className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/10"
          aria-label="Back to home"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path
              fillRule="evenodd"
              d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z"
              clipRule="evenodd"
            />
          </svg>
        </Link>

        <Avatar
          src={persona.avatar}
          alt={persona.displayName}
          initials={persona.initials}
          gradient={persona.gradient}
          className="h-10 w-10 ring-2 ring-white/30"
        />

        <div className="min-w-0 flex-1">
          <h1 className="truncate font-semibold">{persona.displayName}</h1>
          <p className="truncate text-xs text-emerald-100">
            {isLoading ? "typing..." : persona.category}
          </p>
        </div>
      </header>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4cdc4' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Avatar
              src={persona.avatar}
              alt={persona.displayName}
              initials={persona.initials}
              gradient={persona.gradient}
              className="mb-4 h-20 w-20 shadow-lg"
              textClassName="text-2xl"
            />
            <h2 className="text-lg font-semibold text-zinc-700">
              Chat with {persona.displayName}
            </h2>
            <p className="mt-1 max-w-sm text-sm text-zinc-500">
              Ask anything about {persona.expertise.slice(0, 3).join(", ")}, and
              more.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              personaName={persona.displayName}
              personaInitials={persona.initials}
              personaGradient={persona.gradient}
              personaAvatar={persona.avatar}
              userBubbleColor={persona.userBubbleColor}
            />
          ))}

          {isLoading && (
            <div className="flex gap-2">
              <Avatar
                src={persona.avatar}
                alt={persona.displayName}
                initials={persona.initials}
                gradient={persona.gradient}
                className="mt-1 h-8 w-8"
                textClassName="text-xs"
              />
              <div className="rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm ring-1 ring-zinc-100">
                <div className="flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div ref={messagesEndRef} />
      </div>

      {/* Error */}
      {error && (
        <div className="mx-4 mb-2 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600 ring-1 ring-red-100">
          {error}
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-2 bg-[#f0f0f0] px-3 py-3"
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
          disabled={isLoading}
          className="max-h-32 flex-1 resize-none rounded-2xl border-0 bg-white px-4 py-2.5 text-sm text-zinc-800 shadow-sm ring-1 ring-zinc-200 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          style={{ backgroundColor: persona.headerColor }}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Send message"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 2.25 2.25 0 001.871-.662l10.5-10.5a.75.75 0 000-1.06l-10.5-10.5a2.25 2.25 0 00-1.871-.662z" />
          </svg>
        </button>
      </form>
    </div>
  );
}
