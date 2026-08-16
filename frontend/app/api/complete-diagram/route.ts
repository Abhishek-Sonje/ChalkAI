import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { getDecryptedApiKeys } from "@/lib/user-api-keys";
import { DEFAULT_IMAGE_MODEL_ID, getImageModel } from "@/lib/image-models";
import { envKeysFor, generateDiagramImage } from "@/lib/image-generate";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { prompt, image_data, model } = (await request.json()) as {
      prompt: string;
      image_data?: string;
      model?: string;
    };

    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    const modelDef = getImageModel(model || DEFAULT_IMAGE_MODEL_ID);
    const sessionUser = await getSessionUser();
    const accountKeys = sessionUser ? await getDecryptedApiKeys(sessionUser.id) : [];
    const matching = accountKeys
      .filter((entry) => entry.provider === modelDef.provider)
      .map((entry) => entry.key);
    const fallback = accountKeys
      .filter((entry) => entry.provider !== modelDef.provider)
      .map((entry) => entry.key);
    const envKeys = envKeysFor(modelDef.provider);

    const apiKeys = [...new Set([...matching, ...envKeys, ...fallback])];

    if (!apiKeys.length) {
      return NextResponse.json(
        {
          error: "NO_API_KEY",
          message: `No API key configured for ${modelDef.provider}. Add one in the key settings.`,
        },
        { status: 401 }
      );
    }

    let lastError: unknown = null;
    for (const apiKey of apiKeys) {
      try {
        const image_data_out = await generateDiagramImage(
          modelDef,
          apiKey,
          prompt,
          image_data
        );
        return NextResponse.json({
          image_data: image_data_out,
          model: modelDef.id,
        });
      } catch (error) {
        lastError = error;
        console.warn(`Model ${modelDef.id} failed with a key, trying next…`, error);
      }
    }

    return NextResponse.json(
      {
        error: "Failed to generate image",
        details: lastError instanceof Error ? lastError.message : "All API keys failed",
      },
      { status: 500 }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate image",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
