import { notFound } from "next/navigation";
import { boardsCollection } from "@/lib/collections";
import { ShareViewer } from "./share-viewer";

export default async function SharePage({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  const { shareId } = await params;
  const boards = await boardsCollection();
  const board = await boards.findOne({ shareId });
  if (!board) notFound();

  return <ShareViewer title={board.title} snapshot={board.snapshot} />;
}
