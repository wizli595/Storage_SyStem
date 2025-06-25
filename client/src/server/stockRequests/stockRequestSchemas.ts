import { z } from "zod";

export const StockRequestItemSchema = z.object({
  id: z.string(),
  itemId: z.string(),
  requestId: z.string(),
  requestedQuantity: z.number(),
  approvedQuantity: z.number().nullable().optional(), // <-- nullable
  issuedQuantity: z.number().nullable().optional(), // <-- nullable
  createdAt: z.string(),
  updatedAt: z.string(),
  item: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable().optional(),
    stock: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
});

export const StockRequestSchema = z.object({
  id: z.string(),
  requester: z.string(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "COMPLETED"]),
  createdAt: z.string(),
  updatedAt: z.string(),
  StockRequestItem: z.array(StockRequestItemSchema),
});

export const StockRequestsSchema = z.array(StockRequestSchema);

export type StockRequest = z.infer<typeof StockRequestSchema>;
export type StockRequests = z.infer<typeof StockRequestsSchema>;
