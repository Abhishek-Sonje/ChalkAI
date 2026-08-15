import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { BoardClient } from "@/components/board-client";
import { getTldrawLicenseKey } from "@/lib/tldraw-license";

/**
 * BoardPage is a server component that handles authentication checks
 * before rendering the whiteboard client application.
 */
export default async function BoardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return <BoardClient licenseKey={getTldrawLicenseKey()} />;
}
