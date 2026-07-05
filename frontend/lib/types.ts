export type PersonaId = "hitesh_choudhary" | "piyush_garg";

export interface Persona {
  id: PersonaId;
  name: string;
  displayName: string;
  username: string;
  category: string;
  description: string;
  initials: string;
  avatar: string;
  gradient: string;
  headerColor: string;
  userBubbleColor: string;
  expertise: string[];
  starterQuestions: string[];
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  persona: PersonaId;
  userMessage: string;
}

export interface ChatResponse {
  reply?: string;
  error?: string;
}

export interface AuthUser {
  username: string;
}

export interface AuthResponse {
  token?: string;
  user?: AuthUser;
  error?: string;
}
