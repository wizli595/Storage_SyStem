import ClientDashboard from "@/components/ClientDashboard";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function StockPage() {
  const session = await getSession();

  if (!session?.userId) {
    redirect("/login");
  }

  return <ClientDashboard userId={session.userId as string} />;
}
