import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";

export default async function Home() {
  const session = await auth();
  if (!session?.user) {
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
