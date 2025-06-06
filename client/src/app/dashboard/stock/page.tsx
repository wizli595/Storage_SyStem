import { HydrationBoundary } from "@tanstack/react-query";
import { fetchItems } from "@/server/items/itemsApi";
import { fetchIngredients } from "@/server/ingredients/ingredientsApi";
import { dehydrateQueries } from "@/lib/react-query-ssr";
import ClientStockPage from "@/components/stock/ClientStockPage";

export default async function StockPage() {
  const dehydratedState = await dehydrateQueries(async (queryClient) => {
    await queryClient.prefetchQuery({
      queryKey: ["items"],
      queryFn: fetchItems,
    });
    await queryClient.prefetchQuery({
      queryKey: ["ingredients"],
      queryFn: fetchIngredients,
    });
  });

  return (
    <HydrationBoundary state={dehydratedState}>
      <ClientStockPage />
    </HydrationBoundary>
  );
}
