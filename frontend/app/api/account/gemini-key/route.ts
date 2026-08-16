import { NextResponse } from "next/server";
import { addUserApiKey, listPublicApiKeys, removeUserApiKey } from "@/lib/user-api-keys";
import { getSessionUser, unauthorized } from "@/lib/session";

export const runtime = "nodejs";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return unauthorized();
  const keys = await listPublicApiKeys(user.id);
  return NextResponse.json({ keys, hasGeminiKey: keys.length > 0 });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  const body = (await request.json()) as { apiKey?: string; provider?: string };
  const apiKey = body.apiKey?.trim();
  if (!apiKey) {
    return NextResponse.json({ error: "API key is required" }, { status: 400 });
  }

  const provider =
    body.provider === "openai" || body.provider === "flux" || body.provider === "midjourney"
      ? body.provider
      : "google";

  const result = await addUserApiKey(user.id, apiKey, provider);
  return NextResponse.json({ ok: true, hasGeminiKey: true, ...result });
}

export async function PUT(request: Request) {
  return POST(request);
}

export async function DELETE(request: Request) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  const url = new URL(request.url);
  const keyId = url.searchParams.get("id") ?? undefined;
  const keys = await removeUserApiKey(user.id, keyId);
  return NextResponse.json({ ok: true, keys, hasGeminiKey: keys.length > 0 });
}
