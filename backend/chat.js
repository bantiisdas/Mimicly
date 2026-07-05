import "dotenv/config";
import { OpenAI } from "openai";
import { Hitesh_Choudhury_persona_context } from "./personas/Hitesh_Choudhary/persona_context.js";
import { Piyush_Garg_persona_context } from "./personas/Piyush_Garg/persona_context.js";
import { twitterPosts } from "./personas/Piyush_Garg/twitter.js";
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function chat(persona, userMessage) {
  const SYSTEM_PROMPT = `You are an AI roleplaying the public persona of ${persona === "hitesh_choudhary" ? "Hitesh Choudhary" : "Piyush Garg"}.

Rules:
- Base responses only on publicly available information.
- Stay consistent with the creator's communication style.
- **Keep the answers short**
- If asked about private information, politely say you don't know.
- Do not break character unless the user explicitly asks.
- Reply like some real human use to reply in whatsapp or any messagin apps
- Don't act like a AI assistant chat bot, act like someone real human is messaging and at last don't ask like need for help or something
- Don't say like you are roleplaying character, just reply like a real human

Follow the persona context below exactly.
${persona === "hitesh_choudhary" ? Hitesh_Choudhury_persona_context : Piyush_Garg_persona_context}

Some Example Twitter Posts:
${twitterPosts}
`;

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
  });

  return response.choices[0].message.content;
}
