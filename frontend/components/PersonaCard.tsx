import Link from "next/link";
import type { Persona } from "@/lib/types";
import Avatar from "./Avatar";

interface PersonaCardProps {
  persona: Persona;
}

export default function PersonaCard({ persona }: PersonaCardProps) {
  return (
    <Link
      href={`/chat/${persona.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-zinc-300 hover:shadow-lg"
    >
      <div className={`bg-gradient-to-br ${persona.gradient} px-6 py-8`}>
        <div className="flex items-center gap-4">
          <Avatar
            src={persona.avatar}
            alt={persona.displayName}
            initials={persona.initials}
            gradient={persona.gradient}
            className="h-16 w-16 ring-2 ring-white/30"
            textClassName="text-xl"
          />
          <div>
            <h2 className="text-xl font-bold text-white">{persona.displayName}</h2>
            <p className="text-sm text-white/80">@{persona.username}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <span className="inline-block rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
            {persona.category}
          </span>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600">
            {persona.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {persona.expertise.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-zinc-50 px-2 py-1 text-xs text-zinc-500"
            >
              {tag}
            </span>
          ))}
          {persona.expertise.length > 4 && (
            <span className="rounded-md bg-zinc-50 px-2 py-1 text-xs text-zinc-400">
              +{persona.expertise.length - 4} more
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-sm text-zinc-400">Tap to start chatting</span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-white transition-transform group-hover:scale-110">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
              <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C13.037 4.357 14.932 3 17.25 3A6 6 0 0121 9v.086a48.527 48.527 0 00-1.087-.128C17.595 8.716 16.5 7.036 16.5 5.5V5a4.5 4.5 0 00-4.5-4.5c-1.036 0-2.086.168-3.044.481A48.171 48.171 0 0015.75 7.5z" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
