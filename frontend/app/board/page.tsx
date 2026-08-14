import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { BoardClient } from "@/components/board-client";

/**
 * BoardPage is a server component that handles authentication checks
 * before rendering the whiteboard client application.
 */
export default async function BoardPage() {
  // Use the latest Clerk auth() API with async/await
  const { userId } = await auth();

  // If no user is authenticated, redirect to the landing page
  // Note: middleware.ts also handles this, but this is a secondary safety check
  if (!userId) {
    redirect("/");
  }

  return <BoardClient />;
}
