import "dotenv/config";
import express from "express";
import { chat } from "./chat.js";
import {
  signup,
  login,
  logout,
  requireAuth,
  AuthError,
} from "./auth.js";

const app = express();
const PORT = process.env.PORT || 3000;

const VALID_PERSONAS = ["hitesh_choudhary", "piyush_garg"];

app.use(express.json());

app.post("/api/auth/signup", (req, res) => {
  const { username, password } = req.body;
  try {
    const result = signup(username, password);
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof AuthError) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error("Signup error:", error);
    res.status(500).json({ error: "Failed to sign up." });
  }
});

app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  try {
    const result = login(username, password);
    res.json(result);
  } catch (error) {
    if (error instanceof AuthError) {
      return res.status(error.status).json({ error: error.message });
    }
    console.error("Login error:", error);
    res.status(500).json({ error: "Failed to log in." });
  }
});

app.post("/api/auth/logout", requireAuth, (req, res) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (token) logout(token);
  res.json({ ok: true });
});

app.post("/api/chat", requireAuth, async (req, res) => {
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
