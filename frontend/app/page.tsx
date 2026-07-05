import { personas } from "@/lib/personas";
import PersonaCard from "@/components/PersonaCard";
import UserMenu from "@/components/UserMenu";

export default function Home() {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-zinc-50 to-zinc-100">
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-lg font-bold text-white">
              M
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-zinc-900">
                Mimicly
              </h1>
              <p className="text-xs text-zinc-500">
                Chat with your favorite educators
              </p>
            </div>
          </div>

          <UserMenu />
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
            Who would you like to chat with?
          </h2>
          <p className="mt-3 text-zinc-500">
            Pick a persona and start a conversation. Powered by AI that mimics
            their teaching style.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {personas.map((persona) => (
            <PersonaCard key={persona.id} persona={persona} />
          ))}
        </div>
      </main>
    </div>
  );
}
