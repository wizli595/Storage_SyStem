import { z } from "zod";

export const UnitEnum = z.enum(["KG", "PLATE", "LITRE", "PIECE"]);

export const ItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  unit: UnitEnum,
  price: z.number(),
  stock: z.number(),
  minStock: z.number(),
  isDeleted: z.boolean(),
  createdAt: z.string(), // ISO Date String
  updatedAt: z.string(),
});

export const ItemsSchema = z.array(ItemSchema);
export type Item = z.infer<typeof ItemSchema>;
export type Items = z.infer<typeof ItemsSchema>;
