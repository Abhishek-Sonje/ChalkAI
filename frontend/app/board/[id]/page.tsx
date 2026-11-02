import { ObjectId } from "mongodb";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { BoardClient } from "@/components/board-client";
import { getTldrawLicenseKey } from "@/lib/tldraw-license";
import { boardsCollection, profilesCollection } from "@/lib/collections";

export default async function BoardEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/");

  const { id } = await params;
  if (!ObjectId.isValid(id)) notFound();

  const boards = await boardsCollection();
  const board = await boards.findOne({
    _id: new ObjectId(id),
    userId: session.user.id,
  });
  if (!board) notFound();

  const profiles = await profilesCollection();
  const profile = await profiles.findOne({ userId: session.user.id });

  return (
    <BoardClient
      licenseKey={getTldrawLicenseKey()}
      boardId={board._id.toString()}
      initialTitle={board.title}
      initialSnapshot={board.snapshot}
      initialShareId={board.shareId}
      showOnboarding={!profile?.onboardingComplete}
    />
  );
}
