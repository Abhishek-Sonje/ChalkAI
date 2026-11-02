import { decryptSecret } from "@/lib/crypto-secret";
import { getDecryptedApiKeys } from "@/lib/user-api-keys";

/** @deprecated Use getDecryptedApiKeys. Kept for older call sites. */
export async function getUserGeminiKey(userId: string) {
  const keys = await getDecryptedApiKeys(userId);
  return keys[0]?.key ?? null;
}

export { decryptSecret };
