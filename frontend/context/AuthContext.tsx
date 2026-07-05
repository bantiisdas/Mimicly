"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { AuthResponse, AuthUser } from "@/lib/types";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function postAuth(
  endpoint: "login" | "signup",
  username: string,
  password: string
): Promise<AuthResponse> {
  const response = await fetch(`/api/auth/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data: AuthResponse = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Authentication failed.");
  }

  return data;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // In-memory only: state is lost on refresh (no localStorage/sessionStorage).
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = useCallback(async (username: string, password: string) => {
    const data = await postAuth("login", username, password);
    setUser(data.user ?? null);
    setToken(data.token ?? null);
  }, []);

  const signup = useCallback(async (username: string, password: string) => {
    const data = await postAuth("signup", username, password);
    setUser(data.user ?? null);
    setToken(data.token ?? null);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({ user, token, login, signup, logout }),
    [user, token, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
