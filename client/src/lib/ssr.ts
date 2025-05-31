import { appRouter } from "@/server/api/routers";
// import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { createServerSideHelpers } from "@trpc/react-query/server";
// import superjson from "superjson";

export function createSSRHelper() {
  return createServerSideHelpers({
    router: appRouter,
    ctx: {}, // No auth/session needed for now
    // transformer: superjson,
  });
}
