import prismaCTL from "../models/prismaClient";
import { BaseRepository } from "../core/BaseRepository";
import { StockRequest } from "@prisma/client";

class StockRequestRepository extends BaseRepository<StockRequest> {
  constructor() {
    super(prismaCTL.stockRequest);
  }
  async createStockRequest(
    requester: string,
    items: { itemId: string; requestedQuantity: number }[],
    justification?: string
  ) {
    return this.model.create({
      data: {
        requester,
        status: "PENDING",
        StockRequestItem: {
          create: items.map((item) => ({
            itemId: item.itemId,
            requestedQuantity: item.requestedQuantity,
          })),
        },
        justification: justification,
      },
    });
  }
  async updateStockRequestStatus(id: string, status: "APPROVED" | "REJECTED") {
    return this.model.update({
      where: { id },
      data: { status },
    });
  }
  async issueStockRequest(
    id: string,
    issuedItems: { itemId: string; issuedQuantity: number }[]
  ) {
    return prismaCTL.$transaction(async (tx) => {
      await tx.stockRequest.update({
        where: { id },
        data: { status: "COMPLETED" },
      });
      for (const item of issuedItems) {
        const existingItem = await tx.item.findUnique({
          where: { id: item.itemId },
        });
        if (!existingItem || existingItem.stock < item.issuedQuantity) {
          throw new Error("Not enough stock for item " + item.itemId);
        }
        await tx.item.update({
          where: { id: item.itemId },
          data: { stock: existingItem.stock - item.issuedQuantity },
        });
        await tx.stockLog.create({
          data: {
            itemId: item.itemId,
            quantity: -item.issuedQuantity,
            changeType: "ISSUED",
            relatedRequestID: id,
          },
        });
      }
      return { success: true };
    });
  }
  async findAll() {
    return this.model.findMany({
      include: {
        StockRequestItem: true,
      },
    });
  }
}

export default StockRequestRepository;
