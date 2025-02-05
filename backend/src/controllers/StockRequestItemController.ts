import { Request, Response, NextFunction } from "express";
import { StockRequestItemService } from "../services/StockRequestItemService";
import BaseController from "../core/BaseController";

export class StockRequestItemController extends BaseController {
  private stockRequestItemService: StockRequestItemService;

  constructor() {
    super();
    this.stockRequestItemService = new StockRequestItemService();

    this.getStockRequestItems = this.getStockRequestItems.bind(this);
    this.approveItem = this.approveItem.bind(this);
    this.issueItem = this.issueItem.bind(this);
  }

  /**
   * Get all items in a stock request
   */
  async getStockRequestItems(req: Request, res: Response, next: NextFunction) {
    this.handleRequest(req, res, next, async () => {
      return this.stockRequestItemService.findByRequestId(req.params.requestId);
    });
  }

  /**
   * Approve requested item
   */
  async approveItem(req: Request, res: Response, next: NextFunction) {
    this.handleRequest(req, res, next, async () => {
      const { approvedQuantity } = req.body;
      return this.stockRequestItemService.approveItem(
        req.params.id,
        approvedQuantity
      );
    });
  }

  /**
   * Issue item from stock
   */
  async issueItem(req: Request, res: Response, next: NextFunction) {
    this.handleRequest(req, res, next, async () => {
      const { issuedQuantity } = req.body;
      return this.stockRequestItemService.issueItem(
        req.params.id,
        issuedQuantity
      );
    });
  }
}
