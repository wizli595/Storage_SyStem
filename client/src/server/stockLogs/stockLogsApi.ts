// src/server/stockLogs/stockLogApi.ts
import { fetcher } from "@/lib/fetcher";
import { stockLogsSchema } from "./stockLogSchemas";

export async function fetchStockLogs() {
  return fetcher("/stock-log", stockLogsSchema); // GET /stock-logs
}

export async function fetchStockLogsByItem(itemId: string) {
  return fetcher(`/stock-log/item/${itemId}`, stockLogsSchema); // GET /stock-logs/item/:itemId
}
