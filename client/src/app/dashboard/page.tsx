import { getSession } from "@/lib/session";
import { HydrationBoundary } from "@tanstack/react-query";
import { dehydrateQueries } from "@/lib/react-query-ssr"; // our helper!
import { fetchItems, fetchLowStockItems } from "@/server/items/itemsApi";
import { fetchOrders } from "@/server/orders/orderApi";
import { ClientDashboard } from "@/components/dashboard/ClientDashboard";

export default async function DashboardPage() {
  const session = await getSession();

  const dehydratedState = await dehydrateQueries(async (queryClient) => {
    await queryClient.prefetchQuery({
      queryKey: ["items"],
      queryFn: fetchItems,
    });
    await queryClient.prefetchQuery({
      queryKey: ["orders"],
      queryFn: fetchOrders,
    });
    await queryClient.prefetchQuery({
      queryKey: ["low-stock-items"],
      queryFn: fetchLowStockItems,
    });
  });

  return (
    <HydrationBoundary state={dehydratedState}>
      <ClientDashboard userId={session?.userId as string} />
    </HydrationBoundary>
  );
}
