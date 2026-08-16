import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { boardsCollection, serializeBoard, type BoardSummary } from "@/lib/collections";
import { getSessionUser, unauthorized } from "@/lib/session";

export const runtime = "nodejs";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  const boards = await boardsCollection();
  const rows = await boards
    .find({ userId: user.id })
    .project<BoardSummary>({ snapshot: 0 })
    .sort({ updatedAt: -1 })
    .toArray();

  return NextResponse.json({
    boards: rows.map((row) => serializeBoard(row)),
  });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  const body = (await request.json().catch(() => ({}))) as { title?: string };
  const now = new Date();
  const boards = await boardsCollection();
  const doc = {
    _id: new ObjectId(),
    userId: user.id,
    title: body.title?.trim() || "Untitled board",
    snapshot: null,
    shareId: null,
    createdAt: now,
    updatedAt: now,
  };
  await boards.insertOne(doc);

  return NextResponse.json({ board: serializeBoard(doc) }, { status: 201 });
}
