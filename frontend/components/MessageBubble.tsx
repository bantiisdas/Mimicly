import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Message } from "@/lib/types";
import Avatar from "./Avatar";

interface MessageBubbleProps {
  message: Message;
  personaName: string;
  personaInitials: string;
  personaGradient: string;
  personaAvatar: string;
  userBubbleColor: string;
}

export default function MessageBubble({
  message,
  personaName,
  personaInitials,
  personaGradient,
  personaAvatar,
  userBubbleColor,
}: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {!isUser && (
        <Avatar
          src={personaAvatar}
          alt={personaName}
          initials={personaInitials}
          gradient={personaGradient}
          className="mt-1 h-8 w-8"
          textClassName="text-xs"
        />
      )}

      <div
        style={isUser ? { backgroundColor: userBubbleColor } : undefined}
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "rounded-tr-sm text-white"
            : "rounded-tl-sm bg-white text-zinc-800 shadow-sm ring-1 ring-zinc-100"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        ) : (
          <div
            className={`space-y-2 break-words [&_a]:text-emerald-700 [&_a]:underline [&_code]:rounded [&_code]:bg-zinc-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] [&_h1]:text-base [&_h1]:font-bold [&_h2]:text-sm [&_h2]:font-bold [&_h3]:font-semibold [&_li]:my-0.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-zinc-900 [&_pre]:p-3 [&_pre]:text-xs [&_pre_code]:bg-transparent [&_pre_code]:text-zinc-100 [&_strong]:font-semibold [&_strong]:text-zinc-900 [&_ul]:list-disc [&_ul]:pl-5`}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>
        )}
        <p
          className={`mt-1 text-[10px] ${
            isUser ? "text-white/70" : "text-zinc-400"
          }`}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
