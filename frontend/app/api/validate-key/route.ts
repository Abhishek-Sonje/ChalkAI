import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { api_key } = (await request.json()) as { api_key: string };

    if (!api_key?.trim()) {
      return NextResponse.json(
        { valid: false, reason: "API key is required." },
        { status: 400 }
      );
    }

    if (!api_key.startsWith("AIza")) {
      return NextResponse.json({
        valid: false,
        reason: "That doesn't look like a valid Gemini API key. Keys start with 'AIza'.",
      });
    }

    // Make a real but minimal call to Gemini to validate the key
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${api_key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Hi" }] }],
        }),
      }
    );

    if (response.ok) {
      return NextResponse.json({ valid: true });
    }

    const data = await response.json().catch(() => ({}));
    const errorCode = data?.error?.status ?? "";
    const errorMessage = data?.error?.message ?? "";

    if (response.status === 400 && errorMessage.includes("API_KEY_INVALID")) {
      return NextResponse.json({
        valid: false,
        reason: "Invalid API key. Please check and try again.",
      });
    }

    if (response.status === 403 || errorCode === "PERMISSION_DENIED") {
      return NextResponse.json({
        valid: false,
        reason: "API key is valid but doesn't have permission to use Gemini. Enable the Generative Language API in your Google Cloud project.",
      });
    }

    if (response.status === 429 || errorCode === "RESOURCE_EXHAUSTED") {
      // Key works, just rate-limited — treat as valid
      return NextResponse.json({ valid: true });
    }

    return NextResponse.json({
      valid: false,
      reason: `Gemini returned an error: ${errorMessage || response.statusText}`,
    });
  } catch (error) {
    console.error("Key validation error:", error);
    return NextResponse.json(
      { valid: false, reason: "Could not reach Gemini API. Check your internet connection." },
      { status: 500 }
    );
  }
}
