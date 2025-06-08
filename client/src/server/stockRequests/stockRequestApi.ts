import { fetcher, poster } from "@/lib/fetcher";
import { StockRequestsSchema, StockRequestSchema } from "./stockRequestSchemas";

export function fetchStockRequests() {
  return fetcher("/stock-request", StockRequestsSchema);
}
export function createStockRequest(data: {
  requester: string;
  items: { itemId: string; requestedQuantity: number }[];
  justification: string;
}) {
  return poster("/stock-request", data, StockRequestSchema);
}
