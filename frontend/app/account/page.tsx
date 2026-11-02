import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AccountClient } from "./account-client";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/");
  return <AccountClient />;
}
