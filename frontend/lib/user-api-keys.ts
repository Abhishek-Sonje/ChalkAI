import { randomUUID } from "crypto";
import { decryptSecret, encryptSecret, hashSecret } from "@/lib/crypto-secret";
import { maskApiKey, type ImageModelProvider } from "@/lib/image-models";
import { profilesCollection, type StoredApiKey } from "@/lib/collections";

export type PublicApiKey = {
  id: string;
  provider: ImageModelProvider;
  hint: string;
};

function asStored(profile: {
  apiKeys?: StoredApiKey[];
  geminiKeyEnc?: string;
  geminiKeyHash?: string;
  updatedAt?: Date;
} | null): StoredApiKey[] {
  if (profile?.apiKeys?.length) return profile.apiKeys;

  if (profile?.geminiKeyEnc) {
    let hint = "AIza********";
    try {
      hint = maskApiKey(decryptSecret(profile.geminiKeyEnc));
    } catch {}
    return [
      {
        id: "legacy",
        provider: "google",
        enc: profile.geminiKeyEnc,
        hash: profile.geminiKeyHash ?? "",
        hint,
        createdAt: profile.updatedAt ?? new Date(),
      },
    ];
  }

  return [];
}

export async function listPublicApiKeys(userId: string): Promise<PublicApiKey[]> {
  const profiles = await profilesCollection();
  const profile = await profiles.findOne({ userId });
  return asStored(profile).map(({ id, provider, hint }) => ({ id, provider, hint }));
}

export async function getDecryptedApiKeys(userId: string): Promise<{ provider: ImageModelProvider; key: string }[]> {
  const profiles = await profilesCollection();
  const profile = await profiles.findOne({ userId });
  const keys: { provider: ImageModelProvider; key: string }[] = [];
  for (const stored of asStored(profile)) {
    try {
      keys.push({ provider: stored.provider ?? "google", key: decryptSecret(stored.enc) });
    } catch {}
  }
  return keys;
}

export async function addUserApiKey(userId: string, apiKey: string, provider: ImageModelProvider = "google") {
  const profiles = await profilesCollection();
  const profile = await profiles.findOne({ userId });
  const existing = asStored(profile);
  const hash = hashSecret(apiKey);

  if (existing.some((key) => key.hash && key.hash === hash)) {
    return { keys: existing.map(({ id, provider, hint }) => ({ id, provider, hint })), added: false };
  }

  const next: StoredApiKey = {
    id: randomUUID(),
    provider,
    enc: encryptSecret(apiKey),
    hash,
    hint: maskApiKey(apiKey),
    createdAt: new Date(),
  };
  const apiKeys = [...existing, next];

  await profiles.updateOne(
    { userId },
    {
      $set: {
        userId,
        apiKeys,
        geminiKeyEnc: apiKeys[0]?.enc,
        geminiKeyHash: apiKeys[0]?.hash,
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );

  return {
    keys: apiKeys.map(({ id, provider, hint }) => ({ id, provider, hint })),
    added: true,
  };
}

export async function removeUserApiKey(userId: string, keyId?: string) {
  const profiles = await profilesCollection();
  const profile = await profiles.findOne({ userId });
  const existing = asStored(profile);
  const apiKeys = keyId ? existing.filter((key) => key.id !== keyId) : [];

  await profiles.updateOne(
    { userId },
    {
      $set: {
        userId,
        apiKeys,
        updatedAt: new Date(),
        ...(apiKeys[0]
          ? { geminiKeyEnc: apiKeys[0].enc, geminiKeyHash: apiKeys[0].hash }
          : {}),
      },
      ...(apiKeys[0] ? {} : { $unset: { geminiKeyEnc: "", geminiKeyHash: "" } }),
    },
    { upsert: true }
  );

  return apiKeys.map(({ id, provider, hint }) => ({ id, provider, hint }));
}
