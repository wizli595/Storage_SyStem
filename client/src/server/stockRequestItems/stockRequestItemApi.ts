import { fetcher, poster } from "@/lib/fetcher";
import {
  StockRequestItemsSchema,
  StockRequestItemSchema,
} from "../stockRequestItems/stockRequestItemSchemas";

export function fetchStockRequestItems(requestId: string) {
  return fetcher(
    `/stock-request-item/request/${requestId}`,
    StockRequestItemsSchema
  );
}
export function approveStockRequestItem(id: string, quantity: number) {
  return poster(
    `/stock-request-item/${id}/approve`,
    { quantity },
    StockRequestItemSchema
  );
}

export function issueStockRequestItem(id: string, quantity: number) {
  return poster(
    `/stock-request-item/${id}/issue`,
    { quantity },
    StockRequestItemSchema
  );
}
