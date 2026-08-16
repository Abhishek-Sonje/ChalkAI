import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { boardsCollection, serializeBoard } from "@/lib/collections";
import { getSessionUser, unauthorized } from "@/lib/session";

export const runtime = "nodejs";

function asObjectId(id: string) {
  if (!ObjectId.isValid(id)) return null;
  return new ObjectId(id);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  const { id } = await params;
  const objectId = asObjectId(id);
  if (!objectId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const boards = await boardsCollection();
  const board = await boards.findOne({ _id: objectId, userId: user.id });
  if (!board) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    board: {
      ...serializeBoard(board),
      snapshot: board.snapshot,
    },
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  const { id } = await params;
  const objectId = asObjectId(id);
  if (!objectId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = (await request.json()) as {
    title?: string;
    snapshot?: unknown;
  };

  const update: Record<string, unknown> = { updatedAt: new Date() };
  if (typeof body.title === "string" && body.title.trim()) {
    update.title = body.title.trim().slice(0, 80);
  }
  if ("snapshot" in body) {
    update.snapshot = body.snapshot;
  }

  const boards = await boardsCollection();
  const result = await boards.findOneAndUpdate(
    { _id: objectId, userId: user.id },
    { $set: update },
    { returnDocument: "after" }
  );

  if (!result) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ board: serializeBoard(result) });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  const { id } = await params;
  const objectId = asObjectId(id);
  if (!objectId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const boards = await boardsCollection();
  const result = await boards.deleteOne({ _id: objectId, userId: user.id });
  if (!result.deletedCount) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
