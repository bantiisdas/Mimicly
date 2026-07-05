import "dotenv/config";
import { OpenAI } from "openai";
import { HITESH_CHOUDHARY_SYSTEM_PROMPT } from "./personas/Hitesh_Choudhary/systemPrompt.js";
import { PIYUSH_GARG_SYSTEM_PROMPT } from "./personas/Piyush_Garg/systemPrompt.js";
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function chat(persona, userMessage) {
  const SYSTEM_PROMPT =
    persona === "hitesh_choudhary"
      ? HITESH_CHOUDHARY_SYSTEM_PROMPT
      : PIYUSH_GARG_SYSTEM_PROMPT;

  console.log(SYSTEM_PROMPT);
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
