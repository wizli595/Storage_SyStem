import { z } from "zod";
import { fetcher } from "./fetcher";

// --- Enums based on your Prisma schema
export const UnitEnum = z.enum(["KG", "PLATE", "LITRE", "PIECE"]);
export const RequestStatusEnum = z.enum([
  "PENDING",
  "APPROVED",
  "REJECTED",
  "COMPLETED",
]);
export const StockChangeTypeEnum = z.enum(["RECEIVED", "ISSUED", "ADJUSTMENT"]);

// --- Schema definitions ---

// Item schema
export const ItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  unit: UnitEnum,
  price: z.number(),
  stock: z.number(),
  minStock: z.number(),
  isDeleted: z.boolean(),
  createdAt: z.string(), // ISO string
  updatedAt: z.string(),
});

export const ItemsSchema = z.array(ItemSchema);

// Order schema
export const OrderSchema = z.object({
  id: z.string(),
  plateId: z.string(),
  quantity: z.number(),
  isDeleted: z.boolean(),
  createdAt: z.string(), // ISO string
  updatedAt: z.string(),
});

export const OrdersSchema = z.array(OrderSchema);

// Stock Log schema
export const StockLogSchema = z.object({
  id: z.string(),
  itemId: z.string(),
  quantity: z.number(),
  actionBy: z.string(),
  changeType: StockChangeTypeEnum,
  relatedRequestID: z.string().nullable(), // can be null
  date: z.string(), // ISO string
});

// --- API Fetch Functions ---

// Fetch all items
export function fetchItems() {
  return fetcher("http://localhost:5000/items", ItemsSchema);
}

// Fetch all orders
export function fetchOrders() {
  return fetcher("http://localhost:5000/orders", OrdersSchema);
}

// Fetch only low stock items by filtering client-side
export async function fetchLowStockItems() {
  const allItems = await fetchItems(); // fetch all validated items
  return allItems.filter((item) => item.stock < item.minStock);
}
export const IngredientSchema = z.object({
  id: z.string(),
  itemId: z.string(),
  plateId: z.string(),
  quantity: z.number(),
  plate: z.object({
    id: z.string(),
    name: z.string(),
  }),
});

export const IngredientsSchema = z.array(IngredientSchema);

export function fetchIngredients() {
  return fetcher("http://localhost:5000/ingredients", IngredientsSchema);
}
