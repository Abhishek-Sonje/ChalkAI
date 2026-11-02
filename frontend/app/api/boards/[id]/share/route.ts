import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { boardsCollection, serializeBoard } from "@/lib/collections";
import { getSessionUser, unauthorized } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const boards = await boardsCollection();
  const existing = await boards.findOne({ _id: new ObjectId(id), userId: user.id });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const shareId = existing.shareId ?? randomBytes(8).toString("base64url");
  const updated = await boards.findOneAndUpdate(
    { _id: existing._id },
    { $set: { shareId, updatedAt: new Date() } },
    { returnDocument: "after" }
  );

  return NextResponse.json({ board: serializeBoard(updated!) });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const boards = await boardsCollection();
  const updated = await boards.findOneAndUpdate(
    { _id: new ObjectId(id), userId: user.id },
    { $set: { shareId: null, updatedAt: new Date() } },
    { returnDocument: "after" }
  );

  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ board: serializeBoard(updated) });
}
