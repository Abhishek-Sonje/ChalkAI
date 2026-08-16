import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { boardsCollection, profilesCollection } from "@/lib/collections";
import { getSessionUser, unauthorized } from "@/lib/session";
import { listPublicApiKeys } from "@/lib/user-api-keys";
import { getImageModel } from "@/lib/image-models";

export const runtime = "nodejs";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  const profiles = await profilesCollection();
  const profile = await profiles.findOne({ userId: user.id });

  const keys = await listPublicApiKeys(user.id);

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name ?? "",
      email: user.email ?? "",
      image: user.image ?? "",
    },
    hasGeminiKey: keys.length > 0,
    keys,
    preferredModelId: getImageModel(profile?.preferredModelId).id,
    onboardingComplete: !!profile?.onboardingComplete,
  });
}

export async function PATCH(request: Request) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  const body = (await request.json()) as {
    onboardingComplete?: boolean;
    preferredModelId?: string;
  };
  const profiles = await profilesCollection();
  await profiles.updateOne(
    { userId: user.id },
    {
      $set: {
        userId: user.id,
        ...(typeof body.onboardingComplete === "boolean"
          ? { onboardingComplete: body.onboardingComplete }
          : {}),
        ...(typeof body.preferredModelId === "string"
          ? { preferredModelId: getImageModel(body.preferredModelId).id }
          : {}),
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  const db = await getDb();
  const boards = await boardsCollection();
  const profiles = await profilesCollection();

  await boards.deleteMany({ userId: user.id });
  await profiles.deleteOne({ userId: user.id });

  let userFilter: Record<string, unknown> = { id: user.id };
  if (ObjectId.isValid(user.id)) {
    userFilter = { $or: [{ _id: new ObjectId(user.id) }, { id: user.id }] };
  }

  await db.collection("users").deleteMany(userFilter);
  await db.collection("accounts").deleteMany({
    $or: [
      { userId: user.id },
      ...(ObjectId.isValid(user.id) ? [{ userId: new ObjectId(user.id) }] : []),
    ],
  });
  await db.collection("sessions").deleteMany({
    $or: [
      { userId: user.id },
      ...(ObjectId.isValid(user.id) ? [{ userId: new ObjectId(user.id) }] : []),
    ],
  });

  return NextResponse.json({ ok: true });
}
