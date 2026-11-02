"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { signOutAction } from "@/app/actions/auth";
import { ApiKeyModal } from "@/components/api-key-modal";
import { ModelPicker } from "@/components/model-picker";
import { useApiKey } from "@/components/api-key-provider";
import { getProviderMeta, type ImageModelProvider } from "@/lib/image-models";

type AccountData = {
  user: { name: string; email: string; image: string };
  hasGeminiKey: boolean;
  keys?: { id: string; hint: string; provider?: string }[];
  preferredModelId?: string;
};

export function AccountClient() {
  const router = useRouter();
  const { hasKey, keys, clearApiKey, removeApiKey } = useApiKey();
  const [data, setData] = useState<AccountData | null>(null);
  const [keyOpen, setKeyOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    void fetch("/api/account")
      .then((res) => (res.ok ? res.json() : null))
      .then(setData);
  }, [hasKey, keys]);

  const deleteAccount = async () => {
    if (!confirm("This permanently deletes your account and boards. Continue?")) return;
    setDeleting(true);
    const res = await fetch("/api/account", { method: "DELETE" });
    if (res.ok) {
      clearApiKey();
      await signOutAction();
      router.push("/");
    } else {
      setDeleting(false);
    }
  };

  if (!data) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-chalk-gray" />
      </div>
    );
  }

  const savedKeys = keys.length ? keys : data.keys ?? [];

  return (
    <div className="max-w-xl mx-auto px-[5vw] pb-16 pt-4">
      <h1 className="font-sketch text-3xl sm:text-4xl text-chalk-ink mb-8">Account</h1>

      <div className="bg-white border-2 border-chalk-border rounded-3xl p-5 sm:p-6 shadow-[4px_4px_0px_0px_var(--chalk-border)] mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {data.user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.user.image}
              alt=""
              className="w-16 h-16 rounded-full border-2 border-chalk-border"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-chalk-purple-light border-2 border-chalk-border" />
          )}
          <div className="flex-1 min-w-0">
            <p className="font-sketch text-xl text-chalk-ink">{data.user.name || "Signed in"}</p>
            <p className="text-sm text-chalk-gray">{data.user.email}</p>
            <p className="text-xs font-semibold text-chalk-purple mt-1">Connected with Google</p>
          </div>
          <form action={signOutAction} className="sm:ml-auto">
            <button
              type="submit"
              className="px-4 py-2 border-2 border-chalk-border text-sm font-semibold rounded-xl hover:bg-[#faf9f5] w-full sm:w-auto"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>

      <div className="bg-white border-2 border-chalk-border rounded-3xl p-5 sm:p-6 shadow-[4px_4px_0px_0px_var(--chalk-border)] mb-6">
        <h2 className="font-semibold text-chalk-ink mb-2">API keys</h2>
        <p className="text-sm text-chalk-gray mb-4">
          Keys are hashed and encrypted on your account. Only the start is shown. If the first key fails, the next one is used.
        </p>

        {savedKeys.length > 0 ? (
          <div className="space-y-2 mb-4">
            {savedKeys.map((key) => (
              <div
                key={key.id}
                className="flex items-center gap-2 px-3 py-2 bg-[#faf9f5] border-2 border-chalk-border rounded-xl"
              >
                <span className="text-[11px] font-semibold text-chalk-purple">
                  {getProviderMeta(((key as { provider?: ImageModelProvider }).provider) ?? "google").label}
                </span>
                <code className="flex-1 font-mono text-sm text-chalk-ink truncate">{key.hint}</code>
                <button
                  type="button"
                  onClick={() => void removeApiKey(key.id)}
                  className="p-1.5 text-chalk-gray hover:text-red-600"
                  title="Remove key"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-chalk-gray mb-4">No account key yet.</p>
        )}

        <button
          type="button"
          onClick={() => setKeyOpen(true)}
          className="px-4 py-2 bg-chalk-ink text-white text-sm font-semibold rounded-xl"
        >
          {savedKeys.length ? "Add another key" : "Add key"}
        </button>
      </div>

      <div className="bg-white border-2 border-chalk-border rounded-3xl p-5 sm:p-6 shadow-[4px_4px_0px_0px_var(--chalk-border)] mb-6">
        <h2 className="font-semibold text-chalk-ink mb-2">Image model</h2>
        <p className="text-sm text-chalk-gray mb-4">
          Gemini, ChatGPT, Flux, and Midjourney image models. Suggested default is Gemini 3.1 Flash Image.
        </p>
        <ModelPicker className="w-full max-w-none h-11 justify-between border-2 border-chalk-border" />
      </div>

      <div className="bg-white border-2 border-red-200 rounded-3xl p-5 sm:p-6">
        <h2 className="font-semibold text-red-700 mb-2">Delete account</h2>
        <p className="text-sm text-chalk-gray mb-4">
          Removes your Google login, saved boards, and stored API keys.
        </p>
        <button
          type="button"
          onClick={() => void deleteAccount()}
          disabled={deleting}
          className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-xl disabled:opacity-60"
        >
          {deleting ? "Deleting…" : "Delete my account"}
        </button>
      </div>

      <ApiKeyModal isOpen={keyOpen} onClose={() => setKeyOpen(false)} />
    </div>
  );
}
