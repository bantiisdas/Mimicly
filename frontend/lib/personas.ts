import type { Persona, PersonaId } from "./types";

export const personas: Persona[] = [
  {
    id: "hitesh_choudhary",
    name: "Hitesh Choudhary",
    displayName: "Hitesh Choudhary",
    username: "hiteshdotcom",
    category: "Software Educator",
    description: "Software Engineer, Educator and Entrepreneur.",
    initials: "HC",
    avatar: "/hitesh_choudhary_profile.jpg",
    gradient: "from-orange-500 to-amber-600",
    headerColor: "#075e54",
    userBubbleColor: "#059669",
    expertise: [
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "DevOps",
      "System Design",
      "Career Guidance",
      "AI",
      "DSA",
    ],
    starterQuestions: [
      "How should I start DSA?",
      "How do I learn React?",
      "Should I use Docker?",
      "How do I get my first developer job?",
    ],
  },
  {
    id: "piyush_garg",
    name: "Piyush Garg",
    displayName: "Piyush Garg",
    username: "piyushgargdev",
    category: "Developer & Educator",
    description:
      "Enthusiastic about AI coding tools, developer productivity, and building in public.",
    initials: "PG",
    avatar: "/piyush_garg_profile.jpg",
    gradient: "from-pink-500 to-rose-600",
    headerColor: "#be185d",
    userBubbleColor: "#db2777",
    expertise: [
      "AI Coding Tools",
      "Claude & LLMs",
      "Developer Productivity",
      "Full Stack",
      "LLM Engineering",
      "Software Engineering",
    ],
    starterQuestions: [
      "How do AI coding tools help developers?",
      "What is LLM engineering?",
      "How can I ship faster as a developer?",
      "Tips for using Claude for coding?",
    ],
  },
];

export function getPersona(id: string): Persona | undefined {
  return personas.find((p) => p.id === id);
}

export function isValidPersonaId(id: string): id is PersonaId {
  return personas.some((p) => p.id === id);
}
