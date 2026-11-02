import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { diagramPrompt, type ImageModelDef } from "@/lib/image-models";

async function urlToBase64(url: string) {
  if (url.startsWith("data:")) {
    return url.replace(/^data:image\/\w+;base64,/, "");
  }
  const res = await fetch(url);
  const buf = Buffer.from(await res.arrayBuffer());
  return buf.toString("base64");
}

async function generateGoogle(model: ImageModelDef, apiKey: string, prompt: string, imageData?: string) {
  const google = createGoogleGenerativeAI({ apiKey });
  const content: Array<{ type: "text"; text: string } | { type: "image"; image: string }> = [];
  if (imageData) {
    content.push({
      type: "image",
      image: imageData.startsWith("data:") ? imageData : `data:image/png;base64,${imageData}`,
    });
  }
  content.push({ type: "text", text: diagramPrompt(prompt) });

  const result = await generateText({
    model: google(model.id),
    messages: [{ role: "user", content }],
  });
  const imageFile = result.files?.find((f) => f.mediaType.startsWith("image/"));
  const base64 =
    imageFile?.base64 ??
    (imageFile?.uint8Array ? Buffer.from(imageFile.uint8Array).toString("base64") : null);
  if (!base64) throw new Error("NO_IMAGE");
  return base64;
}

async function generateOpenAI(model: ImageModelDef, apiKey: string, prompt: string, imageData?: string) {
  const text = diagramPrompt(prompt);
  if (imageData && model.id === "gpt-image-1") {
    const blob = Buffer.from(imageData.replace(/^data:image\/\w+;base64,/, ""), "base64");
    const form = new FormData();
    form.set("model", "gpt-image-1");
    form.set("prompt", text);
    form.set("image", new Blob([new Uint8Array(blob)], { type: "image/png" }), "sketch.png");
    form.set("size", "1024x1024");
    const res = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error?.message ?? "OpenAI edit failed");
    const b64 = data?.data?.[0]?.b64_json;
    if (b64) return b64;
    if (data?.data?.[0]?.url) return urlToBase64(data.data[0].url);
    throw new Error("NO_IMAGE");
  }

  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: model.id,
      prompt: text,
      size: "1024x1024",
      n: 1,
      ...(model.id === "dall-e-3" ? { response_format: "b64_json" } : {}),
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message ?? "OpenAI generation failed");
  const b64 = data?.data?.[0]?.b64_json;
  if (b64) return b64;
  if (data?.data?.[0]?.url) return urlToBase64(data.data[0].url);
  throw new Error("NO_IMAGE");
}

async function generateFlux(model: ImageModelDef, apiKey: string, prompt: string, imageData?: string) {
  const endpoint = imageData
    ? "fal-ai/flux/dev/image-to-image"
    : model.endpoint ?? "fal-ai/flux/schnell";
  const body: Record<string, unknown> = {
    prompt: diagramPrompt(prompt),
    num_images: 1,
    sync_mode: true,
  };
  if (imageData) {
    body.image_url = imageData.startsWith("data:")
      ? imageData
      : `data:image/png;base64,${imageData}`;
    body.strength = 0.65;
  }
  const res = await fetch(`https://fal.run/${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: `Key ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.detail?.[0]?.msg ?? data?.error ?? "Flux generation failed");
  const url = data?.images?.[0]?.url ?? data?.image?.url;
  if (!url) throw new Error("NO_IMAGE");
  return urlToBase64(url);
}

async function generateMidjourney(model: ImageModelDef, apiKey: string, prompt: string) {
  const suffix = model.id === "midjourney-niji" ? " --niji 6" : " --v 6";
  const imagine = await fetch("https://api.goapi.ai/mj/v2/imagine", {
    method: "POST",
    headers: {
      "X-API-KEY": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: `${diagramPrompt(prompt)}${suffix}`,
      process_mode: "fast",
    }),
  });
  const started = await imagine.json();
  if (!imagine.ok) {
    throw new Error(started?.message ?? started?.error ?? "Midjourney imagine failed");
  }
  const taskId = started?.data?.task_id ?? started?.task_id;
  if (!taskId) throw new Error("Midjourney did not return a task id");

  const deadline = Date.now() + 50_000;
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 2500));
    const fetchRes = await fetch("https://api.goapi.ai/mj/v2/fetch", {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task_id: taskId }),
    });
    const data = await fetchRes.json();
    const status = data?.data?.status ?? data?.status;
    const imageUrl =
      data?.data?.task_result?.image_url ??
      data?.data?.image_url ??
      data?.image_url;
    if ((status === "finished" || status === "completed" || status === "SUCCESS") && imageUrl) {
      return urlToBase64(imageUrl);
    }
    if (status === "failed" || status === "FAILURE") {
      throw new Error("Midjourney task failed");
    }
  }
  throw new Error("Midjourney timed out");
}

export async function generateDiagramImage(
  model: ImageModelDef,
  apiKey: string,
  prompt: string,
  imageData?: string
) {
  switch (model.provider) {
    case "google":
      return generateGoogle(model, apiKey, prompt, imageData);
    case "openai":
      return generateOpenAI(model, apiKey, prompt, imageData);
    case "flux":
      return generateFlux(model, apiKey, prompt, imageData);
    case "midjourney":
      return generateMidjourney(model, apiKey, prompt);
    default:
      throw new Error("Unsupported image provider");
  }
}

export function envKeysFor(provider: ImageModelDef["provider"]) {
  const keys: (string | undefined)[] = [];
  if (provider === "google") keys.push(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
  if (provider === "openai") keys.push(process.env.OPENAI_API_KEY);
  if (provider === "flux") keys.push(process.env.FAL_KEY, process.env.FAL_API_KEY);
  if (provider === "midjourney") keys.push(process.env.MIDJOURNEY_API_KEY, process.env.GOAPI_API_KEY);
  return keys.map((k) => k?.trim()).filter((k): k is string => !!k);
}
