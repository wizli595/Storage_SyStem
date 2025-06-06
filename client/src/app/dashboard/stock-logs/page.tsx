import { HydrationBoundary } from "@tanstack/react-query";
import { fetchStockLogs } from "@/server/stockLogs/stockLogsApi";
import { dehydrateQueries } from "@/lib/react-query-ssr";
import { ClientStockLogsPage } from "@/components/stockLogs/ClientStockLogsPage";

export default async function StockLogsPage() {
  const dehydratedState = await dehydrateQueries(async (queryClient) => {
    await queryClient.prefetchQuery({
      queryKey: ["stock-logs"],
      queryFn: fetchStockLogs,
    });
  });

  return (
    <HydrationBoundary state={dehydratedState}>
      <ClientStockLogsPage />
    </HydrationBoundary>
  );
}
