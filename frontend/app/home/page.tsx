import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";

export default async function Home() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }

  return (
    <div>
      <div className="p-4">
        <Navbar />
      </div>
      Hello from Home
    </div>
  );
}
