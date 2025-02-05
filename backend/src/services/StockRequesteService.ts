import { BaseService } from "../core/BaseService";
import StockRequestRepository from "../repositories/StockRequestRepository";
import { StockRequest } from "@prisma/client";

class StockRequestService extends BaseService<
  StockRequest,
  StockRequestRepository
> {
  constructor() {
    super(new StockRequestRepository());
  }
  async createStockRequest(
    requester: string,
    items: { itemId: string; requestedQuantity: number }[]
  ): Promise<StockRequest> {
    return this.repository.createStockRequest(requester, items);
  }

  async approveStockRequest(id: string): Promise<StockRequest> {
    return this.repository.updateStockRequestStatus(id, "APPROVED");
  }
  async rejectStockRequest(id: string): Promise<StockRequest> {
    return this.repository.updateStockRequestStatus(id, "REJECTED");
  }
  async issueStockRequest(
    id: string,
    issuedItems: { itemId: string; issuedQuantity: number }[]
  ): Promise<any> {
    return this.repository.issueStockRequest(id, issuedItems);
  }
}
export default StockRequestService;
