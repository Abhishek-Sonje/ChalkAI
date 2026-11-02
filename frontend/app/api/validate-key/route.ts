import { NextRequest, NextResponse } from "next/server";
import type { ImageModelProvider } from "@/lib/image-models";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { api_key, provider } = (await request.json()) as {
      api_key: string;
      provider?: ImageModelProvider;
    };

    if (!api_key?.trim()) {
      return NextResponse.json(
        { valid: false, reason: "API key is required." },
        { status: 400 }
      );
    }

    const kind = provider ?? "google";

    if (kind === "google") {
      if (!api_key.startsWith("AIza")) {
        return NextResponse.json({
          valid: false,
          reason: "That doesn't look like a Gemini key. Keys start with 'AIza'.",
        });
      }
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
      if (response.ok || response.status === 429) {
        return NextResponse.json({ valid: true });
      }
      const data = await response.json().catch(() => ({}));
      return NextResponse.json({
        valid: false,
        reason: data?.error?.message ?? "Invalid Gemini API key.",
      });
    }

    if (kind === "openai") {
      const response = await fetch("https://api.openai.com/v1/models", {
        headers: { Authorization: `Bearer ${api_key}` },
      });
      if (response.ok || response.status === 429) {
        return NextResponse.json({ valid: true });
      }
      return NextResponse.json({
        valid: false,
        reason: "Invalid OpenAI API key.",
      });
    }

    if (kind === "flux") {
      if (api_key.length < 10) {
        return NextResponse.json({ valid: false, reason: "That Fal.ai key looks too short." });
      }
      return NextResponse.json({ valid: true });
    }

    if (kind === "midjourney") {
      if (api_key.length < 8) {
        return NextResponse.json({ valid: false, reason: "That Midjourney / GoAPI key looks too short." });
      }
      return NextResponse.json({ valid: true });
    }

    return NextResponse.json({ valid: false, reason: "Unknown provider." });
  } catch (error) {
    console.error("Key validation error:", error);
    return NextResponse.json(
      { valid: false, reason: "Could not reach the provider. Check your internet connection." },
      { status: 500 }
    );
  }
}
