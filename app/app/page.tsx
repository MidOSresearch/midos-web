import { redirect } from "next/navigation";
import { auth } from "@/auth";
import JourneyPage from "./sandbox/journey/page";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return <JourneyPage />;
}
