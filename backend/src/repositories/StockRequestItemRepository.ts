import { StockRequestItem } from "@prisma/client";
import { BaseRepository } from "../core/BaseRepository";
import prismaCLT from "../models/prismaClient";

export class StockRequestItemRepository extends BaseRepository<StockRequestItem> {
  constructor() {
    super(prismaCLT.stockRequestItem);
  }

  async findByRequestId(requestId: string) {
    return this.model.findMany({
      where: { requestId },
      include: { item: true },
    });
  }

  async updateApprovedQuantity(id: string, approvedQuantity: number) {
    return this.model.update({
      where: { id },
      data: { approvedQuantity },
    });
  }

  async updateIssuedQuantity(id: string, issuedQuantity: number) {
    return this.model.update({
      where: { id },
      data: { issuedQuantity },
    });
  }
}
