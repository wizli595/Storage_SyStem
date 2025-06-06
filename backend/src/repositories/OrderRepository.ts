import { Order } from "@prisma/client";
import { BaseRepository } from "../core/BaseRepository";
import prismaCLT from "../models/prismaClient";

class OrderRepository extends BaseRepository<Order> {
  constructor() {
    super(prismaCLT.order);
  }
  async createOrder(plateId: string, quantity: number) {
    return prismaCLT.$transaction(async (tx) => {
      const ingredients = await tx.ingredient.findMany({
        where: {
          plateId,
        },
        include: { item: true },
      });
      if (!ingredients.length) {
        throw new Error("No ingredients found for this plate");
      }
      for (const ingredient of ingredients) {
        if (ingredient.item.stock < ingredient.quantity * quantity) {
          throw new Error(
            `Not enough stock for ${ingredient.item.name} ingredient`
          );
        }
      }
      for (const ingredient of ingredients) {
        await tx.item.update({
          where: { id: ingredient.itemId },
          data: { stock: { decrement: ingredient.quantity * quantity } },
        });
        await tx.stockLog.create({
          data: {
            itemId: ingredient.itemId,
            quantity: -ingredient.quantity * quantity,
            changeType: "ISSUED",
            date: new Date(),
          },
        });
      }
      return tx.order.create({
        data: {
          plateId,
          quantity,
        },
      });
    });
  }

  /**
   * Fetch all orders with their related plates
   */
  async findAllOrdersWithPlates() {
    return this.model.findMany({
      where: { isDeleted: false },
      include: {
        plate: true, // Eager load Plate
      },
    });
  }

  /**
   * Fetch single order with plate
   */
  async findOrderByIdWithPlate(id: string) {
    return this.model.findUnique({
      where: { id },
      include: {
        plate: true,
      },
    });
  }
}
export default OrderRepository;
