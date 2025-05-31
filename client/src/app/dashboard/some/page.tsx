import { createSSRHelper } from "@/lib/ssr";
import ClientDashboard from "@/components/ClientDashboard";
import { cache } from "react";
import { hydrate, dehydrate } from "@tanstack/react-query";
import { getSession } from "@/lib/session";

const getDashboardData = cache(async () => {
  const ssr = createSSRHelper();
  await ssr.getItems.prefetch(); // prefetch the tRPC query
  return {
    dehydratedState: dehydrate(ssr),
  };
});

export default async function DashboardPage() {
  const session = await getSession();
  const { dehydratedState } = await getDashboardData();

  return (
    <Hydrate state={dehydratedState}>
      <ClientDashboard userId={session?.userId as string} />
    </Hydrate>
  );
}
