import { StockRequestItem } from "@prisma/client";
import { BaseService } from "../core/BaseService";
import { StockRequestItemRepository } from "../repositories/StockRequestItemRepository";

export class StockRequestItemService extends BaseService<
  StockRequestItem,
  StockRequestItemRepository
> {
  constructor() {
    super(new StockRequestItemRepository());
  }

  async findByRequestId(requestId: string) {
    return this.repository.findByRequestId(requestId);
  }

  async approveItem(id: string, approvedQuantity: number) {
    return this.repository.updateApprovedQuantity(id, approvedQuantity);
  }

  async issueItem(id: string, issuedQuantity: number) {
    return this.repository.updateIssuedQuantity(id, issuedQuantity);
  }
}
