// src/server/stockLogs/stockLogSchemas.ts
import { z } from "zod";

export const stockLogSchema = z.object({
  id: z.string(), // Always present after creation
  itemId: z.string().min(1, "Item ID required"),
  quantity: z.number(),
  actionBy: z.string(),
  changeType: z.enum(["RECEIVED", "ISSUED", "ADJUSTMENT"]), // matching DB enum
  relatedRequestID: z.string().nullable().optional(), // optional
  date: z.string(), // ISO string
});

export const stockLogsSchema = z.array(stockLogSchema);

// Infer Type
export type StockLog = z.infer<typeof stockLogSchema>;

// Array of StockLogs
export type StockLogs = StockLog[];
