import "dotenv/config";
import { OpenAI } from "openai";
import { HITESH_CHOUDHARY_SYSTEM_PROMPT } from "./personas/Hitesh_Choudhary/systemPrompt.js";
import { PIYUSH_GARG_SYSTEM_PROMPT } from "./personas/Piyush_Garg/systemPrompt.js";
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const HC_Conversations = [];
const PG_Conversation = [];

export async function chat(persona, userMessage) {
  const SYSTEM_PROMPT =
    persona === "hitesh_choudhary"
      ? HITESH_CHOUDHARY_SYSTEM_PROMPT
      : PIYUSH_GARG_SYSTEM_PROMPT;

  const history =
    persona === "hitesh_choudhary" ? HC_Conversations : PG_Conversation;

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      ...history,
      {
        role: "user",
        content: userMessage,
      },
    ],
  });

  const chatResponse = response.choices[0].message.content;

  history.push({ role: "user", content: userMessage });
  history.push({ role: "assistant", content: chatResponse });

  console.log(HC_Conversations);
  console.log("---------");
  console.log(PG_Conversation);

  return chatResponse;
}
