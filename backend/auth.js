import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

// In-memory session store: token -> username.
// Cleared whenever the server restarts (matches the frontend's in-memory session).
const sessions = new Map();

function readUsers() {
  try {
    const raw = fs.readFileSync(USERS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeUsers(users) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const hashBuffer = Buffer.from(hash, "hex");
  const derived = crypto.scryptSync(password, salt, 64);
  return (
    hashBuffer.length === derived.length &&
    crypto.timingSafeEqual(hashBuffer, derived)
  );
}

function createSession(username) {
  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, username);
  return token;
}

// Thrown for expected validation failures so the route can map them to 4xx.
class AuthError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

function normalizeUsername(username) {
  return String(username || "").trim().toLowerCase();
}

export function signup(rawUsername, password) {
  const username = normalizeUsername(rawUsername);

  if (username.length < 3) {
    throw new AuthError("Username must be at least 3 characters.");
  }
  if (!password || password.length < 6) {
    throw new AuthError("Password must be at least 6 characters.");
  }

  const users = readUsers();
  if (users.some((u) => u.username === username)) {
    throw new AuthError("Username is already taken.", 409);
  }

  users.push({
    username,
    password: hashPassword(password),
    createdAt: new Date().toISOString(),
  });
  writeUsers(users);

  const token = createSession(username);
  return { token, user: { username } };
}

export function login(rawUsername, password) {
  const username = normalizeUsername(rawUsername);

  if (!username || !password) {
    throw new AuthError("Username and password are required.");
  }

  const users = readUsers();
  const user = users.find((u) => u.username === username);

  if (!user || !verifyPassword(password, user.password)) {
    throw new AuthError("Invalid username or password.", 401);
  }

  const token = createSession(username);
  return { token, user: { username } };
}

export function logout(token) {
  sessions.delete(token);
}

export function getUsernameFromToken(token) {
  return sessions.get(token) || null;
}

// Express middleware: requires a valid "Authorization: Bearer <token>" header.
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  const username = token ? getUsernameFromToken(token) : null;

  if (!username) {
    return res.status(401).json({ error: "Unauthorized. Please log in." });
  }

  req.username = username;
  next();
}

export { AuthError };
