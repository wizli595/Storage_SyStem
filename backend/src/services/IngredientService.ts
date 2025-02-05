import { Ingredient } from "@prisma/client";
import { BaseService } from "../core/BaseService";
import { IngredientRepository } from "../repositories/IngredientRepository";

export class IngredientService extends BaseService<
  Ingredient,
  IngredientRepository
> {
  constructor() {
    super(new IngredientRepository());
  }

  async findIngredientsByPlate(plateId: string) {
    return this.repository.findIngredientsByPlate(plateId);
  }
}
