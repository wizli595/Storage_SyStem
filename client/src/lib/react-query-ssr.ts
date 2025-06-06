// lib/react-query-ssr.ts
import { QueryClient, dehydrate } from "@tanstack/react-query";

// Always create a fresh QueryClient for server
export function getQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
      },
    },
  });
}

// A helper to dehydrate after prefetching
export async function dehydrateQueries(
  callback: (queryClient: QueryClient) => Promise<void>
) {
  const queryClient = getQueryClient();
  await callback(queryClient);
  const dehydratedState = dehydrate(queryClient);
  return dehydratedState;
}
