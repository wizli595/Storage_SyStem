import { PrismaClient, Ingredient } from "@prisma/client";
import { BaseRepository } from "../core/BaseRepository";

const prisma = new PrismaClient();

export class IngredientRepository extends BaseRepository<Ingredient> {
  constructor() {
    super(prisma.ingredient);
  }

  async findIngredientsByPlate(plateId: string) {
    return this.model.findMany({
      where: { plateId },
      include: { item: true },
    });
  }
}
