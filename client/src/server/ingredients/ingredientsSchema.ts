import { z } from "zod";

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
