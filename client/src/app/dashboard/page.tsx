import { getSession } from "@/lib/session";
import ClientDashboard from "@/components/ClientDashboard"; // your current dashboard with "use client"

export default async function Dashboard() {
  const session = await getSession();

  return <ClientDashboard userId={session?.userId as string} />;
}
