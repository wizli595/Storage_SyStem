import { HydrationBoundary } from "@tanstack/react-query";
import { fetchStockRequests } from "@/server/stockRequests/stockRequestApi";
import StockRequestsDashboard from "@/components/stockRequests/StockRequestsDashboard";
import { dehydrateQueries } from "@/lib/react-query-ssr";

export default async function StockRequestsPage() {
  const dehydratedState = await dehydrateQueries(async (queryClient) => {
    await queryClient.prefetchQuery({
      queryKey: ["stockRequests"],
      queryFn: fetchStockRequests,
    });
  });

  return (
    <HydrationBoundary state={dehydratedState}>
      <StockRequestsDashboard />
    </HydrationBoundary>
  );
}
