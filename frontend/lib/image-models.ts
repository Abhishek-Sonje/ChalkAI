/**
 * Image models used by the board generator.
 * Add a new model by appending an entry: id, label, provider, optional endpoint.
 * Set recommended: true on one model to make it the default.
 */
export type ImageModelProvider = "google" | "openai" | "flux" | "midjourney";

export type ImageModelDef = {
  id: string;
  label: string;
  provider: ImageModelProvider;
  endpoint?: string;
  recommended?: boolean;
};

export const IMAGE_PROVIDERS: {
  id: ImageModelProvider;
  label: string;
  keyPlaceholder: string;
  docsUrl: string;
  docsLabel: string;
}[] = [
  {
    id: "google",
    label: "Gemini",
    keyPlaceholder: "AIza…",
    docsUrl: "https://aistudio.google.com/app/apikey",
    docsLabel: "Google AI Studio",
  },
  {
    id: "openai",
    label: "ChatGPT",
    keyPlaceholder: "sk-…",
    docsUrl: "https://platform.openai.com/api-keys",
    docsLabel: "OpenAI API keys",
  },
  {
    id: "flux",
    label: "Flux",
    keyPlaceholder: "Fal key",
    docsUrl: "https://fal.ai/dashboard/keys",
    docsLabel: "Fal.ai keys",
  },
  {
    id: "midjourney",
    label: "Midjourney",
    keyPlaceholder: "GoAPI key",
    docsUrl: "https://www.goapi.ai/",
    docsLabel: "GoAPI Midjourney",
  },
];

export const IMAGE_MODELS: ImageModelDef[] = [
  {
    id: "gemini-3.1-flash-image",
    label: "Gemini 3.1 Flash Image",
    provider: "google",
    recommended: true,
  },
  {
    id: "gemini-2.5-flash-image",
    label: "Gemini 2.5 Flash Image",
    provider: "google",
  },
  {
    id: "gemini-3-pro-image-preview",
    label: "Gemini 3 Pro Image",
    provider: "google",
  },
  {
    id: "gpt-image-1",
    label: "GPT Image",
    provider: "openai",
  },
  {
    id: "dall-e-3",
    label: "DALL·E 3",
    provider: "openai",
  },
  {
    id: "flux-schnell",
    label: "Flux Schnell",
    provider: "flux",
    endpoint: "fal-ai/flux/schnell",
  },
  {
    id: "flux-dev",
    label: "Flux Dev",
    provider: "flux",
    endpoint: "fal-ai/flux/dev",
  },
  {
    id: "flux-pro",
    label: "Flux Pro",
    provider: "flux",
    endpoint: "fal-ai/flux-pro/v1.1",
  },
  {
    id: "midjourney-v6",
    label: "Midjourney v6",
    provider: "midjourney",
  },
  {
    id: "midjourney-niji",
    label: "Midjourney Niji",
    provider: "midjourney",
  },
];

export const DEFAULT_IMAGE_MODEL_ID =
  IMAGE_MODELS.find((model) => model.recommended)?.id ?? IMAGE_MODELS[0].id;

export function getImageModel(id?: string | null): ImageModelDef {
  return (
    IMAGE_MODELS.find((model) => model.id === id) ??
    IMAGE_MODELS.find((model) => model.recommended) ??
    IMAGE_MODELS[0]
  );
}

export function getProviderMeta(id: ImageModelProvider) {
  return IMAGE_PROVIDERS.find((p) => p.id === id) ?? IMAGE_PROVIDERS[0];
}

export function modelsByProvider() {
  return IMAGE_PROVIDERS.map((group) => ({
    ...group,
    models: IMAGE_MODELS.filter((model) => model.provider === group.id),
  })).filter((group) => group.models.length > 0);
}

export function maskApiKey(plain: string) {
  const start = plain.slice(0, 4);
  const hidden = "*".repeat(Math.max(8, plain.length - 4));
  return `${start}${hidden}`;
}

export function diagramPrompt(userPrompt: string) {
  return `Generate a clean, high-quality, professional diagram as a PNG image based on the provided reference sketch (if any) and the user’s explanation.

Treat the reference as a rough sketch, not a final diagram. Redraw with precise shapes, a white background, consistent line weight, and clear labels.

User explanation:
${userPrompt}`;
}
