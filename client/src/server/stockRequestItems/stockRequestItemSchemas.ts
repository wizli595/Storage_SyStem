// src/server/stockRequestItems/stockRequestItemSchemas.ts
import { z } from "zod";

export const ItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  unit: z.enum(["KG", "PLATE", "LITRE", "PIECE"]),
  price: z.number(),
});

export const StockRequestItemSchema = z.object({
  id: z.string(),
  requestId: z.string(),
  itemId: z.string(),
  requestedQuantity: z.number(),
  approvedQuantity: z.number().nullable().optional(),
  issuedQuantity: z.number().nullable().optional(),
  item: ItemSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const StockRequestItemsSchema = z.array(StockRequestItemSchema);

// 🧠 Infer the TypeScript type
export type StockRequestItem = z.infer<typeof StockRequestItemSchema>;
