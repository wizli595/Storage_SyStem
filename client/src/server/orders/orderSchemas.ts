import { z } from "zod";

// --- Enums ---
export const OrderStatusEnum = z.enum([
  "PENDING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
]);

// --- Plate Schema ---
export const PlateSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  createdAt: z.string(), // ISO string
  updatedAt: z.string(),
});

// --- Order Schema ---
export const OrderSchema = z.object({
  id: z.string(),
  plateId: z.string(),
  quantity: z.number(),
  isDeleted: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  plate: PlateSchema.optional(), // <--- Here we inject the plate if included
});

// --- Orders Array Schema ---
export const OrdersSchema = z.array(OrderSchema);

export type Order = z.infer<typeof OrderSchema>;
export type Orders = z.infer<typeof OrdersSchema>;
