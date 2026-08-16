import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { BoardsClient } from "./boards-client";

export default async function BoardsPage() {
  const session = await auth();
  if (!session?.user) redirect("/");
  return <BoardsClient />;
}
