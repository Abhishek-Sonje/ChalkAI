import { NextResponse } from "next/server";
import { boardsCollection } from "@/lib/collections";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ shareId: string }> }
) {
  const { shareId } = await params;
  if (!shareId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const boards = await boardsCollection();
  const board = await boards.findOne({ shareId });
  if (!board) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    board: {
      title: board.title,
      snapshot: board.snapshot,
      updatedAt: board.updatedAt.toISOString(),
    },
  });
}
