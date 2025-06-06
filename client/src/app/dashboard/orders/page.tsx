import { HydrationBoundary } from "@tanstack/react-query";
import { fetchOrders } from "@/server/orders/orderApi";
import OrdersDashboard from "@/components/order/ClientOrderPage";
import { dehydrateQueries } from "@/lib/react-query-ssr";

export default async function OrdersPage() {
  const dehydratedState = await dehydrateQueries(async (queryClient) => {
    await queryClient.prefetchQuery({
      queryKey: ["orders"],
      queryFn: fetchOrders,
    });
  });

  return (
    <HydrationBoundary state={dehydratedState}>
      <OrdersDashboard />
    </HydrationBoundary>
  );
}
