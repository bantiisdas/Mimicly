import "dotenv/config";
import express from "express";
import { chat } from "./chat.js";

const app = express();
const PORT = process.env.PORT || 3000;

const VALID_PERSONAS = ["hitesh_choudhary", "piyush_garg"];

app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const { persona, userMessage } = req.body;

  if (!persona || !userMessage) {
    return res.status(400).json({
      error: "Both persona and userMessage are required.",
    });
  }

  if (!VALID_PERSONAS.includes(persona)) {
    return res.status(400).json({
      error: `Invalid persona. Must be one of: ${VALID_PERSONAS.join(", ")}`,
    });
  }

  try {
    const reply = await chat(persona, userMessage);
    res.json({ reply });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Failed to generate response." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
