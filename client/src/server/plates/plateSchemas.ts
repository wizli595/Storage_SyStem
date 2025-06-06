import { z } from "zod";

export const PlateSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  category: z.string().optional(), // Optional if you have categories
  imageUrl: z.string().optional(), // Optional if you have images
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const PlatesSchema = z.array(PlateSchema);
