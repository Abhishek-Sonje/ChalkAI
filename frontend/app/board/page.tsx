import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { BoardClient } from "@/components/board-client";
import { getTldrawLicenseKey } from "@/lib/tldraw-license";

export default async function BoardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return <BoardClient licenseKey={getTldrawLicenseKey()} />;
}
