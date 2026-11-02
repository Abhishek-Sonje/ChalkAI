import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function BoardIndexPage() {
  const session = await auth();
  if (!session?.user) redirect("/");
  redirect("/boards");
}
