// app/(dashboard)/plates/page.tsx
import { HydrationBoundary } from "@tanstack/react-query";
import { fetchPlates } from "@/server/plates/platesApi";
import { dehydrateQueries } from "@/lib/react-query-ssr";
import ClientPlatesPage from "@/components/plates/ClientPlatesPage";

export default async function PlatesPage() {
  const dehydratedState = await dehydrateQueries(async (queryClient) => {
    queryClient.setDefaultOptions({
      queries: { staleTime: 1000 * 60 * 5 },
    });

    await queryClient.prefetchQuery({
      queryKey: ["plates"],
      queryFn: fetchPlates,
    });
  });

  return (
    <HydrationBoundary state={dehydratedState}>
      <ClientPlatesPage />
    </HydrationBoundary>
  );
}
