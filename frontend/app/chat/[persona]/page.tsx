import { notFound } from "next/navigation";
import ChatInterface from "@/components/ChatInterface";
import { getPersona, isValidPersonaId } from "@/lib/personas";
import type { Metadata } from "next";

interface ChatPageProps {
  params: Promise<{ persona: string }>;
}

export async function generateMetadata({
  params,
}: ChatPageProps): Promise<Metadata> {
  const { persona: personaId } = await params;
  const persona = isValidPersonaId(personaId)
    ? getPersona(personaId)
    : undefined;

  return {
    title: persona
      ? `Chat with ${persona.displayName} | Mimicly`
      : "Chat | Mimicly",
  };
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { persona: personaId } = await params;

  if (!isValidPersonaId(personaId)) {
    notFound();
  }

  const persona = getPersona(personaId);
  if (!persona) {
    notFound();
  }

  return <ChatInterface persona={persona} />;
}
