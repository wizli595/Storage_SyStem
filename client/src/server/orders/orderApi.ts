import { fetcher, poster } from "@/lib/fetcher";
import { OrdersSchema, OrderSchema } from "./orderSchemas";

export function fetchOrders() {
  return fetcher("/orders", OrdersSchema);
}

export function fetchOrderById(id: string) {
  return fetcher(`/orders/${id}`, OrderSchema);
}
export function createOrder(data: { plateId: string; quantity: number }) {
  return poster("/orders", data, OrderSchema);
}
