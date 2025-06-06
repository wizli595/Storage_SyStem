import { fetcher } from "@/lib/fetcher";
import { ItemsSchema } from "./itemsSchemas";

export function fetchItems() {
  return fetcher("/items", ItemsSchema);
}

export async function fetchLowStockItems() {
  const allItems = await fetchItems();
  return allItems.filter((item) => item.stock < item.minStock);
}
