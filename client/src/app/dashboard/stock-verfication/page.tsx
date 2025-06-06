import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import VerificationClientPage from "@/components/stock-verfication/VerificationClientPage";
import { fetchOrders } from "@/server/orders/orderApi";
import { fetchStockRequests } from "@/server/stockRequests/stockRequestApi";

export default async function VerificationPage() {
  const queryClient = new QueryClient();

  // Prefetch on server
  await queryClient.prefetchQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

  await queryClient.prefetchQuery({
    queryKey: ["stockRequests"],
    queryFn: fetchStockRequests,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <VerificationClientPage />
    </HydrationBoundary>
  );
}
