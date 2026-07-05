import { NextRequest, NextResponse } from "next/server";
import type { ChatRequest } from "@/lib/types";
import { isValidPersonaId } from "@/lib/personas";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();

    if (!body.persona || !body.userMessage?.trim()) {
      return NextResponse.json(
        { error: "Both persona and userMessage are required." },
        { status: 400 }
      );
    }

    if (!isValidPersonaId(body.persona)) {
      return NextResponse.json(
        { error: "Invalid persona." },
        { status: 400 }
      );
    }

    const authHeader = request.headers.get("authorization");

    const response = await fetch(`${BACKEND_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body: JSON.stringify({
        persona: body.persona,
        userMessage: body.userMessage.trim(),
      }),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { error: "Failed to connect to chat server. Is the backend running?" },
      { status: 503 }
    );
  }
}
