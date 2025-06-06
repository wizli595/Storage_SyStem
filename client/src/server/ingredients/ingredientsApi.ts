import { fetcher } from "@/lib/fetcher";
import { IngredientsSchema } from "./ingredientsSchema";

export function fetchIngredients() {
  return fetcher("/ingredients", IngredientsSchema);
}
