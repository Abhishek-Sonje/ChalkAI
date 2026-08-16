import { ObjectId, type Collection } from "mongodb";
import { getDb } from "@/lib/db";
import type { ImageModelProvider } from "@/lib/image-models";

export type BoardRecord = {
  _id: ObjectId;
  userId: string;
  title: string;
  snapshot: unknown | null;
  shareId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type StoredApiKey = {
  id: string;
  provider: ImageModelProvider;
  enc: string;
  hash: string;
  hint: string;
  createdAt: Date;
};

export type ProfileRecord = {
  _id?: ObjectId;
  userId: string;
  geminiKeyEnc?: string;
  geminiKeyHash?: string;
  apiKeys?: StoredApiKey[];
  preferredModelId?: string;
  onboardingComplete?: boolean;
  updatedAt: Date;
};

export async function boardsCollection(): Promise<Collection<BoardRecord>> {
  const db = await getDb();
  return db.collection<BoardRecord>("boards");
}

export async function profilesCollection(): Promise<Collection<ProfileRecord>> {
  const db = await getDb();
  return db.collection<ProfileRecord>("user_profiles");
}

export type BoardSummary = Pick<
  BoardRecord,
  "_id" | "title" | "shareId" | "createdAt" | "updatedAt"
>;

export function serializeBoard(board: BoardSummary) {
  return {
    id: board._id.toString(),
    title: board.title,
    shareId: board.shareId,
    createdAt: board.createdAt.toISOString(),
    updatedAt: board.updatedAt.toISOString(),
  };
}
